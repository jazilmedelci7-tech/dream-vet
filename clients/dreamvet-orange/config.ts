// VERSION ORANGE de DreamVet (thème du logo orange). Même contenu que clients/dreamvet, autres couleurs et autre logo.
// Construire avec  CLIENT=dreamvet-orange

import type { SiteConfig } from '../../src/siteTypes'
import base from '../dreamvet/config'
import logoWide from './logo-wide.png'

const config: SiteConfig = {
  ...base,
  titre: 'Clinique Vétérinaire DreamVet',
  logoWide,
  couleur: '#D9701A',
  theme: { entete: '#F5983B', enteteTexte: '#43271A', sombre: '#43271A', accent: '#F5983B', chaud: '#F5983B' },
}

export default config
