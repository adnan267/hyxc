import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { AlertCircle, ArrowRight, ImageOff, Inbox, Loader2 } from 'lucide-react';
import { COMPANY } from '../lib/constants.js';
import useFetch from '../hooks/useFetch.js';
import { api } from '../lib/api.js';

// Cloudinary delivery optimisation: serve WebP/AVIF automatically at sensible quality.
export function optimizeUrl(src) {
  if (typeof src !== 'string' || !src.includes('res.cloudinary.com') || !src.includes('/image/upload/') || /\/image\/upload\/[^/]*(f_auto|q_auto)/.test(src)) return src;
  return src.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}

/* ---------- Image with lazy loading + graceful fallback ---------- */
export function SmartImage({ src, alt, className = '', eager = false, ...rest }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-navy via-navy-700 to-royal text-gold/60 ${className}`} role="img" aria-label={alt}>
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }
  return (
    <img
      src={optimizeUrl(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}

/* ---------- Scroll reveal ---------- */
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false }) {
  return (
    <Reveal className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}>
      {eyebrow && <span className={`eyebrow ${align === 'center' ? 'justify-center' : ''}`}>{eyebrow}</span>}
      <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl lg:text-[2.6rem] ${dark ? 'text-white' : 'text-navy'}`}>{title}</h2>
      {align === 'center' && <div className="gold-rule mt-5" />}
      {subtitle && <p className={`mt-4 max-w-2xl text-base ${align === 'center' ? 'mx-auto' : ''} ${dark ? 'text-white/70' : 'text-navy/65'}`}>{subtitle}</p>}
    </Reveal>
  );
}

/* ---------- Page banner for inner pages ---------- */
export function PageHeader({ eyebrow, title, subtitle, image }) {
  return (
    <header className="relative isolate overflow-hidden bg-navy pt-32 pb-16 sm:pt-40 sm:pb-24">
      {image && <SmartImage src={image} alt="" eager className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/80 via-navy/70 to-navy" />
      <div className="container-x text-center">
        {eyebrow && <span className="eyebrow justify-center">{eyebrow}</span>}
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">{title}</h1>
        <div className="gold-rule mt-6" />
        {subtitle && <p className="mx-auto mt-5 max-w-2xl text-white/75">{subtitle}</p>}
      </div>
    </header>
  );
}

/* ---------- Page-level SEO (title, description, OG, canonical, JSON-LD) ----------
   CMS values from Admin -> SEO override the built-in defaults when present. */
export function Seo({ page, fallbackTitle, fallbackDescription, path = '', image, jsonLd }) {
  const { data } = useFetch(() => api.seo(page), [page]);
  const title = data?.title || fallbackTitle;
  const description = data?.description || fallbackDescription;
  const canonical = data?.canonical || `${COMPANY.url}${path}`;
  const og = data?.ogImage || image;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {data?.keywords && <meta name="keywords" content={data.keywords} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={COMPANY.name} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      {og && <meta property="og:image" content={og} />}
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}

/* ---------- Loading / empty / error states ---------- */
export const LoadingBlock = ({ label = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-navy/60" role="status">
    <Loader2 className="h-5 w-5 animate-spin text-gold-dark" /> {label}
  </div>
);

export const EmptyBlock = ({ title = 'Nothing here yet', text, action }) => (
  <div className="mx-auto max-w-md py-16 text-center">
    <Inbox className="mx-auto h-10 w-10 text-gold-dark/70" />
    <h3 className="mt-4 text-xl font-semibold">{title}</h3>
    {text && <p className="mt-2 text-sm text-navy/60">{text}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export const ErrorBlock = ({ error, onRetry }) => (
  <div className="mx-auto max-w-md py-16 text-center" role="alert">
    <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
    <h3 className="mt-4 text-xl font-semibold">Something went wrong</h3>
    <p className="mt-2 text-sm text-navy/60">{error?.message || 'Please try again.'}</p>
    {onRetry && <button onClick={onRetry} className="btn btn-gold mt-5">Try again</button>}
  </div>
);

/* ---------- Text link with arrow ---------- */
export const ArrowLink = ({ to, children, className = '' }) => (
  <Link to={to} className={`group inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark ${className}`}>
    {children} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
  </Link>
);
