#!/usr/bin/env bash
#
# Erneuert das Let's-Encrypt-Zertifikat und installiert es in mailcow.
#
# Hintergrund: mailcow laeuft mit SKIP_LETS_ENCRYPT=y, verwaltet also kein
# eigenes ACME. Es erwartet cert.pem/key.pem in data/assets/ssl/. certbot
# laeuft als Container und schreibt in das Volume bikehaus_certbot-etc.
# Zwischen beiden muss dieses Skript vermitteln.
#
# Die Vorgaengerversion war beim Anlegen zerschossen worden ($(...) wurde
# vor dem Schreiben expandiert), sodass die cp-Zeilen leere Argumente
# bekamen und das Zertifikat nie ankam. Der Fehler blieb 21 Tage unbemerkt,
# weil nichts geprueft hat, ob die Installation tatsaechlich gewirkt hat.
# Deshalb bricht dieses Skript bei jedem Teilschritt hart ab und verifiziert
# am Ende gegen den echten Port 587.
#
# Idempotent: passiert nichts, wenn das richtige Zertifikat schon liegt.

set -euo pipefail

MAIL_HOST="${MAIL_HOST:-mail.karaarslan-bike.de}"
MAILCOW_SSL="${MAILCOW_SSL:-/opt/mailcow/data/assets/ssl}"
LE_VOLUME="${LE_VOLUME:-bikehaus_certbot-etc}"
LE_VAR_VOLUME="${LE_VAR_VOLUME:-bikehaus_certbot-var}"
MIN_VALID_SECONDS="${MIN_VALID_SECONDS:-86400}"

log()  { printf '%s %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"; }
fail() { log "FEHLER: $*"; exit 1; }

fingerprint() { openssl x509 -in "$1" -noout -fingerprint -sha256 2>/dev/null | cut -d= -f2; }

# Deckt das Zertifikat den Host ab?
#
# Bewusst NICHT ueber "openssl x509 -checkhost": das liefert auch bei
# "does NOT match certificate" den Exit-Code 0, das Ergebnis steht nur im
# Text. Ein Skript, das sich auf den Exit-Code verlaesst, wuerde jedes
# beliebige Zertifikat akzeptieren. Stattdessen die SAN-Liste zeilenweise
# und als Festtext vergleichen — das verhaelt sich in jeder openssl-Version
# gleich.
covers_host() {
  local cert="$1" host="$2" wildcard="*.${2#*.}" sans
  sans=$(openssl x509 -in "$cert" -noout -ext subjectAltName 2>/dev/null | tr ',' '\n' | tr -d ' ')
  printf '%s\n' "$sans" | grep -Fqx "DNS:$host"     && return 0
  printf '%s\n' "$sans" | grep -Fqx "DNS:$wildcard" && return 0
  return 1
}

# Erster laufender Container, dessen Name auf das Muster passt.
find_container() { docker ps --format '{{.Names}}' | grep -E "$1" | head -1; }

reload_container() {
  local name="$1"; shift
  [ -n "$name" ] || { log "  uebersprungen (Container nicht gefunden)"; return 0; }
  if docker exec "$name" "$@" >/dev/null 2>&1; then
    log "  $name neu geladen"
  else
    log "  WARNUNG: Reload von $name fehlgeschlagen"
    RELOAD_FAILED=1
  fi
}

command -v docker  >/dev/null || fail "docker nicht gefunden"
command -v openssl >/dev/null || fail "openssl nicht gefunden"

# ── 1. Erneuern. Ist nichts faellig, ist das ein No-op. ──────────────────
log "certbot renew"
docker run --rm \
  -v "$LE_VOLUME":/etc/letsencrypt \
  -v "$LE_VAR_VOLUME":/var/lib/letsencrypt \
  certbot/certbot renew --quiet \
  || fail "certbot renew fehlgeschlagen"

# ── 2. Volume auf der Platte finden — kein fester Host-Pfad. ─────────────
LE_DIR=$(docker volume inspect -f '{{.Mountpoint}}' "$LE_VOLUME" 2>/dev/null) \
  || fail "Volume $LE_VOLUME nicht gefunden"
[ -d "$LE_DIR/live" ] || fail "$LE_DIR/live existiert nicht"

# ── 3. Die Lineage waehlen, die den Mail-Host abdeckt und am spaetesten ──
#      ablaeuft. certbot legt bei Neuausstellung Verzeichnisse wie
#      "domain-0001" an; ein fester Name geht dabei ins Leere.
best=""; best_end=0
for dir in "$LE_DIR"/live/*/; do
  [ -f "$dir/fullchain.pem" ] && [ -f "$dir/privkey.pem" ] || continue
  covers_host "$dir/fullchain.pem" "$MAIL_HOST" || continue
  end_date=$(openssl x509 -in "$dir/fullchain.pem" -noout -enddate 2>/dev/null | cut -d= -f2) || continue
  end=$(date -d "$end_date" +%s 2>/dev/null) || continue
  if [ "$end" -gt "$best_end" ]; then best="$dir"; best_end="$end"; fi
done
[ -n "$best" ] || fail "kein Zertifikat in $LE_DIR/live deckt $MAIL_HOST ab"
log "Quelle: $best (gueltig bis $(date -u -d "@$best_end" '+%Y-%m-%d'))"

# ── 4. Nur installieren, was auch morgen noch gilt. ──────────────────────
now=$(date +%s)
[ "$best_end" -gt "$((now + MIN_VALID_SECONDS))" ] \
  || fail "neuestes Zertifikat laeuft zu bald ab — certbot renew hat nicht gewirkt"

# ── 5. Zertifikat und Schluessel muessen zusammengehoeren, sonst startet ─
#      postfix nach dem Reload nicht mehr.
cert_pub=$(openssl x509 -in "$best/fullchain.pem" -noout -pubkey 2>/dev/null | openssl sha256 || true)
key_pub=$(openssl pkey -in "$best/privkey.pem" -pubout 2>/dev/null | openssl sha256 || true)
[ -n "$cert_pub" ] || fail "oeffentlicher Schluessel aus fullchain.pem nicht lesbar"
[ "$cert_pub" = "$key_pub" ] || fail "fullchain.pem und privkey.pem passen nicht zusammen"

# ── 6. Schon aktuell? Dann nichts anfassen. ──────────────────────────────
new_fp=$(fingerprint "$best/fullchain.pem")
cur_fp=$(fingerprint "$MAILCOW_SSL/cert.pem" || true)
if [ -n "$new_fp" ] && [ "$new_fp" = "$cur_fp" ]; then
  log "mailcow hat das Zertifikat bereits — nichts zu tun"
  exit 0
fi
log "mailcow hat ${cur_fp:-kein Zertifikat}, installiere $new_fp"

# ── 7. Atomar installieren, vorherigen Stand sichern. ────────────────────
[ -d "$MAILCOW_SSL" ] || fail "$MAILCOW_SSL existiert nicht"
stamp=$(date -u '+%Y%m%d%H%M%S')
for f in cert.pem key.pem; do
  if [ -f "$MAILCOW_SSL/$f" ]; then
    cp -a "$MAILCOW_SSL/$f" "$MAILCOW_SSL/$f.bak-$stamp"
  fi
done
install -m 0644 "$best/fullchain.pem" "$MAILCOW_SSL/.cert.pem.tmp"
install -m 0600 "$best/privkey.pem"   "$MAILCOW_SSL/.key.pem.tmp"
mv -f "$MAILCOW_SSL/.cert.pem.tmp" "$MAILCOW_SSL/cert.pem"
mv -f "$MAILCOW_SSL/.key.pem.tmp"  "$MAILCOW_SSL/key.pem"
log "installiert nach $MAILCOW_SSL"

# Nur die letzten fuenf Sicherungen behalten. Das "|| true" ist noetig:
# unter "set -o pipefail" laesst ein leeres ls-Glob die ganze Pipeline
# fehlschlagen und wuerde das Skript nach erfolgreicher Installation
# abbrechen.
prune_backups() {
  local pattern="$1"
  # $pattern absichtlich unquoted, damit das Glob hier expandiert wird.
  # shellcheck disable=SC2086
  ls -1t $pattern 2>/dev/null | tail -n +6 | xargs -r rm -f || true
}
prune_backups "$MAILCOW_SSL/cert.pem.bak-*"
prune_backups "$MAILCOW_SSL/key.pem.bak-*"

# ── 8. Dienste neu laden. Container-Namen werden gesucht, nicht geraten — ─
#      die alte Fassung rief ein "karaaslan-nginx" auf, das es nicht mehr gibt.
#      postfix und dovecot fehlten dort ganz, sie behielten das alte
#      Zertifikat also selbst dann, wenn die Kopie geklappt haette.
RELOAD_FAILED=0
log "Dienste neu laden"
reload_container "$(find_container 'postfix-mailcow')" postfix reload
reload_container "$(find_container 'dovecot-mailcow')" dovecot reload
reload_container "$(find_container 'nginx-mailcow')"   nginx -s reload
reload_container "$(find_container '^(bikehaus|karaaslan|karaarslan)-nginx$')" nginx -s reload

# ── 9. Auf der Leitung nachsehen. Ohne diesen Schritt bleibt ein ─────────
#      fehlgeschlagener Reload wieder wochenlang unbemerkt.
#
#      Geprueft wird 587 (postfix/submission) UND 993 (dovecot/imaps):
#      genau diese beiden sprechen Outlook, Thunderbird und die Handy-Apps
#      an. Nur 587 zu pruefen wuerde ein stehengebliebenes dovecot
#      durchgehen lassen.
#
#      "|| true" ueberall: schlaegt s_client fehl, soll die Auswertung
#      unten greifen und nicht "set -e" den Lauf kommentarlos beenden.
served_on() { # port  [starttls-protokoll]
  local port="$1" starttls="${2:-}" args=()
  [ -n "$starttls" ] && args=(-starttls "$starttls")
  echo | timeout 20 openssl s_client "${args[@]}" \
      -connect "$MAIL_HOST:$port" -servername "$MAIL_HOST" 2>/dev/null \
    | openssl x509 -noout -fingerprint -sha256 2>/dev/null | cut -d= -f2 || true
}

problems=0
for probe in "587:smtp" "993:"; do
  port="${probe%%:*}"; proto="${probe#*:}"
  got=$(served_on "$port" "$proto")
  if [ "$got" = "$new_fp" ]; then
    log "  OK   Port $port liefert das neue Zertifikat"
  else
    log "  FEHLER Port $port liefert ${got:-kein lesbares Zertifikat}"
    problems=$((problems + 1))
  fi
done

[ "$problems" -eq 0 ] || fail "$problems Port(s) liefern weiterhin nicht $new_fp"
[ "$RELOAD_FAILED" -eq 0 ] || log "Hinweis: mindestens ein Reload meldete einen Fehler"
log "fertig — Zertifikat aktiv bis $(date -u -d "@$best_end" '+%Y-%m-%d')"
