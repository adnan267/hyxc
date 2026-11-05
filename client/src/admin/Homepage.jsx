import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../lib/api.js';
import useFetch from '../hooks/useFetch.js';
import { ErrorBlock, LoadingBlock } from '../components/ui.jsx';
import { Card, FieldControl, Notice, PageTitle } from './Fields.jsx';

const HERO = [
  { name: 'heroHeadingLine1', label: 'Hero heading, line 1 (gold)' },
  { name: 'heroHeadingLine2', label: 'Hero heading, line 2 (white)' },
  { name: 'heroDescription', label: 'Hero description', type: 'textarea', rows: 2 },
  { name: 'heroImage', label: 'Hero background image', type: 'image' },
  { name: 'aboutImage', label: 'About section image', type: 'image' },
];
const CONTACT = [
  { name: 'contactPhone', label: 'Phone' },
  { name: 'contactWhatsapp', label: 'WhatsApp number', placeholder: '971528868393', help: 'International format, digits only, no + or spaces.' },
  { name: 'contactEmail', label: 'Email', type: 'email' },
  { name: 'contactAddress', label: 'Address' },
  { name: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
  { name: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
  { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/...' },
  { name: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/...' },
];

export default function Homepage() {
  const settings = useFetch(() => api.admin.settings(), []);
  const projects = useFetch(() => api.admin.list('projects'), []);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => { if (settings.data) setForm({ ...settings.data, featuredProjects: (settings.data.featuredProjects || []).map(String) }); }, [settings.data]);

  if (settings.loading || projects.loading || !form) return settings.error ? <ErrorBlock error={settings.error} onRetry={settings.reload} /> : <LoadingBlock />;
  const set = (name) => (v) => setForm((f) => ({ ...f, [name]: v }));
  const toggleFeatured = (id) => setForm((f) => ({ ...f, featuredProjects: f.featuredProjects.includes(id) ? f.featuredProjects.filter((x) => x !== id) : [...f.featuredProjects, id] }));

  const save = async () => {
    setSaving(true); setMsg({});
    try { await api.admin.saveSettings(form); setMsg({ type: 'ok', text: 'Homepage settings saved.' }); } catch (e) { setMsg({ type: 'error', text: e.message }); } finally { setSaving(false); }
  };

  return (
    <>
      <PageTitle title="Homepage" subtitle="Edit the hero, featured projects and contact information." action={<button onClick={save} disabled={saving} className="btn btn-gold">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save changes</button>} />
      <Notice type={msg.type === 'ok' ? 'ok' : 'error'}>{msg.text}</Notice>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <Card title="Hero & images"><div className="space-y-4">{HERO.map((f) => <FieldControl key={f.name} field={f} value={form[f.name]} onChange={set(f.name)} />)}</div></Card>
        <Card title="Contact information & social links"><div className="space-y-4">{CONTACT.map((f) => <FieldControl key={f.name} field={f} value={form[f.name]} onChange={set(f.name)} />)}</div></Card>
        <Card title="Featured projects" className="lg:col-span-2">
          {!projects.data?.length ? <p className="text-sm text-navy/60">Add projects first, then pick the ones to feature.</p> : (
            <div className="grid gap-2 sm:grid-cols-2">
              {projects.data.map((p) => (
                <label key={p._id} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm hover:bg-slate-50">
                  <input type="checkbox" className="h-4 w-4 accent-[#D6B34E]" checked={form.featuredProjects.includes(p._id)} onChange={() => toggleFeatured(p._id)} />
                  <span className="font-medium">{p.title}</span><span className="ml-auto text-xs text-navy/50">{p.category}</span>
                </label>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
