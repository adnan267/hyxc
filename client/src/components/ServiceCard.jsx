import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SmartImage } from './ui.jsx';

export default function ServiceCard({ service, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-shadow hover:border-gold/60 hover:shadow-card"
    >
      <Link to={`/services/${service.slug}`} className="flex h-full flex-col" aria-label={`${service.title}: explore more`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage src={service.image} alt={`${service.title} by HYXC Interiors`} width="640" height="480" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-70" />
          <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-3 py-1 font-serif text-xs font-semibold tracking-widest text-gold backdrop-blur">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold leading-snug">{service.title}</h3>
          <p className="mt-2 flex-1 text-sm text-navy/65">{service.shortDescription}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark">
            Explore More
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-gold transition group-hover:bg-gold group-hover:text-navy"><ArrowUpRight className="h-4 w-4" /></span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
