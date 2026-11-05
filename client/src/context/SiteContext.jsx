import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { COMPANY } from '../lib/constants.js';

const SiteContext = createContext(null);

// Loads CMS-managed settings and the service list once for the whole public site
// (used by navbar dropdown, footer, hero, contact details and WhatsApp links).
export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.settings(), api.services()])
      .then(([s, sv]) => {
        if (cancelled) return;
        setSettings(s);
        setServices(sv);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('error'));
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => {
    const s = settings || {};
    return {
      status,
      services,
      settings: s,
      contact: {
        phone: s.contactPhone || COMPANY.phone,
        whatsapp: s.contactWhatsapp || COMPANY.whatsapp,
        email: s.contactEmail || COMPANY.email,
        address: s.contactAddress || COMPANY.address,
      },
      social: { facebook: s.facebook, instagram: s.instagram, linkedin: s.linkedin, youtube: s.youtube },
    };
  }, [settings, services, status]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
