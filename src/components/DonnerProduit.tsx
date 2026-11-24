import { FormEvent, useEffect, useState } from 'react'
import { api, errMsg } from '../api'
import { addToDate, etatPeremption, Fiche, fmt, fmtQte, Produit, todayLocal } from '../data'
import { Modal, useToast } from '../ui'

/** Donner un médicament ou un vaccin du stock à un animal : le stock baisse et le soin s'inscrit dans la fiche. */
export function DonnerProduit({ fiche, onDone, onClose }: { fiche: Fiche; onDone: () => void; onClose: () => void }) {
  const toast = useToast()
  const [produits, setProduits] = useState<Produit[] | null>(null)
  const [id, setId] = useState('')
  const [qte, setQte] = useState('1')
  const [note, setNote] = useState('')
  const [rappel, setRappel] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    api.produits().then((l) => setProduits(l.filter((p) => p.quantite > 0 && etatPeremption(p.peremption) !== 'perime' && (p.especes === 'Tous' || !fiche.espece || p.especes === fiche.espece)))).catch((e) => setErr(errMsg(e)))
  }, [fiche.espece])
  const p = produits?.find((x) => x.id === id)

  const submit = async (e: FormEvent) => {
    e.preventDefault(); if (!p) return
    const n = parseFloat(qte.replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) { setErr('Indique une quantité valide.'); return }
    setBusy(true); setErr('')
    try { await api.donnerSoin(fiche.id, { produitId: p.id, quantite: n, note, rappel }); toast(`${p.nom} ajouté à la fiche`); onDone() } catch (x) { setErr(errMsg(x)); setBusy(false) }
  }
  return (
    <Modal title={`Donner un produit à ${fiche.animal}`} onClose={onClose}>
      {!produits && !err && <p className="text-brand-muted">Chargement…</p>}
      {produits && produits.length === 0 && <p className="text-brand-muted">Aucun produit disponible en stock pour {fiche.espece || 'cet animal'}. Ajoute du stock dans « Pharmacie ».</p>}
      {produits && produits.length > 0 && (
        <form onSubmit={submit} className="grid gap-3.5">
          <div><label className="label" htmlFor="dp-p">Produit</label>
            <select id="dp-p" className="input" required value={id} onChange={(e) => { setId(e.target.value); setRappel('') }}>
              <option value="">Choisir…</option>
              {produits.map((x) => <option key={x.id} value={x.id}>{x.nom} ({fmtQte(x.quantite)} {x.unite})</option>)}
            </select></div>
          {p && <>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div><label className="label" htmlFor="dp-q">Quantité ({p.unite})</label><input id="dp-q" className="input" inputMode="decimal" required value={qte} onChange={(e) => setQte(e.target.value)} /></div>
              <div><label className="label" htmlFor="dp-n">Dose / posologie (facultatif)</label><input id="dp-n" className="input" maxLength={200} placeholder="Ex : 1 comprimé matin et soir, 5 jours" value={note} onChange={(e) => setNote(e.target.value)} /></div>
            </div>
            {p.type === 'Vaccin' && (
              <div><label className="label" htmlFor="dp-r">Date du prochain rappel</label>
                <input id="dp-r" type="date" className="input" min={todayLocal()} value={rappel} onChange={(e) => setRappel(e.target.value)} />
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRappel(addToDate(todayLocal(), { days: 21 }))}>Dans 3 semaines</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRappel(addToDate(todayLocal(), { months: 12 }))}>Dans 1 an</button>
                </div>
                {rappel && <p className="mt-1 text-sm text-brand-muted">Le rappel apparaîtra dans « Rappels » le {fmt(rappel)}.</p>}
              </div>
            )}
            {p.peremption && <p className="text-sm text-brand-muted">Péremption du produit : {fmt(p.peremption)}{p.lot && ` · lot ${p.lot}`}</p>}
          </>}
          {err && <p role="alert" className="font-bold text-red-700">{err}</p>}
          <div className="flex gap-3"><button className="btn btn-primary disabled:opacity-60" disabled={busy || !p}>{busy ? 'Enregistrement…' : 'Valider'}</button><button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button></div>
        </form>
      )}
      {err && !produits && <p role="alert" className="font-bold text-red-700">{err}</p>}
    </Modal>
  )
}
