import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { EmptyBlock, ErrorBlock, LoadingBlock, SmartImage } from './ui.jsx';
import useFetch from '../hooks/useFetch.js';
import { api } from '../lib/api.js';

export default function TestimonialCarousel() {
  const { data, loading, error, reload } = useFetch(() => api.testimonials(), []);
  const [i, setI] = useState(0);
  const items = data || [];

  useEffect(() => {
    if (items.length < 2) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length, i]);

  if (loading) return <LoadingBlock />;
  if (error) return <ErrorBlock error={error} onRetry={reload} />;
  if (!items.length) return <EmptyBlock title="Client reviews coming soon" text="We will share genuine client feedback here." />;

  const t = items[i % items.length];
  const go = (d) => setI((n) => (n + d + items.length) % items.length);

  return (
    <div className="relative mx-auto max-w-3xl">
      <AnimatePresence mode="wait">
        <motion.figure
          key={t._id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}
          className="relative rounded-2xl border border-gold/25 bg-white p-8 text-center shadow-card sm:p-12"
        >
          <Quote className="mx-auto h-9 w-9 text-gold" aria-hidden />
          <blockquote className="mt-5 text-lg leading-relaxed text-navy/80 sm:text-xl">&ldquo;{t.text}&rdquo;</blockquote>
          <figcaption className="mt-7 flex flex-col items-center gap-2">
            {t.photo && <SmartImage src={t.photo} alt={t.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-gold" />}
            <span className="font-serif text-lg font-semibold">{t.name}</span>
            {t.role && <span className="text-xs uppercase tracking-widest text-navy/50">{t.role}</span>}
            {t.rating && (
              <span className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, n) => <Star key={n} className={`h-4 w-4 ${n < t.rating ? 'fill-gold text-gold' : 'text-navy/20'}`} />)}
              </span>
            )}
            {t.isPlaceholder && <span className="rounded-full bg-navy/5 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy/50">Placeholder</span>}
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      {items.length > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label="Previous review" className="absolute -left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-gold shadow-lg transition hover:bg-gold hover:text-navy sm:-left-6"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={() => go(1)} aria-label="Next review" className="absolute -right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-gold shadow-lg transition hover:bg-gold hover:text-navy sm:-right-6"><ChevronRight className="h-5 w-5" /></button>
          <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Choose review">
            {items.map((_, n) => <button key={n} role="tab" aria-selected={n === i % items.length} aria-label={`Review ${n + 1}`} onClick={() => setI(n)} className={`h-2 rounded-full transition-all ${n === i % items.length ? 'w-7 bg-gold' : 'w-2 bg-navy/20'}`} />)}
          </div>
        </>
      )}
    </div>
  );
}
