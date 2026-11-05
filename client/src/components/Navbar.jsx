import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { NAV_LINKS, waLink } from '../lib/constants.js';
import { useSite } from '../context/SiteContext.jsx';
import WhatsAppIcon from './WhatsAppIcon.jsx';

// The original logo file is used untouched; it is only displayed inside a circular frame.
export const Logo = ({ size = 'h-12 w-12', text = true }) => (
  <Link to="/" className="flex items-center gap-3" aria-label="HYXC Interiors home">
    <img src="/logo.jpg" alt="HYXC Interiors logo" className={`${size} rounded-full object-cover ring-1 ring-gold/40`} width="48" height="48" />
    {text && (
      <span className="hidden leading-tight sm:block">
        <span className="block font-serif text-xl font-bold tracking-[0.18em] text-gold">HYXC</span>
        <span className="block text-[10px] uppercase tracking-[0.3em] text-white/60">Interiors</span>
      </span>
    )}
  </Link>
);

export default function Navbar() {
  const { services, contact } = useSite();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const dropRef = useRef(null);

  useEffect(() => { setOpen(false); setDropdown(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const close = (e) => dropRef.current && !dropRef.current.contains(e.target) && setDropdown(false);
    const esc = (e) => e.key === 'Escape' && (setDropdown(false), setOpen(false));
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, []);

  const linkCls = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-medium transition-colors ${isActive ? 'text-gold' : 'text-white/85 hover:text-gold'}`;

  const Indicator = ({ isActive }) =>
    isActive ? <motion.span layoutId="nav-underline" className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded bg-gold" /> : null;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy/95 shadow-lg backdrop-blur' : 'bg-navy'} border-b border-gold/15`}>
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) =>
            l.dropdown ? (
              <div key={l.to} ref={dropRef} className="relative" onMouseEnter={() => setDropdown(true)} onMouseLeave={() => setDropdown(false)}>
                <NavLink to={l.to} end={false} className={linkCls} aria-haspopup="true" aria-expanded={dropdown}>
                  {({ isActive }) => (<><span className="inline-flex items-center gap-1">{l.label}<ChevronDown className={`h-3.5 w-3.5 transition ${dropdown ? 'rotate-180' : ''}`} /></span><Indicator isActive={isActive} /></>)}
                </NavLink>
                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
                    >
                      <div className="overflow-hidden rounded-xl border border-gold/20 bg-navy-800 py-2 shadow-2xl">
                        {services.length === 0 && <p className="px-4 py-3 text-sm text-white/50">Services coming soon</p>}
                        {services.map((s) => (
                          <Link key={s._id} to={`/services/${s.slug}`} className="block px-4 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-gold">{s.title}</Link>
                        ))}
                        <Link to="/services" className="mt-1 flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-sm font-semibold text-gold">
                          All services <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkCls}>
                {({ isActive }) => (<>{l.label}<Indicator isActive={isActive} /></>)}
              </NavLink>
            )
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a href={waLink(contact.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="hidden h-10 w-10 items-center justify-center rounded-full text-[#25D366] transition hover:bg-white/10 sm:flex">
            <WhatsAppIcon />
          </a>
          <Link to="/contact" className="btn btn-gold hidden px-5 py-2.5 sm:inline-flex">Get a Free Quote <ArrowRight className="h-4 w-4" /></Link>
          <button onClick={() => setOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden" aria-label="Open menu" aria-expanded={open}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="fixed right-0 top-0 z-50 flex h-full w-[86%] max-w-sm flex-col bg-navy shadow-2xl lg:hidden"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
              role="dialog" aria-modal="true" aria-label="Menu"
            >
              <div className="flex h-[72px] items-center justify-between border-b border-gold/15 px-5">
                <Logo />
                <button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-lg text-white" aria-label="Close menu"><X className="h-6 w-6" /></button>
              </div>
              <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
                {NAV_LINKS.map((l) =>
                  l.dropdown ? (
                    <div key={l.to} className="border-b border-white/10">
                      <button onClick={() => setMobileServices((v) => !v)} className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-white/90" aria-expanded={mobileServices}>
                        {l.label}<ChevronDown className={`h-4 w-4 transition ${mobileServices ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileServices && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <Link to="/services" className="block py-2 pl-3 text-sm font-semibold text-gold">All services</Link>
                            {services.map((s) => <Link key={s._id} to={`/services/${s.slug}`} className="block py-2 pl-3 text-sm text-white/70">{s.title}</Link>)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `block border-b border-white/10 py-4 text-base font-medium ${isActive ? 'text-gold' : 'text-white/90'}`}>{l.label}</NavLink>
                  )
                )}
              </nav>
              <div className="space-y-3 border-t border-gold/15 p-5">
                <Link to="/contact" className="btn btn-gold w-full">Get a Free Quote</Link>
                <a href={waLink(contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn w-full border border-[#25D366]/60 text-[#25D366]"><WhatsAppIcon className="h-5 w-5" /> WhatsApp us</a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
