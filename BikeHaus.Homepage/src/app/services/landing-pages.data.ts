import { Language } from './translation.service';
import { KIDS_GUIDE, SIZE_GUIDE } from './landing-guides.data';

/**
 * Content for the SEO landing pages (used bikes, Christmas gifts).
 * Every language is written out in full — these pages exist to rank, so no
 * fallback text. Links are absolute paths so each language can point at its
 * own (or the closest available) guide article.
 */

export type LandingKey = 'used' | 'xmas' | 'size' | 'kids';

export interface LandingLink {
  label: string;
  href: string;
}

export interface LandingCard {
  title: string;
  text: string;
  image?: string;
  href?: string;
  linkLabel?: string;
}

export type LandingSection =
  | { kind: 'text'; heading: string; paragraphs: string[] }
  | { kind: 'list'; heading: string; intro?: string; items: string[] }
  | { kind: 'cards'; heading: string; intro?: string; cards: LandingCard[] }
  | {
      kind: 'compare';
      heading: string;
      intro?: string;
      cols: [string, string];
      rows: { label: string; a: string; b: string }[];
    }
  | { kind: 'listings'; heading: string; intro: string; moreLabel: string }
  | {
      kind: 'feature';
      heading: string;
      paragraphs: string[];
      items?: string[];
      image: string;
    }
  | { kind: 'links'; heading: string; intro?: string; links: LandingLink[] }
  | {
      kind: 'table';
      heading: string;
      intro?: string;
      columns: string[];
      rows: string[][];
      note?: string;
    }
  | {
      kind: 'calculator';
      heading: string;
      intro: string;
      mode: 'frame' | 'kids';
      labels: CalculatorLabels;
    };

export interface CalculatorLabels {
  height: string;
  /** frame mode: inside-leg length; kids mode: age in years */
  second: string;
  secondHint: string;
  result: string;
  empty: string;
  /** frame mode: City/Trekking, MTB, road bike; kids mode: wheel size */
  outputs: string[];
  note: string;
}

export interface LandingContent {
  metaTitle: string;
  metaDescription: string;
  breadcrumb: string;
  eyebrow: string;
  h1: string;
  h1Accent: string;
  sub: string;
  ctaPrimary: LandingLink;
  usps: string[];
  sections: LandingSection[];
  faqHeading: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
}

export interface LandingPage {
  slug: string;
  heroImage: string;
  ctaImage: string;
  content: Record<Language, LandingContent>;
}

// ───────────────────────── Gebrauchte Fahrräder ─────────────────────────

const USED: LandingPage = {
  slug: 'gebrauchte-fahrraeder',
  heroImage: '/assets/stock/city-sun.webp',
  ctaImage: '/assets/stock/seaside.webp',
  content: {
    de: {
      metaTitle:
        'Gebrauchte Fahrräder Lünen kaufen | geprüft, 3 Monate Garantie | Karaarslan Bike',
      metaDescription:
        'Gebrauchtes Fahrrad in Lünen kaufen ✓ 100+ geprüfte Gebrauchträder ab ca. 80 € ✓ City, Trekking, MTB, Kinderrad & E-Bike ✓ 3 Monate Garantie ✓ Probefahrt ohne Termin.',
      breadcrumb: 'Gebrauchte Fahrräder',
      eyebrow: 'Gebrauchtrad-Händler in Lünen-Alstedde',
      h1: 'Gebrauchte Fahrräder in Lünen kaufen',
      h1Accent: 'geprüft, mit Garantie.',
      sub: 'Über 100 gebrauchte Fahrräder ab ca. 80 € — Citybike, Trekkingrad, Mountainbike, Kinderfahrrad und E-Bike. Technisch geprüft, aufbereitet, mit 3 Monaten Garantie und sofort zum Mitnehmen.',
      ctaPrimary: { label: 'Gebrauchträder im Showroom', href: '/de/showroom' },
      usps: [
        'Technisch geprüft & aufbereitet',
        '3 Monate Garantie',
        '3 Tage Rückgaberecht',
        'Probefahrt ohne Termin',
        'Rechnung & Kaufvertrag',
        'Inzahlungnahme möglich',
      ],
      sections: [
        {
          kind: 'listings',
          heading: 'Aktuell im Showroom: gebrauchte Fahrräder',
          intro:
            'Unser Bestand wechselt fast täglich. Hier sehen Sie eine Auswahl der Gebrauchträder, die gerade bei uns in der Alstedder Straße 5 stehen.',
          moreLabel: 'Alle gebrauchten Fahrräder ansehen',
        },
        {
          kind: 'compare',
          heading: 'Gebrauchtes Fahrrad vom Händler statt privat kaufen',
          intro:
            'Ein Gebrauchtrad aus Kleinanzeigen ist oft ein Glücksspiel. Bei uns kaufen Sie gebraucht — aber mit der Sicherheit eines Fachhändlers.',
          cols: ['Privatkauf', 'Karaarslan Bike'],
          rows: [
            { label: 'Technische Prüfung', a: 'Meist keine', b: 'Bremsen, Schaltung, Reifen, Kette, Licht' },
            { label: 'Garantie', a: 'Keine', b: '3 Monate auf Gebrauchträder' },
            { label: 'Rückgabe', a: 'Nicht möglich', b: '3 Tage Rückgaberecht' },
            { label: 'Kaufnachweis', a: 'Oft nur Handschlag', b: 'Rechnung & Kaufvertrag' },
            { label: 'Probefahrt', a: 'Nach Absprache', b: 'Jederzeit zu den Öffnungszeiten' },
            { label: 'Beratung zur Rahmengröße', a: 'Selten', b: 'Persönlich vor Ort' },
          ],
        },
        {
          kind: 'list',
          heading: 'So prüfen wir jedes Gebrauchtrad',
          intro:
            'Bevor ein gebrauchtes Fahrrad in unseren Showroom kommt, geht es durch unsere Werkstatt. Dabei kontrollieren und justieren wir unter anderem:',
          items: [
            'Bremsen: Beläge, Züge bzw. Hydraulik und Bremswirkung',
            'Schaltung und Schaltwerk: sauberes Schalten in allen Gängen',
            'Reifen, Schläuche und Kette auf Verschleiß',
            'Lichtanlage, Reflektoren und Klingel (verkehrssicher nach StVZO)',
            'Lager, Lenker, Sattelstütze und alle sicherheitsrelevanten Schrauben',
            'Gründliche Reinigung — das Rad ist sofort fahrbereit',
          ],
        },
        {
          kind: 'cards',
          heading: 'Gebrauchte Fahrräder für jeden Einsatz',
          intro:
            'Ob für den Weg zur Arbeit, die Runde an der Lippe oder den Schulweg — wir haben das passende Gebrauchtrad.',
          cards: [
            { image: '/assets/stock/city.webp', title: 'Gebrauchte Citybikes & Hollandräder', text: 'Bequem, robust und alltagstauglich — ideal für Einkäufe und kurze Wege in Lünen.' },
            { image: '/assets/stock/lake.webp', title: 'Gebrauchte Trekkingräder', text: 'Für Pendler und Touren auf der Römer-Lippe-Route: Gepäckträger, Licht und viele Gänge.' },
            { image: '/assets/stock/mtb.webp', title: 'Gebrauchte Mountainbikes', text: 'Federgabel, griffige Reifen und stabile Rahmen — für Wald, Halden und Feldwege.' },
            { image: '/assets/stock/kids-hero.webp', title: 'Gebrauchte Kinderfahrräder', text: 'Von 12 bis 26 Zoll. Kinder wachsen schnell — gebraucht spart hier besonders viel.', href: '/de/ratgeber/kinderfahrrad-groesse', linkLabel: 'Welche Größe passt?' },
            { image: '/assets/stock/ebike-white.webp', title: 'Gebrauchte E-Bikes', text: 'Ab ca. 800 € — mit geprüftem Antrieb und dokumentiertem Akkuzustand.', href: '/de/ratgeber/e-bike-gebraucht-kaufen', linkLabel: 'Ratgeber gebrauchtes E-Bike' },
            { image: '/assets/stock/happy.webp', title: 'Damen- & Herrenräder', text: 'Tiefer Einstieg oder sportlicher Diamantrahmen — in vielen Rahmengrößen vorrätig.', href: '/de/ratgeber/fahrrad-rahmengroesse-berechnen', linkLabel: 'Rahmengröße berechnen' },
          ],
        },
        {
          kind: 'text',
          heading: 'Was kostet ein gebrauchtes Fahrrad in Lünen?',
          paragraphs: [
            'Gebrauchte Fahrräder bekommen Sie bei uns ab ca. 80 €, gebrauchte E-Bikes ab ca. 800 €. Der Preis hängt von Marke, Alter, Ausstattung und Zustand ab — jedes Rad ist mit einem festen, fair kalkulierten Preis ausgezeichnet. Kein Feilschen, kein Kleingedrucktes.',
            'Bezahlen können Sie bar, mit EC-Karte, per Überweisung oder PayPal. Zu jedem Gebrauchtrad erhalten Sie eine Rechnung und einen Kaufvertrag.',
          ],
        },
        {
          kind: 'text',
          heading: 'Altes Fahrrad verkaufen oder in Zahlung geben',
          paragraphs: [
            'Sie möchten Ihr altes Rad loswerden? Wir kaufen gebrauchte Fahrräder in gutem Zustand zu fairen Preisen an. Schicken Sie uns einfach Fotos und Ihre Preisvorstellung per WhatsApp an +49 163 7390 301 oder kommen Sie direkt vorbei.',
            'Beim Kauf eines anderen Rades ist eine Inzahlungnahme im Einzelfall möglich — sprechen Sie uns an.',
          ],
        },
        {
          kind: 'links',
          heading: 'Gebrauchte Fahrräder für Lünen und Umgebung',
          intro:
            'Unser Laden liegt in Lünen-Alstedde. Zu uns kommen Kunden aus allen Lüner Stadtteilen — Brambauer, Altlünen, Gahmen, Horstmar, Wethmar, Lünen-Süd, Niederaden und Beckinghausen — und aus den Nachbarstädten:',
          links: [
            { label: 'Fahrrad kaufen Dortmund', href: '/de/fahrrad-dortmund' },
            { label: 'Fahrrad kaufen Selm', href: '/de/fahrrad-selm' },
            { label: 'Fahrrad kaufen Werne', href: '/de/fahrrad-werne' },
            { label: 'Fahrrad kaufen Kamen', href: '/de/fahrrad-kamen' },
            { label: 'Fahrrad kaufen Bergkamen', href: '/de/fahrrad-bergkamen' },
            { label: 'Ratgeber: Gebrauchtes Fahrrad kaufen', href: '/de/ratgeber/gebrauchtes-fahrrad-kaufen-tipps' },
          ],
        },
      ],
      faqHeading: 'Häufige Fragen zum Gebrauchtradkauf',
      faq: [
        { q: 'Wo kann ich in Lünen ein gebrauchtes Fahrrad kaufen?', a: 'Bei Karaarslan Bike in der Alstedder Straße 5, 44534 Lünen. Wir haben ständig über 100 geprüfte Gebrauchträder vorrätig — kommen Sie ohne Termin vorbei.' },
        { q: 'Was kostet ein gebrauchtes Fahrrad?', a: 'Gebrauchträder gibt es bei uns ab ca. 80 €, gebrauchte E-Bikes ab ca. 800 €. Jedes Rad hat einen festen, fair kalkulierten Preis.' },
        { q: 'Bekomme ich Garantie auf ein gebrauchtes Fahrrad?', a: 'Ja. Auf Gebrauchträder geben wir 3 Monate Garantie auf Kette, Schaltung, Schaltwerk, Dynamo, Pedale und hydraulische Bremsen. Zusätzlich haben Sie 3 Tage Rückgaberecht.' },
        { q: 'Kann ich ein Gebrauchtrad vor dem Kauf probefahren?', a: 'Ja, jedes Rad kann während der Öffnungszeiten probegefahren werden — ein Termin ist nicht nötig.' },
        { q: 'Woher stammen Ihre gebrauchten Fahrräder?', a: 'Unsere Gebrauchträder kommen von Privatpersonen oder aus anderen legalen Quellen. Sie erhalten zu jedem Rad eine Rechnung und einen Kaufvertrag.' },
        { q: 'Haben Sie auch gebrauchte E-Bikes?', a: 'Ja, wir bieten gebrauchte E-Bikes mit geprüftem Antrieb und dokumentiertem Akkuzustand an — ab ca. 800 €.' },
        { q: 'Kaufen Sie auch gebrauchte Fahrräder an?', a: 'Ja. Schicken Sie uns Fotos und Ihre Preisvorstellung per WhatsApp oder bringen Sie das Rad vorbei. Eine Inzahlungnahme ist im Einzelfall möglich.' },
        { q: 'Wann haben Sie geöffnet?', a: 'Montag bis Donnerstag 09:00–18:00, Freitag 09:00–13:00 und 15:00–18:00, Samstag 09:00–18:00. Sonn- und Feiertage geschlossen.' },
      ],
      ctaTitle: 'Ihr nächstes Gebrauchtrad wartet schon.',
      ctaText:
        'Schauen Sie im Showroom vorbei oder schreiben Sie uns per WhatsApp — wir legen Ihnen gern passende Räder heraus.',
    },
    en: {
      metaTitle:
        'Used Bikes for Sale in Lünen | Inspected, 3-Month Warranty | Karaarslan Bike',
      metaDescription:
        'Buy a used bike in Lünen ✓ 100+ inspected second-hand bikes from approx. €80 ✓ City, trekking, MTB, kids & e-bikes ✓ 3-month warranty ✓ Test ride, no appointment.',
      breadcrumb: 'Used Bikes',
      eyebrow: 'Used bike dealer in Lünen-Alstedde',
      h1: 'Buy used bikes in Lünen',
      h1Accent: 'inspected, with warranty.',
      sub: 'Over 100 second-hand bikes from approx. €80 — city bikes, trekking bikes, mountain bikes, kids’ bikes and e-bikes. Technically inspected, refurbished, with a 3-month warranty and ready to take home.',
      ctaPrimary: { label: 'Used bikes in the showroom', href: '/en/showroom' },
      usps: [
        'Technically inspected & refurbished',
        '3-month warranty',
        '3-day return policy',
        'Test ride, no appointment',
        'Invoice & purchase contract',
        'Trade-in possible',
      ],
      sections: [
        {
          kind: 'listings',
          heading: 'In the showroom now: used bikes',
          intro:
            'Our stock changes almost daily. Here is a selection of the used bikes currently waiting for you at Alstedder Straße 5.',
          moreLabel: 'View all used bikes',
        },
        {
          kind: 'compare',
          heading: 'Buying used from a dealer instead of privately',
          intro:
            'A used bike from a classified ad is often a gamble. With us you buy second-hand — but with the security of a specialist shop.',
          cols: ['Private sale', 'Karaarslan Bike'],
          rows: [
            { label: 'Technical inspection', a: 'Usually none', b: 'Brakes, gears, tyres, chain, lights' },
            { label: 'Warranty', a: 'None', b: '3 months on used bikes' },
            { label: 'Returns', a: 'Not possible', b: '3-day return policy' },
            { label: 'Proof of purchase', a: 'Often just a handshake', b: 'Invoice & purchase contract' },
            { label: 'Test ride', a: 'By arrangement', b: 'Any time during opening hours' },
            { label: 'Frame size advice', a: 'Rarely', b: 'In person, in store' },
          ],
        },
        {
          kind: 'list',
          heading: 'How we inspect every used bike',
          intro:
            'Before a used bike enters our showroom, it goes through our workshop. Among other things, we check and adjust:',
          items: [
            'Brakes: pads, cables or hydraulics, and stopping power',
            'Gears and derailleur: clean shifting in every gear',
            'Tyres, tubes and chain for wear',
            'Lights, reflectors and bell (road-legal under German StVZO)',
            'Bearings, handlebars, seat post and all safety-relevant bolts',
            'Thorough cleaning — the bike is ready to ride straight away',
          ],
        },
        {
          kind: 'cards',
          heading: 'Used bikes for every purpose',
          intro:
            'Commuting to work, a ride along the Lippe or the way to school — we have the right second-hand bike.',
          cards: [
            { image: '/assets/stock/city.webp', title: 'Used city & Dutch bikes', text: 'Comfortable, robust and practical — ideal for shopping and short trips around Lünen.' },
            { image: '/assets/stock/lake.webp', title: 'Used trekking bikes', text: 'For commuters and tours on the Römer-Lippe-Route: rack, lights and plenty of gears.' },
            { image: '/assets/stock/mtb.webp', title: 'Used mountain bikes', text: 'Suspension fork, grippy tyres and solid frames — for forests, spoil tips and farm tracks.' },
            { image: '/assets/stock/kids-hero.webp', title: 'Used kids’ bikes', text: 'From 12 to 26 inches. Children grow fast — buying used saves the most here.', href: '/en/guide/childrens-bike-size-guide', linkLabel: 'Which size fits?' },
            { image: '/assets/stock/ebike-white.webp', title: 'Used e-bikes', text: 'From approx. €800 — with an inspected drive system and documented battery condition.', href: '/en/guide/buying-used-e-bike-guide', linkLabel: 'Used e-bike guide' },
            { image: '/assets/stock/happy.webp', title: 'Women’s & men’s bikes', text: 'Step-through or sporty diamond frame — in stock in many frame sizes.', href: '/en/guide/bike-frame-size-calculator-guide', linkLabel: 'Calculate frame size' },
          ],
        },
        {
          kind: 'text',
          heading: 'How much does a used bike cost in Lünen?',
          paragraphs: [
            'Used bikes start at approx. €80, used e-bikes at approx. €800. The price depends on brand, age, equipment and condition — every bike carries a fixed, fairly calculated price. No haggling, no fine print.',
            'You can pay in cash, by debit card, bank transfer or PayPal. Every used bike comes with an invoice and a purchase contract.',
          ],
        },
        {
          kind: 'text',
          heading: 'Sell your old bike or trade it in',
          paragraphs: [
            'Want to get rid of your old bike? We buy used bikes in good condition at fair prices. Just send us photos and your asking price via WhatsApp to +49 163 7390 301, or drop by.',
            'When you buy another bike, a trade-in is possible in individual cases — just ask us.',
          ],
        },
        {
          kind: 'links',
          heading: 'Used bikes for Lünen and the surrounding area',
          intro:
            'Our shop is in Lünen-Alstedde. Customers come from every district of Lünen — Brambauer, Altlünen, Gahmen, Horstmar, Wethmar, Lünen-Süd, Niederaden and Beckinghausen — and from the neighbouring towns:',
          links: [
            { label: 'Buy a bike near Dortmund', href: '/en/fahrrad-dortmund' },
            { label: 'Buy a bike near Selm', href: '/en/fahrrad-selm' },
            { label: 'Buy a bike near Werne', href: '/en/fahrrad-werne' },
            { label: 'Buy a bike near Kamen', href: '/en/fahrrad-kamen' },
            { label: 'Buy a bike near Bergkamen', href: '/en/fahrrad-bergkamen' },
            { label: 'Guide: buying a used bike', href: '/en/guide/buying-used-bike-luenen-tips' },
          ],
        },
      ],
      faqHeading: 'FAQ about buying a used bike',
      faq: [
        { q: 'Where can I buy a used bike in Lünen?', a: 'At Karaarslan Bike, Alstedder Straße 5, 44534 Lünen. We always have over 100 inspected used bikes in stock — drop by without an appointment.' },
        { q: 'How much does a used bike cost?', a: 'Used bikes start at approx. €80, used e-bikes at approx. €800. Every bike has a fixed, fairly calculated price.' },
        { q: 'Do I get a warranty on a used bike?', a: 'Yes. Used bikes come with a 3-month warranty on chain, gears, derailleur, dynamo, pedals and hydraulic brakes, plus a 3-day return policy.' },
        { q: 'Can I test ride a used bike before buying?', a: 'Yes, every bike can be test ridden during opening hours — no appointment needed.' },
        { q: 'Where do your used bikes come from?', a: 'Our used bikes come from private individuals or other legal sources. Every bike comes with an invoice and a purchase contract.' },
        { q: 'Do you sell used e-bikes?', a: 'Yes, we offer used e-bikes with an inspected drive system and documented battery condition — from approx. €800.' },
        { q: 'Do you buy used bikes?', a: 'Yes. Send us photos and your asking price via WhatsApp, or bring the bike by. Trade-ins are possible in individual cases.' },
        { q: 'What are your opening hours?', a: 'Monday to Thursday 09:00–18:00, Friday 09:00–13:00 and 15:00–18:00, Saturday 09:00–18:00. Closed on Sundays and public holidays.' },
      ],
      ctaTitle: 'Your next used bike is already waiting.',
      ctaText:
        'Visit our showroom or message us on WhatsApp — we are happy to set aside bikes that suit you.',
    },
    fr: {
      metaTitle:
        'Vélos d’occasion à Lünen | contrôlés, garantie 3 mois | Karaarslan Bike',
      metaDescription:
        'Acheter un vélo d’occasion à Lünen ✓ 100+ vélos d’occasion contrôlés dès env. 80 € ✓ Ville, trekking, VTT, enfant & VAE ✓ Garantie 3 mois ✓ Essai sans rendez-vous.',
      breadcrumb: 'Vélos d’occasion',
      eyebrow: 'Vélos d’occasion à Lünen-Alstedde',
      h1: 'Acheter un vélo d’occasion à Lünen',
      h1Accent: 'contrôlé, avec garantie.',
      sub: 'Plus de 100 vélos d’occasion dès env. 80 € — vélos de ville, trekking, VTT, vélos enfant et vélos électriques. Contrôlés, remis en état, garantis 3 mois et prêts à partir.',
      ctaPrimary: { label: 'Vélos d’occasion au showroom', href: '/fr/showroom' },
      usps: [
        'Contrôlé & remis en état',
        'Garantie 3 mois',
        'Retour sous 3 jours',
        'Essai sans rendez-vous',
        'Facture & contrat de vente',
        'Reprise possible',
      ],
      sections: [
        {
          kind: 'listings',
          heading: 'Actuellement au showroom : vélos d’occasion',
          intro:
            'Notre stock change presque tous les jours. Voici une sélection des vélos d’occasion qui vous attendent au 5, Alstedder Straße.',
          moreLabel: 'Voir tous les vélos d’occasion',
        },
        {
          kind: 'compare',
          heading: 'Acheter d’occasion chez un pro plutôt qu’entre particuliers',
          intro:
            'Un vélo de petite annonce, c’est souvent un pari. Chez nous, vous achetez d’occasion — avec la sécurité d’un magasin spécialisé.',
          cols: ['Entre particuliers', 'Karaarslan Bike'],
          rows: [
            { label: 'Contrôle technique', a: 'Rarement', b: 'Freins, vitesses, pneus, chaîne, éclairage' },
            { label: 'Garantie', a: 'Aucune', b: '3 mois sur l’occasion' },
            { label: 'Retour', a: 'Impossible', b: 'Retour sous 3 jours' },
            { label: 'Preuve d’achat', a: 'Souvent aucune', b: 'Facture & contrat de vente' },
            { label: 'Essai', a: 'Sur rendez-vous', b: 'À tout moment pendant les horaires' },
            { label: 'Conseil taille de cadre', a: 'Rarement', b: 'En personne, en magasin' },
          ],
        },
        {
          kind: 'list',
          heading: 'Comment nous contrôlons chaque vélo d’occasion',
          intro:
            'Avant d’entrer au showroom, chaque vélo d’occasion passe par notre atelier. Nous vérifions et réglons notamment :',
          items: [
            'Freins : plaquettes, câbles ou hydraulique et efficacité de freinage',
            'Vitesses et dérailleur : passage propre de tous les rapports',
            'Usure des pneus, chambres à air et chaîne',
            'Éclairage, réflecteurs et sonnette (conformes au code allemand StVZO)',
            'Roulements, guidon, tige de selle et toutes les vis de sécurité',
            'Nettoyage complet — le vélo est prêt à rouler',
          ],
        },
        {
          kind: 'cards',
          heading: 'Des vélos d’occasion pour chaque usage',
          intro:
            'Trajet domicile-travail, balade le long de la Lippe ou chemin de l’école — nous avons le vélo d’occasion qu’il vous faut.',
          cards: [
            { image: '/assets/stock/city.webp', title: 'Vélos de ville & hollandais', text: 'Confortables, robustes et pratiques — parfaits pour les courses et les petits trajets.' },
            { image: '/assets/stock/lake.webp', title: 'Vélos trekking', text: 'Pour les pendulaires et les sorties sur la Römer-Lippe-Route : porte-bagages, éclairage et nombreuses vitesses.' },
            { image: '/assets/stock/mtb.webp', title: 'VTT d’occasion', text: 'Fourche suspendue, pneus crantés et cadres solides — pour la forêt et les chemins.' },
            { image: '/assets/stock/kids-hero.webp', title: 'Vélos enfant d’occasion', text: 'De 12 à 26 pouces. Les enfants grandissent vite — l’occasion fait faire de vraies économies.', href: '/fr/guide/taille-velo-enfant-guide', linkLabel: 'Quelle taille choisir ?' },
            { image: '/assets/stock/ebike-white.webp', title: 'Vélos électriques d’occasion', text: 'Dès env. 800 € — moteur contrôlé et état de la batterie documenté.', href: '/fr/guide/acheter-velo-electrique-occasion', linkLabel: 'Guide VAE d’occasion' },
            { image: '/assets/stock/happy.webp', title: 'Vélos femme & homme', text: 'Cadre ouvert ou cadre diamant sportif — disponibles dans de nombreuses tailles.', href: '/fr/guide/calculer-taille-cadre-velo', linkLabel: 'Calculer la taille du cadre' },
          ],
        },
        {
          kind: 'text',
          heading: 'Combien coûte un vélo d’occasion à Lünen ?',
          paragraphs: [
            'Nos vélos d’occasion commencent à env. 80 €, les vélos électriques d’occasion à env. 800 €. Le prix dépend de la marque, de l’âge, de l’équipement et de l’état — chaque vélo affiche un prix fixe et juste. Pas de marchandage, pas de petites lignes.',
            'Paiement en espèces, par carte bancaire, virement ou PayPal. Chaque vélo d’occasion est vendu avec facture et contrat de vente.',
          ],
        },
        {
          kind: 'text',
          heading: 'Vendre votre ancien vélo ou le faire reprendre',
          paragraphs: [
            'Vous voulez vous séparer de votre vélo ? Nous rachetons les vélos d’occasion en bon état à des prix justes. Envoyez-nous des photos et votre prix par WhatsApp au +49 163 7390 301, ou passez directement.',
            'Lors de l’achat d’un autre vélo, une reprise est possible au cas par cas — parlez-nous-en.',
          ],
        },
        {
          kind: 'links',
          heading: 'Vélos d’occasion pour Lünen et ses environs',
          intro:
            'Notre magasin se trouve à Lünen-Alstedde. Nos clients viennent de tous les quartiers de Lünen — Brambauer, Altlünen, Gahmen, Horstmar, Wethmar, Lünen-Süd, Niederaden et Beckinghausen — et des villes voisines :',
          links: [
            { label: 'Acheter un vélo près de Dortmund', href: '/fr/fahrrad-dortmund' },
            { label: 'Acheter un vélo près de Selm', href: '/fr/fahrrad-selm' },
            { label: 'Acheter un vélo près de Werne', href: '/fr/fahrrad-werne' },
            { label: 'Acheter un vélo près de Kamen', href: '/fr/fahrrad-kamen' },
            { label: 'Acheter un vélo près de Bergkamen', href: '/fr/fahrrad-bergkamen' },
            { label: 'Guide : acheter un vélo d’occasion', href: '/fr/guide/acheter-velo-occasion-luenen-conseils' },
          ],
        },
      ],
      faqHeading: 'Questions fréquentes sur l’achat d’occasion',
      faq: [
        { q: 'Où acheter un vélo d’occasion à Lünen ?', a: 'Chez Karaarslan Bike, Alstedder Straße 5, 44534 Lünen. Nous avons en permanence plus de 100 vélos d’occasion contrôlés — passez sans rendez-vous.' },
        { q: 'Combien coûte un vélo d’occasion ?', a: 'Dès env. 80 € pour un vélo d’occasion, dès env. 800 € pour un vélo électrique d’occasion. Chaque vélo a un prix fixe et juste.' },
        { q: 'Un vélo d’occasion est-il garanti ?', a: 'Oui. 3 mois de garantie sur la chaîne, les vitesses, le dérailleur, la dynamo, les pédales et les freins hydrauliques, plus 3 jours de droit de retour.' },
        { q: 'Puis-je essayer un vélo avant de l’acheter ?', a: 'Oui, chaque vélo peut être essayé pendant nos horaires d’ouverture — sans rendez-vous.' },
        { q: 'D’où viennent vos vélos d’occasion ?', a: 'Nos vélos d’occasion proviennent de particuliers ou d’autres sources légales. Chaque vélo est vendu avec facture et contrat de vente.' },
        { q: 'Avez-vous des vélos électriques d’occasion ?', a: 'Oui, avec moteur contrôlé et état de batterie documenté — dès env. 800 €.' },
        { q: 'Rachetez-vous les vélos d’occasion ?', a: 'Oui. Envoyez-nous des photos et votre prix par WhatsApp ou apportez le vélo. Une reprise est possible au cas par cas.' },
        { q: 'Quels sont vos horaires ?', a: 'Lundi à jeudi 09:00–18:00, vendredi 09:00–13:00 et 15:00–18:00, samedi 09:00–18:00. Fermé dimanche et jours fériés.' },
      ],
      ctaTitle: 'Votre prochain vélo d’occasion vous attend.',
      ctaText:
        'Passez au showroom ou écrivez-nous sur WhatsApp — nous mettons volontiers de côté les vélos qui vous correspondent.',
    },
    tr: {
      metaTitle:
        "Lünen'de İkinci El Bisiklet | Kontrol Edilmiş, 3 Ay Garanti | Karaarslan Bike",
      metaDescription:
        "Lünen'de ikinci el bisiklet satın alın ✓ Yaklaşık 80 €'dan başlayan 100+ kontrol edilmiş bisiklet ✓ Şehir, trekking, dağ, çocuk & e-bisiklet ✓ 3 ay garanti ✓ Randevusuz deneme.",
      breadcrumb: 'İkinci El Bisikletler',
      eyebrow: "Lünen-Alstedde'de ikinci el bisiklet",
      h1: "Lünen'de ikinci el bisiklet satın alın",
      h1Accent: 'kontrol edilmiş, garantili.',
      sub: "Yaklaşık 80 €'dan başlayan 100'ün üzerinde ikinci el bisiklet — şehir, trekking, dağ, çocuk ve elektrikli bisikletler. Teknik kontrolden geçmiş, yenilenmiş, 3 ay garantili ve hemen götürmeye hazır.",
      ctaPrimary: { label: "Showroom'daki ikinci el bisikletler", href: '/tr/showroom' },
      usps: [
        'Teknik kontrol & bakım',
        '3 ay garanti',
        '3 gün iade hakkı',
        'Randevusuz deneme sürüşü',
        'Fatura & satış sözleşmesi',
        'Takas mümkün',
      ],
      sections: [
        {
          kind: 'listings',
          heading: "Şu an showroom'da: ikinci el bisikletler",
          intro:
            "Stoğumuz neredeyse her gün değişiyor. Burada, şu anda Alstedder Straße 5'te sizi bekleyen ikinci el bisikletlerden bir seçki görüyorsunuz.",
          moreLabel: 'Tüm ikinci el bisikletleri gör',
        },
        {
          kind: 'compare',
          heading: 'İkinci el bisikleti şahıstan değil, bayiden alın',
          intro:
            'İlan sitelerinden alınan ikinci el bisiklet çoğu zaman bir kumardır. Bizden ikinci el alırsınız — ama uzman bir mağazanın güvencesiyle.',
          cols: ['Şahıstan alım', 'Karaarslan Bike'],
          rows: [
            { label: 'Teknik kontrol', a: 'Genelde yok', b: 'Fren, vites, lastik, zincir, ışık' },
            { label: 'Garanti', a: 'Yok', b: 'İkinci elde 3 ay' },
            { label: 'İade', a: 'Mümkün değil', b: '3 gün iade hakkı' },
            { label: 'Satın alma belgesi', a: 'Çoğu zaman yok', b: 'Fatura & satış sözleşmesi' },
            { label: 'Deneme sürüşü', a: 'Anlaşmaya bağlı', b: 'Çalışma saatlerinde her zaman' },
            { label: 'Kadro boyu danışmanlığı', a: 'Nadiren', b: 'Mağazada yüz yüze' },
          ],
        },
        {
          kind: 'list',
          heading: 'Her ikinci el bisikleti nasıl kontrol ediyoruz',
          intro:
            "İkinci el bir bisiklet showroom'a girmeden önce atölyemizden geçer. Diğerlerinin yanı sıra şunları kontrol edip ayarlıyoruz:",
          items: [
            'Frenler: balatalar, kablolar veya hidrolik ve fren gücü',
            'Vites ve arka aktarıcı: tüm viteslerde temiz geçiş',
            'Lastik, iç lastik ve zincirde aşınma',
            'Aydınlatma, reflektörler ve zil (Alman StVZO kurallarına uygun)',
            'Rulmanlar, gidon, sele borusu ve güvenlikle ilgili tüm cıvatalar',
            'Detaylı temizlik — bisiklet hemen sürüşe hazır',
          ],
        },
        {
          kind: 'cards',
          heading: 'Her ihtiyaca uygun ikinci el bisiklet',
          intro:
            "İşe gidiş, Lippe kenarında tur ya da okul yolu — size uygun ikinci el bisiklet bizde.",
          cards: [
            { image: '/assets/stock/city.webp', title: 'İkinci el şehir & Hollanda bisikletleri', text: "Rahat, sağlam ve kullanışlı — alışveriş ve Lünen'de kısa yollar için ideal." },
            { image: '/assets/stock/lake.webp', title: 'İkinci el trekking bisikletleri', text: 'İşe gidenler ve Römer-Lippe-Route turları için: bagaj, ışık ve çok vites.' },
            { image: '/assets/stock/mtb.webp', title: 'İkinci el dağ bisikletleri', text: 'Amortisörlü çatal, tutunan lastikler ve sağlam kadrolar — orman ve toprak yollar için.' },
            { image: '/assets/stock/kids-hero.webp', title: 'İkinci el çocuk bisikletleri', text: '12 ile 26 inç arası. Çocuklar hızlı büyür — burada ikinci el en çok kazandırır.', href: '/tr/ratgeber/kinderfahrrad-groesse', linkLabel: 'Hangi boy uygun?' },
            { image: '/assets/stock/ebike-white.webp', title: 'İkinci el e-bisikletler', text: "Yaklaşık 800 €'dan başlayan fiyatlarla — kontrol edilmiş motor ve belgelenmiş batarya durumu.", href: '/tr/ratgeber/e-bike-gebraucht-kaufen', linkLabel: 'İkinci el e-bisiklet rehberi' },
            { image: '/assets/stock/happy.webp', title: 'Kadın & erkek bisikletleri', text: 'Alçak girişli ya da sportif kadro — birçok kadro boyunda stokta.', href: '/tr/ratgeber/fahrrad-rahmengroesse-berechnen', linkLabel: 'Kadro boyunu hesapla' },
          ],
        },
        {
          kind: 'text',
          heading: "Lünen'de ikinci el bisiklet ne kadar?",
          paragraphs: [
            "İkinci el bisikletler yaklaşık 80 €'dan, ikinci el e-bisikletler yaklaşık 800 €'dan başlar. Fiyat marka, yaş, donanım ve duruma göre değişir — her bisikletin sabit ve adil hesaplanmış bir fiyatı vardır. Pazarlık yok, gizli şart yok.",
            'Nakit, banka kartı, havale veya PayPal ile ödeyebilirsiniz. Her ikinci el bisiklet fatura ve satış sözleşmesiyle satılır.',
          ],
        },
        {
          kind: 'text',
          heading: 'Eski bisikletinizi satın veya takas edin',
          paragraphs: [
            "Eski bisikletinizden kurtulmak mı istiyorsunuz? İyi durumdaki ikinci el bisikletleri adil fiyatlarla satın alıyoruz. Fotoğrafları ve istediğiniz fiyatı WhatsApp'tan +49 163 7390 301 numarasına gönderin ya da doğrudan uğrayın.",
            'Başka bir bisiklet alırken, duruma göre takas da mümkün — bize sorun.',
          ],
        },
        {
          kind: 'links',
          heading: "Lünen ve çevresi için ikinci el bisikletler",
          intro:
            "Mağazamız Lünen-Alstedde'de. Müşterilerimiz Lünen'in tüm semtlerinden — Brambauer, Altlünen, Gahmen, Horstmar, Wethmar, Lünen-Süd, Niederaden ve Beckinghausen — ve komşu şehirlerden geliyor:",
          links: [
            { label: 'Dortmund yakınında bisiklet', href: '/tr/fahrrad-dortmund' },
            { label: 'Selm yakınında bisiklet', href: '/tr/fahrrad-selm' },
            { label: 'Werne yakınında bisiklet', href: '/tr/fahrrad-werne' },
            { label: 'Kamen yakınında bisiklet', href: '/tr/fahrrad-kamen' },
            { label: 'Bergkamen yakınında bisiklet', href: '/tr/fahrrad-bergkamen' },
            { label: 'Rehber: ikinci el bisiklet almak', href: '/tr/ratgeber/gebrauchtes-fahrrad-kaufen-tipps' },
          ],
        },
      ],
      faqHeading: 'İkinci el bisiklet hakkında sık sorulan sorular',
      faq: [
        { q: "Lünen'de ikinci el bisikleti nereden alabilirim?", a: "Karaarslan Bike, Alstedder Straße 5, 44534 Lünen. Her zaman 100'ün üzerinde kontrol edilmiş ikinci el bisikletimiz var — randevusuz uğrayın." },
        { q: 'İkinci el bisiklet ne kadar?', a: "İkinci el bisikletler yaklaşık 80 €'dan, ikinci el e-bisikletler yaklaşık 800 €'dan başlar. Her bisikletin sabit ve adil bir fiyatı vardır." },
        { q: 'İkinci el bisiklette garanti var mı?', a: 'Evet. Zincir, vites, arka aktarıcı, dinamo, pedallar ve hidrolik frenlerde 3 ay garanti, ayrıca 3 gün iade hakkı.' },
        { q: 'Satın almadan önce deneyebilir miyim?', a: 'Evet, her bisiklet çalışma saatlerinde denenebilir — randevu gerekmez.' },
        { q: 'İkinci el bisikletleriniz nereden geliyor?', a: 'İkinci el bisikletlerimiz şahıslardan veya diğer yasal kaynaklardan gelir. Her bisiklet fatura ve satış sözleşmesiyle satılır.' },
        { q: 'İkinci el e-bisikletiniz var mı?', a: "Evet, kontrol edilmiş motor ve belgelenmiş batarya durumuyla — yaklaşık 800 €'dan başlayan fiyatlarla." },
        { q: 'İkinci el bisiklet satın alıyor musunuz?', a: "Evet. Fotoğrafları ve fiyatınızı WhatsApp'tan gönderin veya bisikleti getirin. Duruma göre takas da mümkün." },
        { q: 'Çalışma saatleriniz nedir?', a: 'Pazartesi–Perşembe 09:00–18:00, Cuma 09:00–13:00 ve 15:00–18:00, Cumartesi 09:00–18:00. Pazar ve resmi tatillerde kapalı.' },
      ],
      ctaTitle: 'Sıradaki ikinci el bisikletiniz sizi bekliyor.',
      ctaText:
        "Showroom'umuza uğrayın veya WhatsApp'tan yazın — size uygun bisikletleri memnuniyetle ayırırız.",
    },
    nl: {
      metaTitle:
        'Tweedehands fietsen kopen in Lünen | gecontroleerd, 3 maanden garantie | Karaarslan Bike',
      metaDescription:
        'Tweedehands fiets kopen in Lünen ✓ 100+ gecontroleerde fietsen vanaf ca. €80 ✓ Stads-, trekking-, mountain-, kinder- & e-bikes ✓ 3 maanden garantie ✓ Proefrit zonder afspraak.',
      breadcrumb: 'Tweedehands fietsen',
      eyebrow: 'Tweedehands fietsen in Lünen-Alstedde',
      h1: 'Tweedehands fietsen kopen in Lünen',
      h1Accent: 'gecontroleerd, met garantie.',
      sub: 'Meer dan 100 tweedehands fietsen vanaf ca. €80 — stadsfietsen, trekkingfietsen, mountainbikes, kinderfietsen en e-bikes. Technisch gecontroleerd, opgeknapt, met 3 maanden garantie en direct mee te nemen.',
      ctaPrimary: { label: 'Tweedehands fietsen in de showroom', href: '/nl/showroom' },
      usps: [
        'Technisch gecontroleerd & opgeknapt',
        '3 maanden garantie',
        '3 dagen retourrecht',
        'Proefrit zonder afspraak',
        'Factuur & koopovereenkomst',
        'Inruil mogelijk',
      ],
      sections: [
        {
          kind: 'listings',
          heading: 'Nu in de showroom: tweedehands fietsen',
          intro:
            'Onze voorraad verandert bijna dagelijks. Hier ziet u een selectie van de tweedehands fietsen die nu bij ons aan de Alstedder Straße 5 staan.',
          moreLabel: 'Alle tweedehands fietsen bekijken',
        },
        {
          kind: 'compare',
          heading: 'Tweedehands kopen bij de vakhandel in plaats van particulier',
          intro:
            'Een fiets via Marktplaats of Kleinanzeigen is vaak een gok. Bij ons koopt u tweedehands — maar met de zekerheid van een vakwinkel.',
          cols: ['Particulier', 'Karaarslan Bike'],
          rows: [
            { label: 'Technische controle', a: 'Meestal niet', b: 'Remmen, versnellingen, banden, ketting, licht' },
            { label: 'Garantie', a: 'Geen', b: '3 maanden op tweedehands' },
            { label: 'Retour', a: 'Niet mogelijk', b: '3 dagen retourrecht' },
            { label: 'Aankoopbewijs', a: 'Vaak niets', b: 'Factuur & koopovereenkomst' },
            { label: 'Proefrit', a: 'Na afspraak', b: 'Altijd tijdens openingstijden' },
            { label: 'Advies over framemaat', a: 'Zelden', b: 'Persoonlijk in de winkel' },
          ],
        },
        {
          kind: 'list',
          heading: 'Zo controleren we elke tweedehands fiets',
          intro:
            'Voordat een tweedehands fiets in onze showroom komt, gaat hij door onze werkplaats. We controleren en stellen onder meer af:',
          items: [
            'Remmen: blokken, kabels of hydrauliek en remkracht',
            'Versnellingen en derailleur: soepel schakelen in alle versnellingen',
            'Banden, binnenbanden en ketting op slijtage',
            'Verlichting, reflectoren en bel (verkeersveilig volgens de Duitse StVZO)',
            'Lagers, stuur, zadelpen en alle veiligheidsrelevante bouten',
            'Grondige reiniging — de fiets is direct rijklaar',
          ],
        },
        {
          kind: 'cards',
          heading: 'Tweedehands fietsen voor elk doel',
          intro:
            'Woon-werkverkeer, een rondje langs de Lippe of naar school — wij hebben de juiste tweedehands fiets.',
          cards: [
            { image: '/assets/stock/city.webp', title: 'Tweedehands stads- & omafietsen', text: 'Comfortabel, robuust en praktisch — ideaal voor boodschappen en korte ritten.' },
            { image: '/assets/stock/lake.webp', title: 'Tweedehands trekkingfietsen', text: 'Voor forenzen en tochten over de Römer-Lippe-Route: bagagedrager, licht en veel versnellingen.' },
            { image: '/assets/stock/mtb.webp', title: 'Tweedehands mountainbikes', text: 'Verende voorvork, grip-banden en stevige frames — voor bos en onverharde paden.' },
            { image: '/assets/stock/kids-hero.webp', title: 'Tweedehands kinderfietsen', text: 'Van 12 tot 26 inch. Kinderen groeien snel — tweedehands bespaart hier het meest.', href: '/en/guide/childrens-bike-size-guide', linkLabel: 'Welke maat past? (EN)' },
            { image: '/assets/stock/ebike-white.webp', title: 'Tweedehands e-bikes', text: 'Vanaf ca. €800 — met gecontroleerde aandrijving en gedocumenteerde accustaat.', href: '/en/guide/buying-used-e-bike-guide', linkLabel: 'Gids tweedehands e-bike (EN)' },
            { image: '/assets/stock/happy.webp', title: 'Dames- & herenfietsen', text: 'Lage instap of sportief diamantframe — in veel framematen op voorraad.', href: '/en/guide/bike-frame-size-calculator-guide', linkLabel: 'Framemaat berekenen (EN)' },
          ],
        },
        {
          kind: 'text',
          heading: 'Wat kost een tweedehands fiets in Lünen?',
          paragraphs: [
            'Tweedehands fietsen vanaf ca. €80, tweedehands e-bikes vanaf ca. €800. De prijs hangt af van merk, leeftijd, uitrusting en staat — elke fiets heeft een vaste, eerlijk berekende prijs. Geen onderhandelen, geen kleine lettertjes.',
            'U kunt contant betalen, met pinpas, per overschrijving of met PayPal. Bij elke tweedehands fiets krijgt u een factuur en een koopovereenkomst.',
          ],
        },
        {
          kind: 'text',
          heading: 'Uw oude fiets verkopen of inruilen',
          paragraphs: [
            "Wilt u van uw oude fiets af? We kopen tweedehands fietsen in goede staat in tegen eerlijke prijzen. Stuur ons foto's en uw vraagprijs via WhatsApp naar +49 163 7390 301, of kom gewoon langs.",
            'Bij aankoop van een andere fiets is inruil in individuele gevallen mogelijk — vraag het ons.',
          ],
        },
        {
          kind: 'links',
          heading: 'Tweedehands fietsen voor Lünen en omgeving',
          intro:
            'Onze winkel ligt in Lünen-Alstedde, op ruim een uur rijden van de Nederlandse grens. Klanten komen uit alle wijken van Lünen en uit de buursteden:',
          links: [
            { label: 'Fiets kopen bij Dortmund', href: '/en/fahrrad-dortmund' },
            { label: 'Fiets kopen bij Selm', href: '/en/fahrrad-selm' },
            { label: 'Fiets kopen bij Werne', href: '/en/fahrrad-werne' },
            { label: 'Fiets kopen bij Kamen', href: '/en/fahrrad-kamen' },
            { label: 'Fiets kopen bij Bergkamen', href: '/en/fahrrad-bergkamen' },
            { label: 'Gids: tweedehands fiets kopen (EN)', href: '/en/guide/buying-used-bike-luenen-tips' },
          ],
        },
      ],
      faqHeading: 'Veelgestelde vragen over tweedehands fietsen',
      faq: [
        { q: 'Waar koop ik een tweedehands fiets in Lünen?', a: 'Bij Karaarslan Bike, Alstedder Straße 5, 44534 Lünen. We hebben altijd meer dan 100 gecontroleerde tweedehands fietsen op voorraad — kom langs zonder afspraak.' },
        { q: 'Wat kost een tweedehands fiets?', a: 'Tweedehands fietsen vanaf ca. €80, tweedehands e-bikes vanaf ca. €800. Elke fiets heeft een vaste, eerlijke prijs.' },
        { q: 'Krijg ik garantie op een tweedehands fiets?', a: 'Ja. 3 maanden garantie op ketting, versnellingen, derailleur, dynamo, pedalen en hydraulische remmen, plus 3 dagen retourrecht.' },
        { q: 'Kan ik eerst een proefrit maken?', a: 'Ja, elke fiets kan tijdens de openingstijden worden getest — een afspraak is niet nodig.' },
        { q: 'Waar komen uw tweedehands fietsen vandaan?', a: 'Onze tweedehands fietsen komen van particulieren of uit andere legale bronnen. Bij elke fiets krijgt u een factuur en een koopovereenkomst.' },
        { q: 'Heeft u tweedehands e-bikes?', a: 'Ja, met gecontroleerde aandrijving en gedocumenteerde accustaat — vanaf ca. €800.' },
        { q: 'Koopt u tweedehands fietsen in?', a: "Ja. Stuur ons foto's en uw vraagprijs via WhatsApp of breng de fiets langs. Inruil is in individuele gevallen mogelijk." },
        { q: 'Wat zijn uw openingstijden?', a: 'Maandag t/m donderdag 09:00–18:00, vrijdag 09:00–13:00 en 15:00–18:00, zaterdag 09:00–18:00. Zon- en feestdagen gesloten.' },
      ],
      ctaTitle: 'Uw volgende tweedehands fiets staat al klaar.',
      ctaText:
        'Kom langs in de showroom of stuur ons een WhatsApp — we zetten graag passende fietsen voor u klaar.',
    },
  },
};

// ───────────────────────── Weihnachten & Neujahr ─────────────────────────

const XMAS: LandingPage = {
  slug: 'weihnachtsgeschenk-fahrrad',
  heroImage: '/assets/stock/xmas-hero.webp',
  ctaImage: '/assets/stock/xmas-winter.webp',
  content: {
    de: {
      metaTitle:
        'Fahrrad als Weihnachtsgeschenk in Lünen | Geschenkideen 2026 | Karaarslan Bike',
      metaDescription:
        'Fahrrad zu Weihnachten schenken ✓ Kinderfahrrad, E-Bike, Citybike & Zubehör als Geschenk ✓ Neu & gebraucht ab ca. 80 € ✓ Persönliche Beratung in Lünen ✓ Tipps zur Größe.',
      breadcrumb: 'Weihnachtsgeschenk Fahrrad',
      eyebrow: 'Weihnachten & Neujahr 2026 in Lünen',
      h1: 'Ein Fahrrad zu Weihnachten',
      h1Accent: 'Geschenkideen aus Lünen.',
      sub: 'Kaum ein Geschenk sorgt für so viel Freude unterm Weihnachtsbaum: Kinderfahrrad, E-Bike für die Eltern, Citybike für den Partner — oder Helm, Schloss und Licht als kleines Extra. Neu und gebraucht, persönlich beraten.',
      ctaPrimary: { label: 'Geschenk im Showroom finden', href: '/de/showroom' },
      usps: [
        'Neu & gebraucht ab ca. 80 €',
        'Beratung zur richtigen Größe',
        'Sofort fahrbereit',
        'Zubehör als Geschenk',
        '24 Monate Garantie bei Neurädern',
      ],
      sections: [
        {
          kind: 'cards',
          heading: 'Geschenkideen: das passende Fahrrad für jeden',
          intro:
            'Wer soll sich an Heiligabend freuen? Hier sind unsere Empfehlungen — vor Ort zeigen wir Ihnen gern passende Räder.',
          cards: [
            { image: '/assets/stock/kids-hero.webp', title: 'Für Kinder', text: 'Ein Kinderfahrrad von 12 bis 26 Zoll — das Geschenk, das Kinder nie vergessen. Gebraucht besonders günstig, weil sie schnell herauswachsen.', href: '/de/ratgeber/kinderfahrrad-groesse', linkLabel: 'Welche Größe passt?' },
            { image: '/assets/stock/mtb.webp', title: 'Für Jugendliche', text: 'Ein Mountainbike oder sportliches Trekkingrad für Schulweg, Freunde und Ausflüge an die Lippe.' },
            { image: '/assets/stock/seaside.webp', title: 'Für Partner & Partnerin', text: 'Ein bequemes Citybike oder Trekkingrad für gemeinsame Touren auf der Römer-Lippe-Route.' },
            { image: '/assets/stock/ebike-white.webp', title: 'Für Eltern & Großeltern', text: 'Ein E-Bike schenkt neue Freiheit: Gegenwind und Steigungen verlieren ihren Schrecken. Gebrauchte E-Bikes ab ca. 800 €.', href: '/de/ratgeber/e-bike-gebraucht-kaufen', linkLabel: 'Ratgeber gebrauchtes E-Bike' },
            { image: '/assets/stock/city-sun.webp', title: 'Für Pendler', text: 'Ein verlässliches Alltagsrad mit Licht und Gepäckträger — spart jeden Tag Sprit und Parkplatzsuche.', href: '/de/ratgeber/fahrrad-pendler-stadtraeder', linkLabel: 'Ratgeber Pendlerrad' },
            { image: '/assets/stock/happy.webp', title: 'Für Studierende', text: 'Ein geprüftes Gebrauchtrad ab ca. 80 € — das perfekte Geschenk mit kleinem Budget.', href: '/de/gebrauchte-fahrraeder', linkLabel: 'Gebrauchte Fahrräder' },
          ],
        },
        {
          kind: 'list',
          heading: 'Kleine Geschenke: Fahrradzubehör unterm Baum',
          intro:
            'Nicht jedes Geschenk muss ein ganzes Rad sein. Mit Zubehör machen Sie Radfahrern im Winter eine besondere Freude:',
          items: [
            'Fahrradhelm — Sicherheit, die man gern trägt',
            'Gutes Fahrradschloss — schützt das Rad in der Stadt',
            'Helle Fahrradbeleuchtung — gerade in der dunklen Jahreszeit wichtig',
            'Fahrradtaschen und Körbe für Einkauf und Arbeit',
            'Klingel, Spiegel und weiteres Zubehör für Groß und Klein',
          ],
        },
        {
          kind: 'list',
          heading: 'So gelingt die Überraschung',
          intro:
            'Ein Fahrrad muss passen — auch wenn der Beschenkte nichts ahnen darf. Unsere Tipps:',
          items: [
            'Körpergröße und Schrittlänge unauffällig herausfinden — zum Beispiel an einer Hose, die gut passt.',
            'Bei Kindern lieber mitwachsend planen: verstellbarer Sattel und Lenker verlängern die Nutzung.',
            'Bringen Sie die Maße mit — wir beraten Sie zur passenden Rahmengröße.',
            'Fragen Sie uns, ob wir Ihr Wunschrad bis zur Bescherung zurückstellen können.',
            'Rechtzeitig kommen: Die beliebtesten Größen sind vor Weihnachten schnell vergriffen.',
          ],
        },
        {
          kind: 'feature',
          heading: 'Guter Vorsatz fürs neue Jahr: mehr Rad fahren',
          paragraphs: [
            'Mehr Bewegung, weniger Auto, frische Luft — ein Fahrrad ist der einfachste gute Vorsatz für 2027. Rund um Lünen warten flache, gut ausgebaute Radwege wie die Römer-Lippe-Route, der Seseke-Weg und der Datteln-Hamm-Kanal-Radweg.',
            'Schon ein Rad? Dann starten Sie mit unserem kostenlosen Fahrrad-Check ins neue Jahr: Wir prüfen Bremsen, Schaltung, Reifen, Kette und Licht — Reparaturen nur auf Wunsch.',
          ],
          items: [
            'Kostenloser Fahrrad-Check: Bremsen, Schaltung, Reifen & Kette, Licht',
            'Faire Preise für Reparaturen auf Wunsch',
            'Gebrauchte und neue Räder für den Neustart',
          ],
          image: '/assets/stock/xmas-winter.webp',
        },
        {
          kind: 'text',
          heading: 'Öffnungszeiten rund um Weihnachten und Silvester',
          paragraphs: [
            'Wir sind montags bis donnerstags von 09:00 bis 18:00 Uhr, freitags von 09:00 bis 13:00 und 15:00 bis 18:00 Uhr und samstags von 09:00 bis 18:00 Uhr für Sie da. An Sonn- und Feiertagen — also auch am 25. und 26. Dezember und an Neujahr — bleibt der Laden geschlossen.',
            'Planen Sie Ihren Geschenkekauf deshalb rechtzeitig. Fragen vorab beantworten wir gern per WhatsApp unter +49 163 7390 301.',
          ],
        },
      ],
      faqHeading: 'Häufige Fragen zum Fahrrad als Geschenk',
      faq: [
        { q: 'Ist ein Fahrrad ein gutes Weihnachtsgeschenk?', a: 'Ja — ein Fahrrad schenkt Bewegung, Freiheit und Freude über viele Jahre. Gerade Kinderfahrräder und E-Bikes gehören zu den beliebtesten Weihnachtsgeschenken.' },
        { q: 'Welche Fahrradgröße braucht mein Kind?', a: 'Das hängt von Körpergröße und Schrittlänge ab, nicht nur vom Alter. Als grobe Orientierung: 12–16 Zoll für Kleinkinder, 20 Zoll ab etwa 6 Jahren, 24–26 Zoll für Schulkinder. Wir beraten Sie gern persönlich.' },
        { q: 'Wie finde ich die Rahmengröße heraus, ohne dass es auffällt?', a: 'Messen Sie unauffällig die Schrittlänge an einer gut sitzenden Hose oder fragen Sie nach der Körpergröße. Mit diesen Maßen finden wir gemeinsam die passende Rahmengröße.' },
        { q: 'Kann ich ein Fahrrad bis Weihnachten reservieren?', a: 'Sprechen Sie uns an — in vielen Fällen können wir Ihr Wunschrad bis zur Bescherung zurückstellen.' },
        { q: 'Gibt es auch günstige Fahrräder als Geschenk?', a: 'Ja. Geprüfte gebrauchte Fahrräder gibt es bei uns ab ca. 80 €, mit 3 Monaten Garantie. Auch Zubehör wie Helm, Schloss oder Licht eignet sich als kleines Geschenk.' },
        { q: 'Haben Sie zwischen den Jahren geöffnet?', a: 'Ja, an allen Werktagen zu unseren normalen Öffnungszeiten. Am 25. und 26. Dezember sowie an Neujahr ist geschlossen.' },
        { q: 'Welche Garantie gibt es auf ein geschenktes Fahrrad?', a: 'Neue Fahrräder haben 24 Monate Garantie, gebrauchte Fahrräder 3 Monate auf Kette, Schaltung, Schaltwerk, Dynamo, Pedale und hydraulische Bremsen.' },
      ],
      ctaTitle: 'Frohe Weihnachten & ein gutes neues Jahr!',
      ctaText:
        'Kommen Sie in unserem Laden in Lünen-Alstedde vorbei — wir helfen Ihnen, das perfekte Geschenk zu finden.',
    },
    en: {
      metaTitle:
        'A Bike as a Christmas Gift in Lünen | Gift Ideas 2026 | Karaarslan Bike',
      metaDescription:
        'Give a bike for Christmas ✓ Kids’ bikes, e-bikes, city bikes & accessories as gifts ✓ New & used from approx. €80 ✓ Personal advice in Lünen ✓ Size tips.',
      breadcrumb: 'Christmas gift bike',
      eyebrow: 'Christmas & New Year 2026 in Lünen',
      h1: 'A bike for Christmas',
      h1Accent: 'gift ideas from Lünen.',
      sub: 'Few gifts bring as much joy under the tree: a kids’ bike, an e-bike for your parents, a city bike for your partner — or a helmet, lock and lights as a small extra. New and used, with personal advice.',
      ctaPrimary: { label: 'Find a gift in the showroom', href: '/en/showroom' },
      usps: [
        'New & used from approx. €80',
        'Advice on the right size',
        'Ready to ride',
        'Accessories as gifts',
        '24-month warranty on new bikes',
      ],
      sections: [
        {
          kind: 'cards',
          heading: 'Gift ideas: the right bike for everyone',
          intro:
            'Who should be smiling on Christmas Eve? Here are our recommendations — in store we are happy to show you suitable bikes.',
          cards: [
            { image: '/assets/stock/kids-hero.webp', title: 'For kids', text: 'A kids’ bike from 12 to 26 inches — the gift children never forget. Buying used is especially good value because they outgrow bikes quickly.', href: '/en/guide/childrens-bike-size-guide', linkLabel: 'Which size fits?' },
            { image: '/assets/stock/mtb.webp', title: 'For teenagers', text: 'A mountain bike or sporty trekking bike for school, friends and trips along the Lippe.' },
            { image: '/assets/stock/seaside.webp', title: 'For your partner', text: 'A comfortable city or trekking bike for rides together on the Römer-Lippe-Route.' },
            { image: '/assets/stock/ebike-white.webp', title: 'For parents & grandparents', text: 'An e-bike gives new freedom: headwinds and hills lose their sting. Used e-bikes from approx. €800.', href: '/en/guide/buying-used-e-bike-guide', linkLabel: 'Used e-bike guide' },
            { image: '/assets/stock/city-sun.webp', title: 'For commuters', text: 'A reliable everyday bike with lights and a rack — saves fuel and parking every day.', href: '/en/guide/commuter-bike-luenen-guide', linkLabel: 'Commuter bike guide' },
            { image: '/assets/stock/happy.webp', title: 'For students', text: 'An inspected used bike from approx. €80 — the perfect gift on a small budget.', href: '/en/gebrauchte-fahrraeder', linkLabel: 'Used bikes' },
          ],
        },
        {
          kind: 'list',
          heading: 'Small gifts: bike accessories under the tree',
          intro:
            'Not every gift has to be a whole bike. Accessories make cyclists especially happy in winter:',
          items: [
            'Bike helmet — safety people actually like to wear',
            'A good bike lock — protects the bike in town',
            'Bright bike lights — especially important in the dark season',
            'Panniers and baskets for shopping and work',
            'Bell, mirror and other accessories for young and old',
          ],
        },
        {
          kind: 'list',
          heading: 'How to pull off the surprise',
          intro:
            'A bike has to fit — even if the recipient mustn’t suspect a thing. Our tips:',
          items: [
            'Find out height and inside-leg length discreetly — for example from trousers that fit well.',
            'For kids, plan for growth: adjustable saddle and handlebars extend the bike’s life.',
            'Bring the measurements — we will advise you on the right frame size.',
            'Ask whether we can set your chosen bike aside until Christmas.',
            'Come early: the most popular sizes sell out quickly before Christmas.',
          ],
        },
        {
          kind: 'feature',
          heading: 'New Year’s resolution: cycle more',
          paragraphs: [
            'More exercise, less driving, fresh air — a bike is the easiest resolution for 2027. Around Lünen you will find flat, well-built cycle paths such as the Römer-Lippe-Route, the Seseke-Weg and the Datteln-Hamm-Kanal-Radweg.',
            'Already have a bike? Start the new year with our free bike check: we inspect brakes, gears, tyres, chain and lights — repairs only on request.',
          ],
          items: [
            'Free bike check: brakes, gears, tyres & chain, lights',
            'Fair prices for repairs on request',
            'Used and new bikes for a fresh start',
          ],
          image: '/assets/stock/xmas-winter.webp',
        },
        {
          kind: 'text',
          heading: 'Opening hours around Christmas and New Year’s Eve',
          paragraphs: [
            'We are open Monday to Thursday 09:00–18:00, Friday 09:00–13:00 and 15:00–18:00, and Saturday 09:00–18:00. On Sundays and public holidays — including 25 and 26 December and New Year’s Day — the shop is closed.',
            'So plan your gift shopping in good time. We are happy to answer questions in advance via WhatsApp at +49 163 7390 301.',
          ],
        },
      ],
      faqHeading: 'FAQ: a bike as a gift',
      faq: [
        { q: 'Is a bike a good Christmas present?', a: 'Yes — a bike gives exercise, freedom and joy for many years. Kids’ bikes and e-bikes are among the most popular Christmas gifts.' },
        { q: 'What bike size does my child need?', a: 'It depends on height and inside-leg length, not just age. As a rough guide: 12–16 inches for toddlers, 20 inches from about age 6, 24–26 inches for school children. We are happy to advise you in person.' },
        { q: 'How do I find the frame size without giving it away?', a: 'Discreetly measure the inside leg on well-fitting trousers or ask about their height. With these measurements we will find the right frame size together.' },
        { q: 'Can I reserve a bike until Christmas?', a: 'Just ask us — in many cases we can set your chosen bike aside until Christmas.' },
        { q: 'Are there affordable bikes as gifts?', a: 'Yes. Inspected used bikes start at approx. €80 with a 3-month warranty. Accessories such as a helmet, lock or lights also make great small gifts.' },
        { q: 'Are you open between Christmas and New Year?', a: 'Yes, on all working days during our normal hours. Closed on 25 and 26 December and on New Year’s Day.' },
        { q: 'What warranty does a gifted bike have?', a: 'New bikes have a 24-month warranty; used bikes 3 months on chain, gears, derailleur, dynamo, pedals and hydraulic brakes.' },
      ],
      ctaTitle: 'Merry Christmas & a happy New Year!',
      ctaText:
        'Visit our shop in Lünen-Alstedde — we will help you find the perfect gift.',
    },
    fr: {
      metaTitle:
        'Un vélo en cadeau de Noël à Lünen | Idées cadeaux 2026 | Karaarslan Bike',
      metaDescription:
        'Offrir un vélo à Noël ✓ Vélo enfant, vélo électrique, vélo de ville & accessoires ✓ Neuf & occasion dès env. 80 € ✓ Conseil personnalisé à Lünen ✓ Astuces taille.',
      breadcrumb: 'Vélo cadeau de Noël',
      eyebrow: 'Noël & Nouvel An 2026 à Lünen',
      h1: 'Un vélo pour Noël',
      h1Accent: 'idées cadeaux de Lünen.',
      sub: 'Peu de cadeaux font autant plaisir sous le sapin : un vélo enfant, un vélo électrique pour les parents, un vélo de ville pour votre partenaire — ou un casque, un antivol et un éclairage en petit plus. Neuf et d’occasion, avec conseil personnalisé.',
      ctaPrimary: { label: 'Trouver un cadeau au showroom', href: '/fr/showroom' },
      usps: [
        'Neuf & occasion dès env. 80 €',
        'Conseil sur la bonne taille',
        'Prêt à rouler',
        'Accessoires à offrir',
        'Garantie 24 mois sur le neuf',
      ],
      sections: [
        {
          kind: 'cards',
          heading: 'Idées cadeaux : le bon vélo pour chacun',
          intro:
            'Qui doit sourire le soir de Noël ? Voici nos recommandations — en magasin, nous vous montrons volontiers les vélos adaptés.',
          cards: [
            { image: '/assets/stock/kids-hero.webp', title: 'Pour les enfants', text: 'Un vélo enfant de 12 à 26 pouces — le cadeau inoubliable. L’occasion est idéale, car ils grandissent vite.', href: '/fr/guide/taille-velo-enfant-guide', linkLabel: 'Quelle taille choisir ?' },
            { image: '/assets/stock/mtb.webp', title: 'Pour les ados', text: 'Un VTT ou un vélo trekking sportif pour l’école, les amis et les sorties le long de la Lippe.' },
            { image: '/assets/stock/seaside.webp', title: 'Pour votre partenaire', text: 'Un vélo de ville ou trekking confortable pour rouler ensemble sur la Römer-Lippe-Route.' },
            { image: '/assets/stock/ebike-white.webp', title: 'Pour parents & grands-parents', text: 'Un vélo électrique offre une nouvelle liberté : vent et côtes ne font plus peur. VAE d’occasion dès env. 800 €.', href: '/fr/guide/acheter-velo-electrique-occasion', linkLabel: 'Guide VAE d’occasion' },
            { image: '/assets/stock/city-sun.webp', title: 'Pour les pendulaires', text: 'Un vélo du quotidien fiable avec éclairage et porte-bagages — économie d’essence et de stationnement chaque jour.', href: '/fr/guide/velo-pendulaire-luenen-guide', linkLabel: 'Guide vélo pendulaire' },
            { image: '/assets/stock/happy.webp', title: 'Pour les étudiants', text: 'Un vélo d’occasion contrôlé dès env. 80 € — le cadeau parfait à petit budget.', href: '/fr/gebrauchte-fahrraeder', linkLabel: 'Vélos d’occasion' },
          ],
        },
        {
          kind: 'list',
          heading: 'Petits cadeaux : des accessoires sous le sapin',
          intro:
            'Un cadeau n’est pas forcément un vélo entier. Les accessoires font particulièrement plaisir en hiver :',
          items: [
            'Casque de vélo — la sécurité qu’on aime porter',
            'Un bon antivol — protège le vélo en ville',
            'Un éclairage puissant — essentiel pendant la saison sombre',
            'Sacoches et paniers pour les courses et le travail',
            'Sonnette, rétroviseur et autres accessoires pour petits et grands',
          ],
        },
        {
          kind: 'list',
          heading: 'Réussir la surprise',
          intro:
            'Un vélo doit être à la bonne taille — même si la personne ne doit rien soupçonner. Nos conseils :',
          items: [
            'Repérez discrètement la taille et l’entrejambe — par exemple sur un pantalon bien ajusté.',
            'Pour les enfants, pensez à la croissance : selle et guidon réglables prolongent l’usage.',
            'Apportez les mesures — nous vous conseillons sur la taille de cadre.',
            'Demandez-nous si nous pouvons mettre votre vélo de côté jusqu’à Noël.',
            'Venez tôt : les tailles les plus demandées partent vite avant Noël.',
          ],
        },
        {
          kind: 'feature',
          heading: 'Bonne résolution : rouler plus en 2027',
          paragraphs: [
            'Plus de mouvement, moins de voiture, de l’air frais — le vélo est la résolution la plus simple pour 2027. Autour de Lünen, de belles pistes plates vous attendent, comme la Römer-Lippe-Route, le Seseke-Weg et la piste du canal Datteln-Hamm.',
            'Vous avez déjà un vélo ? Commencez l’année avec notre contrôle gratuit : freins, vitesses, pneus, chaîne et éclairage — réparations uniquement sur demande.',
          ],
          items: [
            'Contrôle gratuit : freins, vitesses, pneus & chaîne, éclairage',
            'Prix justes pour les réparations sur demande',
            'Vélos neufs et d’occasion pour bien démarrer',
          ],
          image: '/assets/stock/xmas-winter.webp',
        },
        {
          kind: 'text',
          heading: 'Horaires autour de Noël et du Nouvel An',
          paragraphs: [
            'Nous sommes ouverts du lundi au jeudi de 09:00 à 18:00, le vendredi de 09:00 à 13:00 et de 15:00 à 18:00, et le samedi de 09:00 à 18:00. Les dimanches et jours fériés — y compris les 25 et 26 décembre et le 1er janvier — le magasin est fermé.',
            'Prévoyez donc vos achats à temps. Nous répondons volontiers à vos questions sur WhatsApp au +49 163 7390 301.',
          ],
        },
      ],
      faqHeading: 'Questions fréquentes : un vélo en cadeau',
      faq: [
        { q: 'Un vélo est-il un bon cadeau de Noël ?', a: 'Oui — un vélo offre du mouvement, de la liberté et de la joie pendant des années. Les vélos enfant et les VAE comptent parmi les cadeaux les plus appréciés.' },
        { q: 'Quelle taille de vélo pour mon enfant ?', a: 'Cela dépend de la taille et de l’entrejambe, pas seulement de l’âge. À titre indicatif : 12–16 pouces pour les petits, 20 pouces dès 6 ans environ, 24–26 pouces pour les écoliers. Nous vous conseillons volontiers.' },
        { q: 'Comment trouver la taille de cadre sans éveiller les soupçons ?', a: 'Mesurez discrètement l’entrejambe d’un pantalon bien ajusté ou demandez la taille. Avec ces mesures, nous trouvons ensemble la bonne taille de cadre.' },
        { q: 'Puis-je réserver un vélo jusqu’à Noël ?', a: 'Parlez-nous-en — dans de nombreux cas, nous pouvons mettre votre vélo de côté jusqu’à Noël.' },
        { q: 'Y a-t-il des vélos abordables à offrir ?', a: 'Oui. Vélos d’occasion contrôlés dès env. 80 €, avec 3 mois de garantie. Casque, antivol ou éclairage font aussi de jolis petits cadeaux.' },
        { q: 'Êtes-vous ouverts entre Noël et le Nouvel An ?', a: 'Oui, tous les jours ouvrables aux horaires habituels. Fermé les 25 et 26 décembre et le 1er janvier.' },
        { q: 'Quelle garantie pour un vélo offert ?', a: 'Les vélos neufs ont 24 mois de garantie ; les vélos d’occasion 3 mois sur la chaîne, les vitesses, le dérailleur, la dynamo, les pédales et les freins hydrauliques.' },
      ],
      ctaTitle: 'Joyeux Noël & bonne année !',
      ctaText:
        'Passez dans notre magasin à Lünen-Alstedde — nous vous aidons à trouver le cadeau parfait.',
    },
    tr: {
      metaTitle:
        "Lünen'de Yılbaşı Hediyesi Bisiklet | 2026 Hediye Fikirleri | Karaarslan Bike",
      metaDescription:
        "Yılbaşı ve Noel'de bisiklet hediye edin ✓ Çocuk bisikleti, e-bisiklet, şehir bisikleti & aksesuar ✓ Yeni & ikinci el, yaklaşık 80 €'dan ✓ Lünen'de kişisel danışmanlık.",
      breadcrumb: 'Yılbaşı hediyesi bisiklet',
      eyebrow: "Lünen'de Noel & Yılbaşı 2026",
      h1: 'Yılbaşında bisiklet hediye edin',
      h1Accent: "Lünen'den hediye fikirleri.",
      sub: 'Az hediye bu kadar sevindirir: bir çocuk bisikleti, anne-babaya e-bisiklet, eşinize şehir bisikleti — ya da küçük bir sürpriz olarak kask, kilit ve ışık. Yeni ve ikinci el, kişisel danışmanlıkla.',
      ctaPrimary: { label: "Showroom'da hediye bul", href: '/tr/showroom' },
      usps: [
        "Yeni & ikinci el, yaklaşık 80 €'dan",
        'Doğru boy için danışmanlık',
        'Hemen sürüşe hazır',
        'Hediye olarak aksesuar',
        'Yeni bisikletlerde 24 ay garanti',
      ],
      sections: [
        {
          kind: 'cards',
          heading: 'Hediye fikirleri: herkese uygun bisiklet',
          intro:
            'Kimi sevindirmek istiyorsunuz? İşte önerilerimiz — mağazada uygun bisikletleri memnuniyetle gösteririz.',
          cards: [
            { image: '/assets/stock/kids-hero.webp', title: 'Çocuklar için', text: '12 ile 26 inç arası bir çocuk bisikleti — çocukların asla unutmadığı hediye. Hızlı büyüdükleri için ikinci el özellikle avantajlı.', href: '/tr/ratgeber/kinderfahrrad-groesse', linkLabel: 'Hangi boy uygun?' },
            { image: '/assets/stock/mtb.webp', title: 'Gençler için', text: 'Okul, arkadaşlar ve Lippe kenarındaki gezintiler için dağ bisikleti ya da sportif trekking bisikleti.' },
            { image: '/assets/stock/seaside.webp', title: 'Eşiniz için', text: 'Römer-Lippe-Route üzerinde birlikte turlar için rahat bir şehir ya da trekking bisikleti.' },
            { image: '/assets/stock/ebike-white.webp', title: 'Anne-baba & büyükler için', text: "E-bisiklet yeni bir özgürlük sunar: rüzgar ve yokuşlar artık sorun değil. İkinci el e-bisikletler yaklaşık 800 €'dan.", href: '/tr/ratgeber/e-bike-gebraucht-kaufen', linkLabel: 'İkinci el e-bisiklet rehberi' },
            { image: '/assets/stock/city-sun.webp', title: 'İşe bisikletle gidenler için', text: 'Işıklı ve bagajlı güvenilir bir günlük bisiklet — her gün yakıttan ve park derdinden tasarruf.', href: '/tr/ratgeber/fahrrad-pendler-stadtraeder', linkLabel: 'İşe gidiş bisikleti rehberi' },
            { image: '/assets/stock/happy.webp', title: 'Öğrenciler için', text: "Yaklaşık 80 €'dan başlayan kontrol edilmiş ikinci el bisiklet — küçük bütçeye mükemmel hediye.", href: '/tr/gebrauchte-fahrraeder', linkLabel: 'İkinci el bisikletler' },
          ],
        },
        {
          kind: 'list',
          heading: 'Küçük hediyeler: bisiklet aksesuarları',
          intro:
            'Her hediyenin bütün bir bisiklet olması gerekmez. Aksesuarlar kışın bisikletçileri özellikle sevindirir:',
          items: [
            'Bisiklet kaskı — severek takılan güvenlik',
            'İyi bir bisiklet kilidi — şehirde bisikleti korur',
            'Güçlü bisiklet ışıkları — karanlık mevsimde çok önemli',
            'Alışveriş ve iş için bisiklet çantaları ve sepetler',
            'Büyük küçük herkes için zil, ayna ve diğer aksesuarlar',
          ],
        },
        {
          kind: 'list',
          heading: 'Sürprizi bozmadan doğru boyu bulun',
          intro:
            'Bisiklet uymalı — hediye edilen kişi hiçbir şey anlamasa bile. İpuçlarımız:',
          items: [
            'Boyu ve iç bacak uzunluğunu fark ettirmeden öğrenin — örneğin iyi oturan bir pantolondan.',
            'Çocuklarda büyümeyi düşünün: ayarlanabilir sele ve gidon kullanım süresini uzatır.',
            'Ölçüleri getirin — doğru kadro boyu konusunda size danışmanlık yapalım.',
            'Seçtiğiniz bisikleti yılbaşına kadar ayırıp ayıramayacağımızı sorun.',
            'Erken gelin: en çok aranan boylar yılbaşı öncesi hızla tükenir.',
          ],
        },
        {
          kind: 'feature',
          heading: 'Yeni yıl kararı: daha çok bisiklet',
          paragraphs: [
            "Daha çok hareket, daha az araba, temiz hava — bisiklet 2027 için en kolay yeni yıl kararı. Lünen çevresinde Römer-Lippe-Route, Seseke-Weg ve Datteln-Hamm-Kanal bisiklet yolu gibi düz ve bakımlı yollar sizi bekliyor.",
            'Zaten bisikletiniz mi var? Yeni yıla ücretsiz bisiklet kontrolümüzle başlayın: fren, vites, lastik, zincir ve ışık — tamir sadece isteğe bağlı.',
          ],
          items: [
            'Ücretsiz kontrol: fren, vites, lastik & zincir, ışık',
            'İsteğe bağlı tamirlerde adil fiyatlar',
            'Yeni başlangıç için ikinci el ve yeni bisikletler',
          ],
          image: '/assets/stock/xmas-winter.webp',
        },
        {
          kind: 'text',
          heading: 'Noel ve yılbaşı döneminde çalışma saatleri',
          paragraphs: [
            'Pazartesi–Perşembe 09:00–18:00, Cuma 09:00–13:00 ve 15:00–18:00, Cumartesi 09:00–18:00 açığız. Pazar ve resmi tatillerde — 25 ve 26 Aralık ile 1 Ocak dahil — mağaza kapalıdır.',
            "Hediye alışverişinizi bu yüzden zamanında planlayın. Sorularınızı WhatsApp'tan +49 163 7390 301 numarasında memnuniyetle yanıtlarız.",
          ],
        },
      ],
      faqHeading: 'Hediye bisiklet hakkında sık sorulan sorular',
      faq: [
        { q: 'Bisiklet iyi bir yılbaşı hediyesi mi?', a: 'Evet — bisiklet yıllarca hareket, özgürlük ve mutluluk getirir. Çocuk bisikletleri ve e-bisikletler en sevilen hediyeler arasındadır.' },
        { q: 'Çocuğum için hangi boy bisiklet gerekir?', a: 'Sadece yaşa değil, boya ve iç bacak uzunluğuna bağlıdır. Kabaca: küçükler için 12–16 inç, yaklaşık 6 yaştan itibaren 20 inç, okul çağı için 24–26 inç. Size yüz yüze danışmanlık yaparız.' },
        { q: 'Kadro boyunu belli etmeden nasıl öğrenirim?', a: 'İyi oturan bir pantolonun iç bacak boyunu ölçün veya boyunu sorun. Bu ölçülerle doğru kadro boyunu birlikte buluruz.' },
        { q: 'Bisikleti yılbaşına kadar ayırtabilir miyim?', a: 'Bize sorun — çoğu durumda seçtiğiniz bisikleti yılbaşına kadar ayırabiliriz.' },
        { q: 'Hediye olarak uygun fiyatlı bisiklet var mı?', a: "Evet. Kontrol edilmiş ikinci el bisikletler yaklaşık 80 €'dan başlar ve 3 ay garantilidir. Kask, kilit veya ışık da güzel küçük hediyelerdir." },
        { q: 'Noel ile yılbaşı arasında açık mısınız?', a: 'Evet, tüm iş günlerinde normal saatlerimizle. 25 ve 26 Aralık ile 1 Ocak kapalıyız.' },
        { q: 'Hediye bisikletin garantisi nedir?', a: 'Yeni bisikletlerde 24 ay; ikinci el bisikletlerde zincir, vites, arka aktarıcı, dinamo, pedallar ve hidrolik frenlerde 3 ay garanti.' },
      ],
      ctaTitle: 'Mutlu Noeller & iyi yıllar!',
      ctaText:
        "Lünen-Alstedde'deki mağazamıza uğrayın — mükemmel hediyeyi bulmanıza yardım edelim.",
    },
    nl: {
      metaTitle:
        'Fiets als kerstcadeau in Lünen | Cadeau-ideeën 2026 | Karaarslan Bike',
      metaDescription:
        'Een fiets cadeau doen met Kerst ✓ Kinderfiets, e-bike, stadsfiets & accessoires ✓ Nieuw & tweedehands vanaf ca. €80 ✓ Persoonlijk advies in Lünen ✓ Tips voor de juiste maat.',
      breadcrumb: 'Fiets als kerstcadeau',
      eyebrow: 'Kerst & Oud en Nieuw 2026 in Lünen',
      h1: 'Een fiets voor Kerst',
      h1Accent: 'cadeau-ideeën uit Lünen.',
      sub: 'Weinig cadeaus geven zoveel plezier onder de kerstboom: een kinderfiets, een e-bike voor uw ouders, een stadsfiets voor uw partner — of een helm, slot en verlichting als klein extraatje. Nieuw en tweedehands, met persoonlijk advies.',
      ctaPrimary: { label: 'Cadeau vinden in de showroom', href: '/nl/showroom' },
      usps: [
        'Nieuw & tweedehands vanaf ca. €80',
        'Advies over de juiste maat',
        'Direct rijklaar',
        'Accessoires als cadeau',
        '24 maanden garantie op nieuw',
      ],
      sections: [
        {
          kind: 'cards',
          heading: 'Cadeau-ideeën: de juiste fiets voor iedereen',
          intro:
            'Wie wilt u op kerstavond blij maken? Dit zijn onze tips — in de winkel laten we u graag passende fietsen zien.',
          cards: [
            { image: '/assets/stock/kids-hero.webp', title: 'Voor kinderen', text: 'Een kinderfiets van 12 tot 26 inch — het cadeau dat kinderen nooit vergeten. Tweedehands extra voordelig, want ze groeien er snel uit.', href: '/en/guide/childrens-bike-size-guide', linkLabel: 'Welke maat past? (EN)' },
            { image: '/assets/stock/mtb.webp', title: 'Voor tieners', text: 'Een mountainbike of sportieve trekkingfiets voor school, vrienden en tochtjes langs de Lippe.' },
            { image: '/assets/stock/seaside.webp', title: 'Voor uw partner', text: 'Een comfortabele stads- of trekkingfiets voor samen fietsen op de Römer-Lippe-Route.' },
            { image: '/assets/stock/ebike-white.webp', title: 'Voor (groot)ouders', text: 'Een e-bike geeft nieuwe vrijheid: tegenwind en heuvels zijn geen probleem meer. Tweedehands e-bikes vanaf ca. €800.', href: '/en/guide/buying-used-e-bike-guide', linkLabel: 'Gids tweedehands e-bike (EN)' },
            { image: '/assets/stock/city-sun.webp', title: 'Voor forenzen', text: 'Een betrouwbare dagelijkse fiets met licht en bagagedrager — bespaart elke dag brandstof en parkeerstress.', href: '/en/guide/commuter-bike-luenen-guide', linkLabel: 'Gids forensenfiets (EN)' },
            { image: '/assets/stock/happy.webp', title: 'Voor studenten', text: 'Een gecontroleerde tweedehands fiets vanaf ca. €80 — het perfecte cadeau met een klein budget.', href: '/nl/gebrauchte-fahrraeder', linkLabel: 'Tweedehands fietsen' },
          ],
        },
        {
          kind: 'list',
          heading: 'Kleine cadeaus: fietsaccessoires onder de boom',
          intro:
            'Niet elk cadeau hoeft een hele fiets te zijn. Met accessoires maakt u fietsers in de winter extra blij:',
          items: [
            'Fietshelm — veiligheid die je graag draagt',
            'Een goed fietsslot — beschermt de fiets in de stad',
            'Felle fietsverlichting — juist in het donkere seizoen belangrijk',
            'Fietstassen en manden voor boodschappen en werk',
            'Bel, spiegel en andere accessoires voor groot en klein',
          ],
        },
        {
          kind: 'list',
          heading: 'Zo lukt de verrassing',
          intro:
            'Een fiets moet passen — ook als de ontvanger niets mag vermoeden. Onze tips:',
          items: [
            'Achterhaal ongemerkt lengte en binnenbeenlengte — bijvoorbeeld aan een goed passende broek.',
            'Houd bij kinderen rekening met groei: verstelbaar zadel en stuur verlengen het gebruik.',
            'Neem de maten mee — wij adviseren u over de juiste framemaat.',
            'Vraag ons of we uw favoriete fiets tot Kerst kunnen reserveren.',
            'Kom op tijd: de populairste maten zijn voor Kerst snel uitverkocht.',
          ],
        },
        {
          kind: 'feature',
          heading: 'Goed voornemen: meer fietsen in 2027',
          paragraphs: [
            'Meer beweging, minder auto, frisse lucht — een fiets is het makkelijkste goede voornemen voor 2027. Rond Lünen liggen vlakke, goed aangelegde fietsroutes zoals de Römer-Lippe-Route, de Seseke-Weg en het fietspad langs het Datteln-Hamm-kanaal.',
            'Al een fiets? Begin het nieuwe jaar met onze gratis fietscheck: remmen, versnellingen, banden, ketting en verlichting — reparaties alleen op verzoek.',
          ],
          items: [
            'Gratis fietscheck: remmen, versnellingen, banden & ketting, licht',
            'Eerlijke prijzen voor reparaties op verzoek',
            'Tweedehands en nieuwe fietsen voor een frisse start',
          ],
          image: '/assets/stock/xmas-winter.webp',
        },
        {
          kind: 'text',
          heading: 'Openingstijden rond Kerst en Oud en Nieuw',
          paragraphs: [
            'We zijn open van maandag t/m donderdag 09:00–18:00, vrijdag 09:00–13:00 en 15:00–18:00 en zaterdag 09:00–18:00. Op zon- en feestdagen — ook op 25 en 26 december en Nieuwjaarsdag — is de winkel gesloten.',
            'Plan uw cadeau-aankoop dus op tijd. Vragen beantwoorden we vooraf graag via WhatsApp op +49 163 7390 301.',
          ],
        },
      ],
      faqHeading: 'Veelgestelde vragen: een fiets als cadeau',
      faq: [
        { q: 'Is een fiets een goed kerstcadeau?', a: 'Ja — een fiets geeft jarenlang beweging, vrijheid en plezier. Kinderfietsen en e-bikes behoren tot de populairste kerstcadeaus.' },
        { q: 'Welke fietsmaat heeft mijn kind nodig?', a: 'Dat hangt af van lengte en binnenbeenlengte, niet alleen van leeftijd. Als richtlijn: 12–16 inch voor peuters, 20 inch vanaf ongeveer 6 jaar, 24–26 inch voor schoolkinderen. We adviseren u graag persoonlijk.' },
        { q: 'Hoe vind ik de framemaat zonder dat het opvalt?', a: 'Meet ongemerkt de binnenbeenlengte aan een goed passende broek of vraag naar de lengte. Met die maten vinden we samen de juiste framemaat.' },
        { q: 'Kan ik een fiets tot Kerst reserveren?', a: 'Vraag het ons — in veel gevallen kunnen we uw favoriete fiets tot Kerst apart zetten.' },
        { q: 'Zijn er ook betaalbare fietsen als cadeau?', a: 'Ja. Gecontroleerde tweedehands fietsen vanaf ca. €80, met 3 maanden garantie. Ook een helm, slot of verlichting is een mooi klein cadeau.' },
        { q: 'Bent u open tussen Kerst en Oud en Nieuw?', a: 'Ja, op alle werkdagen tijdens onze normale openingstijden. Gesloten op 25 en 26 december en op Nieuwjaarsdag.' },
        { q: 'Welke garantie heeft een cadeaufiets?', a: 'Nieuwe fietsen hebben 24 maanden garantie; tweedehands fietsen 3 maanden op ketting, versnellingen, derailleur, dynamo, pedalen en hydraulische remmen.' },
      ],
      ctaTitle: 'Fijne feestdagen & een gelukkig nieuwjaar!',
      ctaText:
        'Kom langs in onze winkel in Lünen-Alstedde — we helpen u het perfecte cadeau te vinden.',
    },
  },
};

export const LANDING_PAGES: Record<LandingKey, LandingPage> = {
  used: USED,
  xmas: XMAS,
  size: SIZE_GUIDE,
  kids: KIDS_GUIDE,
};
