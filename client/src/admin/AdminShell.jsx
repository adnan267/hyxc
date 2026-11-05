import { useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BarChart3, Briefcase, ExternalLink, Home, Inbox, LayoutGrid, LogOut, Menu, MessageSquareQuote, Search, X } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext.jsx';

const LINKS = [
  { to: '/admin', label: 'Overview', icon: BarChart3, end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/projects', label: 'Projects', icon: Briefcase },
  { to: '/admin/services', label: 'Services', icon: LayoutGrid },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/homepage', label: 'Homepage', icon: Home },
  { to: '/admin/seo', label: 'SEO', icon: Search },
];

function Shell() {
  const { admin, checking, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  if (checking) return <div className="flex min-h-screen items-center justify-center bg-navy text-white/70">Checking session...</div>;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: pathname }} />;

  const nav = (
    <nav className="flex-1 space-y-1 p-4" aria-label="Admin">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${isActive ? 'bg-gold text-navy' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
          <Icon className="h-4 w-4" />{label}
        </NavLink>
      ))}
    </nav>
  );
  const footer = (
    <div className="space-y-2 border-t border-white/10 p-4 text-sm">
      <p className="truncate px-2 text-xs text-white/50">{admin.email}</p>
      <Link to="/" target="_blank" className="flex items-center gap-2 rounded-lg px-2 py-2 text-white/75 hover:text-gold"><ExternalLink className="h-4 w-4" />View website</Link>
      <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-white/75 hover:text-red-300"><LogOut className="h-4 w-4" />Sign out</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Helmet><title>Admin | HYXC Interiors</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <aside className="hidden w-64 shrink-0 flex-col bg-navy lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5"><img src="/logo.jpg" alt="" className="h-9 w-9 rounded-full" /><span className="font-serif font-bold tracking-widest text-gold">HYXC ADMIN</span></div>
        {nav}{footer}
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-navy">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5"><span className="font-serif font-bold tracking-widest text-gold">HYXC ADMIN</span><button onClick={() => setOpen(false)} aria-label="Close menu" className="text-white"><X className="h-5 w-5" /></button></div>
            {nav}{footer}
          </aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex h-16 items-center gap-3 border-b bg-white px-4 lg:hidden"><button onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6" /></button><span className="font-semibold">HYXC Admin</span></div>
        <main className="p-4 sm:p-8"><Outlet /></main>
      </div>
    </div>
  );
}

// Route elements: AdminRoot supplies auth state to /admin/*, AdminShell guards the dashboard pages.
export function AdminRoot() {
  return <AuthProvider><Outlet /></AuthProvider>;
}
export default Shell;
