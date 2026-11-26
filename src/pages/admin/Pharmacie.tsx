import { FormEvent, useEffect, useMemo, useState } from 'react'
import { api, errMsg } from '../../api'
import { enAlerte, etatPeremption, etatStock, fmt, fmtQte, Mouvement, Produit, ProduitInput, todayLocal, typesProduit } from '../../data'
import { especes } from '../../animals'
import { Confirm, ErrorBox, Modal, useToast } from '../../ui'

const vide: ProduitInput = { type: 'Médicament', nom: '', protege: '', especes: 'Tous', quantite: 0, unite: 'unité', seuil: 0, peremption: '', lot: '', prix: 0, note: '' }
const unites = ['unité', 'dose', 'flacon', 'boîte', 'comprimé', 'ampoule', 'tube', 'ml']
const vaccinsCourants: ProduitInput[] = [
  { ...vide, type: 'Vaccin', nom: 'Vaccin CHPPi', protege: 'CHPPi', especes: 'Chien', unite: 'dose', seuil: 5 },
  { ...vide, type: 'Vaccin', nom: 'Vaccin Leptospirose', protege: 'Leptospirose', especes: 'Chien', unite: 'dose', seuil: 5 },
  { ...vide, type: 'Vaccin', nom: 'Vaccin Rage (chien)', protege: 'Rage', especes: 'Chien', unite: 'dose', seuil: 5 },
  { ...vide, type: 'Vaccin', nom: 'Vaccin Leishmaniose', protege: 'Leishmaniose', especes: 'Chien', unite: 'dose', seuil: 5 },
  { ...vide, type: 'Vaccin', nom: 'Vaccin CRP', protege: 'CRP', especes: 'Chat', unite: 'dose', seuil: 5 },
  { ...vide, type: 'Vaccin', nom: 'Vaccin Rage (chat)', protege: 'Rage', especes: 'Chat', unite: 'dose', seuil: 5 },
]
const nombre = (v: string) => { const n = parseFloat(v.replace(',', '.')); return Number.isFinite(n) && n >= 0 ? n : 0 }

function Badge({ tone, children }: { tone: 'red' | 'amber' | 'green' | 'gray'; children: string }) {
  const c = { red: 'bg-red-600 text-white', amber: 'bg-amber-500 text-white', green: 'bg-green-600 text-white', gray: 'bg-brand-line text-brand-dark' }[tone]
  return <span className={`whitespace-nowrap rounded px-2 py-0.5 text-xs font-bold ${c}`}>{children}</span>
}

function ProduitForm({ initial, onSave, onClose }: { initial: ProduitInput; onSave: (p: ProduitInput) => Promise<void>; onClose: () => void }) {
  const [p, setP] = useState(initial)
  const [qte, setQte] = useState(fmtQte(initial.quantite))
  const [seuil, setSeuil] = useState(fmtQte(initial.seuil))
  const [prix, setPrix] = useState(initial.prix ? String(initial.prix) : '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k: keyof ProduitInput) => (e: { target: { value: string } }) => setP({ ...p, [k]: e.target.value })
  const vaccins = [...new Set(especes.flatMap((e) => e.vaccins))]
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await onSave({ ...p, quantite: nombre(qte), seuil: nombre(seuil), prix: nombre(prix) }) } catch (x) { setErr(errMsg(x)) } finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} className="grid gap-3.5 sm:grid-cols-2">
      <div><label className="label" htmlFor="pr-type">Type</label><select id="pr-type" className="input" value={p.type} onChange={set('type')}>{typesProduit.map((t) => <option key={t}>{t}</option>)}</select></div>
      <div><label className="label" htmlFor="pr-nom">Nom du produit *</label><input id="pr-nom" className="input" required maxLength={100} value={p.nom} onChange={set('nom')} /></div>
      {p.type === 'Vaccin' ? (
        <div><label className="label" htmlFor="pr-prot">Vaccin contre</label><input id="pr-prot" className="input" list="pr-vaccins" maxLength={120} value={p.protege} onChange={set('protege')} placeholder="Ex : CHPPi" /><datalist id="pr-vaccins">{vaccins.map((v) => <option key={v} value={v} />)}</datalist></div>
      ) : (
        <div><label className="label" htmlFor="pr-prot">Principe actif (facultatif)</label><input id="pr-prot" className="input" maxLength={120} value={p.protege} onChange={set('protege')} /></div>
      )}
      <div><label className="label" htmlFor="pr-esp">Pour</label><select id="pr-esp" className="input" value={p.especes} onChange={set('especes')}><option>Tous</option>{especes.filter((e) => e.nom !== 'Autre').map((e) => <option key={e.nom}>{e.nom}</option>)}</select></div>
      <div><label className="label" htmlFor="pr-qte">Quantité en stock</label><input id="pr-qte" className="input" inputMode="decimal" value={qte} onChange={(e) => setQte(e.target.value)} /></div>
      <div><label className="label" htmlFor="pr-unite">Unité</label><input id="pr-unite" className="input" list="pr-unites" maxLength={20} value={p.unite} onChange={set('unite')} /><datalist id="pr-unites">{unites.map((u) => <option key={u} value={u} />)}</datalist></div>
      <div><label className="label" htmlFor="pr-seuil">Alerte quand il en reste moins de</label><input id="pr-seuil" className="input" inputMode="decimal" value={seuil} onChange={(e) => setSeuil(e.target.value)} /></div>
      <div><label className="label" htmlFor="pr-per">Date de péremption</label><input id="pr-per" type="date" className="input" value={p.peremption} onChange={set('peremption')} /></div>
      <div><label className="label" htmlFor="pr-lot">N° de lot</label><input id="pr-lot" className="input" maxLength={40} value={p.lot} onChange={set('lot')} /></div>
      <div><label className="label" htmlFor="pr-prix">Prix de vente (DA, facultatif)</label><input id="pr-prix" className="input" inputMode="decimal" value={prix} onChange={(e) => setPrix(e.target.value)} /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="pr-note">Remarque (facultatif)</label><textarea id="pr-note" rows={2} maxLength={500} className="input" value={p.note} onChange={set('note')} /></div>
      {err && <p role="alert" className="font-bold text-red-700 sm:col-span-2">{err}</p>}
      <div className="flex gap-3 sm:col-span-2"><button className="btn btn-primary disabled:opacity-60" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button><button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button></div>
    </form>
  )
}

function MouvementForm({ produit, type, onDone, onClose }: { produit: Produit; type: 'entree' | 'sortie'; onDone: (p: Produit) => void; onClose: () => void }) {
  const [qte, setQte] = useState('1')
  const [note, setNote] = useState('')
  const [lot, setLot] = useState('')
  const [per, setPer] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const entree = type === 'entree'
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { onDone(await api.mouvement(produit.id, { type, quantite: nombre(qte), note, lot, peremption: per })) } catch (x) { setErr(errMsg(x)); setBusy(false) }
  }
  return (
    <form onSubmit={submit} className="grid gap-3.5">
      <p className="text-sm text-brand-muted">Stock actuel : <b>{fmtQte(produit.quantite)} {produit.unite}</b></p>
      <div><label className="label" htmlFor="mv-q">{entree ? 'Quantité reçue' : 'Quantité retirée'}</label><input id="mv-q" className="input" inputMode="decimal" required autoFocus value={qte} onChange={(e) => setQte(e.target.value)} /></div>
      {entree && <div className="grid gap-3.5 sm:grid-cols-2">
        <div><label className="label" htmlFor="mv-lot">N° de lot (facultatif)</label><input id="mv-lot" className="input" maxLength={40} value={lot} onChange={(e) => setLot(e.target.value)} /></div>
        <div><label className="label" htmlFor="mv-per">Péremption (facultatif)</label><input id="mv-per" type="date" className="input" min={todayLocal()} value={per} onChange={(e) => setPer(e.target.value)} /></div>
      </div>}
      <div><label className="label" htmlFor="mv-note">{entree ? 'Remarque (ex. fournisseur)' : 'Raison (perte, périmé, casse…)'}</label><input id="mv-note" className="input" maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} /></div>
      {err && <p role="alert" className="font-bold text-red-700">{err}</p>}
      <div className="flex gap-3"><button className="btn btn-primary disabled:opacity-60" disabled={busy}>{entree ? 'Ajouter au stock' : 'Retirer du stock'}</button><button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button></div>
    </form>
  )
}

function Historique({ id }: { id: string }) {
  const [list, setList] = useState<Mouvement[] | null>(null)
  useEffect(() => { api.mouvements(id).then(setList).catch(() => setList([])) }, [id])
  if (!list) return <p className="text-sm text-brand-muted">Chargement…</p>
  if (!list.length) return <p className="text-sm text-brand-muted">Aucun mouvement.</p>
  const lbl = { entree: 'Entrée', sortie: 'Sortie', ajustement: 'Correction' }
  return (
    <ul className="grid gap-1 text-sm">
      {list.map((m) => (
        <li key={m.id} className="flex flex-wrap gap-x-3 border-t border-brand-line pt-1 first:border-0 first:pt-0">
          <span className="text-brand-muted">{fmt(m.createdAt.slice(0, 10))}</span>
          <b className={m.type === 'sortie' ? 'text-red-700' : m.type === 'entree' ? 'text-green-700' : ''}>{lbl[m.type]} {m.type === 'sortie' ? '−' : m.quantite > 0 ? '+' : ''}{fmtQte(Math.abs(m.quantite))}</b>
          <span>{m.animal ? `${m.animal}${m.client ? ` (${m.client})` : ''}` : m.note}</span>
          <span className="text-brand-muted">→ stock {fmtQte(m.stockApres)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Pharmacie() {
  const toast = useToast()
  const [list, setList] = useState<Produit[] | null>(null)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('Tous')
  const [alertes, setAlertes] = useState(false)
  const [edit, setEdit] = useState<Produit | 'new' | null>(null)
  const [mv, setMv] = useState<{ p: Produit; type: 'entree' | 'sortie' } | null>(null)
  const [del, setDel] = useState<Produit | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const charger = () => { setErr(''); api.produits().then(setList).catch((e) => setErr(errMsg(e))) }
  useEffect(charger, [])
  const remplace = (p: Produit) => setList((l) => (l ?? []).map((x) => (x.id === p.id ? p : x)))

  const vus = useMemo(() => {
    const n = q.trim().toLowerCase()
    return (list ?? []).filter((p) => (type === 'Tous' || p.type === type) && (!alertes || enAlerte(p)) && (!n || [p.nom, p.protege, p.lot, p.especes].join(' ').toLowerCase().includes(n)))
  }, [list, q, type, alertes])
  const nbAlertes = (list ?? []).filter(enAlerte).length
  const nbPerimes = (list ?? []).filter((p) => p.quantite > 0 && etatPeremption(p.peremption) === 'perime').length

  const save = async (d: ProduitInput) => {
    if (edit && edit !== 'new') remplace(await api.updateProduit(edit.id, d))
    else { const p = await api.createProduit(d); setList((l) => [...(l ?? []), p].sort((a, b) => a.nom.localeCompare(b.nom))) }
    setEdit(null); toast('Produit enregistré')
  }
  const supprimer = async () => { if (!del) return; try { await api.deleteProduit(del.id); setList((l) => (l ?? []).filter((x) => x.id !== del.id)); toast('Produit supprimé') } catch (e) { setErr(errMsg(e)) } setDel(null) }
  const ajouterVaccins = async () => {
    setBusy(true)
    try { for (const v of vaccinsCourants) await api.createProduit(v); charger(); toast('Vaccins ajoutés : indique maintenant leur stock') } catch (e) { setErr(errMsg(e)) } finally { setBusy(false) }
  }

  if (!list && !err) return <p className="text-brand-muted">Chargement de la pharmacie…</p>
  return (
    <div className="animate-fade-in">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold md:text-3xl">Pharmacie</h1>
        <button className="btn btn-primary" onClick={() => setEdit('new')}>+ Nouveau produit</button>
      </div>
      <p className="mb-6 text-brand-muted">Médicaments, vaccins et produits du cabinet : stock, péremption et historique.</p>
      {err && <ErrorBox message={err} onRetry={charger} />}

      {list && (
        <>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="card"><p className="text-sm text-brand-muted">Produits</p><p className="text-3xl font-extrabold">{list.length}</p></div>
            <button type="button" onClick={() => setAlertes((a) => !a)} className={`card text-left ${alertes ? 'ring-2 ring-amber-500' : ''}`}><p className="text-sm text-brand-muted">À surveiller (stock bas, péremption proche)</p><p className={`text-3xl font-extrabold ${nbAlertes ? 'text-amber-700' : ''}`}>{nbAlertes}</p></button>
            <div className="card"><p className="text-sm text-brand-muted">Périmés encore en stock</p><p className={`text-3xl font-extrabold ${nbPerimes ? 'text-red-700' : ''}`}>{nbPerimes}</p></div>
          </div>

          {!list.some((p) => p.type === 'Vaccin') && (
            <div className="card mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-xl text-sm">Pour commencer vite : ajoute les vaccins courants (chiens : CHPPi, leptospirose, rage, leishmaniose · chats : CRP, rage). Ils sont créés avec un stock de 0, tu indiques ensuite les quantités.</p>
              <button className="btn btn-ghost disabled:opacity-60" disabled={busy} onClick={() => void ajouterVaccins()}>{busy ? 'Ajout…' : 'Ajouter les vaccins courants'}</button>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {['Tous', ...typesProduit].map((t) => <button key={t} type="button" onClick={() => setType(t)} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${type === t ? 'border-brand bg-brand text-white' : 'border-brand-line bg-white hover:border-brand'}`}>{t}</button>)}
            <input aria-label="Rechercher un produit" className="input ml-auto max-w-xs" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          {vus.length === 0 && <div className="card text-center text-brand-muted">{list.length === 0 ? 'Aucun produit pour l\'instant. Clique sur « + Nouveau produit ».' : 'Aucun produit ne correspond.'}</div>}
          <div className="grid gap-3">
            {vus.map((p) => {
              const es = etatStock(p), ep = etatPeremption(p.peremption)
              return (
                <article key={p.id} className={`card ${es === 'rupture' && p.seuil > 0 ? 'border-red-300' : es === 'bas' ? 'border-amber-400' : ''}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-extrabold">{p.nom}</h2>
                      <p className="text-sm text-brand-muted">{[p.type, p.protege, p.especes !== 'Tous' ? p.especes : '', p.lot && `lot ${p.lot}`].filter(Boolean).join(' · ')}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {es === 'rupture' && <Badge tone={p.seuil > 0 ? 'red' : 'gray'}>EN RUPTURE</Badge>}
                        {es === 'bas' && <Badge tone="amber">STOCK BAS</Badge>}
                        {ep === 'perime' && <Badge tone="red">PÉRIMÉ</Badge>}
                        {ep === 'bientot' && <Badge tone="amber">PÉRIME BIENTÔT</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-extrabold leading-none">{fmtQte(p.quantite)}<span className="ml-1 text-sm font-semibold text-brand-muted">{p.unite}</span></p>
                      <p className="mt-1 text-sm text-brand-muted">{p.peremption ? `Péremption : ${fmt(p.peremption)}` : 'Pas de date de péremption'}{p.seuil > 0 && ` · alerte à ${fmtQte(p.seuil)}`}</p>
                    </div>
                  </div>
                  {p.note && <p className="mt-2 text-sm">{p.note}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => setMv({ p, type: 'entree' })}>+ Entrée</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setMv({ p, type: 'sortie' })}>− Sortie</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEdit(p)}>Modifier</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setOpen(open === p.id ? null : p.id)}>{open === p.id ? 'Masquer l\'historique' : 'Historique'}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDel(p)}>Supprimer</button>
                  </div>
                  {open === p.id && <div className="mt-3 border-t border-brand-line pt-3"><Historique id={p.id} /></div>}
                </article>
              )
            })}
          </div>
        </>
      )}

      {edit && <Modal title={edit === 'new' ? 'Nouveau produit' : 'Modifier le produit'} onClose={() => setEdit(null)} wide><ProduitForm initial={edit === 'new' ? vide : (({ id: _i, ...r }) => r)(edit)} onSave={save} onClose={() => setEdit(null)} /></Modal>}
      {mv && <Modal title={`${mv.type === 'entree' ? 'Entrée de stock' : 'Sortie de stock'} : ${mv.p.nom}`} onClose={() => setMv(null)}><MouvementForm produit={mv.p} type={mv.type} onClose={() => setMv(null)} onDone={(p) => { remplace(p); setMv(null); setOpen(null); toast('Stock mis à jour') }} /></Modal>}
      <Confirm open={!!del} title="Supprimer ce produit ?" text={del ? `« ${del.nom} » sera retiré de la pharmacie (l'historique des soins dans les fiches reste).` : ''} onConfirm={() => void supprimer()} onCancel={() => setDel(null)} />
    </div>
  )
}
