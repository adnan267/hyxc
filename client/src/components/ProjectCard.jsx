import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { SmartImage } from './ui.jsx';

export default function ProjectCard({ project }) {
  return (
    <motion.article layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl bg-navy shadow-card">
      <Link to={`/projects/${project.slug}`} aria-label={`View project: ${project.title}`}>
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5]">
          <SmartImage src={project.coverImage} alt={`${project.title}, ${project.category} project in ${project.location || 'the UAE'}`} width="800" height="1000" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-90 transition group-hover:opacity-100" />
          {project.isDemo && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy">Demo content</span>}
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">{project.category}</span>
            <h3 className="mt-1 text-xl font-semibold leading-snug">{project.title}</h3>
            {project.location && <p className="mt-1 flex items-center gap-1.5 text-sm text-white/70"><MapPin className="h-3.5 w-3.5 text-gold" />{project.location}</p>}
            <span className="mt-4 inline-flex translate-y-2 items-center gap-1.5 rounded-full border border-gold/60 px-4 py-1.5 text-xs font-semibold text-gold opacity-80 transition duration-300 group-hover:translate-y-0 group-hover:bg-gold group-hover:text-navy group-hover:opacity-100">
              View Project <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
