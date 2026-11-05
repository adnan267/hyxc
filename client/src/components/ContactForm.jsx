import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { api } from '../lib/api.js';
import { BUDGETS, PROPERTY_TYPES } from '../lib/constants.js';
import { useSite } from '../context/SiteContext.jsx';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(7, 'Enter a valid phone number').regex(/^[0-9+()\-\s]+$/, 'Use digits, +, - and spaces only'),
  projectLocation: z.string().trim().optional(),
  propertyType: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  details: z.string().trim().max(3000, 'Please keep details under 3000 characters').optional(),
  website: z.string().optional(), // honeypot
});

export default function ContactForm({ dark = false, defaultService = '', sourcePage = '' }) {
  const { services } = useSite();
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { service: defaultService, propertyType: '', budget: '' },
  });

  const onSubmit = async (values) => {
    setStatus({ type: 'idle', message: '' });
    try {
      const res = await api.sendEnquiry({ ...values, sourcePage });
      setStatus({ type: 'success', message: res.message });
      reset({ service: defaultService, propertyType: '', budget: '' });
    } catch (err) {
      // Map server-side validation errors back onto fields.
      err.errors?.forEach((e) => e.field && setError(e.field, { message: e.message }));
      setStatus({ type: 'error', message: err.message });
    }
  };

  const inp = `input ${dark ? 'input-dark' : ''}`;
  const lbl = `label ${dark ? 'label-dark' : ''}`;
  const opt = dark ? 'text-navy' : '';
  const Err = ({ name }) => errors[name] ? <p className="mt-1 text-xs text-red-400" role="alert">{errors[name].message}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2" aria-label="Request a free consultation">
      {/* Honeypot: hidden from people, bots tend to fill it */}
      <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label></div>

      <div><label className={lbl} htmlFor="fullName">Full Name *</label><input id="fullName" autoComplete="name" className={inp} placeholder="Your full name" {...register('fullName')} /><Err name="fullName" /></div>
      <div><label className={lbl} htmlFor="email">Email Address *</label><input id="email" type="email" autoComplete="email" className={inp} placeholder="you@example.com" {...register('email')} /><Err name="email" /></div>
      <div><label className={lbl} htmlFor="phone">Phone Number *</label><input id="phone" type="tel" autoComplete="tel" className={inp} placeholder="+971 5X XXX XXXX" {...register('phone')} /><Err name="phone" /></div>
      <div><label className={lbl} htmlFor="projectLocation">Project Location</label><input id="projectLocation" className={inp} placeholder="e.g. Dubai Marina, Ajman" {...register('projectLocation')} /></div>
      <div>
        <label className={lbl} htmlFor="propertyType">Property Type</label>
        <select id="propertyType" className={inp} {...register('propertyType')}>
          <option value="" className={opt}>Select property type</option>
          {PROPERTY_TYPES.map((p) => <option key={p} className={opt}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className={lbl} htmlFor="service">Service Required</label>
        <select id="service" className={inp} {...register('service')}>
          <option value="" className={opt}>Select a service</option>
          {services.map((s) => <option key={s._id} value={s.title} className={opt}>{s.title}</option>)}
          <option value="Other" className={opt}>Other</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={lbl} htmlFor="budget">Estimated Budget</label>
        <select id="budget" className={inp} {...register('budget')}>
          <option value="" className={opt}>Select budget range</option>
          {BUDGETS.map((b) => <option key={b} className={opt}>{b}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2"><label className={lbl} htmlFor="details">Project Details</label><textarea id="details" rows={4} className={inp} placeholder="Tell us about your space and what you would like to achieve" {...register('details')} /><Err name="details" /></div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={isSubmitting} className="btn btn-gold w-full py-4 tracking-wider">
          {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> SENDING...</> : <>REQUEST FREE CONSULTATION <Send className="h-4 w-4" /></>}
        </button>
        <div aria-live="polite">
          {status.type === 'success' && <p className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{status.message}</p>}
          {status.type === 'error' && <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{status.message}</p>}
        </div>
      </div>
    </form>
  );
}
