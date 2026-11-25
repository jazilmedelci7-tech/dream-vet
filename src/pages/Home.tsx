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
        <Reveal><h2 className="mb-2 text-4xl font-bold text-brand-dark md:text-5xl">Nos soins</h2><p className="mb-10 max-w-xl text-lg text-brand-muted">{services.length} façons de prendre soin de votre animal, au même endroit.</p></Reveal>
        <Reveal><ol className="grid gap-x-12 border-t-2 border-brand-dark md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.title} className="border-b border-brand-line">
              <Link to="/services" className="group flex items-start gap-5 px-2 py-6 transition-colors duration-300 hover:bg-brand-light md:px-4">
                <span className="w-12 shrink-0 font-display text-4xl font-bold leading-none text-brand-accent transition-colors group-hover:text-brand">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">
                  <span className="mb-1 flex items-center gap-2 font-display text-2xl font-semibold text-brand-dark"><Icon name={s.icon} className="h-6 w-6 text-brand" />{s.title}</span>
                  <span className="block leading-relaxed text-brand-muted">{s.text}</span>
                </span>
                <span aria-hidden="true" className="mt-1 text-2xl text-brand-dark opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
              </Link>
            </li>
          ))}
        </ol></Reveal>
      </section>

      <section className="wrap grid gap-10 py-16 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal><div className="lg:sticky lg:top-28">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-widest text-brand">Pourquoi les familles reviennent</p>
          <h2 className="text-4xl font-bold leading-tight text-brand-dark md:text-5xl">Une clinique qui prend le temps</h2>
          <p className="mt-4 max-w-md text-lg text-brand-muted">Un lieu, une équipe, un carnet de santé qui suit votre animal toute sa vie.</p>
        </div></Reveal>
        <ol className="relative grid gap-6 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-0.5 before:border-l-2 before:border-dashed before:border-brand-accent">
          {atouts.map((a, i) => (
            <li key={a.titre}><Reveal delay={i * 120}><div className="relative flex gap-5">
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-dark text-brand-accent ring-8 ring-brand-light">
                {i === 0 && <Icon name="chirurgie" className="h-7 w-7" />}
                {i === 1 && <Icon name="dossier" className="h-7 w-7" />}
                {i === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="h-7 w-7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>}
              </span>
              <div className="flex-1 rounded-3xl border border-brand-line bg-white p-6 shadow-sm">
                <h3 className="mb-1 text-2xl font-semibold text-brand-dark">{a.titre}</h3>
                <p className="leading-relaxed text-brand-muted">{a.texte}</p>
              </div>
            </div></Reveal></li>
          ))}
        </ol>
      </section>

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
