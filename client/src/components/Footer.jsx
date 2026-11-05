import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { useSite } from '../context/SiteContext.jsx';
import { Logo } from './Navbar.jsx';

const QUICK = [
  ['Home', '/'], ['About Us', '/about'], ['Services', '/services'], ['Projects', '/projects'],
  ['Our Process', '/process'], ['FAQ', '/faq'], ['Contact', '/contact'],
];

export default function Footer() {
  const { services, contact, social } = useSite();
  const socials = [
    { key: 'facebook', label: 'Facebook', Icon: Facebook },
    { key: 'instagram', label: 'Instagram', Icon: Instagram },
    { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
    { key: 'youtube', label: 'YouTube', Icon: Youtube },
  ];

  return (
    <footer className="relative overflow-hidden bg-navy text-white/75">
      <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="h-16 w-16" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">Premium interior design, renovation, flooring and fit-out solutions for homes and businesses across the UAE.</p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ key, label, Icon }) =>
              social[key] ? (
                <a key={key} href={social[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition hover:bg-gold hover:text-navy"><Icon className="h-4 w-4" /></a>
              ) : (
                // Profile URL not set yet: the icon is shown disabled instead of linking nowhere.
                <span key={key} title={`${label} link not added yet`} aria-label={`${label} (not set)`} className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-white/10 text-white/30"><Icon className="h-4 w-4" /></span>
              )
            )}
          </div>
        </div>

        <nav aria-label="Quick links">
          <h3 className="mb-5 font-serif text-lg text-gold">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            {QUICK.map(([l, to]) => <li key={to}><Link to={to} className="transition hover:text-gold">{l}</Link></li>)}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h3 className="mb-5 font-serif text-lg text-gold">Our Services</h3>
          <ul className="space-y-2.5 text-sm">
            {services.slice(0, 6).map((s) => <li key={s._id}><Link to={`/services/${s.slug}`} className="transition hover:text-gold">{s.title}</Link></li>)}
            {services.length === 0 && <li><Link to="/services" className="hover:text-gold">View services</Link></li>}
          </ul>
        </nav>

        <div>
          <h3 className="mb-5 font-serif text-lg text-gold">Contact</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="hover:text-gold">{contact.phone}</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`mailto:${contact.email}`} className="hover:text-gold">{contact.email}</a></li>
            <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><span>{contact.address}</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <p>&copy; {new Date().getFullYear()} HYXC Interiors. All Rights Reserved.</p>
          <p className="flex items-center gap-3">
            <Link to="/privacy-policy" className="hover:text-gold">Privacy Policy</Link><span aria-hidden>|</span>
            <Link to="/terms-and-conditions" className="hover:text-gold">Terms &amp; Conditions</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
