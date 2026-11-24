// Pharmacie du cabinet : stock de médicaments et de vaccins, mouvements, et soins donnés à un animal.
import { randomUUID } from 'node:crypto'
import { Router, type Response } from 'express'
import { z } from 'zod'
import { Fiche, Mouvement, Produit, typesProduit } from './models.js'

export const pharmacie = Router()

const isId = (v: unknown): v is string => typeof v === 'string' && /^[a-f0-9]{24}$/i.test(v)
const arrondi = (n: number) => Math.round(n * 100) / 100
const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function parse<T extends z.ZodTypeAny>(schema: T, body: unknown, res: Response): z.infer<T> | null {
  const r = schema.safeParse(body)
  if (r.success) return r.data
  res.status(400).json({ error: r.error.issues[0]?.message ?? 'Données invalides' })
  return null
}

const str = (max: number) => z.string().trim().max(max).default('')
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide').or(z.literal('')).default('')
const nombre = (msg: string) => z.coerce.number({ invalid_type_error: msg }).finite(msg).min(0, msg).max(1_000_000, msg)
const quantite = z.coerce.number({ invalid_type_error: 'Quantité invalide' }).finite().gt(0, 'La quantité doit être supérieure à 0').max(100_000, 'Quantité trop grande')

const produitSchema = z.object({
  type: z.enum(typesProduit, { errorMap: () => ({ message: 'Type de produit invalide' }) }).default('Médicament'),
  nom: z.string({ required_error: 'Le nom du produit est obligatoire' }).trim().min(1, 'Le nom du produit est obligatoire').max(100),
  protege: str(120),
  especes: str(40).transform((s) => s || 'Tous'),
  quantite: nombre('Quantité invalide').default(0),
  unite: str(20).transform((s) => s || 'unité'),
  seuil: nombre('Seuil invalide').default(0),
  peremption: day,
  lot: str(40),
  prix: nombre('Prix invalide').default(0),
  note: str(500),
})

const mouvementSchema = z.object({
  type: z.enum(['entree', 'sortie']),
  quantite,
  note: str(300),
  lot: str(40),
  peremption: day,
})

const soinSchema = z.object({
  produitId: z.string().refine(isId, 'Produit invalide'),
  quantite,
  note: str(200),
  rappel: day,
})

pharmacie.get('/produits', async (_req, res) => {
  res.json(await Produit.find().sort({ nom: 1 }).limit(2000))
})

pharmacie.post('/produits', async (req, res) => {
  const data = parse(produitSchema, req.body, res)
  if (!data) return
  const p = await Produit.create({ ...data, quantite: arrondi(data.quantite) })
  if (p.quantite > 0) await Mouvement.create({ produit: p._id, produitNom: p.nom, type: 'entree', quantite: p.quantite, stockApres: p.quantite, lot: p.lot, note: 'Stock de départ' })
  res.status(201).json(p)
})

pharmacie.put('/produits/:id', async (req, res) => {
  if (!isId(req.params.id)) { res.status(404).json({ error: 'Produit introuvable' }); return }
  const data = parse(produitSchema, req.body, res)
  if (!data) return
  const avant = await Produit.findById(req.params.id)
  if (!avant) { res.status(404).json({ error: 'Produit introuvable' }); return }
  const q = arrondi(data.quantite)
  const p = await Produit.findByIdAndUpdate(req.params.id, { $set: { ...data, quantite: q } }, { new: true, runValidators: true })
  if (p && q !== avant.quantite) {
    await Mouvement.create({ produit: p._id, produitNom: p.nom, type: 'ajustement', quantite: arrondi(q - avant.quantite), stockApres: q, lot: p.lot, note: 'Correction du stock' })
  }
  res.json(p)
})

pharmacie.delete('/produits/:id', async (req, res) => {
  if (!isId(req.params.id)) { res.status(404).json({ error: 'Produit introuvable' }); return }
  const p = await Produit.findByIdAndDelete(req.params.id)
  if (!p) { res.status(404).json({ error: 'Produit introuvable' }); return }
  res.json({ ok: true })
})

// Entrée (réception d'une commande) ou sortie (perte, casse, périmé…) de stock
pharmacie.post('/produits/:id/mouvement', async (req, res) => {
  if (!isId(req.params.id)) { res.status(404).json({ error: 'Produit introuvable' }); return }
  const d = parse(mouvementSchema, req.body, res)
  if (!d) return
  const q = arrondi(d.quantite)
  let p
  if (d.type === 'entree') {
    const set: Record<string, string> = {}
    if (d.lot) set.lot = d.lot
    if (d.peremption) set.peremption = d.peremption
    p = await Produit.findByIdAndUpdate(req.params.id, { $inc: { quantite: q }, ...(Object.keys(set).length ? { $set: set } : {}) }, { new: true })
  } else {
    // La condition garantit que le stock ne devient jamais négatif, même avec deux clics en même temps
    p = await Produit.findOneAndUpdate({ _id: req.params.id, quantite: { $gte: q } }, { $inc: { quantite: -q } }, { new: true })
    if (!p) {
      const existe = await Produit.exists({ _id: req.params.id })
      res.status(existe ? 409 : 404).json({ error: existe ? 'Stock insuffisant' : 'Produit introuvable' })
      return
    }
  }
  if (!p) { res.status(404).json({ error: 'Produit introuvable' }); return }
  await Mouvement.create({ produit: p._id, produitNom: p.nom, type: d.type, quantite: q, stockApres: arrondi(p.quantite), lot: d.lot || p.lot, note: d.note })
  res.json(p)
})

pharmacie.get('/produits/:id/mouvements', async (req, res) => {
  if (!isId(req.params.id)) { res.status(404).json({ error: 'Produit introuvable' }); return }
  res.json(await Mouvement.find({ produit: req.params.id }).sort({ createdAt: -1 }).limit(60))
})

// Soin donné à un animal : retire du stock ET inscrit le soin dans l'historique de la fiche
pharmacie.post('/fiches/:id/soins', async (req, res) => {
  if (!isId(req.params.id)) { res.status(404).json({ error: 'Fiche introuvable' }); return }
  const d = parse(soinSchema, req.body, res)
  if (!d) return
  const fiche = await Fiche.findById(req.params.id)
  if (!fiche) { res.status(404).json({ error: 'Fiche introuvable' }); return }
  const q = arrondi(d.quantite)
  const p = await Produit.findOneAndUpdate({ _id: d.produitId, quantite: { $gte: q } }, { $inc: { quantite: -q } }, { new: true })
  if (!p) {
    const existe = await Produit.exists({ _id: d.produitId })
    res.status(existe ? 409 : 404).json({ error: existe ? 'Stock insuffisant' : 'Produit introuvable' })
    return
  }
  try {
    const date = today()
    const nomVaccin = (p.protege || p.nom).slice(0, 100)
    const nomMedic = `${p.nom}${d.note ? ` – ${d.note}` : ''}`.slice(0, 120)
    const lotTxt = p.lot ? `Lot ${p.lot}` : ''
    let v = fiche.visites.find((x) => x.date === date)
    if (!v) {
      fiche.visites.push({ id: randomUUID(), date, motifs: [], vaccins: [], medicaments: [], rappel: '', note: '' })
      v = fiche.visites[fiche.visites.length - 1]!
    }
    if (p.type === 'Vaccin') {
      if (!v.vaccins.includes(nomVaccin)) v.vaccins.push(nomVaccin)
      if (!v.motifs.includes('Vaccination')) v.motifs.push('Vaccination')
      if (d.rappel) v.rappel = d.rappel
      if (lotTxt && !v.note.includes(lotTxt)) v.note = `${v.note ? v.note + '\n' : ''}${p.nom} – ${lotTxt}`.slice(0, 2000)
    } else if (!v.medicaments.includes(nomMedic)) {
      v.medicaments.push(nomMedic)
    }
    fiche.markModified('visites')
    await fiche.save()
    await Mouvement.create({ produit: p._id, produitNom: p.nom, type: 'sortie', quantite: q, stockApres: arrondi(p.quantite), fiche: fiche._id, animal: fiche.animal, client: `${fiche.nom} ${fiche.prenom}`.trim(), lot: p.lot, note: d.note || 'Soin donné' })
  } catch (e) {
    await Produit.findByIdAndUpdate(p._id, { $inc: { quantite: q } }) // on remet le stock si la fiche n'a pas pu être mise à jour
    throw e
  }
  res.json({ fiche, produit: p })
})
