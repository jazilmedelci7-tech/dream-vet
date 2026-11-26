import mongoose, { Schema } from 'mongoose'

const toJSON = {
  versionKey: false,
  transform(_doc: unknown, ret: Record<string, unknown>) {
    ret.id = String(ret._id)
    delete ret._id
    return ret
  },
}

/** Produit de la pharmacie utilisé pendant une visite : le stock baisse de cette quantité à l'enregistrement. */
const produitUtiliseSchema = new Schema(
  {
    produitId: { type: String, required: true },
    nom: { type: String, default: '' },
    type: { type: String, default: '' },
    unite: { type: String, default: '' },
    quantite: { type: Number, required: true },
    note: { type: String, default: '' },
  },
  { _id: false },
)

/** Un rappel à faire (ex. « CRP-RH » dans 1 an, « CRP » dans 1 mois) : une visite peut en avoir plusieurs. */
const rappelSchema = new Schema(
  {
    id: { type: String, required: true },
    date: { type: String, default: '' },
    libelle: { type: String, default: '' },
    fait: { type: Boolean, default: false },
  },
  { _id: false },
)

const visiteSchema = new Schema(
  {
    id: { type: String, required: true },
    date: { type: String, default: '' },
    motifs: { type: [String], default: [] },
    vaccins: { type: [String], default: [] },
    medicaments: { type: [String], default: [] },
    produits: { type: [produitUtiliseSchema], default: [] },
    rappel: { type: String, default: '' },
    rappels: { type: [rappelSchema], default: [] },
    note: { type: String, default: '' },
  },
  { _id: false },
)

const imageSchema = new Schema(
  {
    id: { type: String, required: true },
    file: { type: String, required: true },
    type: { type: String, default: 'Radiographie' },
    legende: { type: String, default: '' },
    date: { type: String, default: '' },
  },
  { _id: false },
)

const ficheSchema = new Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, default: '' },
    age: { type: String, default: '' },
    telephone: { type: String, default: '' },
    adresse: { type: String, default: '' },
    animal: { type: String, required: true },
    espece: { type: String, default: '' },
    precision: { type: String, default: '' },
    race: { type: String, default: '' },
    sexe: { type: String, default: '' },
    sterilise: { type: String, default: '' },
    ageAnimal: { type: String, default: '' },
    naissance: { type: String, default: '' },
    poids: { type: String, default: '' },
    robe: { type: String, default: '' },
    puce: { type: String, default: '' },
    tatouage: { type: String, default: '' },
    agressif: { type: Boolean, default: false },
    dus: { type: String, default: '' },
    paye: { type: String, default: '' },
    dusNote: { type: String, default: '' },
    antecedents: { type: [String], default: [] },
    antecedentsNote: { type: String, default: '' },
    images: { type: [imageSchema], default: [] },
    visites: { type: [visiteSchema], default: [] },
  },
  { timestamps: true, toJSON },
)
ficheSchema.index({ nom: 1 })
ficheSchema.index({ animal: 1 })
ficheSchema.index({ updatedAt: -1 })

const rdvSchema = new Schema(
  {
    nom: { type: String, required: true },
    telephone: { type: String, required: true },
    animal: { type: String, required: true },
    cabinet: { type: String, maxlength: 40, default: '' },
    date: { type: String, default: '' },
    message: { type: String, default: '' },
    statut: { type: String, enum: ['nouvelle', 'confirmée', 'refusée'], default: 'nouvelle' },
  },
  { timestamps: true, toJSON },
)
rdvSchema.index({ createdAt: -1 })

const adminSchema = new Schema({ passwordHash: { type: String, required: true } }, { timestamps: true })
const settingSchema = new Schema({ key: { type: String, unique: true, required: true }, value: { type: String, required: true } })

// Images stockées dans la base (le disque de l'hébergeur gratuit est effacé à chaque redémarrage). _id = nom de fichier.
const imageDataSchema = new Schema({ _id: { type: String, required: true }, mime: { type: String, required: true }, data: { type: Buffer, required: true } }, { timestamps: true })

export const typesProduit = ['Médicament', 'Vaccin', 'Antiparasitaire', 'Consommable', 'Autre'] as const

// Stock de la pharmacie du cabinet : médicaments, vaccins, etc.
const produitSchema = new Schema(
  {
    type: { type: String, enum: typesProduit, default: 'Médicament' },
    nom: { type: String, required: true },
    protege: { type: String, default: '' }, // vaccin : maladies couvertes (ex. CHPPi) · médicament : principe actif
    especes: { type: String, default: 'Tous' },
    quantite: { type: Number, default: 0, min: 0 },
    unite: { type: String, default: 'unité' },
    seuil: { type: Number, default: 0, min: 0 }, // en dessous : alerte « stock bas »
    peremption: { type: String, default: '' },
    lot: { type: String, default: '' },
    prix: { type: Number, default: 0, min: 0 },
    note: { type: String, default: '' },
  },
  { timestamps: true, toJSON },
)
produitSchema.index({ nom: 1 })

// Historique du stock : entrées, sorties (dont les soins donnés à un animal) et corrections.
const mouvementSchema = new Schema(
  {
    produit: { type: Schema.Types.ObjectId, ref: 'Produit', required: true, index: true },
    produitNom: { type: String, default: '' },
    type: { type: String, enum: ['entree', 'sortie', 'ajustement'], required: true },
    quantite: { type: Number, required: true },
    stockApres: { type: Number, default: 0 },
    fiche: { type: Schema.Types.ObjectId, ref: 'Fiche', default: null },
    animal: { type: String, default: '' },
    client: { type: String, default: '' },
    lot: { type: String, default: '' },
    note: { type: String, default: '' },
  },
  { timestamps: true, toJSON },
)
mouvementSchema.index({ createdAt: -1 })

export const Fiche = mongoose.model('Fiche', ficheSchema)
export const Produit = mongoose.model('Produit', produitSchema)
export const Mouvement = mongoose.model('Mouvement', mouvementSchema)
export const ImageData = mongoose.model('ImageData', imageDataSchema)
export const Rdv = mongoose.model('Rdv', rdvSchema)
export const Admin = mongoose.model('Admin', adminSchema)
export const Setting = mongoose.model('Setting', settingSchema)
