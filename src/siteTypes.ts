// Forme du fichier de réglages d'un client (clients/<nom>/config.ts).
// Tu n'as normalement PAS besoin de modifier ce fichier.

export interface Cabinet {
  /** Identifiant court sans espace ni accent, ex. 'centre' ou 'annexe-nord' */
  id: string
  /** Nom complet affiché, ex. « Cabinet principal – Centre-ville » */
  nom: string
  /** Nom court, ex. « Centre-ville » */
  court: string
  /** Facultatif : lien Google Maps du cabinet (bouton « Itinéraire ») */
  lienCarte?: string
  adresse: string
  telephone: string
  email: string
  horaires: { jours: string; heures: string }[]
  /** Texte envoyé à Google Maps pour afficher la carte (en général l'adresse) */
  carte: string
}

export interface Service {
  title: string
  text: string
  points: string[]
  icon: 'consultation' | 'vaccin' | 'chirurgie' | 'radio' | 'echo' | 'imagerie' | 'dents' | 'identification' | 'dossier' | 'gardiennage' | 'hospitalisation' | 'bienetre'
  /** Photo facultative (dossier public/services du client). Sans photo : une illustration est affichée. */
  image?: string
}

export interface Avis { texte: string; auteur: string }

export interface SiteConfig {
  /** Titre de l'onglet du navigateur. Garde-le sur UNE seule ligne. */
  titre: string
  /** Nom affiché dans l'en-tête et dans les messages WhatsApp, ex. « Docteur Martin » */
  nom: string
  /** Le logo est une image large (nom + dessin) : l'en-tête l'affiche seule, sans répéter le nom */
  logoLarge?: boolean
  /** Adresse de l'image large du logo (import dans config.ts) ; sinon /logo-wide.png */
  logoWide?: string
  /** Facultatif : comment le cabinet se présente dans les messages WhatsApp (sinon le nom ci-dessus), ex. « le cabinet vétérinaire du Dr Martin » */
  signature?: string
  /** Ville ou région affichée sous le nom */
  ville: string
  /** Phrase d'accroche de la page d'accueil */
  accroche: string
  /** Indicatif du pays pour WhatsApp, sans « + » : '213' Algérie, '216' Tunisie, '212' Maroc, '33' France */
  indicatifPays: string
  /** Couleur principale du site (format #RRGGBB). Les autres teintes sont calculées. */
  couleur: string
  cabinets: Cabinet[]
  services: Service[]
  /** Avis de vrais clients. Liste vide = la section est masquée. */
  avis: Avis[]
}
