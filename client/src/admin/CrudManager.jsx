import { useState } from 'react';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { api } from '../lib/api.js';
import useFetch from '../hooks/useFetch.js';
import { EmptyBlock, ErrorBlock, LoadingBlock, SmartImage } from '../components/ui.jsx';
import { Card, FieldControl, Notice, PageTitle } from './Fields.jsx';

/**
 * Generic admin list + create/edit modal.
 * config: { resource, title, singular, fields, defaults, columns: [{label, render}] }
 */
export default function CrudManager({ config }) {
  const { resource, title, singular, fields, defaults, columns, subtitle } = config;
  const { data, loading, error, reload } = useFetch(() => api.admin.list(resource), [resource]);
  const [editing, setEditing] = useState(null); // null | {} (new) | record
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const openNew = () => { setForm({ ...defaults }); setEditing({}); setMsg({}); };
  const openEdit = (rec) => { setForm({ ...defaults, ...rec }); setEditing(rec); setMsg({}); };
  const close = () => setEditing(null);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMsg({});
    try {
      if (editing._id) await api.admin.update(resource, editing._id, form);
      else await api.admin.create(resource, form);
      close(); reload();
    } catch (err) {
      setMsg({ type: 'error', text: err.errors?.map((x) => x.message).join(', ') || err.message });
    } finally { setSaving(false); }
  };

  const remove = async (rec) => {
    if (!window.confirm(`Delete this ${singular}? This cannot be undone.`)) return;
    try { await api.admin.remove(resource, rec._id); reload(); } catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  const togglePublished = async (rec) => {
    try { await api.admin.update(resource, rec._id, { ...rec, published: !rec.published }); reload(); } catch (err) { setMsg({ type: 'error', text: err.message }); }
  };

  return (
    <>
      <PageTitle title={title} subtitle={subtitle} action={<button onClick={openNew} className="btn btn-gold"><Plus className="h-4 w-4" />Add {singular}</button>} />
      <Notice>{!editing && msg.text}</Notice>
      <Card>
        {loading ? <LoadingBlock /> : error ? <ErrorBlock error={error} onRetry={reload} /> : !data?.length ? (
          <EmptyBlock title={`No ${title.toLowerCase()} yet`} text={`Click "Add ${singular}" to create the first one.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs uppercase tracking-wider text-navy/50">
                <tr><th className="py-3 pr-4">{singular}</th>{columns.map((c) => <th key={c.label} className="hidden px-4 py-3 sm:table-cell">{c.label}</th>)}<th className="px-4 py-3">Status</th><th className="py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {data.map((rec) => (
                  <tr key={rec._id}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        {(rec.coverImage || rec.image || rec.photo) !== undefined && <SmartImage src={rec.coverImage || rec.image || rec.photo} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />}
                        <span className="font-medium">{rec.title || rec.name}</span>
                      </div>
                    </td>
                    {columns.map((c) => <td key={c.label} className="hidden px-4 py-3 text-navy/70 sm:table-cell">{c.render(rec)}</td>)}
                    <td className="px-4 py-3">
                      <button onClick={() => togglePublished(rec)} className={`rounded-full px-3 py-1 text-xs font-semibold ${rec.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`} title="Click to publish / unpublish">{rec.published ? 'Published' : 'Hidden'}</button>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => openEdit(rec)} aria-label={`Edit ${rec.title || rec.name}`} className="mr-1 rounded-lg p-2 hover:bg-slate-100"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(rec)} aria-label={`Delete ${rec.title || rec.name}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:p-8" role="dialog" aria-modal="true">
          <form onSubmit={save} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold">{editing._id ? `Edit ${singular}` : `New ${singular}`}</h2><button type="button" onClick={close} aria-label="Close"><X className="h-5 w-5" /></button></div>
            <div className="space-y-4">
              {fields.map((f) => <FieldControl key={f.name} field={f} value={form[f.name]} onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))} />)}
            </div>
            <div className="mt-4"><Notice>{msg.text}</Notice></div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={close} className="btn btn-outline-dark">Cancel</button>
              <button type="submit" disabled={saving} className="btn btn-gold">{saving && <Loader2 className="h-4 w-4 animate-spin" />} Save</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
