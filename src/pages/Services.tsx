import { Cta, PageHero } from '../components/Layout'
import { Service, services } from '../services'
import { Reveal } from '../ui'

export const paths: Record<Service['icon'], string[]> = {
  consultation: ['M6 3v6a4 4 0 0 0 8 0V3', 'M10 13v2a5 5 0 0 0 10 0v-1', 'M20 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'],
  vaccin: ['M18 2l4 4', 'M17 7l3-3', 'M19 9L8.7 19.3a2.1 2.1 0 0 1-3 0l-1-1a2.1 2.1 0 0 1 0-3L15 5', 'M9 11l4 4', 'M5 19l-3 3', 'M14 4l6 6'],
  chirurgie: ['M9 3h6v6h6v6h-6v6H9v-6H3V9h6z'],
  radio: ['M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z'],
  echo: ['M22 12h-4l-3 9L9 3l-3 9H2'],
  imagerie: ['M3 7V5a2 2 0 0 1 2-2h2', 'M17 3h2a2 2 0 0 1 2 2v2', 'M21 17v2a2 2 0 0 1-2 2h-2', 'M7 21H5a2 2 0 0 1-2-2v-2', 'M7 12h10'],
  dents: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M8 14s1.5 2 4 2 4-2 4-2', 'M9 9h.01', 'M15 9h.01'],
  identification: ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'],
  gardiennage: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  hospitalisation: ['M2 4v16', 'M2 8h18a2 2 0 0 1 2 2v10', 'M2 17h20', 'M6 8v9'],
  bienetre: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'],
  dossier: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8'],
}

export function Icon({ name, className }: { name: Service['icon']; className: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name].map((d) => <path key={d} d={d} />)}</svg>
}

function ServiceRow({ s, n }: { s: Service; n: number }) {
  const pair = n % 2 === 0
  return (
    <Reveal>
      <article className={`grid items-stretch gap-6 md:gap-10 ${pair ? 'md:grid-cols-[1fr_300px]' : 'md:grid-cols-[300px_1fr]'}`}>
        <div className={`relative flex min-h-[170px] items-center justify-center overflow-hidden rounded-[2rem] ${pair ? 'bg-brand-dark md:order-2' : 'bg-brand'} text-white`}>
          <span aria-hidden="true" className="absolute -bottom-6 left-3 font-display text-[9rem] font-bold leading-none text-white/10">{String(n + 1).padStart(2, '0')}</span>
          <Icon name={s.icon} className="relative h-20 w-20 text-white" />
        </div>
        <div className="flex flex-col justify-center py-1">
          <h2 className="mb-2 text-3xl font-bold text-brand-dark md:text-4xl">{s.title}</h2>
          <p className="mb-4 max-w-2xl text-lg leading-relaxed text-brand-muted">{s.text}</p>
          <ul className="flex flex-wrap gap-2">{s.points.map((p) => <li key={p} className="rounded-full bg-brand-light px-4 py-1.5 text-sm font-bold text-brand-dark ring-1 ring-brand-line">{p}</li>)}</ul>
        </div>
      </article>
    </Reveal>
  )
}

export default function Services() {
  return (
    <>
      <PageHero title="Nos soins" text="Radiologie, chirurgie, hospitalisation, gardiennage, vaccins et conseils : tout ce dont votre animal a besoin, réuni dans une seule clinique." />
      <section className="wrap grid gap-14 py-14 md:gap-16 md:py-20">
        {services.map((s, i) => <ServiceRow key={s.title} s={s} n={i} />)}
      </section>
      <Cta />
    </>
  )
}
