import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, ChevronDown, MapPin, Tag } from 'lucide-react';
import { api } from '../lib/api.js';
import useFetch from '../hooks/useFetch.js';
import { useSite } from '../context/SiteContext.jsx';
import { COMPANY, FAQS, WHY_CHOOSE, waLink } from '../lib/constants.js';
import { EmptyBlock, ErrorBlock, LoadingBlock, PageHeader, Reveal, SectionHeading, Seo, SmartImage } from '../components/ui.jsx';
import { ContactSection, CtaStrip, ProcessTimeline, ProjectsGrid, ServicesGrid } from '../components/sections.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import ContactForm from '../components/ContactForm.jsx';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';

/* ================= ABOUT ================= */
export function About() {
  const { settings } = useSite();
  return (
    <>
      <Seo page="about" path="/about" fallbackTitle="About HYXC Interiors | Interior Design Company in Ajman, UAE"
        fallbackDescription="Learn about HYXC Interiors, an Ajman-based interior design and fit-out company delivering tailored residential and commercial spaces across the UAE." />
      <PageHeader eyebrow="About HYXC" title="Creating Spaces That Inspire" subtitle="Interior design, renovation, flooring and decorative solutions across the UAE." image={settings.heroImage} />
      <section className="section-y">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal><SmartImage src={settings.aboutImage} alt="HYXC Interiors project" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-card" /></Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">Our story</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Beauty, comfort and functionality in balance</h2>
            <p className="mt-5 leading-relaxed text-navy/70">At HYXC, we believe every space deserves a perfect balance of beauty, comfort and functionality. We provide tailored interior design, renovation, flooring and decorative solutions to transform residential and commercial spaces across the UAE.</p>
            <p className="mt-4 leading-relaxed text-navy/70">Based in Ajman, we work with homeowners and businesses in Dubai, Ajman, Sharjah, Abu Dhabi and other UAE locations, guiding each project from the first consultation to the final handover.</p>
            <Link to="/contact" className="btn btn-gold mt-8">Request a Free Consultation</Link>
          </Reveal>
        </div>
      </section>
      <section className="section-y bg-navy">
        <div className="container-x">
          <SectionHeading eyebrow="Our values" title="What we stand for" dark />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map(({ icon: Icon, title, text }) => (
              <Reveal key={title}><div className="h-full rounded-2xl border border-gold/25 p-7 text-center"><Icon className="mx-auto h-8 w-8 text-gold" /><h3 className="mt-4 text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-sm text-white/65">{text}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaStrip />
    </>
  );
}

/* ================= SERVICES OVERVIEW ================= */
export function Services() {
  return (
    <>
      <Seo page="services" path="/services" fallbackTitle="Interior Design & Fit-Out Services in UAE | HYXC Interiors"
        fallbackDescription="Interior design, renovation, flooring, wall panels, kitchen makeovers, media walls, outdoor solutions and curtains for homes and businesses across the UAE." />
      <PageHeader eyebrow="What we do" title="Our Interior Solutions" subtitle="Comprehensive interior services tailored to your needs." />
      <section className="section-y"><div className="container-x"><ServicesGrid /></div></section>
      <CtaStrip />
    </>
  );
}

/* ================= SERVICE DETAIL ================= */
export function ServiceDetail() {
  const { slug } = useParams();
  const { data: service, loading, error, reload } = useFetch(() => api.service(slug), [slug]);
  const { services, contact } = useSite();

  if (loading) return <div className="pt-40"><LoadingBlock /></div>;
  if (error) return <div className="pt-32"><ErrorBlock error={error.status === 404 ? { message: 'This service could not be found.' } : error} onRetry={error.status === 404 ? undefined : reload} /><p className="text-center"><Link to="/services" className="font-semibold text-gold-dark">View all services</Link></p></div>;

  const msg = `Hello HYXC Interiors, I am interested in your ${service.title} service. I would like to request a consultation.`;
  const others = services.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <>
      <Seo page={`service-${slug}`} path={`/services/${slug}`} image={service.image}
        fallbackTitle={service.seoTitle || `${service.title} in UAE | HYXC Interiors`}
        fallbackDescription={service.seoDescription || service.shortDescription}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: service.shortDescription, provider: { '@type': 'HomeAndConstructionBusiness', name: COMPANY.name, url: COMPANY.url }, areaServed: 'United Arab Emirates' }} />
      <PageHeader eyebrow="Service" title={service.title} subtitle={service.shortDescription} image={service.image} />
      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Link to="/services" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark"><ArrowLeft className="h-4 w-4" /> All services</Link>
            <SmartImage src={service.image} alt={`${service.title} by HYXC Interiors`} eager className="aspect-[16/10] w-full rounded-2xl object-cover shadow-card" />
            <h2 className="mt-10 text-2xl font-semibold">About this service</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-navy/70">{service.description || service.shortDescription}</p>
            {service.features?.length > 0 && (
              <>
                <h3 className="mt-10 text-xl font-semibold">What is included</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.features.map((f) => <li key={f} className="flex items-start gap-3 rounded-lg bg-white p-4 text-sm shadow-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />{f}</li>)}
                </ul>
              </>
            )}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl bg-navy p-6 text-white shadow-card">
              <h3 className="text-xl font-semibold text-gold">Enquire about this service</h3>
              <p className="mt-2 text-sm text-white/70">Talk to our team on WhatsApp or request a free consultation.</p>
              <a href={waLink(contact.whatsapp, msg)} target="_blank" rel="noopener noreferrer" className="btn mt-5 w-full bg-[#25D366] text-white hover:brightness-110"><WhatsAppIcon className="h-5 w-5" /> Enquire on WhatsApp</a>
              <Link to="/contact" className="btn btn-gold mt-3 w-full">Request Free Consultation</Link>
            </div>
            {others.length > 0 && (
              <div className="rounded-2xl border border-navy/10 bg-white p-6">
                <h3 className="font-serif text-lg font-semibold">Other services</h3>
                <ul className="mt-3 space-y-2 text-sm">{others.map((s) => <li key={s._id}><Link to={`/services/${s.slug}`} className="text-navy/70 hover:text-gold-dark">{s.title}</Link></li>)}</ul>
              </div>
            )}
          </aside>
        </div>
      </section>
      <section className="bg-navy py-16"><div className="container-x"><SectionHeading title="Request a Free Consultation" dark /><div className="mx-auto max-w-3xl"><ContactForm dark defaultService={service.title} sourcePage={`/services/${slug}`} /></div></div></section>
    </>
  );
}

/* ================= PROJECTS ================= */
export function Projects() {
  return (
    <>
      <Seo page="projects" path="/projects" fallbackTitle="Interior Design Projects & Portfolio | HYXC Interiors"
        fallbackDescription="Browse HYXC Interiors project transformations across residential, commercial, flooring, media wall, kitchen and outdoor spaces in the UAE." />
      <PageHeader eyebrow="Portfolio" title="Our Recent Transformations" subtitle="Explore our interior projects across the UAE." />
      <section className="section-y"><div className="container-x"><ProjectsGrid /></div></section>
      <CtaStrip />
    </>
  );
}

/* ================= PROJECT DETAIL ================= */
export function ProjectDetail() {
  const { slug } = useParams();
  const { data: p, loading, error, reload } = useFetch(() => api.project(slug), [slug]);
  const [active, setActive] = useState(0);

  if (loading) return <div className="pt-40"><LoadingBlock /></div>;
  if (error) return <div className="pt-32"><ErrorBlock error={error.status === 404 ? { message: 'This project could not be found.' } : error} onRetry={error.status === 404 ? undefined : reload} /><p className="text-center"><Link to="/projects" className="font-semibold text-gold-dark">Back to projects</Link></p></div>;

  const gallery = [p.coverImage, ...(p.images || [])].filter((v, i, a) => v && a.indexOf(v) === i);
  return (
    <>
      <Seo page={`project-${slug}`} path={`/projects/${slug}`} image={p.coverImage} fallbackTitle={`${p.title} | ${p.category} Project | HYXC Interiors`} fallbackDescription={p.description?.slice(0, 155)} />
      <PageHeader eyebrow={p.category} title={p.title} image={p.coverImage} />
      <section className="section-y">
        <div className="container-x">
          <Link to="/projects" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark"><ArrowLeft className="h-4 w-4" /> All projects</Link>
          {p.isDemo && <p className="mb-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-navy/80"><strong>Demo content.</strong> This is a sample project shown until real HYXC project information is added.</p>}
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SmartImage src={gallery[active]} alt={`${p.title} gallery image ${active + 1}`} eager className="aspect-[16/10] w-full rounded-2xl object-cover shadow-card" />
              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {gallery.map((g, i) => (
                    <button key={g} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`} className={`overflow-hidden rounded-lg ring-2 transition ${i === active ? 'ring-gold' : 'ring-transparent opacity-70 hover:opacity-100'}`}>
                      <SmartImage src={g} alt="" className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <aside className="space-y-5">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Project overview</h2>
                <ul className="mt-4 space-y-3 text-sm text-navy/75">
                  <li className="flex items-center gap-2"><Tag className="h-4 w-4 text-gold-dark" />{p.category}</li>
                  {p.location && <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-dark" />{p.location}</li>}
                </ul>
                <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-navy/70">{p.description}</p>
              </div>
              <Link to="/contact" className="btn btn-gold w-full">Start a Similar Project</Link>
            </aside>
          </div>
          {p.videos?.length > 0 && (
            <div className="mt-16"><h2 className="mb-6 text-center text-2xl font-semibold">Project Video</h2>
              <div className="mx-auto grid max-w-4xl gap-6">{p.videos.map((v) => <video key={v} src={v} controls preload="metadata" playsInline className="w-full rounded-2xl bg-black shadow-card" />)}</div></div>
          )}
          {p.beforeImage && p.afterImage && (
            <div className="mt-16"><h2 className="mb-6 text-center text-2xl font-semibold">Before &amp; After</h2><div className="mx-auto max-w-4xl"><BeforeAfter before={p.beforeImage} after={p.afterImage} alt={p.title} /></div></div>
          )}
        </div>
      </section>
      <CtaStrip />
    </>
  );
}

/* ================= PROCESS ================= */
export function Process() {
  return (
    <>
      <Seo page="process" path="/process" fallbackTitle="Our Interior Design Process | HYXC Interiors"
        fallbackDescription="From consultation and site visit to design, quotation, installation and handover: how HYXC delivers your interior project in five clear steps." />
      <PageHeader eyebrow="How we work" title="From Vision to Reality" subtitle="A clear five-step process from first conversation to final handover." />
      <section className="section-y"><div className="container-x"><ProcessTimeline /></div></section>
      <CtaStrip title="Ready to start step one?" text="Book your free consultation today." />
    </>
  );
}

/* ================= FAQ ================= */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <Seo page="faq" path="/faq" fallbackTitle="Interior Design FAQ | HYXC Interiors UAE"
        fallbackDescription="Answers to common questions about interior design, renovation, flooring, kitchen wrapping, media walls and outdoor installations with HYXC Interiors."
        jsonLd={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <PageHeader eyebrow="FAQ" title="Frequently Asked Questions" subtitle="Everything you need to know before starting your project." />
      <section className="section-y">
        <div className="container-x max-w-3xl space-y-3">
          {FAQS.map((f, i) => (
            <div key={f.q} className="overflow-hidden rounded-xl border border-navy/10 bg-white">
              <h2 className="font-sans">
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 p-5 text-left text-base font-semibold">
                  {f.q}<ChevronDown className={`h-5 w-5 shrink-0 text-gold-dark transition ${open === i ? 'rotate-180' : ''}`} />
                </button>
              </h2>
              <AnimatePresence initial={false}>
                {open === i && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-navy/70">{f.a}</p></motion.div>}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      <CtaStrip title="Still have questions?" text="Our team is happy to help." />
    </>
  );
}

/* ================= CONTACT ================= */
export function Contact() {
  return (
    <>
      <Seo page="contact" path="/contact" fallbackTitle="Contact HYXC Interiors | Free Consultation & Site Visit"
        fallbackDescription="Request a free interior design consultation and site visit anywhere in the UAE. Call or WhatsApp +971 52 886 8393 or email info@hyxc.ae." />
      <PageHeader eyebrow="Get in touch" title="Contact Us" subtitle="Request your free consultation and site visit." />
      <ContactSection />
    </>
  );
}

/* ================= LEGAL ================= */
const LEGAL = {
  privacy: {
    title: 'Privacy Policy', path: '/privacy-policy',
    description: 'How HYXC Interiors collects, uses and protects your personal information.',
    sections: [
      ['Information we collect', 'When you submit an enquiry we collect the details you provide: your name, email address, phone number, project location, property type, service required, estimated budget and project details.'],
      ['How we use it', 'We use this information to respond to your enquiry, arrange consultations and site visits, prepare quotations and improve our services. We do not sell your personal information.'],
      ['Sharing', 'We only share your information with service providers who help us operate the website and deliver our services, or where required by law.'],
      ['Retention & security', 'We keep enquiry records only as long as needed for the purposes above and use reasonable technical measures to protect them.'],
      ['Your choices', `You can ask us to access, correct or delete your information by emailing ${COMPANY.email}.`],
    ],
  },
  terms: {
    title: 'Terms & Conditions', path: '/terms-and-conditions',
    description: 'Terms and conditions for using the HYXC Interiors website and services.',
    sections: [
      ['Use of this website', 'The content on this website is provided for general information. Services, materials and finishes shown may vary by project.'],
      ['Quotations', 'Pricing and timelines are confirmed in a written quotation after consultation and site assessment. Website content is not a binding offer.'],
      ['Intellectual property', 'Website content, imagery and branding belong to HYXC Interiors or its licensors and may not be reproduced without permission.'],
      ['Limitation of liability', 'We make reasonable efforts to keep the website accurate but do not guarantee it is free of errors or interruptions.'],
      ['Contact', `Questions about these terms can be sent to ${COMPANY.email}.`],
    ],
  },
};

export function Legal({ type }) {
  const doc = LEGAL[type];
  return (
    <>
      <Seo page={type} path={doc.path} fallbackTitle={`${doc.title} | HYXC Interiors`} fallbackDescription={doc.description} />
      <PageHeader title={doc.title} subtitle="Last updated: November 2026. Please have this text reviewed by your legal adviser before launch." />
      <section className="section-y">
        <div className="container-x max-w-3xl space-y-8">
          {doc.sections.map(([h, t]) => <div key={h}><h2 className="text-xl font-semibold">{h}</h2><p className="mt-2 leading-relaxed text-navy/70">{t}</p></div>)}
        </div>
      </section>
    </>
  );
}

/* ================= 404 ================= */
export function NotFound() {
  return (
    <>
      <Seo page="404" fallbackTitle="Page not found | HYXC Interiors" />
      <div className="container-x flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
        <p className="font-serif text-7xl font-bold text-gold">404</p>
        <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-navy/65">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="btn btn-gold mt-8">Back to Home</Link>
      </div>
    </>
  );
}
