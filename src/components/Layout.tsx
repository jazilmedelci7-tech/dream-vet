import { useEffect, useRef, useState } from "react";
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { api, ApiError } from "../api";
import { AdminStoreProvider, useStore } from "../store";
import { cabinets, telHref } from "../cabinets";
import { site } from "../site";
import { enAlerte, listRappels } from "../data";
import { ErrorBox, Reveal } from "../ui";
import { setMode, useMode } from "../messagerie";

export function Logo({
  variant = "white",
  className = "",
}: {
  variant?: "white" | "blue" | "wide";
  className?: string;
}) {
  const img = (
    <img
      src={variant === "wide" ? (site.logoWide ?? "/logo-wide.png") : `/logo-${variant}.png`}
      alt={`Logo ${site.nom}`}
      className={className}
    />
  );
  // Thème avec fond d'en-tête coloré : le logo garde toujours son fond, même sur du blanc ou du foncé
  if (variant === "wide" && site.theme?.entete) {
    return <span className="flex max-w-full rounded-2xl p-1.5" style={{ background: site.theme.entete }}>{img}</span>;
  }
  return img;
}

export function Brand({ size = "h-12" }: { size?: string }) {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={site.nom}>
      {site.logoLarge ? <Logo variant="wide" className="h-10 w-auto md:h-12" /> : <Logo className={size} />}
      <span className={`leading-tight ${site.logoLarge ? "sr-only" : ""}`}>
        <strong className="block text-lg md:text-xl">{site.nom}</strong>
        <span className="text-[13px] opacity-85">
          {cabinets.map((c) => c.court).join(" · ")}
        </span>
      </span>
    </Link>
  );
}

export function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const links: [string, string][] = [
  ["/", "Accueil"],
  ["/services", "Services"],
  ["/contact", "Contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="wrap flex flex-wrap items-center justify-between py-2.5 text-white md:py-3" style={site.theme?.enteteTexte ? { color: site.theme.enteteTexte } : undefined}>
      <Brand size="h-11 md:h-14" />
      <button
        className="rounded-full border-2 border-current px-4 py-1.5 font-bold md:hidden"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? "Fermer" : "Menu"}
      </button>
      <nav
        className={`${open ? "flex animate-drop" : "hidden"} w-full flex-col gap-4 py-4 text-[15px] md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:py-0`}
      >
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `rounded-full px-4 py-1.5 font-bold transition-colors ${isActive ? (site.theme?.entete ? "bg-white text-brand-dark" : "bg-brand-accent text-brand-dark") : (site.theme?.entete ? "hover:bg-black/10" : "hover:bg-white/10")}`
            }
          >
            {label}
          </NavLink>
        ))}
        <Link to="/contact" className={`btn rounded-full text-center ${site.theme?.entete ? "bg-brand-dark text-white" : "btn-warm"}`}>
          Réserver une visite
        </Link>
      </nav>
    </header>
  );
}

/** Horaires du pied de page : une seule liste si tous les cabinets ont les mêmes horaires, sinon une par cabinet. */
function horairesFooter() {
  const memes = cabinets.every(
    (c) => JSON.stringify(c.horaires) === JSON.stringify(cabinets[0].horaires),
  );
  const liste = (c: (typeof cabinets)[number]) =>
    c.horaires.map((h) => (
      <div key={h.jours}>
        {h.jours} : {h.heures}
      </div>
    ));
  if (memes) return <div>{cabinets[0].mention && <div className="font-bold text-brand-accent">{cabinets[0].mention}</div>}{liste(cabinets[0])}</div>;
  return (
    <>
      {cabinets.map((c) => (
        <div key={c.id} className="mt-1">
          <em>{c.court}</em>
          {liste(c)}
        </div>
      ))}
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="wrap grid gap-8 py-10 text-sm leading-8 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          {site.logoLarge ? <Logo variant="wide" className="h-16 w-auto" /> : <Logo className="h-20" />}
          <div>
            <strong className="text-lg">{site.nom}</strong>
            {cabinets.map((c) => (
              <div key={c.id} className="mt-2 leading-6">
                <strong>{c.court}</strong>
                <br />
                {c.adresse}
                <br />
                <a className="hover:underline" href={telHref(c.telephone)}>
                  {c.telephone}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div>
          <strong>Naviguer</strong>
          {links.map(([to, l]) => (
            <Link key={to} to={to} className="block hover:underline">
              {l}
            </Link>
          ))}
        </div>
        <div>
          <strong>Nous recevons</strong>
          {horairesFooter()}
          <Link to="/admin" className="block opacity-70 hover:opacity-100">
            Espace vétérinaire
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <div
        className={`sticky top-0 z-40 border-b border-white/10 backdrop-blur transition-shadow duration-300 ${site.theme?.entete ? "" : "bg-brand-dark/95"} ${scrolled ? "shadow-lg shadow-black/30" : ""}`}
        style={site.theme?.entete ? { background: site.theme.entete } : undefined}
      >
        <Header />
      </div>
      <div key={pathname} className="animate-fade-in">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export function PageHero({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-soft via-brand-light to-brand-soft pb-14 md:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-accent/25 md:h-80 md:w-80" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-40 hidden h-48 w-48 rounded-full bg-brand-accent/25 md:block" />
      <div className="wrap relative pt-10 md:pt-14">
        <h1 className="animate-fade-up text-4xl font-bold text-brand-dark md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-xl animate-fade-up text-lg text-brand-muted [animation-delay:150ms]">{text}</p>
      </div>
    </div>
  );
}

export function Cta() {
  return (
    <section className="wrap py-12 md:py-16">
      <Reveal>
        <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-brand-dark p-8 text-white md:flex-row md:items-center md:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-accent/30" />
          <Logo className="pointer-events-none absolute -bottom-6 right-6 hidden h-40 animate-float md:block" />
          <div className="relative">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">Votre compagnon a besoin de nous ?</h2>
            <p className="text-lg opacity-90">
              Appelez-nous au{" "}
              <a className="font-extrabold text-brand-accent hover:underline" href={telHref(cabinets[0].telephone)}>{cabinets[0].telephone}</a>{" "}
              ou envoyez votre demande en ligne.
            </p>
          </div>
          <Link to="/contact" className="btn btn-warm relative rounded-full px-8 md:mr-36">
            Réserver une visite
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export function Card({
  badge,
  title,
  text,
  delay = 0,
}: {
  badge: string;
  title: string;
  text: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="card h-full transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand/10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-lg font-extrabold text-brand">
          {badge}
        </div>
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <p className="leading-relaxed text-brand-muted">{text}</p>
      </div>
    </Reveal>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const nav = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', out); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc) }
  }, [open])
  const quit = async () => { try { await api.logout() } catch { /* déjà déconnecté */ } nav('/admin/login') }
  const row = 'block w-full px-4 py-2.5 text-left text-[15px] text-brand-dark hover:bg-brand-light'
  return (
    <div ref={box} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} className={`flex w-full gap-3 rounded-2xl bg-white/10 p-2.5 text-left transition-colors hover:bg-white/20 ${site.logoLarge ? "flex-col items-start" : "items-center"}`}>
        {site.logoLarge ? <Logo variant="wide" className="h-10 w-auto" /> : <Logo className="h-10 md:h-11" />}
        <span className="flex w-full min-w-0 flex-1 items-center justify-between leading-tight">{!site.logoLarge && <strong className="block">{site.nom}</strong>}<span className="text-[12px] opacity-80">Espace vétérinaire</span><svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg></span>
      </button>
      {open && (
        <div role="menu" className="absolute left-0 right-0 z-50 mt-2 animate-drop overflow-hidden rounded-lg border border-brand-line bg-white py-1 shadow-xl md:right-auto md:w-56">
          <Link role="menuitem" to="/" className={row}>Voir le site</Link>
          <Link role="menuitem" to="/admin/notifications" className={row}>Notifications</Link>
          <Link role="menuitem" to="/admin/mot-de-passe" className={row}>Mot de passe</Link>
          <div className="my-1 border-t border-brand-line" />
          <button role="menuitem" type="button" className={`${row} font-bold text-red-700`} onClick={quit}>Déconnexion</button>
        </div>
      )}
    </div>
  )
}

function AdminShell() {
  const { rdvs, fiches } = useStore()
  const nouvelles = rdvs.filter((r) => r.statut === 'nouvelle').length
  const rappelsUrgents = listRappels(fiches, 7).length
  // Pastille « Pharmacie » : nombre de produits à surveiller (rechargée à chaque changement de page)
  const { pathname } = useLocation()
  const [alertesPharma, setAlertesPharma] = useState(0)
  useEffect(() => { api.produits().then((l) => setAlertesPharma(l.filter(enAlerte).length)).catch(() => setAlertesPharma(0)) }, [pathname])
  const mode = useMode()
  const item = ({ isActive }: { isActive: boolean }) => `whitespace-nowrap rounded-lg px-3.5 py-2.5 transition-colors md:py-3 ${isActive ? 'bg-brand-accent font-bold text-brand-dark' : 'hover:bg-white/10'}`
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="relative z-30 flex flex-col bg-brand-dark p-4 text-white md:sticky md:top-0 md:h-screen md:p-5">
        <AccountMenu />
        <nav className="mt-4 flex flex-wrap gap-1.5 text-[15px] md:mt-8 md:flex-col md:flex-nowrap">
          <NavLink to="/admin" end className={item}>Fiches clients</NavLink>
          <NavLink to="/admin/rendez-vous" className={item}>Rendez-vous{nouvelles > 0 && <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-brand">{nouvelles}</span>}</NavLink>
          <NavLink to="/admin/rappels" className={item}>Rappels{rappelsUrgents > 0 && <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-brand">{rappelsUrgents}</span>}</NavLink>
          <NavLink to="/admin/pharmacie" className={item}>Pharmacie{alertesPharma > 0 && <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-brand-dark">{alertesPharma}</span>}</NavLink>
          <NavLink to="/admin/statistiques" className={item}>Statistiques</NavLink>
          <NavLink to="/admin/sauvegardes" className={item}>Sauvegardes</NavLink>
        </nav>
        <div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm md:mt-auto">
          <span className="mb-2 block text-[12px] opacity-80">Envoyer les messages par</span>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/20 p-1" role="group" aria-label="Envoyer les messages par">
            {(['whatsapp', 'sms'] as const).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`rounded-lg px-2 py-1.5 font-bold transition-colors ${mode === m ? 'bg-brand-accent text-brand-dark' : 'hover:bg-white/10'}`}>{m === 'sms' ? 'SMS' : 'WhatsApp'}</button>
            ))}
          </div>
        </div>
        <div className="mt-4 hidden rounded-2xl bg-white/10 p-4 text-sm leading-6 md:block">
          <strong className="block font-display text-base">{cabinets[0].court}</strong>
          <a href={telHref(cabinets[0].telephone)} className="font-bold text-brand-accent hover:underline">{cabinets[0].telephone}</a>
        </div>
      </aside>
      <main className="min-w-0 p-4 md:p-10"><Outlet /></main>
    </div>
  )
}

export function AdminLayout() {
  const [status, setStatus] = useState<"checking" | "in" | "out" | "down">(
    "checking",
  );
  const [msg, setMsg] = useState("");
  const check = () => {
    setStatus("checking");
    api
      .me()
      .then(() => setStatus("in"))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) setStatus("out");
        else {
          setMsg(e instanceof Error ? e.message : "Erreur");
          setStatus("down");
        }
      });
  };
  useEffect(check, []);
  if (status === "checking")
    return (
      <div className="flex min-h-screen items-center justify-center text-brand-muted">
        Chargement…
      </div>
    );
  if (status === "out") return <Navigate to="/admin/login" replace />;
  if (status === "down")
    return (
      <div className="mx-auto max-w-md p-6">
        <ErrorBox message={msg} onRetry={check} />
      </div>
    );
  return (
    <AdminStoreProvider onUnauthorized={() => setStatus("out")}>
      <AdminShell />
    </AdminStoreProvider>
  );
}
