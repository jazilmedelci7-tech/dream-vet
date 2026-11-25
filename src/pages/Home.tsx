import { Link } from 'react-router-dom'
import { Cta, Logo } from '../components/Layout'
import { CabinetMap, Horaires } from '../components/CabinetCard'
import { cabinets, telHref } from '../cabinets'
import { services } from '../services'
import { site } from '../site'
import { Reveal } from '../ui'
import { Icon } from './Services'

const atouts = [
  { titre: 'Tout sous le même toit', texte: 'Radiologie, chirurgie, hospitalisation, vaccins : une seule adresse pour suivre votre animal de A à Z.' },
  { titre: 'Un carnet toujours à jour', texte: "Chaque animal a sa fiche : vaccins, traitements, visites. Rien ne se perd, même après des années." },
  { titre: "Ouverts jusqu'à 22 h", texte: "Ouvert 7j/7 : du samedi au jeudi de 9h à 22h, et le vendredi de 10h à midi puis de 15h à 22h." },
]

/** Bandeau défilant avec les soins proposés. */
function Bandeau() {
  const liste = [...services, ...services]
  return (
    <div className="overflow-hidden bg-brand py-4 text-white" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl">
        {liste.map((s, i) => <span key={i} className="flex items-center gap-10">{s.title}<span className="text-brand-accent">✦</span></span>)}
      </div>
    </div>
  )
}

export default function Home() {
  const c = cabinets[0]
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-soft via-brand-light to-brand-soft">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-brand-accent/20" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-1/3 h-56 w-56 rounded-full bg-brand-accent/25" />
        <div className="wrap relative grid items-center gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="mb-4 inline-block animate-fade-up rounded-full bg-white px-4 py-1.5 text-sm font-extrabold text-brand shadow-sm">Clinique vétérinaire · {site.ville}</p>
            <h1 className="animate-fade-up text-5xl font-bold leading-[1.05] text-brand-dark [animation-delay:100ms] md:text-7xl">{site.accroche}</h1>
            <p className="mb-8 mt-6 max-w-lg animate-fade-up text-lg leading-relaxed text-brand-muted [animation-delay:200ms]">
              Chiens, chats et autres petits compagnons : l'équipe DreamVet les soigne avec douceur et sérieux, de la simple vaccination à l'intervention chirurgicale.
            </p>
            <div className="flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:300ms]">
              <Link to="/contact" className="btn btn-warm rounded-full px-8">Réserver une visite</Link>
              <Link to="/services" className="btn btn-ghost rounded-full px-8">Découvrir nos soins</Link>
            </div>
            <div className="mt-8 flex animate-fade-up flex-wrap gap-3 text-sm font-bold [animation-delay:400ms]">
              <span className="rounded-full bg-white px-4 py-2 shadow-sm">Ouvert 7j/7</span>
              <a href={telHref(c.telephone)} className="rounded-full bg-brand px-4 py-2 text-white shadow-sm hover:bg-brand-dark">{c.telephone}</a>
            </div>
          </div>
          <div className="relative animate-fade-in [animation-delay:300ms]">
            <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-brand-accent/40" aria-hidden="true" />
            <div className="relative grid place-items-center rounded-[2.5rem] bg-brand-dark p-8 md:p-12">
              <Logo variant="wide" className="w-full animate-float drop-shadow-xl" />
              <p className="mt-6 text-center font-display text-2xl text-white">Toujours à vos côtés</p>
            </div>
          </div>
        </div>
      </section>

      <Bandeau />

      <section className="wrap py-16 md:py-24">
        <Reveal><h2 className="mb-2 text-4xl font-bold text-brand-dark md:text-5xl">Nos soins</h2><p className="mb-10 max-w-xl text-lg text-brand-muted">Six façons de prendre soin de votre animal, au même endroit.</p></Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 100} className="h-full">
              <Link to="/services" className="group flex h-full gap-4 rounded-3xl border-2 border-transparent bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-accent hover:shadow-xl">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand text-white transition group-hover:bg-brand-warm group-hover:text-brand-dark"><Icon name={s.icon} className="h-7 w-7" /></span>
                <span><span className="mb-1 block font-display text-xl font-semibold">{s.title}</span><span className="leading-relaxed text-brand-muted">{s.text}</span></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-dark py-16 text-white md:py-24"><div className="wrap">
        <Reveal><h2 className="mb-10 text-4xl font-bold md:text-5xl">Pourquoi nous faire confiance</h2></Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {atouts.map((a, i) => (
            <Reveal key={a.titre} delay={i * 120}><div className="h-full rounded-3xl bg-white/10 p-7 ring-1 ring-white/15">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-brand-accent font-display text-lg font-bold text-brand-dark">{i + 1}</span>
              <h3 className="mb-2 text-2xl font-semibold">{a.titre}</h3><p className="leading-relaxed opacity-85">{a.texte}</p>
            </div></Reveal>
          ))}
        </div>
      </div></section>

      <section className="wrap grid gap-8 py-16 md:grid-cols-2 md:py-24">
        <Reveal><div className="h-full rounded-3xl bg-white p-7 shadow-sm md:p-9">
          <h2 className="mb-4 text-3xl font-bold text-brand-dark">Venir nous voir</h2>
          <p className="text-brand-muted">{c.adresse}</p>
          <p className="mb-5"><a className="text-xl font-extrabold text-brand hover:underline" href={telHref(c.telephone)}>{c.telephone}</a></p>
          <Horaires c={c} />
        </div></Reveal>
        <Reveal delay={150}><CabinetMap c={c} /></Reveal>
      </section>

      <Cta />
    </>
  )
}
