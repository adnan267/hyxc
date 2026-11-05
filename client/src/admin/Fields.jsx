import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { api } from '../lib/api.js';
import { SmartImage } from '../components/ui.jsx';

export const Card = ({ title, action, children, className = '' }) => (
  <section className={`rounded-xl bg-white p-5 shadow-sm sm:p-6 ${className}`}>
    {(title || action) && <div className="mb-4 flex items-center justify-between gap-3">{title && <h2 className="text-lg font-semibold">{title}</h2>}{action}</div>}
    {children}
  </section>
);

export const PageTitle = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
    <div><h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>{subtitle && <p className="mt-1 text-sm text-navy/60">{subtitle}</p>}</div>
    {action}
  </div>
);

export const Notice = ({ type = 'error', children }) => children ? (
  <p role={type === 'error' ? 'alert' : 'status'} className={`rounded-lg p-3 text-sm ${type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{children}</p>
) : null;

export const Toggle = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center gap-3 text-sm">
    <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#D6B34E]" />{label}
  </label>
);

/* Upload files to Cloudinary through the API, or paste an image URL. Supports single or multiple. */
export function ImageField({ label, value, onChange, multiple = false, video = false }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [url, setUrl] = useState('');
  const list = multiple ? (value || []) : (value ? [value] : []);

  const add = (urls) => onChange(multiple ? [...list, ...urls] : urls[0]);
  const remove = (u) => onChange(multiple ? list.filter((x) => x !== u) : '');

  const upload = async (files) => {
    if (!files?.length) return;
    setBusy(true); setMsg('');
    try { add((await api.admin.upload(files)).urls); } catch (e) { setMsg(e.message); } finally { setBusy(false); if (inputRef.current) inputRef.current.value = ''; }
  };
  const addUrl = () => {
    const u = url.trim();
    if (!/^https?:\/\//i.test(u)) return setMsg('Enter a full URL starting with http(s)://');
    setMsg(''); add([u]); setUrl('');
  };

  return (
    <div>
      <span className="label">{label}</span>
      {list.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {list.map((u) => (
            <div key={u} className="group relative overflow-hidden rounded-lg border">
              {video ? <video src={u} muted preload="metadata" className="aspect-square w-full bg-black object-cover" /> : <SmartImage src={u} alt="" className="aspect-square w-full object-cover" />}
              <button type="button" onClick={() => remove(u)} aria-label="Remove image" className="absolute right-1 top-1 rounded-full bg-red-600 p-1.5 text-white opacity-90 hover:opacity-100"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="btn btn-outline-dark px-4 py-2">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload</button>
        <input ref={inputRef} type="file" accept={video ? 'video/*' : 'image/*'} multiple={multiple} hidden onChange={(e) => upload(e.target.files)} />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={video ? '...or paste video URL' : '...or paste image URL'} className="input min-w-0 flex-1 py-2" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())} />
        <button type="button" onClick={addUrl} className="btn btn-outline-dark px-4 py-2"><ImagePlus className="h-4 w-4" />Add</button>
      </div>
      <Notice>{msg}</Notice>
    </div>
  );
}

/* Renders a form control from a field config object. */
export function FieldControl({ field, value, onChange }) {
  const { name, label, type = 'text', options = [], placeholder, help } = field;
  const id = `f-${name}`;
  switch (type) {
    case 'textarea':
      return <div><label className="label" htmlFor={id}>{label}</label><textarea id={id} rows={field.rows || 4} className="input" placeholder={placeholder} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />{help && <p className="mt-1 text-xs text-navy/50">{help}</p>}</div>;
    case 'select':
      return <div><label className="label" htmlFor={id}>{label}</label><select id={id} className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>{field.empty && <option value="">{field.empty}</option>}{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></div>;
    case 'number':
      return <div><label className="label" htmlFor={id}>{label}</label><input id={id} type="number" className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} min={field.min} max={field.max} />{help && <p className="mt-1 text-xs text-navy/50">{help}</p>}</div>;
    case 'checkbox':
      return <Toggle label={label} checked={value} onChange={onChange} />;
    case 'lines': // one item per line <-> string[]
      return <div><label className="label" htmlFor={id}>{label}</label><textarea id={id} rows={4} className="input" placeholder="One item per line" value={(value || []).join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} onBlur={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} /></div>;
    case 'image':
      return <ImageField label={label} value={value} onChange={onChange} />;
    case 'images':
      return <ImageField label={label} value={value} onChange={onChange} multiple />;
    case 'videos':
      return <ImageField label={label} value={value} onChange={onChange} multiple video />;
    default:
      return <div><label className="label" htmlFor={id}>{label}</label><input id={id} type={type} className="input" placeholder={placeholder} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />{help && <p className="mt-1 text-xs text-navy/50">{help}</p>}</div>;
  }
}
