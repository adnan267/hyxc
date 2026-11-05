import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../lib/api.js';
import useFetch from '../hooks/useFetch.js';
import { ErrorBlock, LoadingBlock } from '../components/ui.jsx';
import { Card, FieldControl, Notice, PageTitle } from './Fields.jsx';

const PAGES = [['home', 'Home'], ['about', 'About Us'], ['services', 'Services'], ['projects', 'Projects'], ['process', 'Our Process'], ['faq', 'FAQ'], ['contact', 'Contact'], ['privacy', 'Privacy Policy'], ['terms', 'Terms & Conditions']];

const FIELDS = [
  { name: 'title', label: 'SEO title', help: 'Aim for 50-60 characters.' },
  { name: 'description', label: 'Meta description', type: 'textarea', rows: 3, help: 'Aim for 140-160 characters.' },
  { name: 'keywords', label: 'Keywords (comma separated)' },
  { name: 'ogImage', label: 'Open Graph image', type: 'image' },
  { name: 'canonical', label: 'Canonical URL', placeholder: 'https://hyxc.ae/about' },
];

export default function SeoAdmin() {
  const { data, loading, error, reload } = useFetch(() => api.admin.seo(), []);
  const [page, setPage] = useState('home');
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({});

  useEffect(() => { if (data) setForm(data.find((s) => s.page === page) || {}); setMsg({}); }, [data, page]);

  if (loading) return <LoadingBlock />;
  if (error) return <ErrorBlock error={error} onRetry={reload} />;

  const save = async () => {
    setSaving(true); setMsg({});
    try { await api.admin.saveSeo(page, form); setMsg({ type: 'ok', text: 'SEO saved.' }); reload(); } catch (e) { setMsg({ type: 'error', text: e.message }); } finally { setSaving(false); }
  };

  return (
    <>
      <PageTitle title="SEO" subtitle="Page titles, descriptions and social sharing details." />
      <div className="mb-4 flex flex-wrap gap-2">
        {PAGES.map(([k, l]) => <button key={k} onClick={() => setPage(k)} className={`rounded-full px-4 py-1.5 text-sm ${page === k ? 'bg-navy text-gold' : 'bg-white text-navy/70 hover:bg-slate-50'}`}>{l}</button>)}
      </div>
      <Card title={`${PAGES.find(([k]) => k === page)[1]} page`} className="max-w-2xl">
        <div className="space-y-4">{FIELDS.map((f) => <FieldControl key={f.name} field={f} value={form[f.name]} onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))} />)}</div>
        <div className="mt-4"><Notice type={msg.type === 'ok' ? 'ok' : 'error'}>{msg.text}</Notice></div>
        <button onClick={save} disabled={saving} className="btn btn-gold mt-5">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save SEO</button>
      </Card>
    </>
  );
}
