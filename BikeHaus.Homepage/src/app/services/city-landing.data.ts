import { Language } from './translation.service';

export interface CityLandingTranslation {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSub: string;
  introHeading: string;
  introText: string;
  whyHeading: string;
  whyItems: string[];
  offerHeading: string;
  offerItems: string[];
  ctaHeading: string;
  ctaText: string;
  directions: string;
}

export interface CityLanding {
  slug: string;
  cityName: string;
  distanceKm: number;
  driveMinutes: number;
  translations: Record<Language, CityLandingTranslation>;
}

export const CITY_LANDINGS: CityLanding[] = [
  {
    slug: 'fahrrad-dortmund',
    cityName: 'Dortmund',
    distanceKm: 15,
    driveMinutes: 20,
    translations: {
      de: {
        metaTitle: 'Fahrrad Dortmund — Fahrräder kaufen bei Karaarslan Bike',
        metaDescription:
          'Fahrrad kaufen in Dortmund? Karaarslan Bike ist nur 15 km entfernt. Über 100 neue & gebrauchte Fahrräder, E-Bikes mit Garantie. Probefahrt ohne Termin.',
        heroTitle: 'Fahrrad kaufen in Dortmund?',
        heroSub:
          'Karaarslan Bike — Ihr Fahrradladen nur 15 km von Dortmund entfernt.',
        introHeading: 'Fahrräder für Dortmund bei Karaarslan Bike',
        introText:
          'Sie suchen ein Fahrrad in Dortmund? Karaarslan Bike in der Alstedder Straße 5, Lünen, ist nur 20 Minuten mit dem Auto entfernt. Bei uns finden Sie über 100 neue und gebrauchte Fahrräder — Citybikes, Trekkingräder, Mountainbikes, E-Bikes und Kinderfahrräder. Jedes Gebrauchtrad ist technisch geprüft und wird mit 3 Monaten Garantie verkauft.',
        whyHeading: 'Warum Karaarslan Bike für Dortmunder?',
        whyItems: [
          'Nur 15 km / 20 Minuten über die B236/B54',
          'Über 100 Fahrräder vorrätig — keine Wartezeit, keine Bestellung',
          'Geprüfte Gebrauchträder mit 3 Monaten Garantie',
          'Neue Fahrräder mit 24 Monaten Garantie',
          'Probefahrt vor Ort — ohne Termin',
          'Faire Preise — deutlich günstiger als viele Dortmunder Händler',
          'Beratung auf Deutsch, Englisch, Französisch und Türkisch',
        ],
        offerHeading: 'Unser Angebot',
        offerItems: [
          'Citybikes ab ca. 80 € (gebraucht) / ab 350 € (neu)',
          'Trekkingräder für Pendler und Freizeit',
          'E-Bikes ab ca. 800 € (gebraucht) — Akku-Zustand dokumentiert',
          'City- und Trekkingräder ideal fürs flache Ruhrgebiet',
          'Kinderfahrräder in allen Größen',
          'Fahrradzubehör: Schlösser, Helme, Beleuchtung, Körbe',
        ],
        ctaHeading: 'Jetzt vorbeikommen!',
        ctaText:
          'Besuchen Sie uns in der Alstedder Straße 5, 44534 Lünen. Geöffnet Mo–Do 09–18 Uhr, Fr 09–13 + 15–18 Uhr, Sa 09–18 Uhr. Oder schreiben Sie uns auf WhatsApp: +49 163 7390 301.',
        directions:
          'Von Dortmund über die B236/B54 Richtung Lünen, Stadtteil Alstedde. Kostenlose Parkplätze vor dem Geschäft.',
      },
      en: {
        metaTitle: 'Bicycle Dortmund — Buy bikes at Karaarslan Bike',
        metaDescription:
          'Buy a bike in Dortmund? Karaarslan Bike is only 15 km away. Over 100 new & used bicycles, e-bikes with warranty. Test ride without appointment.',
        heroTitle: 'Buy a bicycle in Dortmund?',
        heroSub:
          'Karaarslan Bike — your bike shop only 15 km from Dortmund.',
        introHeading: 'Bicycles for Dortmund at Karaarslan Bike',
        introText:
          "Looking for a bike in Dortmund? Karaarslan Bike at Alstedder Straße 5, Lünen, is only a 20-minute drive away. We have over 100 new and used bicycles — city bikes, trekking bikes, mountain bikes, e-bikes and children's bikes. Every used bike is technically inspected and comes with a 3-month warranty.",
        whyHeading: 'Why Karaarslan Bike for Dortmund residents?',
        whyItems: [
          'Only 15 km / 20 minutes via the B236/B54',
          'Over 100 bikes in stock — no waiting, no ordering',
          'Inspected used bikes with 3-month warranty',
          'New bicycles with 24-month warranty',
          'Test ride on site — no appointment needed',
          'Fair prices — significantly cheaper than many Dortmund dealers',
          'Advice in German, English, French and Turkish',
        ],
        offerHeading: 'Our Range',
        offerItems: [
          'City bikes from approx. €80 (used) / from €350 (new)',
          'Trekking bikes for commuters and leisure',
          'E-bikes from approx. €800 (used) — battery condition documented',
          'City and trekking bikes ideal for the flat Ruhrgebiet',
          "Children's bikes in all sizes",
          'Bike accessories: locks, helmets, lights, baskets',
        ],
        ctaHeading: 'Visit us now!',
        ctaText:
          'Visit us at Alstedder Straße 5, 44534 Lünen. Open Mon–Thu 09–18, Fri 09–13 + 15–18, Sat 09–18. Or message us on WhatsApp: +49 163 7390 301.',
        directions:
          'From Dortmund via the B236/B54 towards Lünen, Alstedde district. Free parking in front of the shop.',
      },
      fr: {
        metaTitle: 'Vélo Dortmund — Acheter des vélos chez Karaarslan Bike',
        metaDescription:
          "Acheter un vélo à Dortmund? Karaarslan Bike n'est qu'à 15 km. Plus de 100 vélos neufs et d'occasion, vélos électriques avec garantie.",
        heroTitle: 'Acheter un vélo à Dortmund?',
        heroSub:
          "Karaarslan Bike — votre magasin de vélos à seulement 15 km de Dortmund.",
        introHeading: 'Vélos pour Dortmund chez Karaarslan Bike',
        introText:
          "Vous cherchez un vélo à Dortmund? Karaarslan Bike, Alstedder Straße 5, Lünen, n'est qu'à 20 minutes en voiture. Nous proposons plus de 100 vélos neufs et d'occasion — vélos de ville, VTC, VTT, vélos électriques et vélos pour enfants. Chaque vélo d'occasion est contrôlé techniquement et vendu avec 3 mois de garantie.",
        whyHeading:
          'Pourquoi Karaarslan Bike pour les habitants de Dortmund?',
        whyItems: [
          'Seulement 15 km / 20 minutes via la B236/B54',
          'Plus de 100 vélos en stock — sans attente',
          "Vélos d'occasion contrôlés avec 3 mois de garantie",
          'Vélos neufs avec 24 mois de garantie',
          'Essai sur place — sans rendez-vous',
          'Prix justes — nettement moins cher que beaucoup de revendeurs de Dortmund',
          'Conseils en allemand, anglais, français et turc',
        ],
        offerHeading: 'Notre offre',
        offerItems: [
          "Vélos de ville à partir d'env. 80 € (occasion) / 350 € (neuf)",
          'VTC pour les trajets et les loisirs',
          "Vélos électriques à partir d'env. 800 € (occasion) — état de la batterie documenté",
          'Vélos de ville et VTC idéals pour la Ruhr, terrain plat',
          'Vélos pour enfants dans toutes les tailles',
          'Accessoires vélo: antivols, casques, éclairage, paniers',
        ],
        ctaHeading: 'Venez nous voir!',
        ctaText:
          'Rendez-nous visite au Alstedder Straße 5, 44534 Lünen. Ouvert Lun–Jeu 09–18, Ven 09–13 + 15–18, Sam 09–18. Ou écrivez-nous sur WhatsApp: +49 163 7390 301.',
        directions:
          'Depuis Dortmund via la B236/B54 direction Lünen, quartier Alstedde. Parking gratuit devant le magasin.',
      },
      tr: {
        metaTitle: "Bisiklet Dortmund — Karaarslan Bike'da bisiklet alın",
        metaDescription:
          "Dortmund'da bisiklet mi arıyorsunuz? Karaarslan Bike sadece 15 km uzaklıkta. 100'den fazla yeni ve ikinci el bisiklet, e-bisiklet, garantili.",
        heroTitle: "Dortmund'da bisiklet mi arıyorsunuz?",
        heroSub:
          "Karaarslan Bike — Dortmund'dan sadece 15 km uzaklıkta bisiklet mağazanız.",
        introHeading: 'Dortmund için bisikletler — Karaarslan Bike',
        introText:
          "Dortmund'da bisiklet mi arıyorsunuz? Karaarslan Bike, Alstedder Straße 5, Lünen, arabayla sadece 20 dakika uzaklıkta. 100'den fazla yeni ve ikinci el bisiklet — şehir bisikletleri, trekking bisikletleri, dağ bisikletleri, e-bisikletler ve çocuk bisikletleri. Her ikinci el bisiklet teknik olarak kontrol edilmiş ve 3 ay garantili.",
        whyHeading: "Dortmund'lular neden Karaarslan Bike'u tercih etmeli?",
        whyItems: [
          'Sadece 15 km / 20 dakika B236/B54 üzerinden',
          "Stokta 100'den fazla bisiklet — bekleme yok",
          'Kontrol edilmiş ikinci el bisikletler, 3 ay garantili',
          'Yeni bisikletler 24 ay garantili',
          'Yerinde test sürüşü — randevusuz',
          'Uygun fiyatlar — birçok Dortmund satıcısından çok daha ucuz',
          'Almanca, İngilizce, Fransızca ve Türkçe danışmanlık',
        ],
        offerHeading: 'Ürün Yelpazemiz',
        offerItems: [
          "Şehir bisikletleri yaklaşık 80 €'dan (ikinci el) / 350 €'dan (yeni)",
          'İşe gidip gelme ve boş zaman için trekking bisikletleri',
          "E-bisikletler yaklaşık 800 €'dan (ikinci el) — akü durumu belgelenmiş",
          'Düz Ruhrgebiet için ideal şehir ve trekking bisikletleri',
          'Tüm bedenlerde çocuk bisikletleri',
          'Bisiklet aksesuarları: kilitler, kasklar, aydınlatma, sepetler',
        ],
        ctaHeading: 'Hemen gelin!',
        ctaText:
          "Alstedder Straße 5, 44534 Lünen adresine gelin. Açılış saatleri: Pzt–Per 09–18, Cum 09–13 + 15–18, Cmt 09–18. Ya da WhatsApp'tan yazın: +49 163 7390 301.",
        directions:
          "Dortmund'dan B236/B54 üzerinden Lünen, Alstedde semti yönüne gidin. Mağaza önünde ücretsiz park yeri mevcut.",
      },
    },
  },
  {
    slug: 'fahrrad-kamen',
    cityName: 'Kamen',
    distanceKm: 10,
    driveMinutes: 15,
    translations: {
      de: {
        metaTitle:
          'Fahrrad Kamen — Fahrräder kaufen bei Karaarslan Bike',
        metaDescription:
          'Fahrrad kaufen in Kamen? Karaarslan Bike: Nur 10 km entfernt. 100+ neue & gebrauchte Fahrräder, E-Bikes, Garantie, Probefahrt.',
        heroTitle: 'Fahrrad kaufen in Kamen?',
        heroSub:
          'Karaarslan Bike — nur 10 km von Kamen. Über 100 Fahrräder mit Garantie.',
        introHeading: 'Fahrräder für Kamen bei Karaarslan Bike',
        introText:
          'Kamen und Umgebung suchen ein gutes Fahrrad? Karaarslan Bike bietet Ihnen über 100 neue und gebrauchte Fahrräder — nur 15 Minuten Fahrt über die B61. Ob Citybike für den Alltag, E-Bike für entspanntes Pendeln im flachen Ruhrgebiet oder Trekkingrad für längere Touren — wir haben das passende Rad.',
        whyHeading: 'Warum von Kamen zu uns kommen?',
        whyItems: [
          'Nur 10 km / 15 Minuten über die B61',
          'Über 100 Fahrräder sofort verfügbar',
          'Geprüfte Gebrauchträder mit 3 Monaten Garantie',
          'E-Bikes mit dokumentiertem Akku-Zustand',
          'Kostenlose Probefahrt — ohne Termin',
          'Faire, transparente Preise',
        ],
        offerHeading: 'Unser Angebot',
        offerItems: [
          'Citybikes und Hollandräder für den Alltag',
          'E-Bikes für entspanntes Pendeln im flachen Ruhrgebiet',
          'Trekkingräder für den Seseke-Weg',
          'Kinderfahrräder in allen Größen',
          'Gebrauchte Fahrräder ab ca. 80 €',
        ],
        ctaHeading: 'Besuchen Sie uns!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Mo–Do 09–18 Uhr, Fr 09–13 + 15–18 Uhr, Sa 09–18 Uhr. WhatsApp: +49 163 7390 301.',
        directions:
          'Von Kamen über die B61 Richtung Lünen. Dauer: ca. 15 Minuten. Kostenlose Parkplätze vor dem Geschäft.',
      },
      en: {
        metaTitle: 'Bicycle Kamen — Buy bikes at Karaarslan Bike',
        metaDescription:
          'Buy a bike in Kamen? Karaarslan Bike: Only 10 km away. 100+ new & used bicycles, e-bikes, warranty, test rides.',
        heroTitle: 'Buy a bicycle in Kamen?',
        heroSub:
          'Karaarslan Bike — only 10 km from Kamen. Over 100 bikes with warranty.',
        introHeading: 'Bicycles for Kamen at Karaarslan Bike',
        introText:
          'Looking for a good bike in Kamen and the surrounding area? Karaarslan Bike offers over 100 new and used bicycles — just a 15-minute drive via the B61. Whether a city bike for everyday use, an e-bike for relaxed commuting across the flat Ruhrgebiet, or a trekking bike for longer tours — we have the right bike for you.',
        whyHeading: 'Why come from Kamen to us?',
        whyItems: [
          'Only 10 km / 15 minutes via the B61',
          'Over 100 bikes immediately available',
          'Inspected used bikes with 3-month warranty',
          'E-bikes with documented battery condition',
          'Free test ride — no appointment needed',
          'Fair, transparent prices',
        ],
        offerHeading: 'Our Range',
        offerItems: [
          'City bikes and Dutch bikes for everyday use',
          'E-bikes for relaxed commuting across the flat Ruhrgebiet',
          'Trekking bikes for the Seseke-Weg',
          "Children's bikes in all sizes",
          'Used bicycles from approx. €80',
        ],
        ctaHeading: 'Visit us!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Open Mon–Thu 09–18, Fri 09–13 + 15–18, Sat 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          'From Kamen via the B61 towards Lünen. Duration: approx. 15 minutes. Free parking in front of the shop.',
      },
      fr: {
        metaTitle:
          'Vélo Kamen — Acheter des vélos chez Karaarslan Bike',
        metaDescription:
          "Acheter un vélo à Kamen? Karaarslan Bike: seulement 10 km. 100+ vélos neufs et d'occasion, vélos électriques, garantie.",
        heroTitle: 'Acheter un vélo à Kamen?',
        heroSub:
          'Karaarslan Bike — à seulement 10 km de Kamen. Plus de 100 vélos avec garantie.',
        introHeading: 'Vélos pour Kamen chez Karaarslan Bike',
        introText:
          "Vous cherchez un bon vélo à Kamen et ses environs? Karaarslan Bike vous propose plus de 100 vélos neufs et d'occasion — à seulement 15 minutes en voiture via la B61. Vélo de ville, vélo électrique pour un trajet détendu dans la Ruhr toute plate ou VTC pour les longues randonnées — nous avons le vélo qu'il vous faut.",
        whyHeading: 'Pourquoi venir de Kamen chez nous?',
        whyItems: [
          'Seulement 10 km / 15 minutes via la B61',
          'Plus de 100 vélos immédiatement disponibles',
          "Vélos d'occasion contrôlés avec 3 mois de garantie",
          'Vélos électriques avec état de batterie documenté',
          'Essai gratuit — sans rendez-vous',
          'Prix justes et transparents',
        ],
        offerHeading: 'Notre offre',
        offerItems: [
          'Vélos de ville et hollandais pour le quotidien',
          'Vélos électriques pour un trajet détendu dans la Ruhr toute plate',
          'VTC pour le Seseke-Weg',
          'Vélos pour enfants dans toutes les tailles',
          "Vélos d'occasion à partir d'env. 80 €",
        ],
        ctaHeading: 'Venez nous voir!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Ouvert Lun–Jeu 09–18, Ven 09–13 + 15–18, Sam 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          'Depuis Kamen via la B61 direction Lünen. Durée: env. 15 minutes. Parking gratuit devant le magasin.',
      },
      tr: {
        metaTitle: "Bisiklet Kamen — Karaarslan Bike'da bisiklet alın",
        metaDescription:
          "Kamen'de bisiklet mi arıyorsunuz? Karaarslan Bike sadece 10 km uzaklıkta. 100+ yeni ve ikinci el bisiklet, garantili.",
        heroTitle: "Kamen'de bisiklet mi arıyorsunuz?",
        heroSub:
          "Karaarslan Bike — Kamen'den sadece 10 km. 100'den fazla garantili bisiklet.",
        introHeading: 'Kamen için bisikletler — Karaarslan Bike',
        introText:
          "Kamen ve çevresinde iyi bir bisiklet mi arıyorsunuz? Karaarslan Bike, B61 üzerinden sadece 15 dakika uzaklıkta, 100'den fazla yeni ve ikinci el bisiklet sunuyor. Günlük kullanım için şehir bisikleti, düz Ruhrgebiet'te rahat ulaşım için e-bisiklet veya uzun turlar için trekking bisikleti — sizin için doğru bisiklete sahibiz.",
        whyHeading: "Kamen'den neden bize gelmeli?",
        whyItems: [
          'Sadece 10 km / 15 dakika B61 üzerinden',
          "Stokta 100'den fazla bisiklet",
          'Kontrol edilmiş ikinci el bisikletler, 3 ay garantili',
          'Akü durumu belgelenmiş e-bisikletler',
          'Ücretsiz test sürüşü — randevusuz',
          'Adil, şeffaf fiyatlar',
        ],
        offerHeading: 'Ürün Yelpazemiz',
        offerItems: [
          'Günlük kullanım için şehir ve Hollanda bisikletleri',
          "Düz Ruhrgebiet'te rahat ulaşım için e-bisikletler",
          'Seseke-Weg için trekking bisikletleri',
          'Tüm bedenlerde çocuk bisikletleri',
          "İkinci el bisikletler yaklaşık 80 €'dan",
        ],
        ctaHeading: 'Bizi ziyaret edin!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Pzt–Per 09–18, Cum 09–13 + 15–18, Cmt 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          "Kamen'den B61 üzerinden Lünen yönüne. Süre: yaklaşık 15 dakika. Mağaza önünde ücretsiz park yeri.",
      },
    },
  },
  {
    slug: 'fahrrad-bergkamen',
    cityName: 'Bergkamen',
    distanceKm: 10,
    driveMinutes: 15,
    translations: {
      de: {
        metaTitle: 'Fahrrad Bergkamen — Fahrräder kaufen bei Karaarslan Bike',
        metaDescription:
          'Fahrrad kaufen in Bergkamen? Karaarslan Bike: 10 km entfernt, 100+ Fahrräder, E-Bikes, Garantie, Probefahrt ohne Termin.',
        heroTitle: 'Fahrrad kaufen in Bergkamen?',
        heroSub:
          'Karaarslan Bike — die große Auswahl nur 10 km von Bergkamen entfernt.',
        introHeading: 'Fahrräder für Bergkamen bei Karaarslan Bike',
        introText:
          'In Bergkamen und Umgebung suchen Sie einen spezialisierten Fahrradhändler? Karaarslan Bike bietet Ihnen die Auswahl, die Sie verdienen: über 100 neue und gebrauchte Fahrräder mit Garantie, nur 15 Minuten entfernt.',
        whyHeading: 'Warum die kurze Fahrt lohnt',
        whyItems: [
          'Nur 10 km / 15 Minuten über die B233',
          'Größte Auswahl in der Region — über 100 Fahrräder',
          'Gebrauchträder mit Garantie',
          'E-Bikes mit geprüftem Akku',
          'Probefahrt ohne Termin',
          'Parkplätze direkt vor dem Geschäft',
        ],
        offerHeading: 'Das erwartet Sie',
        offerItems: [
          'Citybikes für den Alltag in Bergkamen und Umgebung',
          'Trekkingräder für den Datteln-Hamm-Kanal-Radweg',
          'E-Bikes für die Fahrten zwischen Bergkamen und Lünen',
          'City- und Trekkingräder ideal fürs flache Ruhrgebiet',
          'Kinderfahrräder für den Schulweg',
        ],
        ctaHeading: 'Kommen Sie vorbei!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Mo–Do 09–18 Uhr, Fr 09–13 + 15–18 Uhr, Sa 09–18 Uhr. WhatsApp: +49 163 7390 301.',
        directions:
          'Von Bergkamen über die B233 Richtung Lünen. In ca. 15 Minuten bei uns. Parkplätze vorhanden.',
      },
      en: {
        metaTitle: 'Bicycle Bergkamen — Buy bikes at Karaarslan Bike',
        metaDescription:
          'Buy a bike in Bergkamen? Karaarslan Bike: 10 km away, 100+ bicycles, e-bikes, warranty, test ride without appointment.',
        heroTitle: 'Buy a bicycle in Bergkamen?',
        heroSub:
          'Karaarslan Bike — the big selection only 10 km from Bergkamen.',
        introHeading: 'Bicycles for Bergkamen at Karaarslan Bike',
        introText:
          'Looking for a specialized bicycle dealer in Bergkamen and the surrounding area? Karaarslan Bike offers you the selection you deserve: over 100 new and used bicycles with warranty, only 15 minutes away.',
        whyHeading: 'Why the short drive is worth it',
        whyItems: [
          'Only 10 km / 15 minutes via the B233',
          'Largest selection in the region — over 100 bicycles',
          'Used bikes with warranty',
          'E-bikes with inspected battery',
          'Test ride without appointment',
          'Parking directly in front of the shop',
        ],
        offerHeading: 'What awaits you',
        offerItems: [
          'City bikes for everyday use in Bergkamen and surroundings',
          'Trekking bikes for the Datteln-Hamm-Kanal cycle path',
          'E-bikes for trips between Bergkamen and Lünen',
          'City and trekking bikes ideal for the flat Ruhrgebiet',
          "Children's bikes for the school commute",
        ],
        ctaHeading: 'Come visit us!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Open Mon–Thu 09–18, Fri 09–13 + 15–18, Sat 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          'From Bergkamen via the B233 towards Lünen. About 15 minutes to reach us. Parking available.',
      },
      fr: {
        metaTitle: 'Vélo Bergkamen — Acheter des vélos chez Karaarslan Bike',
        metaDescription:
          'Acheter un vélo à Bergkamen? Karaarslan Bike: 10 km, 100+ vélos, vélos électriques, garantie, essai sans rendez-vous.',
        heroTitle: 'Acheter un vélo à Bergkamen?',
        heroSub:
          'Karaarslan Bike — le grand choix à seulement 10 km de Bergkamen.',
        introHeading: 'Vélos pour Bergkamen chez Karaarslan Bike',
        introText:
          "Vous cherchez un marchand de vélos spécialisé à Bergkamen et ses environs? Karaarslan Bike vous offre le choix que vous méritez: plus de 100 vélos neufs et d'occasion avec garantie, à seulement 15 minutes.",
        whyHeading: 'Pourquoi le court trajet en vaut la peine',
        whyItems: [
          'Seulement 10 km / 15 minutes via la B233',
          'Plus grand choix de la région — plus de 100 vélos',
          "Vélos d'occasion avec garantie",
          'Vélos électriques avec batterie contrôlée',
          'Essai sans rendez-vous',
          'Parking directement devant le magasin',
        ],
        offerHeading: 'Ce qui vous attend',
        offerItems: [
          'Vélos de ville pour le quotidien à Bergkamen et environs',
          'VTC pour la piste cyclable du Datteln-Hamm-Kanal',
          'Vélos électriques pour les trajets entre Bergkamen et Lünen',
          'Vélos de ville et VTC idéals pour la Ruhr, terrain plat',
          'Vélos pour enfants pour le trajet scolaire',
        ],
        ctaHeading: 'Venez nous voir!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Ouvert Lun–Jeu 09–18, Ven 09–13 + 15–18, Sam 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          'Depuis Bergkamen via la B233 direction Lünen. En env. 15 minutes chez nous. Parking disponible.',
      },
      tr: {
        metaTitle: "Bisiklet Bergkamen — Karaarslan Bike'da bisiklet alın",
        metaDescription:
          "Bergkamen'de bisiklet mi arıyorsunuz? Karaarslan Bike: 10 km uzaklıkta, 100+ bisiklet, garantili, randevusuz test sürüşü.",
        heroTitle: "Bergkamen'de bisiklet mi arıyorsunuz?",
        heroSub:
          "Karaarslan Bike — Bergkamen'den sadece 10 km uzaklıkta geniş seçenek.",
        introHeading: 'Bergkamen için bisikletler — Karaarslan Bike',
        introText:
          "Bergkamen ve çevresinde uzmanlaşmış bir bisiklet satıcısı mı arıyorsunuz? Karaarslan Bike size hak ettiğiniz seçeneği sunuyor: garantili 100'den fazla yeni ve ikinci el bisiklet, sadece 15 dakika uzaklıkta.",
        whyHeading: 'Kısa yolculuk neden buna değer',
        whyItems: [
          'Sadece 10 km / 15 dakika B233 üzerinden',
          "Bölgenin en büyük seçimi — 100'den fazla bisiklet",
          'Garantili ikinci el bisikletler',
          'Kontrol edilmiş akülü e-bisikletler',
          'Randevusuz test sürüşü',
          'Mağaza önünde park yeri',
        ],
        offerHeading: 'Sizi neler bekliyor',
        offerItems: [
          'Bergkamen ve çevresinde günlük kullanım için şehir bisikletleri',
          'Datteln-Hamm-Kanal bisiklet yolu için trekking bisikletleri',
          'Bergkamen-Lünen arası yolculuklar için e-bisikletler',
          'Düz Ruhrgebiet için ideal şehir ve trekking bisikletleri',
          'Okul yolu için çocuk bisikletleri',
        ],
        ctaHeading: 'Bize uğrayın!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Pzt–Per 09–18, Cum 09–13 + 15–18, Cmt 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          "Bergkamen'den B233 üzerinden Lünen yönüne. Yaklaşık 15 dakikada bizde. Park yeri mevcut.",
      },
    },
  },
  {
    slug: 'fahrrad-werne',
    cityName: 'Werne',
    distanceKm: 12,
    driveMinutes: 18,
    translations: {
      de: {
        metaTitle:
          'Fahrrad Werne — Fahrräder kaufen bei Karaarslan Bike',
        metaDescription:
          'Fahrrad kaufen in Werne? Karaarslan Bike: Nur 12 km entfernt! 100+ neue & gebrauchte Fahrräder, E-Bikes, Garantie.',
        heroTitle: 'Fahrrad kaufen in Werne?',
        heroSub:
          'Karaarslan Bike — Ihr Fahrradladen in der Nähe, nur 12 km entfernt.',
        introHeading: 'Fahrräder für Werne bei Karaarslan Bike',
        introText:
          'Werne liegt direkt nördlich von Lünen — und Karaarslan Bike ist nur 18 Minuten mit dem Auto entfernt. Perfekt für eine Probefahrt! Wir bieten über 100 neue und gebrauchte Fahrräder mit Garantie.',
        whyHeading: 'Warum Karaarslan Bike für Werner?',
        whyItems: [
          'Nur 12 km / 18 Minuten mit dem Auto über die B54',
          'Über die Römer-Lippe-Route auch bequem mit dem Fahrrad erreichbar',
          'Über 100 Fahrräder zum Probefahren',
          'Gebrauchträder mit 3 Monaten Garantie',
          'Faire Preise',
        ],
        offerHeading: 'Unser Sortiment',
        offerItems: [
          'Citybikes für den Pendelweg nach Lünen',
          'E-Bikes für entspanntes Pendeln',
          'Trekkingräder für Touren auf der Römer-Lippe-Route',
          'Kinderfahrräder für alle Altersgruppen',
          'Gebrauchte Fahrräder ab ca. 80 €',
        ],
        ctaHeading: 'Jetzt vorbeikommen!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Mo–Do 09–18 Uhr, Fr 09–13 + 15–18 Uhr, Sa 09–18 Uhr. WhatsApp: +49 163 7390 301.',
        directions:
          'Von Werne über die B54 Richtung Lünen, Stadtteil Alstedde. Nur 18 Minuten.',
      },
      en: {
        metaTitle: 'Bicycle Werne — Buy bikes at Karaarslan Bike',
        metaDescription:
          'Buy a bike in Werne? Karaarslan Bike: Only 12 km away! 100+ new & used bicycles, e-bikes, warranty.',
        heroTitle: 'Buy a bicycle in Werne?',
        heroSub:
          'Karaarslan Bike — your nearby bike shop, only 12 km away.',
        introHeading: 'Bicycles for Werne at Karaarslan Bike',
        introText:
          'Werne is located just north of Lünen — and Karaarslan Bike is only an 18-minute drive away. Perfect for a test ride! We offer over 100 new and used bicycles with warranty.',
        whyHeading: 'Why Karaarslan Bike for Werne residents?',
        whyItems: [
          'Only 12 km / 18 minutes by car via the B54',
          'Also easily reachable by bike via the Römer-Lippe-Route',
          'Over 100 bikes to test ride',
          'Used bikes with 3-month warranty',
          'Fair prices',
        ],
        offerHeading: 'Our Selection',
        offerItems: [
          'City bikes for commuting to Lünen',
          'E-bikes for relaxed commuting',
          'Trekking bikes for tours on the Römer-Lippe-Route',
          "Children's bikes for all age groups",
          'Used bicycles from approx. €80',
        ],
        ctaHeading: 'Visit us now!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Open Mon–Thu 09–18, Fri 09–13 + 15–18, Sat 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          'From Werne via the B54 towards Lünen, Alstedde district. Only 18 minutes.',
      },
      fr: {
        metaTitle: 'Vélo Werne — Acheter des vélos chez Karaarslan Bike',
        metaDescription:
          "Acheter un vélo à Werne? Karaarslan Bike: seulement 12 km! 100+ vélos neufs et d'occasion, vélos électriques, garantie.",
        heroTitle: 'Acheter un vélo à Werne?',
        heroSub:
          'Karaarslan Bike — votre magasin de vélos à proximité, à seulement 12 km.',
        introHeading: 'Vélos pour Werne chez Karaarslan Bike',
        introText:
          "Werne est situé juste au nord de Lünen — et Karaarslan Bike n'est qu'à 18 minutes en voiture. Parfait pour un essai! Nous proposons plus de 100 vélos neufs et d'occasion avec garantie.",
        whyHeading: 'Pourquoi Karaarslan Bike pour les habitants de Werne?',
        whyItems: [
          'Seulement 12 km / 18 minutes en voiture via la B54',
          'Aussi facilement accessible en vélo via la Römer-Lippe-Route',
          'Plus de 100 vélos à essayer',
          "Vélos d'occasion avec 3 mois de garantie",
          'Prix justes',
        ],
        offerHeading: 'Notre sélection',
        offerItems: [
          'Vélos de ville pour les trajets vers Lünen',
          'Vélos électriques pour un trajet détendu',
          'VTC pour les randonnées sur la Römer-Lippe-Route',
          'Vélos pour enfants pour tous les âges',
          "Vélos d'occasion à partir d'env. 80 €",
        ],
        ctaHeading: 'Venez nous voir!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Ouvert Lun–Jeu 09–18, Ven 09–13 + 15–18, Sam 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          'Depuis Werne via la B54 direction Lünen, quartier Alstedde. Seulement 18 minutes.',
      },
      tr: {
        metaTitle: "Bisiklet Werne — Karaarslan Bike'da bisiklet alın",
        metaDescription:
          "Werne'de bisiklet mi arıyorsunuz? Karaarslan Bike sadece 12 km uzaklıkta! 100+ yeni ve ikinci el bisiklet, garantili.",
        heroTitle: "Werne'de bisiklet mi arıyorsunuz?",
        heroSub:
          'Karaarslan Bike — yakınınızdaki bisiklet mağazası, sadece 12 km uzaklıkta.',
        introHeading: 'Werne için bisikletler — Karaarslan Bike',
        introText:
          "Werne, Lünen'in hemen kuzeyinde yer alıyor — ve Karaarslan Bike arabayla sadece 18 dakika uzaklıkta. Test sürüşü için mükemmel! Garantili 100'den fazla yeni ve ikinci el bisiklet sunuyoruz.",
        whyHeading: "Werne'liler neden Karaarslan Bike'u tercih etmeli?",
        whyItems: [
          'Sadece 12 km / 18 dakika arabayla B54 üzerinden',
          'Römer-Lippe-Route üzerinden bisikletle de kolayca ulaşılabilir',
          "Test sürüşü yapılabilecek 100'den fazla bisiklet",
          '3 ay garantili ikinci el bisikletler',
          'Uygun fiyatlar',
        ],
        offerHeading: 'Ürün Seçimimiz',
        offerItems: [
          "Lünen'e gidiş-geliş için şehir bisikletleri",
          'Rahat ulaşım için e-bisikletler',
          'Römer-Lippe-Route turları için trekking bisikletleri',
          'Tüm yaş grupları için çocuk bisikletleri',
          "İkinci el bisikletler yaklaşık 80 €'dan",
        ],
        ctaHeading: 'Hemen gelin!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Pzt–Per 09–18, Cum 09–13 + 15–18, Cmt 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          "Werne'den B54 üzerinden Lünen, Alstedde semti yönüne. Sadece 18 dakika.",
      },
    },
  },
  {
    slug: 'fahrrad-selm',
    cityName: 'Selm',
    distanceKm: 12,
    driveMinutes: 18,
    translations: {
      de: {
        metaTitle: 'Fahrrad Selm — Fahrräder kaufen bei Karaarslan Bike',
        metaDescription:
          'Fahrrad kaufen in Selm? Karaarslan Bike: 12 km entfernt, 100+ Fahrräder, E-Bikes, Garantie, Probefahrt.',
        heroTitle: 'Fahrrad kaufen in Selm?',
        heroSub:
          'Karaarslan Bike — nur 12 km von Selm entfernt. Große Auswahl, faire Preise.',
        introHeading: 'Fahrräder für Selm bei Karaarslan Bike',
        introText:
          'Selm (Bork, Cappenberg) liegt nordwestlich von Lünen. Karaarslan Bike ist in nur 18 Minuten erreichbar und bietet Ihnen die größte Fahrradauswahl der Region — über 100 neue und gebrauchte Fahrräder mit Garantie.',
        whyHeading: 'Warum zu uns kommen?',
        whyItems: [
          'Nur 12 km / 18 Minuten mit dem Auto über die B236',
          'Über 100 Fahrräder sofort verfügbar',
          'Geprüfte Gebrauchträder mit Garantie',
          'E-Bikes mit dokumentiertem Akku-Zustand',
          'Probefahrt ohne Termin',
        ],
        offerHeading: 'Unser Angebot',
        offerItems: [
          'Citybikes für den Alltag',
          'E-Bikes für die Strecke Selm – Lünen',
          'Trekkingräder für Touren auf dem Lippeauenweg',
          'Kinderfahrräder',
          'Gebrauchte Fahrräder ab ca. 80 €',
        ],
        ctaHeading: 'Besuchen Sie uns!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Mo–Do 09–18 Uhr, Fr 09–13 + 15–18 Uhr, Sa 09–18 Uhr. WhatsApp: +49 163 7390 301.',
        directions:
          'Von Selm über die B236 Richtung Lünen, Stadtteil Alstedde. Nur 18 Minuten.',
      },
      en: {
        metaTitle: 'Bicycle Selm — Buy bikes at Karaarslan Bike',
        metaDescription:
          'Buy a bike in Selm? Karaarslan Bike: 12 km away, 100+ bicycles, e-bikes, warranty, test rides.',
        heroTitle: 'Buy a bicycle in Selm?',
        heroSub:
          'Karaarslan Bike — only 12 km from Selm. Large selection, fair prices.',
        introHeading: 'Bicycles for Selm at Karaarslan Bike',
        introText:
          'Selm (Bork, Cappenberg) is located northwest of Lünen. Karaarslan Bike is reachable in just 18 minutes and offers you the largest bicycle selection in the region — over 100 new and used bicycles with warranty.',
        whyHeading: 'Why come to us?',
        whyItems: [
          'Only 12 km / 18 minutes by car via the B236',
          'Over 100 bikes immediately available',
          'Inspected used bikes with warranty',
          'E-bikes with documented battery condition',
          'Test ride without appointment',
        ],
        offerHeading: 'Our Range',
        offerItems: [
          'City bikes for everyday use',
          'E-bikes for the Selm – Lünen route',
          'Trekking bikes for tours on the Lippeauenweg',
          "Children's bikes",
          'Used bicycles from approx. €80',
        ],
        ctaHeading: 'Visit us!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Open Mon–Thu 09–18, Fri 09–13 + 15–18, Sat 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          'From Selm via the B236 towards Lünen, Alstedde district. Only 18 minutes.',
      },
      fr: {
        metaTitle: 'Vélo Selm — Acheter des vélos chez Karaarslan Bike',
        metaDescription:
          'Acheter un vélo à Selm? Karaarslan Bike: 12 km, 100+ vélos, vélos électriques, garantie, essai.',
        heroTitle: 'Acheter un vélo à Selm?',
        heroSub:
          'Karaarslan Bike — à seulement 12 km de Selm. Grand choix, prix justes.',
        introHeading: 'Vélos pour Selm chez Karaarslan Bike',
        introText:
          "Selm (Bork, Cappenberg) est situé au nord-ouest de Lünen. Karaarslan Bike est accessible en seulement 18 minutes et vous offre le plus grand choix de vélos de la région — plus de 100 vélos neufs et d'occasion avec garantie.",
        whyHeading: 'Pourquoi venir chez nous?',
        whyItems: [
          'Seulement 12 km / 18 minutes en voiture via la B236',
          'Plus de 100 vélos immédiatement disponibles',
          "Vélos d'occasion contrôlés avec garantie",
          'Vélos électriques avec état de batterie documenté',
          'Essai sans rendez-vous',
        ],
        offerHeading: 'Notre offre',
        offerItems: [
          'Vélos de ville pour le quotidien',
          'Vélos électriques pour le trajet Selm – Lünen',
          'VTC pour les randonnées sur le Lippeauenweg',
          'Vélos pour enfants',
          "Vélos d'occasion à partir d'env. 80 €",
        ],
        ctaHeading: 'Venez nous voir!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Ouvert Lun–Jeu 09–18, Ven 09–13 + 15–18, Sam 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          'Depuis Selm via la B236 direction Lünen, quartier Alstedde. Seulement 18 minutes.',
      },
      tr: {
        metaTitle: "Bisiklet Selm — Karaarslan Bike'da bisiklet alın",
        metaDescription:
          "Selm'de bisiklet mi arıyorsunuz? Karaarslan Bike: 12 km uzaklıkta, 100+ bisiklet, garantili.",
        heroTitle: "Selm'de bisiklet mi arıyorsunuz?",
        heroSub:
          "Karaarslan Bike — Selm'den sadece 12 km. Geniş seçenek, uygun fiyatlar.",
        introHeading: 'Selm için bisikletler — Karaarslan Bike',
        introText:
          "Selm (Bork, Cappenberg) Lünen'in kuzeybatısında yer alıyor. Karaarslan Bike sadece 18 dakikada ulaşılabilir ve bölgenin en büyük bisiklet seçimini sunuyor — garantili 100'den fazla yeni ve ikinci el bisiklet.",
        whyHeading: 'Neden bize gelmelisiniz?',
        whyItems: [
          'Sadece 12 km / 18 dakika arabayla B236 üzerinden',
          "Stokta 100'den fazla bisiklet",
          'Garantili kontrol edilmiş ikinci el bisikletler',
          'Akü durumu belgelenmiş e-bisikletler',
          'Randevusuz test sürüşü',
        ],
        offerHeading: 'Ürün Yelpazemiz',
        offerItems: [
          'Günlük kullanım için şehir bisikletleri',
          'Selm – Lünen güzergahı için e-bisikletler',
          'Lippeauenweg turları için trekking bisikletleri',
          'Çocuk bisikletleri',
          "İkinci el bisikletler yaklaşık 80 €'dan",
        ],
        ctaHeading: 'Bizi ziyaret edin!',
        ctaText:
          'Alstedder Straße 5, 44534 Lünen. Pzt–Per 09–18, Cum 09–13 + 15–18, Cmt 09–18. WhatsApp: +49 163 7390 301.',
        directions:
          "Selm'den B236 üzerinden Lünen, Alstedde semti yönüne. Sadece 18 dakika.",
      },
    },
  },
];
