import { Link } from 'react-router-dom';
import { Briefcase, Inbox, LayoutGrid, Sparkles } from 'lucide-react';
import { api } from '../lib/api.js';
import useFetch from '../hooks/useFetch.js';
import { ErrorBlock, LoadingBlock } from '../components/ui.jsx';
import { Card, PageTitle } from './Fields.jsx';

export const StatusBadge = ({ status }) => {
  const colors = { new: 'bg-blue-100 text-blue-800', contacted: 'bg-amber-100 text-amber-800', quoted: 'bg-purple-100 text-purple-800', won: 'bg-emerald-100 text-emerald-800', lost: 'bg-slate-200 text-slate-600' };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${colors[status] || colors.new}`}>{status}</span>;
};

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch(() => api.admin.stats(), []);
  if (loading) return <LoadingBlock />;
  if (error) return <ErrorBlock error={error} onRetry={reload} />;

  const cards = [
    { label: 'Total enquiries', value: data.totalEnquiries, icon: Inbox, to: '/admin/enquiries' },
    { label: 'New enquiries', value: data.newEnquiries, icon: Sparkles, to: '/admin/enquiries' },
    { label: 'Total projects', value: data.totalProjects, icon: Briefcase, to: '/admin/projects' },
    { label: 'Total services', value: data.totalServices, icon: LayoutGrid, to: '/admin/services' },
  ];

  return (
    <>
      <PageTitle title="Overview" subtitle="A quick look at your website activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to} className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-dark"><Icon className="h-5 w-5" /></span>
            <div><p className="text-3xl font-semibold">{value}</p><p className="text-sm text-navy/60">{label}</p></div>
          </Link>
        ))}
      </div>
      <Card title="Recent enquiries" className="mt-6" action={<Link to="/admin/enquiries" className="text-sm font-semibold text-gold-dark">View all</Link>}>
        {data.recent.length === 0 ? <p className="py-6 text-center text-sm text-navy/60">No enquiries yet. They will appear here when customers submit the contact form.</p> : (
          <ul className="divide-y">
            {data.recent.map((e) => (
              <li key={e._id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div><p className="font-medium">{e.fullName}</p><p className="text-navy/60">{e.service || 'General enquiry'} &middot; {e.phone}</p></div>
                <div className="flex items-center gap-3"><span className="text-xs text-navy/50">{new Date(e.createdAt).toLocaleDateString()}</span><StatusBadge status={e.status} /></div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
