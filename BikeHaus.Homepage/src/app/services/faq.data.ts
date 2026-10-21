import { Language } from './translation.service';

/**
 * FAQ page content, grouped by topic. Answers only state facts the shop has
 * confirmed elsewhere on the site (warranty terms, hours, payment, prices
 * "from approx."). Optional links point to the page that goes deeper.
 */

export interface FaqEntry {
  q: string;
  a: string;
  link?: { label: string; href: string };
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqEntry[];
}

export interface FaqPageContent {
  h1: string;
  sub: string;
  searchPlaceholder: string;
  noMatch: string;
  categories: FaqCategory[];
}

export const FAQ_CONTENT: Record<Language, FaqPageContent> = {
  de: {
    h1: 'Häufige Fragen',
    sub: 'Alles zu Fahrradkauf, Gebrauchträdern, Garantie, Werkstatt und Größen — kurz und ehrlich beantwortet von Karaarslan Bike in Lünen.',
    searchPlaceholder: 'Frage suchen, z. B. „Garantie“ oder „20 Zoll“',
    noMatch: 'Keine passende Frage gefunden. Schreiben Sie uns einfach per WhatsApp!',
    categories: [
      {
        id: 'kauf',
        title: 'Kauf & Beratung',
        items: [
          { q: 'Wo kann ich in Lünen ein Fahrrad kaufen?', a: 'Bei Karaarslan Bike, Alstedder Straße 5, 44534 Lünen (Alstedde). Wir haben über 100 neue und gebrauchte Fahrräder vorrätig.' },
          { q: 'Brauche ich einen Termin?', a: 'Nein. Kommen Sie einfach während der Öffnungszeiten vorbei — Beratung und Probefahrt sind ohne Termin möglich.' },
          { q: 'Kann ich ein Fahrrad vor dem Kauf probefahren?', a: 'Ja, jedes Rad kann während der Öffnungszeiten probegefahren werden.' },
          { q: 'Welche Fahrradtypen haben Sie?', a: 'Citybikes, Trekkingräder, Mountainbikes, E-Bikes, Kinderfahrräder, Hollandräder und Rennräder — neu und gebraucht.' },
          { q: 'Kann ich ein Fahrrad reservieren?', a: 'Sprechen Sie uns an — in vielen Fällen können wir Ihr Wunschrad für kurze Zeit zurückstellen.' },
          { q: 'Bekomme ich eine Rechnung?', a: 'Ja, zu jedem Fahrrad erhalten Sie eine Rechnung und einen Kaufvertrag.' },
        ],
      },
      {
        id: 'gebraucht',
        title: 'Gebrauchte Fahrräder',
        items: [
          { q: 'Was kostet ein gebrauchtes Fahrrad?', a: 'Gebrauchträder gibt es ab ca. 80 €, gebrauchte E-Bikes ab ca. 800 €. Jedes Rad hat einen festen, fair kalkulierten Preis.', link: { label: 'Gebrauchte Fahrräder ansehen', href: '/de/gebrauchte-fahrraeder' } },
          { q: 'Sind die Gebrauchträder geprüft?', a: 'Ja. Jedes Gebrauchtrad wird technisch geprüft und aufbereitet: Bremsen, Schaltung, Reifen, Kette, Licht und alle sicherheitsrelevanten Teile.' },
          { q: 'Woher stammen die gebrauchten Fahrräder?', a: 'Von Privatpersonen oder aus anderen legalen Quellen. Sie erhalten zu jedem Rad Rechnung und Kaufvertrag.' },
          { q: 'Haben Sie gebrauchte E-Bikes?', a: 'Ja, mit geprüftem Antrieb und dokumentiertem Akkuzustand.' },
          { q: 'Kaufen Sie gebrauchte Fahrräder an?', a: 'Ja, gebrauchte Fahrräder in gutem Zustand kaufen wir zu fairen Preisen an. Schicken Sie uns Fotos und Ihre Preisvorstellung per WhatsApp oder kommen Sie vorbei.' },
          { q: 'Kann ich mein altes Fahrrad in Zahlung geben?', a: 'Im Einzelfall ja — sprechen Sie uns an, wir finden eine Lösung.' },
        ],
      },
      {
        id: 'garantie',
        title: 'Garantie & Rückgabe',
        items: [
          { q: 'Welche Garantie gibt es auf neue Fahrräder?', a: '24 Monate gesetzliche Gewährleistung. Die Rechnung wird mitgeliefert.' },
          { q: 'Welche Garantie gibt es auf Gebrauchträder?', a: '3 Monate auf Kette, Schaltung, Schaltwerk, Dynamo, Pedale und hydraulische Bremsen.', link: { label: 'Garantiebedingungen', href: '/de/garantie' } },
          { q: 'Was ist von der Garantie ausgeschlossen?', a: 'Verschleißteile wie Reifen, Schläuche, Bremsbeläge und Lampen sowie Schäden durch Unfälle oder unsachgemäße Nutzung.' },
          { q: 'Kann ich ein Fahrrad zurückgeben?', a: 'Ja, innerhalb von 3 Arbeitstagen, wenn das Rad vollständig und unbeschädigt zurückgebracht wird.' },
        ],
      },
      {
        id: 'werkstatt',
        title: 'Werkstatt & Service',
        items: [
          { q: 'Reparieren Sie auch Fahrräder?', a: 'Ja. Wir bieten einen kostenlosen Fahrrad-Check und Reparaturen auf Wunsch — Bremsen, Schaltung, Reifen, Kette, Züge, Licht und mehr. Kündigen Sie sich am besten vorher per WhatsApp an.' },
          { q: 'Was beinhaltet der kostenlose Fahrrad-Check?', a: 'Wir prüfen Bremsen, Schaltung, Reifen und Kette, Licht, Reflektoren, Klingel und die allgemeine Verkehrssicherheit. Reparaturen nur, wenn Sie es möchten.' },
          { q: 'Reparieren Sie E-Bikes und Rennräder?', a: 'Nein, unser Werkstattservice gilt nur für normale Fahrräder — nicht für E-Bikes und Rennräder.' },
        ],
      },
      {
        id: 'groesse',
        title: 'Größe & Kinderräder',
        items: [
          { q: 'Welche Fahrradgröße brauche ich?', a: 'Das hängt von Körpergröße, Schrittlänge und Fahrradtyp ab. Bei 170 cm passt meist ein Trekkingrad mit 48–52 cm Rahmen, bei 180 cm eines mit 53–57 cm.', link: { label: 'Fahrradgröße berechnen', href: '/de/fahrradgroesse-berechnen' } },
          { q: 'Welches Kinderfahrrad für welches Alter?', a: 'Grob: 12 Zoll ab 2–4 Jahren, 16 Zoll ab 4–6, 20 Zoll ab 6–8, 24 Zoll ab 8–11 und 26 Zoll ab 10–13 Jahren. Die Körpergröße ist wichtiger als das Alter.', link: { label: 'Kinderfahrrad nach Alter', href: '/de/kinderfahrrad-alter' } },
          { q: 'Ist ein Fahrrad ein gutes Weihnachtsgeschenk?', a: 'Ja — besonders Kinderräder und E-Bikes. Wir beraten Sie zur richtigen Größe, auch wenn es eine Überraschung bleiben soll.', link: { label: 'Fahrrad als Weihnachtsgeschenk', href: '/de/weihnachtsgeschenk-fahrrad' } },
        ],
      },
      {
        id: 'info',
        title: 'Bezahlung, Öffnungszeiten & Anfahrt',
        items: [
          { q: 'Wie kann ich bezahlen?', a: 'Bar, mit EC-Karte, Kreditkarte, per Überweisung oder PayPal.' },
          { q: 'Wann haben Sie geöffnet?', a: 'Montag bis Donnerstag 09:00–18:00, Freitag 09:00–13:00 und 15:00–18:00, Samstag 09:00–18:00. Sonn- und Feiertage geschlossen.' },
          { q: 'Wo finde ich Sie?', a: 'Alstedder Straße 5, 44534 Lünen-Alstedde. Kunden kommen auch aus Dortmund, Selm, Werne, Kamen und Bergkamen zu uns.', link: { label: 'Kontakt & Anfahrt', href: '/de/contact' } },
          { q: 'Wie erreiche ich Sie am schnellsten?', a: 'Per WhatsApp oder Telefon unter +49 163 7390 301.' },
        ],
      },
    ],
  },
  en: {
    h1: 'Frequently Asked Questions',
    sub: 'Everything about buying a bike, used bikes, warranty, workshop and sizes — answered briefly and honestly by Karaarslan Bike in Lünen.',
    searchPlaceholder: 'Search, e.g. “warranty” or “20 inch”',
    noMatch: 'No matching question found. Just message us on WhatsApp!',
    categories: [
      {
        id: 'kauf',
        title: 'Buying & advice',
        items: [
          { q: 'Where can I buy a bike in Lünen?', a: 'At Karaarslan Bike, Alstedder Straße 5, 44534 Lünen (Alstedde). We have over 100 new and used bikes in stock.' },
          { q: 'Do I need an appointment?', a: 'No. Just drop by during opening hours — advice and test rides need no appointment.' },
          { q: 'Can I test ride a bike before buying?', a: 'Yes, every bike can be test ridden during opening hours.' },
          { q: 'What types of bikes do you have?', a: 'City bikes, trekking bikes, mountain bikes, e-bikes, kids’ bikes, Dutch bikes and road bikes — new and used.' },
          { q: 'Can I reserve a bike?', a: 'Just ask us — in many cases we can set your chosen bike aside for a short time.' },
          { q: 'Do I get an invoice?', a: 'Yes, every bike comes with an invoice and a purchase contract.' },
        ],
      },
      {
        id: 'gebraucht',
        title: 'Used bikes',
        items: [
          { q: 'How much does a used bike cost?', a: 'Used bikes start at approx. €80, used e-bikes at approx. €800. Every bike has a fixed, fairly calculated price.', link: { label: 'See used bikes', href: '/en/gebrauchte-fahrraeder' } },
          { q: 'Are the used bikes inspected?', a: 'Yes. Every used bike is technically inspected and refurbished: brakes, gears, tyres, chain, lights and all safety-relevant parts.' },
          { q: 'Where do the used bikes come from?', a: 'From private individuals or other legal sources. Every bike comes with an invoice and a purchase contract.' },
          { q: 'Do you have used e-bikes?', a: 'Yes, with an inspected drive system and documented battery condition.' },
          { q: 'Do you buy used bikes?', a: 'Yes, we buy used bikes in good condition at fair prices. Send us photos and your asking price via WhatsApp or drop by.' },
          { q: 'Can I trade in my old bike?', a: 'In individual cases, yes — talk to us and we will find a solution.' },
        ],
      },
      {
        id: 'garantie',
        title: 'Warranty & returns',
        items: [
          { q: 'What warranty do new bikes have?', a: '24 months statutory warranty. The invoice is included.' },
          { q: 'What warranty do used bikes have?', a: '3 months on chain, gears, derailleur, dynamo, pedals and hydraulic brakes.', link: { label: 'Warranty terms', href: '/en/garantie' } },
          { q: 'What is excluded from the warranty?', a: 'Wear parts such as tyres, tubes, brake pads and lights, as well as damage from accidents or improper use.' },
          { q: 'Can I return a bike?', a: 'Yes, within 3 working days, provided the bike is returned complete and undamaged.' },
        ],
      },
      {
        id: 'werkstatt',
        title: 'Workshop & service',
        items: [
          { q: 'Do you repair bikes?', a: 'Yes. We offer a free bike check and repairs on request — brakes, gears, tyres, chain, cables, lights and more. Best let us know in advance via WhatsApp.' },
          { q: 'What does the free bike check include?', a: 'We check brakes, gears, tyres and chain, lights, reflectors, bell and general road safety. Repairs only if you want them.' },
          { q: 'Do you repair e-bikes and road bikes?', a: 'No, our workshop service is for regular bikes only — not for e-bikes or road bikes.' },
        ],
      },
      {
        id: 'groesse',
        title: 'Sizes & kids’ bikes',
        items: [
          { q: 'What bike size do I need?', a: 'It depends on height, inside leg and bike type. At 170 cm a trekking bike with a 48–52 cm frame usually fits, at 180 cm one with 53–57 cm.', link: { label: 'Calculate bike size', href: '/en/fahrradgroesse-berechnen' } },
          { q: 'Which kids’ bike for which age?', a: 'Roughly: 12 inch from 2–4 years, 16 inch from 4–6, 20 inch from 6–8, 24 inch from 8–11 and 26 inch from 10–13. Height matters more than age.', link: { label: 'Kids’ bike by age', href: '/en/kinderfahrrad-alter' } },
          { q: 'Is a bike a good Christmas present?', a: 'Yes — especially kids’ bikes and e-bikes. We help you choose the right size, even if it has to stay a surprise.', link: { label: 'A bike as a Christmas gift', href: '/en/weihnachtsgeschenk-fahrrad' } },
        ],
      },
      {
        id: 'info',
        title: 'Payment, hours & directions',
        items: [
          { q: 'How can I pay?', a: 'Cash, debit card, credit card, bank transfer or PayPal.' },
          { q: 'What are your opening hours?', a: 'Monday to Thursday 09:00–18:00, Friday 09:00–13:00 and 15:00–18:00, Saturday 09:00–18:00. Closed on Sundays and public holidays.' },
          { q: 'Where can I find you?', a: 'Alstedder Straße 5, 44534 Lünen-Alstedde. Customers also come from Dortmund, Selm, Werne, Kamen and Bergkamen.', link: { label: 'Contact & directions', href: '/en/contact' } },
          { q: 'What is the fastest way to reach you?', a: 'WhatsApp or phone: +49 163 7390 301.' },
        ],
      },
    ],
  },
  fr: {
    h1: 'Questions fréquentes',
    sub: 'Tout sur l’achat d’un vélo, l’occasion, la garantie, l’atelier et les tailles — des réponses courtes et honnêtes de Karaarslan Bike à Lünen.',
    searchPlaceholder: 'Rechercher, ex. « garantie » ou « 20 pouces »',
    noMatch: 'Aucune question trouvée. Écrivez-nous simplement sur WhatsApp !',
    categories: [
      {
        id: 'kauf',
        title: 'Achat & conseil',
        items: [
          { q: 'Où acheter un vélo à Lünen ?', a: 'Chez Karaarslan Bike, Alstedder Straße 5, 44534 Lünen (Alstedde). Plus de 100 vélos neufs et d’occasion en stock.' },
          { q: 'Faut-il un rendez-vous ?', a: 'Non. Passez simplement pendant nos horaires — conseil et essai sans rendez-vous.' },
          { q: 'Puis-je essayer un vélo avant de l’acheter ?', a: 'Oui, chaque vélo peut être essayé pendant les horaires d’ouverture.' },
          { q: 'Quels types de vélos proposez-vous ?', a: 'Vélos de ville, trekking, VTT, vélos électriques, vélos enfant, vélos hollandais et vélos de route — neufs et d’occasion.' },
          { q: 'Puis-je réserver un vélo ?', a: 'Parlez-nous-en — dans de nombreux cas, nous pouvons mettre votre vélo de côté pour une courte durée.' },
          { q: 'Est-ce que je reçois une facture ?', a: 'Oui, chaque vélo est vendu avec facture et contrat de vente.' },
        ],
      },
      {
        id: 'gebraucht',
        title: 'Vélos d’occasion',
        items: [
          { q: 'Combien coûte un vélo d’occasion ?', a: 'Dès env. 80 €, et dès env. 800 € pour un vélo électrique d’occasion. Chaque vélo a un prix fixe et juste.', link: { label: 'Voir les vélos d’occasion', href: '/fr/gebrauchte-fahrraeder' } },
          { q: 'Les vélos d’occasion sont-ils contrôlés ?', a: 'Oui. Chaque vélo d’occasion est contrôlé et remis en état : freins, vitesses, pneus, chaîne, éclairage et toutes les pièces de sécurité.' },
          { q: 'D’où viennent les vélos d’occasion ?', a: 'De particuliers ou d’autres sources légales. Chaque vélo est vendu avec facture et contrat de vente.' },
          { q: 'Avez-vous des vélos électriques d’occasion ?', a: 'Oui, avec moteur contrôlé et état de la batterie documenté.' },
          { q: 'Rachetez-vous les vélos d’occasion ?', a: 'Oui, les vélos en bon état à des prix justes. Envoyez-nous des photos et votre prix par WhatsApp ou passez nous voir.' },
          { q: 'Puis-je faire reprendre mon ancien vélo ?', a: 'Au cas par cas, oui — parlez-nous-en, nous trouverons une solution.' },
        ],
      },
      {
        id: 'garantie',
        title: 'Garantie & retour',
        items: [
          { q: 'Quelle garantie sur les vélos neufs ?', a: '24 mois de garantie légale. La facture est fournie.' },
          { q: 'Quelle garantie sur les vélos d’occasion ?', a: '3 mois sur la chaîne, les vitesses, le dérailleur, la dynamo, les pédales et les freins hydrauliques.', link: { label: 'Conditions de garantie', href: '/fr/garantie' } },
          { q: 'Qu’est-ce qui est exclu de la garantie ?', a: 'Les pièces d’usure comme les pneus, chambres à air, plaquettes et lampes, ainsi que les dommages dus à un accident ou à une mauvaise utilisation.' },
          { q: 'Puis-je retourner un vélo ?', a: 'Oui, sous 3 jours ouvrables, si le vélo est rendu complet et en bon état.' },
        ],
      },
      {
        id: 'werkstatt',
        title: 'Atelier & service',
        items: [
          { q: 'Réparez-vous les vélos ?', a: 'Oui. Nous proposons un contrôle gratuit et des réparations sur demande — freins, vitesses, pneus, chaîne, câbles, éclairage et plus. Prévenez-nous de préférence par WhatsApp.' },
          { q: 'Que comprend le contrôle gratuit ?', a: 'Freins, vitesses, pneus et chaîne, éclairage, réflecteurs, sonnette et sécurité générale. Réparations seulement si vous le souhaitez.' },
          { q: 'Réparez-vous les vélos électriques et de route ?', a: 'Non, notre atelier traite uniquement les vélos classiques — pas les VAE ni les vélos de route.' },
        ],
      },
      {
        id: 'groesse',
        title: 'Tailles & vélos enfant',
        items: [
          { q: 'Quelle taille de vélo me faut-il ?', a: 'Cela dépend de la taille, de l’entrejambe et du type de vélo. À 170 cm, un trekking en 48–52 cm convient généralement, à 180 cm en 53–57 cm.', link: { label: 'Calculer la taille du vélo', href: '/fr/fahrradgroesse-berechnen' } },
          { q: 'Quel vélo enfant pour quel âge ?', a: 'En gros : 12 pouces dès 2–4 ans, 16 pouces dès 4–6, 20 pouces dès 6–8, 24 pouces dès 8–11 et 26 pouces dès 10–13 ans. La taille compte plus que l’âge.', link: { label: 'Vélo enfant selon l’âge', href: '/fr/kinderfahrrad-alter' } },
          { q: 'Un vélo est-il un bon cadeau de Noël ?', a: 'Oui — surtout les vélos enfant et les VAE. Nous vous aidons à choisir la bonne taille, même en gardant la surprise.', link: { label: 'Un vélo en cadeau de Noël', href: '/fr/weihnachtsgeschenk-fahrrad' } },
        ],
      },
      {
        id: 'info',
        title: 'Paiement, horaires & accès',
        items: [
          { q: 'Comment puis-je payer ?', a: 'Espèces, carte bancaire, carte de crédit, virement ou PayPal.' },
          { q: 'Quels sont vos horaires ?', a: 'Lundi à jeudi 09:00–18:00, vendredi 09:00–13:00 et 15:00–18:00, samedi 09:00–18:00. Fermé dimanche et jours fériés.' },
          { q: 'Où vous trouver ?', a: 'Alstedder Straße 5, 44534 Lünen-Alstedde. Des clients viennent aussi de Dortmund, Selm, Werne, Kamen et Bergkamen.', link: { label: 'Contact & accès', href: '/fr/contact' } },
          { q: 'Comment vous joindre le plus vite ?', a: 'Par WhatsApp ou téléphone : +49 163 7390 301.' },
        ],
      },
    ],
  },
  tr: {
    h1: 'Sık Sorulan Sorular',
    sub: 'Bisiklet alımı, ikinci el, garanti, atölye ve ölçüler hakkında her şey — Lünen’deki Karaarslan Bike’tan kısa ve dürüst yanıtlar.',
    searchPlaceholder: 'Ara, örn. “garanti” veya “20 inç”',
    noMatch: 'Uygun soru bulunamadı. Bize WhatsApp’tan yazın!',
    categories: [
      {
        id: 'kauf',
        title: 'Satın alma & danışmanlık',
        items: [
          { q: "Lünen'de nereden bisiklet alabilirim?", a: "Karaarslan Bike, Alstedder Straße 5, 44534 Lünen (Alstedde). 100'ün üzerinde yeni ve ikinci el bisiklet stoğumuzda." },
          { q: 'Randevu gerekli mi?', a: 'Hayır. Çalışma saatlerinde uğramanız yeterli — danışmanlık ve deneme sürüşü randevusuz.' },
          { q: 'Satın almadan önce deneyebilir miyim?', a: 'Evet, her bisiklet çalışma saatlerinde denenebilir.' },
          { q: 'Hangi bisiklet tipleri var?', a: 'Şehir, trekking, dağ, elektrikli, çocuk, Hollanda ve yol bisikletleri — yeni ve ikinci el.' },
          { q: 'Bisiklet ayırtabilir miyim?', a: 'Bize sorun — çoğu durumda seçtiğiniz bisikleti kısa bir süre ayırabiliriz.' },
          { q: 'Fatura alıyor muyum?', a: 'Evet, her bisiklet fatura ve satış sözleşmesiyle satılır.' },
        ],
      },
      {
        id: 'gebraucht',
        title: 'İkinci el bisikletler',
        items: [
          { q: 'İkinci el bisiklet ne kadar?', a: "Yaklaşık 80 €'dan, ikinci el e-bisikletler yaklaşık 800 €'dan başlar. Her bisikletin sabit ve adil bir fiyatı vardır.", link: { label: 'İkinci el bisikletleri gör', href: '/tr/gebrauchte-fahrraeder' } },
          { q: 'İkinci el bisikletler kontrol ediliyor mu?', a: 'Evet. Her ikinci el bisiklet teknik kontrolden geçer ve yenilenir: fren, vites, lastik, zincir, ışık ve güvenlikle ilgili tüm parçalar.' },
          { q: 'İkinci el bisikletler nereden geliyor?', a: 'Şahıslardan veya diğer yasal kaynaklardan. Her bisiklet fatura ve satış sözleşmesiyle satılır.' },
          { q: 'İkinci el e-bisiklet var mı?', a: 'Evet, kontrol edilmiş motor ve belgelenmiş batarya durumuyla.' },
          { q: 'İkinci el bisiklet alıyor musunuz?', a: "Evet, iyi durumdaki bisikletleri adil fiyatla alıyoruz. Fotoğrafları ve fiyatınızı WhatsApp'tan gönderin veya uğrayın." },
          { q: 'Eski bisikletimi takas edebilir miyim?', a: 'Duruma göre evet — bize sorun, bir çözüm buluruz.' },
        ],
      },
      {
        id: 'garantie',
        title: 'Garanti & iade',
        items: [
          { q: 'Yeni bisikletlerde garanti nedir?', a: '24 ay yasal garanti. Fatura teslim edilir.' },
          { q: 'İkinci el bisikletlerde garanti nedir?', a: 'Zincir, vites, arka aktarıcı, dinamo, pedallar ve hidrolik frenlerde 3 ay.', link: { label: 'Garanti koşulları', href: '/tr/garantie' } },
          { q: 'Garanti kapsamı dışında neler var?', a: 'Lastik, iç lastik, fren balatası ve lamba gibi aşınan parçalar ile kaza veya hatalı kullanımdan doğan hasarlar.' },
          { q: 'Bisikleti iade edebilir miyim?', a: 'Evet, eksiksiz ve hasarsız iade edilmesi şartıyla 3 iş günü içinde.' },
        ],
      },
      {
        id: 'werkstatt',
        title: 'Atölye & servis',
        items: [
          { q: 'Bisiklet tamiri yapıyor musunuz?', a: "Evet. Ücretsiz bisiklet kontrolü ve isteğe bağlı tamir sunuyoruz — fren, vites, lastik, zincir, kablolar, ışık ve daha fazlası. Önceden WhatsApp'tan haber vermeniz en iyisi." },
          { q: 'Ücretsiz kontrol neleri kapsıyor?', a: 'Fren, vites, lastik ve zincir, ışık, reflektörler, zil ve genel trafik güvenliği. Tamir sadece isterseniz.' },
          { q: 'E-bisiklet ve yol bisikleti tamir ediyor musunuz?', a: 'Hayır, atölye hizmetimiz sadece normal bisikletler içindir — e-bisiklet ve yol bisikleti hariç.' },
        ],
      },
      {
        id: 'groesse',
        title: 'Ölçüler & çocuk bisikletleri',
        items: [
          { q: 'Hangi bisiklet ölçüsüne ihtiyacım var?', a: 'Boya, iç bacak uzunluğuna ve bisiklet tipine bağlı. 170 cm boyda genelde 48–52 cm, 180 cm boyda 53–57 cm kadrolu trekking bisikleti uyar.', link: { label: 'Bisiklet boyunu hesapla', href: '/tr/fahrradgroesse-berechnen' } },
          { q: 'Hangi yaşa hangi çocuk bisikleti?', a: 'Kabaca: 2–4 yaş 12 inç, 4–6 yaş 16 inç, 6–8 yaş 20 inç, 8–11 yaş 24 inç, 10–13 yaş 26 inç. Boy, yaştan daha önemlidir.', link: { label: 'Yaşa göre çocuk bisikleti', href: '/tr/kinderfahrrad-alter' } },
          { q: 'Bisiklet iyi bir yılbaşı hediyesi mi?', a: 'Evet — özellikle çocuk bisikletleri ve e-bisikletler. Sürpriz kalsa bile doğru ölçüyü seçmenize yardım ederiz.', link: { label: 'Yılbaşı hediyesi bisiklet', href: '/tr/weihnachtsgeschenk-fahrrad' } },
        ],
      },
      {
        id: 'info',
        title: 'Ödeme, çalışma saatleri & ulaşım',
        items: [
          { q: 'Nasıl ödeme yapabilirim?', a: 'Nakit, banka kartı, kredi kartı, havale veya PayPal.' },
          { q: 'Çalışma saatleriniz nedir?', a: 'Pazartesi–Perşembe 09:00–18:00, Cuma 09:00–13:00 ve 15:00–18:00, Cumartesi 09:00–18:00. Pazar ve resmi tatillerde kapalı.' },
          { q: 'Sizi nerede bulurum?', a: 'Alstedder Straße 5, 44534 Lünen-Alstedde. Dortmund, Selm, Werne, Kamen ve Bergkamen’den de müşterilerimiz geliyor.', link: { label: 'İletişim & yol tarifi', href: '/tr/contact' } },
          { q: 'Size en hızlı nasıl ulaşırım?', a: 'WhatsApp veya telefon: +49 163 7390 301.' },
        ],
      },
    ],
  },
  nl: {
    h1: 'Veelgestelde vragen',
    sub: 'Alles over een fiets kopen, tweedehands fietsen, garantie, werkplaats en maten — kort en eerlijk beantwoord door Karaarslan Bike in Lünen.',
    searchPlaceholder: 'Zoeken, bijv. „garantie” of „20 inch”',
    noMatch: 'Geen passende vraag gevonden. Stuur ons gewoon een WhatsApp!',
    categories: [
      {
        id: 'kauf',
        title: 'Kopen & advies',
        items: [
          { q: 'Waar kan ik in Lünen een fiets kopen?', a: 'Bij Karaarslan Bike, Alstedder Straße 5, 44534 Lünen (Alstedde). We hebben meer dan 100 nieuwe en tweedehands fietsen op voorraad.' },
          { q: 'Heb ik een afspraak nodig?', a: 'Nee. Kom gewoon langs tijdens de openingstijden — advies en proefrit zonder afspraak.' },
          { q: 'Kan ik een fiets proefrijden?', a: 'Ja, elke fiets kan tijdens de openingstijden worden getest.' },
          { q: 'Welke soorten fietsen heeft u?', a: 'Stadsfietsen, trekkingfietsen, mountainbikes, e-bikes, kinderfietsen, omafietsen en racefietsen — nieuw en tweedehands.' },
          { q: 'Kan ik een fiets reserveren?', a: 'Vraag het ons — in veel gevallen kunnen we uw favoriete fiets korte tijd apart zetten.' },
          { q: 'Krijg ik een factuur?', a: 'Ja, bij elke fiets krijgt u een factuur en een koopovereenkomst.' },
        ],
      },
      {
        id: 'gebraucht',
        title: 'Tweedehands fietsen',
        items: [
          { q: 'Wat kost een tweedehands fiets?', a: 'Vanaf ca. €80, tweedehands e-bikes vanaf ca. €800. Elke fiets heeft een vaste, eerlijke prijs.', link: { label: 'Tweedehands fietsen bekijken', href: '/nl/gebrauchte-fahrraeder' } },
          { q: 'Zijn de tweedehands fietsen gecontroleerd?', a: 'Ja. Elke tweedehands fiets wordt technisch gecontroleerd en opgeknapt: remmen, versnellingen, banden, ketting, licht en alle veiligheidsrelevante onderdelen.' },
          { q: 'Waar komen de tweedehands fietsen vandaan?', a: 'Van particulieren of uit andere legale bronnen. Bij elke fiets krijgt u een factuur en een koopovereenkomst.' },
          { q: 'Heeft u tweedehands e-bikes?', a: 'Ja, met gecontroleerde aandrijving en gedocumenteerde accustaat.' },
          { q: 'Koopt u tweedehands fietsen in?', a: "Ja, fietsen in goede staat tegen eerlijke prijzen. Stuur ons foto's en uw vraagprijs via WhatsApp of kom langs." },
          { q: 'Kan ik mijn oude fiets inruilen?', a: 'In individuele gevallen wel — spreek ons aan, we vinden een oplossing.' },
        ],
      },
      {
        id: 'garantie',
        title: 'Garantie & retour',
        items: [
          { q: 'Welke garantie hebben nieuwe fietsen?', a: '24 maanden wettelijke garantie. De factuur wordt meegeleverd.' },
          { q: 'Welke garantie hebben tweedehands fietsen?', a: '3 maanden op ketting, versnellingen, derailleur, dynamo, pedalen en hydraulische remmen.', link: { label: 'Garantievoorwaarden', href: '/nl/garantie' } },
          { q: 'Wat valt niet onder de garantie?', a: 'Slijtdelen zoals banden, binnenbanden, remblokken en lampen, en schade door ongevallen of onjuist gebruik.' },
          { q: 'Kan ik een fiets terugbrengen?', a: 'Ja, binnen 3 werkdagen, als de fiets compleet en onbeschadigd wordt teruggebracht.' },
        ],
      },
      {
        id: 'werkstatt',
        title: 'Werkplaats & service',
        items: [
          { q: 'Repareert u ook fietsen?', a: 'Ja. We bieden een gratis fietscheck en reparaties op verzoek — remmen, versnellingen, banden, ketting, kabels, licht en meer. Meld u het liefst vooraf via WhatsApp.' },
          { q: 'Wat houdt de gratis fietscheck in?', a: 'We controleren remmen, versnellingen, banden en ketting, licht, reflectoren, bel en de algemene verkeersveiligheid. Reparaties alleen als u dat wilt.' },
          { q: 'Repareert u e-bikes en racefietsen?', a: 'Nee, onze werkplaats is alleen voor gewone fietsen — niet voor e-bikes en racefietsen.' },
        ],
      },
      {
        id: 'groesse',
        title: 'Maten & kinderfietsen',
        items: [
          { q: 'Welke fietsmaat heb ik nodig?', a: 'Dat hangt af van lengte, binnenbeenlengte en fietstype. Bij 170 cm past meestal een trekkingfiets met 48–52 cm frame, bij 180 cm een met 53–57 cm.', link: { label: 'Fietsmaat berekenen', href: '/nl/fahrradgroesse-berechnen' } },
          { q: 'Welke kinderfiets bij welke leeftijd?', a: 'Grofweg: 12 inch vanaf 2–4 jaar, 16 inch vanaf 4–6, 20 inch vanaf 6–8, 24 inch vanaf 8–11 en 26 inch vanaf 10–13 jaar. Lengte telt meer dan leeftijd.', link: { label: 'Kinderfiets per leeftijd', href: '/nl/kinderfahrrad-alter' } },
          { q: 'Is een fiets een goed kerstcadeau?', a: 'Ja — vooral kinderfietsen en e-bikes. We helpen u met de juiste maat, ook als het een verrassing moet blijven.', link: { label: 'Fiets als kerstcadeau', href: '/nl/weihnachtsgeschenk-fahrrad' } },
        ],
      },
      {
        id: 'info',
        title: 'Betalen, openingstijden & route',
        items: [
          { q: 'Hoe kan ik betalen?', a: 'Contant, met pinpas, creditcard, per overschrijving of met PayPal.' },
          { q: 'Wat zijn uw openingstijden?', a: 'Maandag t/m donderdag 09:00–18:00, vrijdag 09:00–13:00 en 15:00–18:00, zaterdag 09:00–18:00. Zon- en feestdagen gesloten.' },
          { q: 'Waar vind ik u?', a: 'Alstedder Straße 5, 44534 Lünen-Alstedde. Klanten komen ook uit Dortmund, Selm, Werne, Kamen en Bergkamen.', link: { label: 'Contact & route', href: '/nl/contact' } },
          { q: 'Hoe bereik ik u het snelst?', a: 'Via WhatsApp of telefoon: +49 163 7390 301.' },
        ],
      },
    ],
  },
};
