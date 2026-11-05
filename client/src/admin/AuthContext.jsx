import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api.me().then(setAdmin).catch(() => setToken(null)).finally(() => setChecking(false));
  }, []);

  // Any 401 from an authenticated request signs the admin out.
  useEffect(() => {
    const onUnauthorized = () => setAdmin(null);
    window.addEventListener('hyxc:unauthorized', onUnauthorized);
    return () => window.removeEventListener('hyxc:unauthorized', onUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.login({ email, password });
    setToken(res.token);
    setAdmin(res.admin);
  }, []);

  const logout = useCallback(() => { setToken(null); setAdmin(null); }, []);

  return <AuthContext.Provider value={{ admin, checking, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
