import { Link } from 'react-router-dom'
import { Card, Cta, Logo } from '../components/Layout'
import { CabinetCard } from '../components/CabinetCard'
import { cabinets } from '../cabinets'
import { services } from '../services'
import { site } from '../site'
import { Reveal } from '../ui'

const steps = [
  { badge: '1', title: 'Prenez rendez-vous', text: 'En ligne ou par téléphone, choisissez votre créneau.' },
  { badge: '2', title: 'Consultation', text: 'Votre animal est examiné et soigné au cabinet.' },
  { badge: '3', title: 'Suivi numérique', text: 'Sa fiche est mise à jour : historique, vaccins, notes.' },
]

/** Vagues décoratives en bas du bandeau (comme sur la vitrine de la clinique). */
function Waves() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full md:h-24">
      <path d="M0 70c180-50 360-50 540 0s360 50 540 0 270-30 360-10v60H0z" style={{ fill: "rgb(var(--accent, 79 182 217))" }} opacity=".6" />
      <path d="M0 90c200-40 380-40 560 0s340 40 520 0 250-20 360-6v36H0z" style={{ fill: "rgb(var(--brand-light))" }} />
    </svg>
  )
}

export default function Home() {
  // Phrase d'accroche construite avec les services du cabinet (4 premiers), ex. « Radiologie, chirurgie, gardiennage et hospitalisation »
  const noms = services.slice(0, 4).map((x, i) => (i === 0 ? x.title : x.title.charAt(0).toLowerCase() + x.title.slice(1)))
  const resume = noms.length > 1 ? `${noms.slice(0, -1).join(', ')} et ${noms[noms.length - 1]}` : noms[0] ?? 'Soins vétérinaires'
  return (
    <>
      <section className="relative overflow-hidden bg-brand pb-28 text-white md:pb-32">
        <Waves />
        <div className="wrap grid items-center gap-8 pt-8 md:grid-cols-[1.1fr_1fr] md:gap-12 md:pt-10">
          <div>
            <p className="mb-3 animate-fade-up text-sm font-bold opacity-85">{cabinets.map((c) => c.court).join(' · ')} · {site.ville}</p>
            <h1 className="animate-fade-up text-4xl font-extrabold leading-[1.08] [animation-delay:100ms] md:text-6xl">{site.accroche}</h1>
            <p className="mb-8 mt-5 max-w-md animate-fade-up text-lg leading-relaxed opacity-90 [animation-delay:200ms]">{resume}, avec un suivi médical complet. Chaque animal a un dossier complet pour un suivi sur la durée.</p>
            <div className="flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms]"><Link to="/contact" className="btn btn-white">Prendre rendez-vous</Link><Link to="/services" className="btn btn-outline">Nos services</Link></div>
          </div>
          <div className="relative animate-fade-in rounded-3xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur-sm [animation-delay:300ms] md:p-8">
            <div className="mb-5 flex items-center gap-4"><Logo className="h-16 w-16 animate-float" /><p className="text-xl font-extrabold leading-tight">Toujours<br />à vos côtés</p></div>
            <ul className="grid gap-2.5">
              {services.map((s) => <li key={s.title}><Link to="/services" className="flex items-center gap-3 rounded-xl bg-white/95 px-4 py-2.5 font-bold text-brand shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-brand-accent text-sm text-white">✓</span>{s.title}</Link></li>)}
            </ul>
          </div>
        </div>
      </section>
      <div className={`wrap relative -mt-12 grid gap-5 ${cabinets.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {cabinets.map((c, i) => <CabinetCard key={c.id} c={c} delay={i * 100} />)}
      </div>
      <section className="wrap py-14 md:py-16">
        <Reveal><h2 className="mb-8 text-3xl font-extrabold">Nos services</h2></Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map((s, i) => <Card key={s.title} badge={String(i + 1)} delay={i * 100} title={s.title} text={s.text} />)}</div>
      </section>
      <section className="bg-white py-14 md:py-16"><div className="wrap">
        <Reveal><h2 className="mb-8 text-3xl font-extrabold">Comment ça se passe</h2></Reveal>
        <div className="grid gap-5 md:grid-cols-3">{steps.map((s, i) => <Card key={s.title} delay={i * 120} {...s} />)}</div>
      </div></section>
      {site.avis.length > 0 && (
        <section className="wrap py-14 md:py-16">
          <Reveal><h2 className="mb-8 text-3xl font-extrabold">Ils nous font confiance</h2></Reveal>
          <div className="grid gap-5 md:grid-cols-3">{site.avis.map((a, n) => (
            <Reveal key={n} delay={n * 120} className="h-full"><div className="card h-full"><p className="mb-4 leading-relaxed">{a.texte}</p><strong className="text-sm">{a.auteur}</strong></div></Reveal>
          ))}</div>
        </section>
      )}
      <Cta />
    </>
  )
}
