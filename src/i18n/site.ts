export const siteUrl = "https://www.bubbleappstudio.xyz";

export const locales = ["fr", "en", "es", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export type AlternateLink = {
  hrefLang: string;
  href: string;
  locale?: string;
};

export type HomePageContent = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  skipLinkLabel: string;
  localeSwitcherLabel: string;
  titleLine1: string;
  titleLine2: string;
  iconAlt: string;
  tagline: string;
  intro: string;
  body: string;
  searchIntentParagraph?: string;
  appStoreAriaLabel: string;
  appStoreCaption: string;
  appStoreTitle: string;
  playStoreAriaLabel: string;
  playStoreCaption: string;
  playStoreTitle: string;
  stats: Array<{ value: string; label: string }>;
  rolesHeading: string;
  carouselLeftLabel: string;
  carouselRightLabel: string;
  contactHeading: string;
  contactButton: string;
  footerCopy: string;
  termsLabel: string;
  privacyLabel: string;
  roles: Array<{ name: string; image: string }>;
};

export type LegalPageContent = {
  metaTitle: string;
  metaDescription: string;
  skipLinkLabel: string;
  localeSwitcherLabel: string;
  kicker: string;
  title: string;
  updatedLabel: string;
  updatedAt: string;
  sections: Array<{
    heading: string;
    paragraphs?: string[];
    list?: string[];
  }>;
};

export const localeMeta: Record<
  Locale,
  { lang: string; ogLocale: string; hrefLang: string; label: string; name: string }
> = {
  fr: {
    lang: "fr",
    ogLocale: "fr_FR",
    hrefLang: "fr",
    label: "FR",
    name: "Français"
  },
  en: {
    lang: "en",
    ogLocale: "en_US",
    hrefLang: "en",
    label: "EN",
    name: "English"
  },
  es: {
    lang: "es",
    ogLocale: "es_ES",
    hrefLang: "es",
    label: "ES",
    name: "Español"
  },
  de: {
    lang: "de",
    ogLocale: "de_DE",
    hrefLang: "de",
    label: "DE",
    name: "Deutsch"
  }
};

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

export function getLocalizedPath(locale: Locale, path = "/") {
  const normalizedPath = normalizePath(path);
  if (locale === defaultLocale) {
    return normalizedPath === "/" ? "/" : `${normalizedPath}/`;
  }

  if (normalizedPath === "/") {
    return `/${locale}/`;
  }

  return `/${locale}${normalizedPath}/`;
}

export function buildAlternateLinks(path = "/"): AlternateLink[] {
  const alternates = locales.map((locale) => ({
    hrefLang: localeMeta[locale].hrefLang,
    href: new URL(getLocalizedPath(locale, path), siteUrl).toString(),
    locale: localeMeta[locale].ogLocale
  }));

  alternates.push({
    hrefLang: "x-default",
    href: new URL(getLocalizedPath(defaultLocale, path), siteUrl).toString()
  });

  return alternates;
}

const sharedRoles = {
  fr: [
    { name: "Loup-garou", image: "assets/roles/wolf.png" },
    { name: "Voyante", image: "assets/roles/seer.png" },
    { name: "Petite Fille", image: "assets/roles/little_girl.png" },
    { name: "Villageois", image: "assets/roles/villager.png" },
    { name: "Sorcière", image: "assets/roles/witch.png" },
    { name: "Cupidon", image: "assets/roles/cupid.png" },
    { name: "Chasseur", image: "assets/roles/hunter.png" }
  ],
  en: [
    { name: "Werewolf", image: "assets/roles/wolf.png" },
    { name: "Seer", image: "assets/roles/seer.png" },
    { name: "Little Girl", image: "assets/roles/little_girl.png" },
    { name: "Villager", image: "assets/roles/villager.png" },
    { name: "Witch", image: "assets/roles/witch.png" },
    { name: "Cupid", image: "assets/roles/cupid.png" },
    { name: "Hunter", image: "assets/roles/hunter.png" }
  ],
  es: [
    { name: "Hombre lobo", image: "assets/roles/wolf.png" },
    { name: "Vidente", image: "assets/roles/seer.png" },
    { name: "Niña pequeña", image: "assets/roles/little_girl.png" },
    { name: "Aldeano", image: "assets/roles/villager.png" },
    { name: "Bruja", image: "assets/roles/witch.png" },
    { name: "Cupido", image: "assets/roles/cupid.png" },
    { name: "Cazador", image: "assets/roles/hunter.png" }
  ],
  de: [
    { name: "Werwolf", image: "assets/roles/wolf.png" },
    { name: "Seherin", image: "assets/roles/seer.png" },
    { name: "Kleines Mädchen", image: "assets/roles/little_girl.png" },
    { name: "Dorfbewohner", image: "assets/roles/villager.png" },
    { name: "Hexe", image: "assets/roles/witch.png" },
    { name: "Amor", image: "assets/roles/cupid.png" },
    { name: "Jäger", image: "assets/roles/hunter.png" }
  ]
} satisfies Record<Locale, HomePageContent["roles"]>;

export const homePageContent: Record<Locale, HomePageContent> = {
  fr: {
    metaTitle: "Loup-garou Undercover | Jeu de soiree sans cartes",
    metaDescription:
      "Jeu de soiree de loups-garous inspire de Thiercelieux, entre village et mafia. Party game de bluff, role et narrateur pour la famille et les amis, sans cartes, de 6 a 18 joueurs.",
    keywords:
      "loups-garous,loup,garou,soiree,thiercelieux,bluff,role,famille,village,cartes,party,narrateur,mafia",
    skipLinkLabel: "Aller au contenu",
    localeSwitcherLabel: "Choisir la langue",
    titleLine1: "Loup-garou",
    titleLine2: "Undercover",
    iconAlt: "Icône de l'app Loup-garou Undercover",
    tagline: "Le jeu des Loups-Garous, sans carte.",
    intro:
      "Rassemblez vos amis et laissez votre telephone jouer le role du narrateur. Bluff, strategie et fous rires garantis.",
    body:
      "Jeu de soirée convivial mêlant bluff et jeu de rôle, idéal pour la famille et les amis. Inspiré du Loup-Garou de Thiercelieux et des jeux de type Mafia, il plonge les joueurs au cœur d’un village où le loup-garou se cache parmi les habitants. Sans cartes, avec un narrateur, chaque partie est unique et pleine de suspense.",
    appStoreAriaLabel: "Télécharger sur l’App Store",
    appStoreCaption: "Disponible sur",
    appStoreTitle: "App Store",
    playStoreAriaLabel: "Télécharger sur Android",
    playStoreCaption: "Télécharger sur",
    playStoreTitle: "Android",
    stats: [
      { value: "4,7", label: "Note App Store" },
      { value: "6-18", label: "Joueurs" },
      { value: "Gratuit", label: "À télécharger" }
    ],
    rolesHeading: "Découvrir les rôles",
    carouselLeftLabel: "Défiler à gauche",
    carouselRightLabel: "Défiler à droite",
    contactHeading: "Contact",
    contactButton: "Envoyer un email",
    footerCopy: "Copyright Bubble App Studio 2026. Made with love in Paris 🇫🇷",
    termsLabel: "Conditions",
    privacyLabel: "Confidentialité",
    roles: sharedRoles.fr
  },
  en: {
    metaTitle: "Werewolf Game Without Cards | Werewolf Undercover",
    metaDescription:
      "Looking for a werewolf game without cards or a Mafia game without cards? Werewolf Undercover is a card-free party game with hidden roles and a phone narrator for 6 to 18 players.",
    keywords:
      "werewolf game without cards,mafia game without cards,card-free werewolf game,card-free mafia game,hidden roles party game,phone narrator party game,werewolf undercover",
    skipLinkLabel: "Skip to content",
    localeSwitcherLabel: "Choose language",
    titleLine1: "Werewolf",
    titleLine2: "Undercover",
    iconAlt: "Werewolf Undercover app icon",
    tagline: "A werewolf game without cards.",
    intro:
      "Gather your friends and let your phone act as the narrator. Bluff, strategy and loud laughs included.",
    body:
      "A social party game mixing bluff and roleplay, perfect for families and friends. Inspired by Werewolf and Mafia-style games, it drops players into a village where the werewolf hides among the townsfolk. No cards, just a narrator and a fresh suspenseful round every time.",
    searchIntentParagraph:
      "If you are looking for a werewolf game without cards or a Mafia game without cards, this card-free app turns one phone into the narrator and keeps every round fast, social and easy to launch.",
    appStoreAriaLabel: "Download on the App Store",
    appStoreCaption: "Available on",
    appStoreTitle: "App Store",
    playStoreAriaLabel: "Download on Android",
    playStoreCaption: "Get it on",
    playStoreTitle: "Android",
    stats: [
      { value: "4.7", label: "App Store rating" },
      { value: "6-18", label: "Players" },
      { value: "Free", label: "To download" }
    ],
    rolesHeading: "Discover the roles",
    carouselLeftLabel: "Scroll left",
    carouselRightLabel: "Scroll right",
    contactHeading: "Contact",
    contactButton: "Send an email",
    footerCopy: "Copyright Bubble App Studio 2026. Made with love in Paris 🇫🇷",
    termsLabel: "Terms",
    privacyLabel: "Privacy",
    roles: sharedRoles.en
  },
  es: {
    metaTitle: "Hombre lobo Undercover | Juego social sin cartas",
    metaDescription:
      "Juego de hombres lobo inspirado en Mafia y Los Hombres Lobo de Castronegro. Faroles, roles ocultos y narrador en el móvil para 6 a 18 jugadores, sin cartas.",
    keywords:
      "juego de hombres lobo,juego de fiesta,mafia,roles ocultos,faroles,narrador en móvil,juego familiar,amigos,sin cartas,hombre lobo undercover",
    skipLinkLabel: "Ir al contenido",
    localeSwitcherLabel: "Elegir idioma",
    titleLine1: "Hombre lobo",
    titleLine2: "Undercover",
    iconAlt: "Icono de la app Hombre lobo Undercover",
    tagline: "El juego de hombres lobo, sin cartas.",
    intro:
      "Reúne a tus amigos y deja que tu teléfono haga de narrador. Engaños, estrategia y risas garantizadas.",
    body:
      "Un juego social que mezcla faroles y roles ocultos, ideal para familia y amigos. Inspirado en Los Hombres Lobo y en los juegos tipo Mafia, mete a los jugadores en un pueblo donde el hombre lobo se esconde entre los habitantes. Sin cartas y con un narrador, cada partida cambia y mantiene el suspense hasta el final.",
    appStoreAriaLabel: "Descargar en el App Store",
    appStoreCaption: "Disponible en",
    appStoreTitle: "App Store",
    playStoreAriaLabel: "Descargar en Android",
    playStoreCaption: "Descargar en",
    playStoreTitle: "Android",
    stats: [
      { value: "4,7", label: "Nota App Store" },
      { value: "6-18", label: "Jugadores" },
      { value: "Gratis", label: "Para descargar" }
    ],
    rolesHeading: "Descubre los roles",
    carouselLeftLabel: "Desplazar a la izquierda",
    carouselRightLabel: "Desplazar a la derecha",
    contactHeading: "Contacto",
    contactButton: "Enviar un correo",
    footerCopy: "Copyright Bubble App Studio 2026. Made with love in Paris 🇫🇷",
    termsLabel: "Términos",
    privacyLabel: "Privacidad",
    roles: sharedRoles.es
  },
  de: {
    metaTitle: "Werwolf Undercover | Partyspiel ohne Karten",
    metaDescription:
      "Ein Werwolf-Partyspiel im Stil von Mafia und Werwolf. Bluff, geheime Rollen und ein Erzähler auf dem Smartphone für 6 bis 18 Spieler, ganz ohne Karten.",
    keywords:
      "werwolf spiel,partyspiel,mafia spiel,geheime rollen,bluff spiel,erzähler am handy,familienspiel,freunde,ohne karten,werwolf undercover",
    skipLinkLabel: "Zum Inhalt springen",
    localeSwitcherLabel: "Sprache wählen",
    titleLine1: "Werwolf",
    titleLine2: "Undercover",
    iconAlt: "Werwolf Undercover App-Symbol",
    tagline: "Das Werwolfspiel ohne Karten.",
    intro:
      "Hol deine Freunde zusammen und lass dein Smartphone den Erzähler übernehmen. Bluff, Strategie und große Lacher inklusive.",
    body:
      "Ein geselliges Partyspiel voller Bluff und Rollen, ideal für Familie und Freunde. Inspiriert von Werwolf und Mafia-artigen Spielen versetzt es die Spieler in ein Dorf, in dem sich der Werwolf unter den Bewohnern versteckt. Ohne Karten, mit Erzähler und mit frischem Nervenkitzel in jeder Runde.",
    appStoreAriaLabel: "Im App Store laden",
    appStoreCaption: "Erhältlich im",
    appStoreTitle: "App Store",
    playStoreAriaLabel: "Für Android laden",
    playStoreCaption: "Download für",
    playStoreTitle: "Android",
    stats: [
      { value: "4,7", label: "App Store Bewertung" },
      { value: "6-18", label: "Spieler" },
      { value: "Kostenlos", label: "Zum Download" }
    ],
    rolesHeading: "Rollen entdecken",
    carouselLeftLabel: "Nach links scrollen",
    carouselRightLabel: "Nach rechts scrollen",
    contactHeading: "Kontakt",
    contactButton: "E-Mail senden",
    footerCopy: "Copyright Bubble App Studio 2026. Made with love in Paris 🇫🇷",
    termsLabel: "AGB",
    privacyLabel: "Datenschutz",
    roles: sharedRoles.de
  }
};

export const privacyPageContent: Record<Locale, LegalPageContent> = {
  fr: {
    metaTitle: "Politique de confidentialité | Loup-garou Undercover",
    metaDescription: "Politique de confidentialité de Loup-garou Undercover.",
    skipLinkLabel: "Aller au contenu",
    localeSwitcherLabel: "Choisir la langue",
    kicker: "Loup-garou Undercover",
    title: "Politique de confidentialité",
    updatedLabel: "Dernière mise à jour",
    updatedAt: "9 février 2026",
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: ["Bubble App Studio — contact@bubbleappstudio.xyz"]
      },
      {
        heading: "2. Données que nous collectons",
        paragraphs: [
          "Nous n’exploitons aucun serveur et nous ne collectons ni ne stockons de données personnelles. L’application ne vous demande pas de créer un compte."
        ]
      },
      {
        heading: "3. Achats et services tiers",
        paragraphs: [
          "Les paiements sont traités par Apple. Pour valider l’accès Premium et restaurer les achats, nous utilisons RevenueCat. Ces services traitent les données d’achat et d’abonnement nécessaires à la fourniture du service."
        ]
      },
      {
        heading: "4. Utilisation des données",
        paragraphs: ["Nous utilisons les données uniquement pour :"],
        list: [
          "Fournir l’accès Premium et restaurer vos achats.",
          "Assurer le bon fonctionnement de l’application."
        ]
      },
      {
        heading: "5. Conservation",
        paragraphs: [
          "Nous ne conservons pas de données personnelles. Les données liées aux achats sont conservées par Apple et RevenueCat selon leurs propres politiques."
        ]
      },
      {
        heading: "6. Vos droits",
        paragraphs: [
          "Pour toute question relative à la confidentialité, contactez-nous à contact@bubbleappstudio.xyz. Pour la gestion des achats et des abonnements, reportez-vous à l’App Store."
        ]
      },
      {
        heading: "7. Modifications",
        paragraphs: [
          "Nous pouvons mettre à jour cette politique de temps à autre. La version en ligne fait foi."
        ]
      }
    ]
  },
  en: {
    metaTitle: "Privacy Policy | Werewolf Undercover",
    metaDescription: "Privacy Policy for Werewolf Undercover.",
    skipLinkLabel: "Skip to content",
    localeSwitcherLabel: "Choose language",
    kicker: "Werewolf Undercover",
    title: "Privacy Policy",
    updatedLabel: "Last updated",
    updatedAt: "February 9, 2026",
    sections: [
      {
        heading: "1. Data controller",
        paragraphs: ["Bubble App Studio — contact@bubbleappstudio.xyz"]
      },
      {
        heading: "2. Data we collect",
        paragraphs: [
          "We do not operate any servers and we do not collect or store personal data. The app does not require you to create an account."
        ]
      },
      {
        heading: "3. Purchases and third-party services",
        paragraphs: [
          "Payments are processed by Apple. To validate Premium access and restore purchases, we use RevenueCat. These services process purchase and subscription data necessary to provide the service."
        ]
      },
      {
        heading: "4. How we use data",
        paragraphs: ["We use data only to:"],
        list: [
          "Provide Premium access and restore your purchases.",
          "Ensure the app works properly."
        ]
      },
      {
        heading: "5. Retention",
        paragraphs: [
          "We do not retain personal data. Purchase-related data is retained by Apple and RevenueCat under their respective policies."
        ]
      },
      {
        heading: "6. Your rights",
        paragraphs: [
          "For privacy questions, contact us at contact@bubbleappstudio.xyz. For purchase and subscription management, refer to the App Store."
        ]
      },
      {
        heading: "7. Changes",
        paragraphs: ["We may update this policy from time to time. The online version prevails."]
      }
    ]
  },
  es: {
    metaTitle: "Política de privacidad | Hombre lobo Undercover",
    metaDescription: "Política de privacidad de Hombre lobo Undercover.",
    skipLinkLabel: "Ir al contenido",
    localeSwitcherLabel: "Elegir idioma",
    kicker: "Hombre lobo Undercover",
    title: "Política de privacidad",
    updatedLabel: "Última actualización",
    updatedAt: "9 de febrero de 2026",
    sections: [
      {
        heading: "1. Responsable del tratamiento",
        paragraphs: ["Bubble App Studio — contact@bubbleappstudio.xyz"]
      },
      {
        heading: "2. Datos que recopilamos",
        paragraphs: [
          "No operamos ningún servidor y no recopilamos ni almacenamos datos personales. La aplicación no requiere la creación de una cuenta."
        ]
      },
      {
        heading: "3. Compras y servicios de terceros",
        paragraphs: [
          "Los pagos son procesados por Apple. Para validar el acceso Premium y restaurar las compras, utilizamos RevenueCat. Estos servicios procesan los datos de compra y suscripción necesarios para prestar el servicio."
        ]
      },
      {
        heading: "4. Cómo usamos los datos",
        paragraphs: ["Usamos los datos solo para:"],
        list: [
          "Proporcionar el acceso Premium y restaurar tus compras.",
          "Garantizar el correcto funcionamiento de la aplicación."
        ]
      },
      {
        heading: "5. Conservación",
        paragraphs: [
          "No conservamos datos personales. Los datos relacionados con las compras son conservados por Apple y RevenueCat conforme a sus propias políticas."
        ]
      },
      {
        heading: "6. Tus derechos",
        paragraphs: [
          "Para cualquier cuestión sobre privacidad, contáctanos en contact@bubbleappstudio.xyz. Para la gestión de compras y suscripciones, consulta el App Store."
        ]
      },
      {
        heading: "7. Cambios",
        paragraphs: [
          "Podemos actualizar esta política ocasionalmente. La versión publicada en línea prevalece."
        ]
      }
    ]
  },
  de: {
    metaTitle: "Datenschutzerklärung | Werwolf Undercover",
    metaDescription: "Datenschutzerklärung für Werwolf Undercover.",
    skipLinkLabel: "Zum Inhalt springen",
    localeSwitcherLabel: "Sprache wählen",
    kicker: "Werwolf Undercover",
    title: "Datenschutzerklärung",
    updatedLabel: "Zuletzt aktualisiert",
    updatedAt: "9. Februar 2026",
    sections: [
      {
        heading: "1. Verantwortlicher",
        paragraphs: ["Bubble App Studio — contact@bubbleappstudio.xyz"]
      },
      {
        heading: "2. Welche Daten wir erfassen",
        paragraphs: [
          "Wir betreiben keine Server und erfassen oder speichern keine personenbezogenen Daten. Für die App ist kein Benutzerkonto erforderlich."
        ]
      },
      {
        heading: "3. Käufe und Drittanbieterdienste",
        paragraphs: [
          "Zahlungen werden von Apple verarbeitet. Um Premium-Zugänge zu bestätigen und Käufe wiederherzustellen, nutzen wir RevenueCat. Diese Dienste verarbeiten die Kauf- und Abonnementdaten, die für die Bereitstellung des Dienstes erforderlich sind."
        ]
      },
      {
        heading: "4. Wie wir Daten verwenden",
        paragraphs: ["Wir verwenden Daten nur, um:"],
        list: [
          "Premium-Zugänge bereitzustellen und Käufe wiederherzustellen.",
          "Die ordnungsgemäße Funktion der App sicherzustellen."
        ]
      },
      {
        heading: "5. Speicherung",
        paragraphs: [
          "Wir speichern keine personenbezogenen Daten. Kaufbezogene Daten werden von Apple und RevenueCat gemäß deren jeweiligen Richtlinien gespeichert."
        ]
      },
      {
        heading: "6. Ihre Rechte",
        paragraphs: [
          "Bei Fragen zum Datenschutz kontaktieren Sie uns unter contact@bubbleappstudio.xyz. Für die Verwaltung von Käufen und Abonnements wenden Sie sich bitte an den App Store."
        ]
      },
      {
        heading: "7. Änderungen",
        paragraphs: [
          "Wir können diese Erklärung von Zeit zu Zeit aktualisieren. Maßgeblich ist die online veröffentlichte Version."
        ]
      }
    ]
  }
};

export const termsPageContent: Record<Locale, LegalPageContent> = {
  fr: {
    metaTitle: "Conditions d’utilisation | Loup-garou Undercover",
    metaDescription: "Conditions d’utilisation de Loup-garou Undercover.",
    skipLinkLabel: "Aller au contenu",
    localeSwitcherLabel: "Choisir la langue",
    kicker: "Loup-garou Undercover",
    title: "Conditions d’utilisation",
    updatedLabel: "Dernière mise à jour",
    updatedAt: "9 février 2026",
    sections: [
      {
        heading: "1. Éditeur",
        paragraphs: ["Bubble App Studio — contact@bubbleappstudio.xyz"]
      },
      {
        heading: "2. Accès à l’application",
        paragraphs: [
          "L’application est fournie “en l’état”. Vous vous engagez à l’utiliser dans le respect des lois applicables."
        ]
      },
      {
        heading: "3. Achats intégrés",
        paragraphs: [
          "L’application propose un accès Premium via deux options :",
          "Le paiement est facturé sur votre identifiant Apple. Les abonnements se renouvellent automatiquement sauf résiliation au moins 24 heures avant la fin de la période en cours. Vous pouvez gérer ou annuler votre abonnement dans les réglages de l’App Store. En cas d’annulation, l’accès reste actif jusqu’à la fin de la période payée. Les prix sont affichés dans l’application et sur l’écran de paiement de l’App Store.",
          "Les remboursements sont gérés par Apple selon ses propres conditions."
        ],
        list: [
          "<strong>Premium Hebdo</strong> : abonnement hebdomadaire avec renouvellement automatique.",
          "<strong>Premium Annuel</strong> : abonnement annuel avec renouvellement automatique."
        ]
      },
      {
        heading: "4. Licence",
        paragraphs: [
          "Votre utilisation est également soumise au contrat de licence standard d’Apple : <a href='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' rel='noreferrer' target='_blank'>Standard EULA</a>."
        ]
      },
      {
        heading: "5. Confidentialité",
        paragraphs: [
          "La politique de confidentialité est disponible sur <a href='/privacy/'>/privacy/</a>."
        ]
      },
      {
        heading: "6. Modifications",
        paragraphs: [
          "Nous pouvons mettre à jour ces conditions à tout moment. La version en ligne fait foi."
        ]
      }
    ]
  },
  en: {
    metaTitle: "Terms of Use | Werewolf Undercover",
    metaDescription: "Terms of Use for Werewolf Undercover.",
    skipLinkLabel: "Skip to content",
    localeSwitcherLabel: "Choose language",
    kicker: "Werewolf Undercover",
    title: "Terms of Use",
    updatedLabel: "Last updated",
    updatedAt: "February 9, 2026",
    sections: [
      {
        heading: "1. Publisher",
        paragraphs: ["Bubble App Studio — contact@bubbleappstudio.xyz"]
      },
      {
        heading: "2. App access",
        paragraphs: [
          "The app is provided “as is”. You agree to use it in compliance with applicable laws."
        ]
      },
      {
        heading: "3. In-app purchases",
        paragraphs: [
          "The app offers Premium access via two options:",
          "Payment is charged to your Apple ID account. Subscriptions renew automatically unless canceled at least 24 hours before the end of the current period. You can manage or cancel your subscription in App Store settings. If you cancel, access remains active until the end of the paid period. Prices are shown in the app and on the App Store payment sheet.",
          "Refunds are handled by Apple under its own terms."
        ],
        list: [
          "<strong>Premium Weekly</strong>: weekly subscription with auto-renewal.",
          "<strong>Premium Yearly</strong>: yearly subscription with auto-renewal."
        ]
      },
      {
        heading: "4. License",
        paragraphs: [
          "Your use is also subject to Apple’s standard EULA: <a href='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' rel='noreferrer' target='_blank'>Standard EULA</a>."
        ]
      },
      {
        heading: "5. Privacy",
        paragraphs: [
          "The privacy policy is available at <a href='/en/privacy/'>/en/privacy/</a>."
        ]
      },
      {
        heading: "6. Changes",
        paragraphs: ["We may update these terms at any time. The online version prevails."]
      }
    ]
  },
  es: {
    metaTitle: "Términos de uso | Hombre lobo Undercover",
    metaDescription: "Términos de uso de Hombre lobo Undercover.",
    skipLinkLabel: "Ir al contenido",
    localeSwitcherLabel: "Elegir idioma",
    kicker: "Hombre lobo Undercover",
    title: "Términos de uso",
    updatedLabel: "Última actualización",
    updatedAt: "9 de febrero de 2026",
    sections: [
      {
        heading: "1. Editor",
        paragraphs: ["Bubble App Studio — contact@bubbleappstudio.xyz"]
      },
      {
        heading: "2. Acceso a la aplicación",
        paragraphs: [
          "La aplicación se proporciona “tal cual”. Te comprometes a usarla conforme a la legislación aplicable."
        ]
      },
      {
        heading: "3. Compras integradas",
        paragraphs: [
          "La aplicación ofrece acceso Premium mediante dos opciones:",
          "El pago se carga a tu cuenta de Apple ID. Las suscripciones se renuevan automáticamente salvo cancelación al menos 24 horas antes del final del período en curso. Puedes gestionar o cancelar la suscripción en los ajustes del App Store. Si cancelas, el acceso seguirá activo hasta el final del período pagado. Los precios se muestran en la aplicación y en la pantalla de pago del App Store.",
          "Los reembolsos son gestionados por Apple conforme a sus propias condiciones."
        ],
        list: [
          "<strong>Premium semanal</strong>: suscripción semanal con renovación automática.",
          "<strong>Premium anual</strong>: suscripción anual con renovación automática."
        ]
      },
      {
        heading: "4. Licencia",
        paragraphs: [
          "Tu uso también está sujeto al contrato de licencia estándar de Apple: <a href='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' rel='noreferrer' target='_blank'>Standard EULA</a>."
        ]
      },
      {
        heading: "5. Privacidad",
        paragraphs: [
          "La política de privacidad está disponible en <a href='/es/privacy/'>/es/privacy/</a>."
        ]
      },
      {
        heading: "6. Cambios",
        paragraphs: [
          "Podemos actualizar estos términos en cualquier momento. La versión publicada en línea prevalece."
        ]
      }
    ]
  },
  de: {
    metaTitle: "Nutzungsbedingungen | Werwolf Undercover",
    metaDescription: "Nutzungsbedingungen für Werwolf Undercover.",
    skipLinkLabel: "Zum Inhalt springen",
    localeSwitcherLabel: "Sprache wählen",
    kicker: "Werwolf Undercover",
    title: "Nutzungsbedingungen",
    updatedLabel: "Zuletzt aktualisiert",
    updatedAt: "9. Februar 2026",
    sections: [
      {
        heading: "1. Herausgeber",
        paragraphs: ["Bubble App Studio — contact@bubbleappstudio.xyz"]
      },
      {
        heading: "2. Zugriff auf die App",
        paragraphs: [
          "Die App wird „wie besehen“ bereitgestellt. Sie verpflichten sich, sie im Einklang mit den geltenden Gesetzen zu nutzen."
        ]
      },
      {
        heading: "3. In-App-Käufe",
        paragraphs: [
          "Die App bietet Premium-Zugang über zwei Optionen:",
          "Die Zahlung wird Ihrem Apple-ID-Konto belastet. Abonnements verlängern sich automatisch, sofern sie nicht mindestens 24 Stunden vor Ende des aktuellen Zeitraums gekündigt werden. Sie können Ihr Abonnement in den Einstellungen des App Store verwalten oder kündigen. Wenn Sie kündigen, bleibt der Zugang bis zum Ende des bezahlten Zeitraums aktiv. Die Preise werden in der App und auf dem Zahlungsbildschirm des App Store angezeigt.",
          "Rückerstattungen werden von Apple nach dessen eigenen Bedingungen bearbeitet."
        ],
        list: [
          "<strong>Premium Wöchentlich</strong>: wöchentliches Abonnement mit automatischer Verlängerung.",
          "<strong>Premium Jährlich</strong>: jährliches Abonnement mit automatischer Verlängerung."
        ]
      },
      {
        heading: "4. Lizenz",
        paragraphs: [
          "Ihre Nutzung unterliegt außerdem Apples Standard-EULA: <a href='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' rel='noreferrer' target='_blank'>Standard EULA</a>."
        ]
      },
      {
        heading: "5. Datenschutz",
        paragraphs: [
          "Die Datenschutzerklärung finden Sie unter <a href='/de/privacy/'>/de/privacy/</a>."
        ]
      },
      {
        heading: "6. Änderungen",
        paragraphs: [
          "Wir können diese Bedingungen jederzeit aktualisieren. Maßgeblich ist die online veröffentlichte Version."
        ]
      }
    ]
  }
};
