import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PROCESS_STEPS, PROJECT_FILTERS, WHY_CHOOSE } from '../lib/constants.js';
import { api } from '../lib/api.js';
import useFetch from '../hooks/useFetch.js';
import { useSite } from '../context/SiteContext.jsx';
import { EmptyBlock, ErrorBlock, LoadingBlock, Reveal, SectionHeading, SmartImage } from './ui.jsx';
import ServiceCard from './ServiceCard.jsx';
import ProjectCard from './ProjectCard.jsx';
import BeforeAfter from './BeforeAfter.jsx';
import ContactForm from './ContactForm.jsx';

/* ---------- Services grid (data from API) ---------- */
export function ServicesGrid() {
  const { services, status } = useSite();
  if (status === 'loading') return <LoadingBlock />;
  if (status === 'error') return <ErrorBlock error={{ message: 'Could not load services. Please refresh the page.' }} onRetry={() => window.location.reload()} />;
  if (!services.length) return <EmptyBlock title="Services coming soon" />;
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s, i) => <ServiceCard key={s._id} service={s} index={i} />)}
    </div>
  );
}

/* ---------- Filterable projects grid ---------- */
export function ProjectsGrid({ featuredOnly = false, limit }) {
  const [filter, setFilter] = useState('All');
  const { data, loading, error, reload } = useFetch(() => api.projects(), []);
  const items = useMemo(() => {
    let list = data || [];
    if (featuredOnly) list = list.filter((p) => p.featured);
    if (filter !== 'All') list = list.filter((p) => p.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [data, filter, featuredOnly, limit]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter projects">
        {PROJECT_FILTERS.map((f) => (
          <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${filter === f ? 'border-gold bg-gold text-navy shadow-gold' : 'border-navy/15 bg-white text-navy/70 hover:border-gold hover:text-gold-dark'}`}>
            {f === 'All' ? 'All Projects' : f}
          </button>
        ))}
      </div>
      {loading ? <LoadingBlock /> : error ? <ErrorBlock error={error} onRetry={reload} /> : items.length === 0 ? (
        <EmptyBlock title="No projects in this category yet" text="Try another filter or check back soon." />
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">{items.map((p) => <ProjectCard key={p._id} project={p} />)}</AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Before & After section (uses projects that have both images) ---------- */
export function BeforeAfterSection() {
  const { data, loading, error, reload } = useFetch(() => api.projects(), []);
  const [active, setActive] = useState(0);
  const pairs = (data || []).filter((p) => p.beforeImage && p.afterImage);
  const current = pairs[active] || pairs[0];

  return (
    <section className="section-y bg-white" aria-labelledby="ba-heading">
      <div className="container-x">
        <SectionHeading eyebrow="Transformations" title="See the Difference. Experience the Transformation." subtitle="Drag the handle to compare the space before and after." />
        {loading ? <LoadingBlock /> : error ? <ErrorBlock error={error} onRetry={reload} /> : !current ? (
          <EmptyBlock title="Before & after images coming soon" text="Add before/after photos to a project in the admin dashboard and they will appear here." />
        ) : (
          <div className="mx-auto max-w-4xl">
            {pairs.length > 1 && (
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {pairs.map((p, i) => (
                  <button key={p._id} onClick={() => setActive(i)} className={`rounded-full border px-4 py-1.5 text-sm transition ${i === active ? 'border-gold bg-gold text-navy' : 'border-navy/15 text-navy/70 hover:border-gold'}`}>{p.title}</button>
                ))}
              </div>
            )}
            <BeforeAfter key={current._id} before={current.beforeImage} after={current.afterImage} alt={current.title} />
            <p className="mt-4 text-center text-sm text-navy/60">{current.title} &middot; {current.category}{current.isDemo ? ' (demo content)' : ''}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- Why choose HYXC (dark) ---------- */
export function WhyChoose() {
  return (
    <section className="section-y relative overflow-hidden bg-navy" aria-labelledby="why-heading">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-royal/30 blur-3xl" />
      <div className="container-x relative">
        <SectionHeading eyebrow="Our promise" title="Why Choose HYXC?" subtitle="Your trusted partner for premium interior solutions." dark />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CHOOSE.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-gold/25 bg-white/[0.03] p-7 text-center transition duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white/[0.06]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 text-gold transition group-hover:bg-gold group-hover:text-navy"><Icon className="h-7 w-7" /></div>
                <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/65">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process timeline: horizontal on desktop, vertical on mobile ---------- */
export function ProcessTimeline({ dark = false }) {
  return (
    <ol className="relative grid gap-8 md:grid-cols-5 md:gap-4">
      <span aria-hidden className="absolute left-6 top-6 h-[calc(100%-3rem)] w-px bg-gradient-to-b from-gold via-gold/50 to-gold/10 md:left-[10%] md:top-6 md:h-px md:w-[80%] md:bg-gradient-to-r" />
      {PROCESS_STEPS.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 0.1} className="relative flex gap-5 md:block md:text-center">
          <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-gradient font-serif text-lg font-bold text-navy shadow-gold ring-4 ring-sand md:mx-auto" style={dark ? { boxShadow: '0 0 0 4px #09152B' } : undefined}>{i + 1}</span>
          <div className="md:mt-5">
            <h3 className={`text-base font-semibold ${dark ? 'text-white' : 'text-navy'}`}>{s.title}</h3>
            <p className={`mt-1.5 text-sm ${dark ? 'text-white/65' : 'text-navy/65'}`}>{s.text}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/* ---------- Contact / consultation section ---------- */
export function ContactSection({ id = 'contact-form' }) {
  const { contact, settings } = useSite();
  return (
    <section id={id} className="relative isolate overflow-hidden bg-navy section-y" aria-labelledby="contact-heading">
      <SmartImage src={settings?.aboutImage || settings?.heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy via-navy/90 to-royal-700/80" />
      <div className="container-x grid items-start gap-12 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <span className="eyebrow">Free consultation</span>
          <h2 id="contact-heading" className="mt-3 text-3xl font-semibold text-white sm:text-4xl lg:text-[2.6rem] lg:leading-tight">Let&rsquo;s Create Something <span className="text-gold">Beautiful Together.</span></h2>
          <p className="mt-5 text-white/75">Request your free consultation and site visit.</p>
          <ul className="mt-8 space-y-5 rounded-2xl border border-gold/25 bg-navy/60 p-6 backdrop-blur">
            <li className="flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold"><Phone className="h-4 w-4" /></span><a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-white hover:text-gold">{contact.phone}</a></li>
            <li className="flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold"><Mail className="h-4 w-4" /></span><a href={`mailto:${contact.email}`} className="text-white hover:text-gold">{contact.email}</a></li>
            <li className="flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold"><MapPin className="h-4 w-4" /></span><span className="text-white">{contact.address}</span></li>
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="rounded-2xl border border-gold/25 bg-navy/70 p-6 shadow-2xl backdrop-blur sm:p-8"><ContactForm dark sourcePage={typeof window !== 'undefined' ? window.location.pathname : ''} /></div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Generic call-to-action strip ---------- */
export function CtaStrip({ title = 'Ready to transform your space?', text = 'Request a free consultation and site visit.' }) {
  return (
    <section className="bg-gold-gradient py-12">
      <div className="container-x flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div><h2 className="text-2xl font-semibold text-navy">{title}</h2><p className="mt-1 text-navy/75">{text}</p></div>
        <Link to="/contact" className="btn bg-navy text-gold hover:bg-navy-800">Get a Free Quote</Link>
      </div>
    </section>
  );
}
