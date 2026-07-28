import { Injectable, computed, inject, signal } from '@angular/core';
import { Language, TranslationService } from './translation.service';

/**
 * Betriebsurlaub / holiday closure.
 *
 * `firstClosedDay` and `lastClosedDay` are inclusive, `reopenDay` is the first
 * day the shop is open again. The banner disappears by itself once `reopenDay`
 * has started — no manual cleanup needed.
 */
export interface HolidayPeriod {
  firstClosedDay: string; // YYYY-MM-DD
  lastClosedDay: string; // YYYY-MM-DD
  reopenDay: string; // YYYY-MM-DD
  announceFrom: string; // YYYY-MM-DD — banner starts showing on this day
}

export const HOLIDAY_PERIOD: HolidayPeriod = {
  firstClosedDay: '2026-07-28',
  lastClosedDay: '2026-08-08',
  reopenDay: '2026-08-10',
  announceFrom: '2026-07-01',
};

/**
 * schema.org `specialOpeningHoursSpecification` entry. opens === closes === 00:00
 * is the documented way to mark a business as closed for a date range.
 */
export const HOLIDAY_SCHEMA_SPEC = {
  '@type': 'OpeningHoursSpecification',
  name: 'Betriebsurlaub',
  validFrom: HOLIDAY_PERIOD.firstClosedDay,
  validThrough: previousDay(HOLIDAY_PERIOD.reopenDay),
  opens: '00:00',
  closes: '00:00',
};

const LOCALES: Record<Language, string> = {
  de: 'de-DE',
  en: 'en-GB',
  fr: 'fr-FR',
  tr: 'tr-TR',
};

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private translationService = inject(TranslationService);

  /** Re-evaluated on every navigation so a long-open tab still expires the banner. */
  private today = signal(startOfDay(new Date()));

  readonly period = HOLIDAY_PERIOD;

  private firstClosed = parseDay(HOLIDAY_PERIOD.firstClosedDay);
  private lastClosed = parseDay(HOLIDAY_PERIOD.lastClosedDay);
  private reopen = parseDay(HOLIDAY_PERIOD.reopenDay);
  private announceFrom = parseDay(HOLIDAY_PERIOD.announceFrom);

  /** Holiday announced but not started yet. */
  readonly isUpcoming = computed(
    () =>
      this.today().getTime() >= this.announceFrom.getTime() &&
      this.today().getTime() < this.firstClosed.getTime(),
  );

  /** Shop is closed right now because of the holiday. */
  readonly isClosed = computed(
    () =>
      this.today().getTime() >= this.firstClosed.getTime() &&
      this.today().getTime() < this.reopen.getTime(),
  );

  /** Whether banner / notices should be rendered at all. */
  readonly isActive = computed(() => this.isUpcoming() || this.isClosed());

  readonly fromDate = computed(() => this.format(this.firstClosed));
  readonly toDate = computed(() => this.format(this.lastClosed));
  readonly reopenDate = computed(() => this.format(this.reopen));
  readonly reopenWeekday = computed(() =>
    new Intl.DateTimeFormat(LOCALES[this.translationService.currentLanguage()], {
      weekday: 'long',
    }).format(this.reopen),
  );

  /** Machine readable range, e.g. for <time> elements. */
  readonly fromIso = HOLIDAY_PERIOD.firstClosedDay;
  readonly toIso = HOLIDAY_PERIOD.lastClosedDay;
  readonly reopenIso = HOLIDAY_PERIOD.reopenDay;

  /** Replaces {from}, {to}, {reopen} and {weekday} inside a translation string. */
  fill(template: string): string {
    return template
      .replace('{from}', this.fromDate())
      .replace('{to}', this.toDate())
      .replace('{reopen}', this.reopenDate())
      .replace('{weekday}', this.reopenWeekday());
  }

  /** Call when the app may have been left open across midnight. */
  refresh(): void {
    const now = startOfDay(new Date());
    if (now.getTime() !== this.today().getTime()) {
      this.today.set(now);
    }
  }

  private format(date: Date): string {
    return new Intl.DateTimeFormat(
      LOCALES[this.translationService.currentLanguage()],
      { day: '2-digit', month: '2-digit', year: 'numeric' },
    ).format(date);
  }
}

function parseDay(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function previousDay(value: string): string {
  const date = parseDay(value);
  date.setDate(date.getDate() - 1);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
