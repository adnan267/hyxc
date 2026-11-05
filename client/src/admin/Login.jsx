import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Loader2, Lock } from 'lucide-react';
import { useAuth } from './AuthContext.jsx';

export default function Login() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (admin) return <Navigate to={state?.from || '/admin'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err.errors?.[0]?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy via-navy-800 to-royal-700 p-4">
      <Helmet><title>Admin Login | HYXC Interiors</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-gold/30 bg-white p-8 shadow-2xl" noValidate>
        <img src="/logo.jpg" alt="HYXC Interiors" className="mx-auto h-20 w-20 rounded-full ring-2 ring-gold/50" />
        <h1 className="mt-5 text-center text-2xl font-semibold">Admin Sign In</h1>
        <div className="mt-6 space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" type="email" autoComplete="username" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="label" htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        </div>
        {error && <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-gold mt-6 w-full">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in</button>
      </form>
    </div>
  );
}
