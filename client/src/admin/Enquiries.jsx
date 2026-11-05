import { useState } from 'react';
import { Mail, Phone, Trash2, X } from 'lucide-react';
import { api } from '../lib/api.js';
import useFetch from '../hooks/useFetch.js';
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ui.jsx';
import { Card, Notice, PageTitle } from './Fields.jsx';
import { StatusBadge } from './Dashboard.jsx';

const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];

export default function Enquiries() {
  const [filter, setFilter] = useState('all');
  const { data, loading, error, reload } = useFetch(() => api.admin.list('enquiries'), []);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const list = (data || []).filter((e) => filter === 'all' || e.status === filter);
  const open = (e) => { setSelected(e); setNotes(e.notes || ''); setMsg({}); };

  const patch = async (body, okText) => {
    try {
      const updated = await api.admin.patch('enquiries', selected._id, body);
      setSelected(updated); setMsg({ type: 'ok', text: okText }); reload();
    } catch (e) { setMsg({ type: 'error', text: e.message }); }
  };

  const remove = async () => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    try { await api.admin.remove('enquiries', selected._id); setSelected(null); reload(); } catch (e) { setMsg({ type: 'error', text: e.message }); }
  };

  return (
    <>
      <PageTitle title="Enquiries" subtitle="Customer requests submitted through the website." />
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...STATUSES].map((s) => <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${filter === s ? 'bg-navy text-gold' : 'bg-white text-navy/70 hover:bg-slate-50'}`}>{s}</button>)}
      </div>
      <Card>
        {loading ? <LoadingBlock /> : error ? <ErrorBlock error={error} onRetry={reload} /> : list.length === 0 ? <EmptyBlock title="No enquiries" text="Nothing matches this filter yet." /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-wider text-navy/50"><tr><th className="py-3 pr-4">Customer</th><th className="hidden px-4 sm:table-cell">Service</th><th className="hidden px-4 md:table-cell">Date</th><th className="px-4">Status</th></tr></thead>
              <tbody className="divide-y">
                {list.map((e) => (
                  <tr key={e._id} onClick={() => open(e)} className="cursor-pointer hover:bg-slate-50">
                    <td className="py-3 pr-4"><p className="font-medium">{e.fullName}</p><p className="text-xs text-navy/55">{e.email}</p></td>
                    <td className="hidden px-4 text-navy/70 sm:table-cell">{e.service || '-'}</td>
                    <td className="hidden px-4 text-navy/70 md:table-cell">{new Date(e.createdAt).toLocaleString()}</td>
                    <td className="px-4"><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" role="dialog" aria-modal="true">
          <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between"><div><h2 className="text-xl font-semibold">{selected.fullName}</h2><p className="text-xs text-navy/50">{new Date(selected.createdAt).toLocaleString()}</p></div><button onClick={() => setSelected(null)} aria-label="Close"><X className="h-5 w-5" /></button></div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <a href={`mailto:${selected.email}`} className="btn btn-outline-dark px-4 py-2"><Mail className="h-4 w-4" />{selected.email}</a>
              <a href={`tel:${selected.phone}`} className="btn btn-outline-dark px-4 py-2"><Phone className="h-4 w-4" />{selected.phone}</a>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {[['Location', selected.projectLocation], ['Property type', selected.propertyType], ['Service', selected.service], ['Budget', selected.budget], ['Submitted from', selected.sourcePage]].map(([k, v]) => <div key={k}><dt className="text-xs uppercase tracking-wider text-navy/50">{k}</dt><dd className="mt-0.5 font-medium">{v || '-'}</dd></div>)}
            </dl>
            <div className="mt-5"><p className="text-xs uppercase tracking-wider text-navy/50">Project details</p><p className="mt-1 whitespace-pre-line rounded-lg bg-slate-50 p-3 text-sm">{selected.details || 'No details provided.'}</p></div>

            <div className="mt-6"><label className="label" htmlFor="status">Status</label>
              <select id="status" className="input" value={selected.status} onChange={(e) => patch({ status: e.target.value }, 'Status updated.')}>{STATUSES.map((s) => <option key={s} className="capitalize">{s}</option>)}</select>
            </div>
            <div className="mt-4"><label className="label" htmlFor="notes">Internal notes</label>
              <textarea id="notes" rows={4} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to admins" />
              <button onClick={() => patch({ notes }, 'Notes saved.')} className="btn btn-gold mt-2 px-5 py-2">Save notes</button>
            </div>
            <div className="mt-4"><Notice type={msg.type === 'ok' ? 'ok' : 'error'}>{msg.text}</Notice></div>
            <button onClick={remove} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-red-600"><Trash2 className="h-4 w-4" />Delete enquiry</button>
          </div>
        </div>
      )}
    </>
  );
}
