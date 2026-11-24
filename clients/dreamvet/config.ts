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
  accroche: 'Des soins au service de vos animaux',
  indicatifPays: '213',
  couleur: '#1F5FAE',
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
    { title: 'Radiologie', icon: 'radio', text: "Radiographies sur place pour un diagnostic rapide et précis.", points: ['Os, thorax, abdomen', 'Résultat le jour même', 'Images conservées dans la fiche'] },
    { title: 'Chirurgie', icon: 'chirurgie', text: 'Interventions programmées ou urgentes, avec suivi après l\'opération.', points: ['Stérilisation et castration', 'Chirurgie des tissus mous', "Contrôle après l'opération"] },
    { title: 'Gardiennage', icon: 'gardiennage', text: 'Votre animal est gardé dans de bonnes conditions pendant votre absence.', points: ['Espace propre et sécurisé', 'Surveillance par l\'équipe', 'Nouvelles sur demande'] },
    { title: 'Hospitalisation', icon: 'hospitalisation', text: 'Surveillance et soins continus pour les animaux qui en ont besoin.', points: ['Perfusion et traitements', 'Suivi quotidien', 'Vous êtes tenu informé'] },
    { title: 'Vaccination', icon: 'vaccin', text: "Vaccins et rappels selon l'espèce et l'âge, notés dans la fiche.", points: ['Chiens : CHPPi, leptospirose, rage, leishmaniose', 'Chats : CHLP, rage', 'Rappels envoyés au bon moment'] },
    { title: 'Bien-être animal', icon: 'bienetre', text: "Conseils et soins pour que votre compagnon vive bien et longtemps.", points: ['Alimentation adaptée', 'Vermifuge et anti-puces', 'Conseils au quotidien'] },
  ],
  avis: [],
}

export default config
