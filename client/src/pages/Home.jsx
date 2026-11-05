import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Building2, CalendarCheck, Hammer, Home as HomeIcon, Layers, MousePointer2 } from 'lucide-react';
import { useSite } from '../context/SiteContext.jsx';
import { ArrowLink, Reveal, SectionHeading, Seo, SmartImage } from '../components/ui.jsx';
import { BeforeAfterSection, ContactSection, ProcessTimeline, ProjectsGrid, ServicesGrid, WhyChoose } from '../components/sections.jsx';
import TestimonialCarousel from '../components/TestimonialCarousel.jsx';
import { COMPANY } from '../lib/constants.js';

const HIGHLIGHTS = [
  { icon: HomeIcon, label: 'Residential' }, { icon: Building2, label: 'Commercial' },
  { icon: Hammer, label: 'Renovation' }, { icon: Layers, label: 'Flooring' },
];

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: COMPANY.name,
  url: COMPANY.url,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  image: `${COMPANY.url}/logo.jpg`,
  address: { '@type': 'PostalAddress', addressLocality: 'Ajman', addressCountry: 'AE' },
  areaServed: ['Dubai', 'Ajman', 'Sharjah', 'Abu Dhabi', 'United Arab Emirates'],
  description: 'Interior design, renovation, flooring, fit-out and decorative solutions across the UAE.',
};

export default function Home() {
  const { settings } = useSite();
  const reduce = useReducedMotion();
  const line1 = settings.heroHeadingLine1 || 'Transform Your Space.';
  const line2 = settings.heroHeadingLine2 || 'Elevate Your Lifestyle.';
  const fade = (d) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] } });

  return (
    <>
      <Seo page="home" path="/" fallbackTitle="HYXC Interiors | Interior Design & Fit-Out Company in UAE"
        fallbackDescription="Premium interior design, renovation, SPC flooring, media walls, kitchen makeovers and outdoor solutions across Dubai, Ajman, Sharjah and the UAE."
        jsonLd={localBusiness} />

      {/* 02 HERO */}
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy pt-[72px]">
        <motion.div className="absolute inset-0 -z-20" initial={reduce ? false : { scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 14, ease: 'easeOut' }}>
          <SmartImage src={settings.heroImage} alt="Luxury modern living room interior" eager className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/80 to-navy/20" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy to-transparent" />

        <div className="container-x py-16">
          <motion.span {...fade(0.1)} className="eyebrow">HYXC Interiors</motion.span>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] sm:text-6xl lg:text-7xl">
            <motion.span {...fade(0.2)} className="block bg-gold-gradient bg-clip-text text-transparent">{line1}</motion.span>
            <motion.span {...fade(0.35)} className="block text-white">{line2}</motion.span>
          </h1>
          <motion.p {...fade(0.5)} className="mt-6 max-w-xl text-lg text-white/85">{settings.heroDescription || 'Premium Interior Design & Fit-Out Solutions Across the UAE.'}</motion.p>
          <motion.div {...fade(0.65)} className="mt-9 flex flex-wrap gap-4">
            <Link to="/projects" className="btn btn-gold">Explore Our Projects <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/contact" className="btn btn-outline">Get Free Consultation <CalendarCheck className="h-4 w-4" /></Link>
          </motion.div>
          <motion.ul {...fade(0.8)} className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm font-medium text-white/90"><Icon className="h-5 w-5 text-gold" />{label}</li>
            ))}
          </motion.ul>
        </div>

        <a href="#about" aria-label="Scroll down" className="absolute bottom-6 right-6 hidden items-center gap-2 text-xs uppercase tracking-widest text-white/70 transition hover:text-gold sm:flex">
          <MousePointer2 className="h-4 w-4 animate-bounce" /> Scroll Down
        </a>
      </section>

      {/* 03 ABOUT */}
      <section id="about" className="section-y relative overflow-hidden bg-sand">
        {/* Oversized watermark: the original logo, untouched, shown very faintly */}
        <img src="/logo.jpg" alt="" aria-hidden="true" loading="lazy" className="pointer-events-none absolute -right-24 top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 rounded-full opacity-[0.06] grayscale lg:block" />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl border border-gold/50" aria-hidden />
              <SmartImage src={settings.aboutImage} alt="Premium interior by HYXC Interiors" width="900" height="700" className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-card" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">About HYXC</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Creating Spaces <span className="text-gold-dark">That Inspire.</span></h2>
            <p className="mt-6 max-w-xl leading-relaxed text-navy/70">At HYXC, we believe every space deserves a perfect balance of beauty, comfort and functionality. We provide tailored interior design, renovation, flooring and decorative solutions to transform residential and commercial spaces across the UAE.</p>
            <Link to="/about" className="btn btn-gold mt-8">Discover Our Story <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </div>
      </section>

      {/* 04 SERVICES */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading title="Our Interior Solutions" subtitle="Comprehensive interior services tailored to your needs." />
          <ServicesGrid />
        </div>
      </section>

      {/* 05 PROJECTS */}
      <section className="section-y bg-sand">
        <div className="container-x">
          <SectionHeading eyebrow="Portfolio" title="Our Recent Transformations" subtitle="Explore our interior projects across the UAE." />
          <ProjectsGrid limit={6} />
          <div className="mt-10 text-center"><ArrowLink to="/projects">View all projects</ArrowLink></div>
        </div>
      </section>

      {/* 06 BEFORE / AFTER */}
      <BeforeAfterSection />

      {/* 07 WHY */}
      <WhyChoose />

      {/* 08 PROCESS */}
      <section className="section-y bg-sand">
        <div className="container-x">
          <SectionHeading eyebrow="How we work" title="From Vision to Reality" subtitle="From vision to reality, in 5 simple steps." />
          <ProcessTimeline />
        </div>
      </section>

      {/* 09 TESTIMONIALS */}
      <section className="section-y bg-white">
        <div className="container-x">
          <SectionHeading eyebrow="Testimonials" title="What Our Clients Say" />
          <TestimonialCarousel />
        </div>
      </section>

      {/* 10 CONTACT */}
      <ContactSection />
    </>
  );
}
