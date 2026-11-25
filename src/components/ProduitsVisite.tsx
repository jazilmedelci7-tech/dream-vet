import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { etatPeremption, fmtQte, Produit, ProduitUtilise, Visite } from '../data'

/** Quantités utilisées par produit, toutes visites confondues. */
export const totauxProduits = (visites: Visite[]) => {
  const m = new Map<string, number>()
  for (const v of visites) for (const u of v.produits ?? []) m.set(u.produitId, Math.round(((m.get(u.produitId) ?? 0) + u.quantite) * 100) / 100)
  return m
}
const nomVaccin = (p: { nom: string; protege: string }) => (p.protege || p.nom).slice(0, 100)
const nomMedic = (p: { nom: string }, note: string) => `${p.nom}${note ? ` – ${note}` : ''}`.slice(0, 120)

/**
 * Choix des médicaments et vaccins dans la pharmacie, pour une visite.
 * Le stock baisse de la quantité choisie quand la fiche est enregistrée.
 */
export function ProduitsVisite({ visite, espece, avant, toutes, onChange }: {
  visite: Visite; espece: string; avant: Visite[]; toutes: Visite[]; onChange: (p: Partial<Visite>) => void
}) {
  const [produits, setProduits] = useState<Produit[] | null>(null)
  const [id, setId] = useState('')
  const [qte, setQte] = useState('1')
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => { api.produits().then(setProduits).catch(() => setProduits([])) }, [])

  const dejaAvant = useMemo(() => totauxProduits(avant), [avant])
  const dansForm = useMemo(() => totauxProduits(toutes), [toutes])
  /** Stock encore disponible = stock actuel + ce que cette fiche avait déjà pris − ce qu'elle prend maintenant. */
  const dispo = (p: Produit) => Math.round((p.quantite + (dejaAvant.get(p.id) ?? 0) - (dansForm.get(p.id) ?? 0)) * 100) / 100
  const choix = (produits ?? []).filter((p) => dispo(p) > 0 && etatPeremption(p.peremption) !== 'perime' && (p.especes === 'Tous' || !espece || p.especes.split('/').map((x) => x.trim()).includes(espece)))
  const p = choix.find((x) => x.id === id)
  const liste = visite.produits ?? []

  const ajouter = () => {
    if (!p) return
    const n = parseFloat(qte.replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) { setErr('Indique une quantité valide.'); return }
    if (n > dispo(p)) { setErr(`Il ne reste que ${fmtQte(dispo(p))} ${p.unite} en stock.`); return }
    setErr('')
    const deja = liste.find((u) => u.produitId === p.id && u.note === note.trim())
    const produitsNew: ProduitUtilise[] = deja
      ? liste.map((u) => (u === deja ? { ...u, quantite: Math.round((u.quantite + n) * 100) / 100 } : u))
      : [...liste, { produitId: p.id, nom: p.nom, type: p.type, unite: p.unite, quantite: n, note: note.trim() }]
    const patch: Partial<Visite> = { produits: produitsNew }
    if (p.type === 'Vaccin') {
      if (!visite.vaccins.includes(nomVaccin(p))) patch.vaccins = [...visite.vaccins, nomVaccin(p)]
      if (!visite.motifs.includes('Vaccination')) patch.motifs = [...visite.motifs, 'Vaccination']
    } else if (!visite.medicaments.includes(nomMedic(p, note.trim()))) patch.medicaments = [...visite.medicaments, nomMedic(p, note.trim())]
    onChange(patch)
    setId(''); setQte('1'); setNote('')
  }
  const retirer = (u: ProduitUtilise) => {
    const reste = liste.filter((x) => x !== u)
    const patch: Partial<Visite> = { produits: reste }
    if (u.type === 'Vaccin') {
      const prod = produits?.find((x) => x.id === u.produitId)
      const nom = prod ? nomVaccin(prod) : u.nom
      if (!reste.some((x) => x.produitId === u.produitId)) patch.vaccins = visite.vaccins.filter((x) => x !== nom && x !== u.nom)
    } else if (!reste.some((x) => x.produitId === u.produitId && x.note === u.note)) patch.medicaments = visite.medicaments.filter((x) => x !== nomMedic(u, u.note))
    onChange(patch)
  }

  return (
    <div className="mt-3 rounded-xl border border-brand-line bg-brand-light/40 p-3.5">
      <p className="label">Médicaments et vaccins de la pharmacie</p>
      <p className="mb-3 text-sm text-brand-muted">Choisis le produit et la quantité : le stock de la pharmacie baisse tout seul quand tu enregistres la fiche.</p>
      {liste.length > 0 && (
        <ul className="mb-3 grid gap-1.5">
          {liste.map((u, i) => (
            <li key={i} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm">
              <span><b>{u.nom}</b> · {fmtQte(u.quantite)} {u.unite}{u.note && <span className="text-brand-muted"> · {u.note}</span>}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => retirer(u)}>Retirer</button>
            </li>
          ))}
        </ul>
      )}
      {!produits && <p className="text-sm text-brand-muted">Chargement de la pharmacie…</p>}
      {produits && choix.length === 0 && <p className="text-sm text-brand-muted">Aucun produit disponible en stock{espece ? ` pour ${espece}` : ''}. Ajoute du stock dans « Pharmacie ».</p>}
      {produits && choix.length > 0 && (
        <div className="grid gap-2.5 sm:grid-cols-[1.4fr_90px_1.2fr_auto] sm:items-end">
          <div><label className="label" htmlFor={`pp${visite.id}`}>Produit</label>
            <select id={`pp${visite.id}`} className="input" value={id} onChange={(e) => { setId(e.target.value); setErr('') }}>
              <option value="">Choisir…</option>
              {choix.map((x) => <option key={x.id} value={x.id}>{x.nom} ({fmtQte(dispo(x))} {x.unite})</option>)}
            </select></div>
          <div><label className="label" htmlFor={`pq${visite.id}`}>Quantité{p ? ` (${p.unite})` : ''}</label><input id={`pq${visite.id}`} className="input" inputMode="decimal" value={qte} onChange={(e) => setQte(e.target.value)} /></div>
          <div><label className="label" htmlFor={`pn${visite.id}`}>Dose (facultatif)</label><input id={`pn${visite.id}`} className="input" maxLength={200} placeholder="Ex : 2×/jour, 7 jours" value={note} onChange={(e) => setNote(e.target.value)} /></div>
          <button type="button" className="btn btn-primary disabled:opacity-60" disabled={!p} onClick={ajouter}>Ajouter</button>
        </div>
      )}
      {err && <p role="alert" className="mt-2 font-bold text-red-700">{err}</p>}
    </div>
  )
}
