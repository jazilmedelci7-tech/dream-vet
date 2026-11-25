import { FormEvent, useState } from 'react'
import { PageHero } from '../components/Layout'
import { api, errMsg } from '../api'
import { cabinets, telHref } from '../cabinets'
import { CabinetMap } from '../components/CabinetCard'
import { Reveal } from '../ui'

const empty = { nom: '', telephone: '', animal: '', cabinet: '', date: '', message: '' }

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [f, setF] = useState(empty)
  const [trap, setTrap] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(''); setSent(false)
    try { await api.createRdv({ ...f, cabinet: f.cabinet || cabinets[0].id, website: trap }); setF(empty); setSent(true) } catch (error) { setErr(errMsg(error)) } finally { setBusy(false) }
  }
  const fields = [['nom', 'Votre nom', 'text'], ['telephone', 'Votre numéro', 'tel'], ['animal', "Nom de l'animal", 'text'], ['date', 'Jour souhaité', 'date']] as const
  return (
    <>
      <PageHero title="Réserver une visite" text="Dites-nous quel jour vous arrange et ce qui amène votre animal : nous vous rappelons pour confirmer l'heure." />
      <section className="wrap py-14 md:py-16">
        <Reveal><div className="grid overflow-hidden rounded-[2rem] shadow-xl shadow-brand/10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative bg-brand-dark p-7 text-white md:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-16 h-52 w-52 rounded-full bg-brand-accent/20" />
            <div className="relative grid gap-7">{cabinets.map((c) => (
              <div key={c.id}>
                <h2 className="mb-4 text-2xl font-semibold">{cabinets.length > 1 ? c.nom : 'Où et quand nous trouver'}</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">Téléphone</p>
                <a className="mb-4 block font-display text-3xl font-bold hover:underline" href={telHref(c.telephone)}>{c.telephone}</a>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-accent">Adresse</p>
                <p className="mb-4 opacity-90">{c.adresse}</p>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-accent">Horaires</p>
                {c.mention && <p className="mb-1 font-bold">{c.mention}</p>}
                {c.horaires.map((h) => <p key={h.jours} className="opacity-90">{h.jours} : {h.heures}</p>)}
              </div>
            ))}</div>
          </div>
          <form onSubmit={submit} className="grid gap-4 bg-white p-7 sm:grid-cols-2 md:p-10">
            <h2 className="text-2xl font-semibold text-brand-dark sm:col-span-2">Votre demande</h2>
            {fields.map(([id, label, type]) => <div key={id}><label className="label" htmlFor={id}>{label}</label><input id={id} type={type} className="input" required value={f[id]} onChange={set(id)} /></div>)}
            {cabinets.length > 1 && <div className="sm:col-span-2"><label className="label" htmlFor="cabinet">Clinique souhaitée</label>
              <select id="cabinet" className="input" required value={f.cabinet} onChange={set('cabinet')}>
                <option value="">Choisir un cabinet…</option>
                {cabinets.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select></div>}
            <div className="sm:col-span-2"><label className="label" htmlFor="message">Un mot pour nous (facultatif)</label><textarea id="message" rows={3} className="input" value={f.message} onChange={set('message')} /></div>
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Ne pas remplir<input tabIndex={-1} autoComplete="off" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} /></label></div>
            <div className="sm:col-span-2"><button className="btn btn-warm w-full rounded-full disabled:opacity-60" disabled={busy}>{busy ? 'Envoi en cours…' : 'Envoyer ma demande'}</button>
              {err && <p role="alert" className="mt-3 font-bold text-red-700">{err}</p>}
              {sent && <p role="status" className="mt-3 animate-pop font-bold text-brand">Merci ! Votre demande est bien partie, nous vous rappelons très vite pour fixer l'heure.</p>}</div>
          </form>
        </div></Reveal>
      </section>
      <section className="bg-white py-14 md:py-16"><div className="wrap"><Reveal><div className={`grid gap-6 ${cabinets.length > 1 ? 'md:grid-cols-2' : ''}`}>{cabinets.map((c) => <CabinetMap key={c.id} c={c} />)}</div></Reveal></div></section>
    </>
  )
}
