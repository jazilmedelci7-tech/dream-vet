// RÉGLAGES DU CLIENT « dreamvet » : Clinique Vétérinaire DreamVet.
// Construire le site avec  CLIENT=dreamvet  (voir VENDRE.md).

import type { SiteConfig } from '../../src/siteTypes'

const horaires = [
  { jours: 'Samedi – Jeudi', heures: '9h – 22h' },
  { jours: 'Vendredi', heures: '10h – 12h · 15h – 22h' },
]

const config: SiteConfig = {
  titre: 'Clinique Vétérinaire DreamVet',
  nom: 'Clinique Vétérinaire DreamVet',
  signature: 'la clinique vétérinaire DreamVet',
  ville: 'Alger', // À CONFIRMER
  logoLarge: true,
  accroche: 'Vos compagnons méritent le meilleur',
  indicatifPays: '213',
  couleur: '#0C6FB0',
  cabinets: [
    {
      id: 'dreamvet',
      nom: 'Clinique vétérinaire DreamVet',
      court: 'DreamVet',
      adresse: 'Adresse de la clinique, Alger', // À REMPLACER par l'adresse exacte (voir Google Maps)
      telephone: '0552 77 69 46',
      email: '',
      horaires,
      carte: 'Clinique vétérinaire DreamVet', // À REMPLACER : adresse ou nom tel qu'il apparaît sur Google Maps
    },
  ],
  services: [
    { title: 'Radiologie', icon: 'radio', text: 'Radiographies pour voir ce qui se passe sous la peau et poser un diagnostic fiable.', points: ['Os, thorax, abdomen', 'Images gardées dans la fiche', 'Expliquées simplement au propriétaire'] },
    { title: 'Chirurgie', icon: 'chirurgie', text: 'Interventions programmées ou urgentes, avec un suivi après l\'opération.', points: ['Stérilisation et castration', 'Chirurgie des tissus mous', 'Contrôle après l\'opération'] },
    { title: 'Gardiennage', icon: 'gardiennage', text: 'Vous partez quelques jours ? Votre animal est gardé à la clinique.', points: ['Renseignez-vous sur les places disponibles', 'Précisez son alimentation et ses habitudes', 'Appelez-nous pour réserver'] },
    { title: 'Hospitalisation', icon: 'hospitalisation', text: 'Pour les animaux qui ont besoin de soins et de surveillance dans la durée.', points: ['Traitements et perfusions', 'Suivi médical par le vétérinaire', 'Nous restons en contact avec vous'] },
    { title: 'Vaccination', icon: 'vaccin', text: 'Protégez votre animal avec les vaccins adaptés à son espèce et à son âge.', points: ['Chiens : CHPPi, leptospirose, rage, leishmaniose', 'Chats : CHLP, rage', 'Carnet de rappels dans la fiche'] },
    { title: 'Bien-être animal', icon: 'bienetre', text: 'Alimentation, hygiène, parasites : les bons réflexes pour qu\'il vive longtemps en pleine forme.', points: ['Vermifuge et anti-puces', 'Conseils d\'alimentation', 'Questions de comportement'] },
  ],
  avis: [],
}

export default config
