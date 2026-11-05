// Thin fetch wrapper for the HYXC REST API. In dev, Vite proxies /api to the Express server.
const BASE = (import.meta.env.VITE_API_URL || '') + '/api';
const TOKEN_KEY = 'hyxc_admin_token';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t) => {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
};

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body, auth = false, form = false } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  if (body && !form) headers['Content-Type'] = 'application/json';

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? (form ? body : JSON.stringify(body)) : undefined });
  } catch {
    throw new ApiError('Cannot reach the server. Please check your connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) {
      setToken(null);
      window.dispatchEvent(new Event('hyxc:unauthorized'));
    }
    throw new ApiError(data.message || 'Request failed', res.status, data.errors);
  }
  return data;
}

export const api = {
  // public
  services: () => request('/services'),
  service: (slug) => request(`/services/${slug}`),
  projects: (category) => request(`/projects${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),
  project: (slug) => request(`/projects/${slug}`),
  testimonials: () => request('/testimonials'),
  settings: () => request('/settings'),
  seo: (page) => request(`/seo/${page}`),
  sendEnquiry: (body) => request('/enquiries', { method: 'POST', body }),
  // auth
  login: (body) => request('/auth/login', { method: 'POST', body }),
  me: () => request('/auth/me', { auth: true }),
  // admin
  admin: {
    stats: () => request('/admin/stats', { auth: true }),
    list: (res) => request(`/admin/${res}`, { auth: true }),
    create: (res, body) => request(`/admin/${res}`, { method: 'POST', body, auth: true }),
    update: (res, id, body) => request(`/admin/${res}/${id}`, { method: 'PUT', body, auth: true }),
    patch: (res, id, body) => request(`/admin/${res}/${id}`, { method: 'PATCH', body, auth: true }),
    remove: (res, id) => request(`/admin/${res}/${id}`, { method: 'DELETE', auth: true }),
    settings: () => request('/admin/settings', { auth: true }),
    saveSettings: (body) => request('/admin/settings', { method: 'PUT', body, auth: true }),
    seo: () => request('/admin/seo', { auth: true }),
    saveSeo: (page, body) => request(`/admin/seo/${page}`, { method: 'PUT', body, auth: true }),
    // Signed direct upload: ask the API for a signature, then send each file straight to Cloudinary.
    // (Files never go through the API, so Vercel's 4.5 MB request limit does not apply and video works.)
    upload: async (files) => {
      const sig = await request('/admin/upload-signature', { method: 'POST', auth: true });
      const urls = [];
      for (const file of [...files]) {
        const isVideo = file.type.startsWith('video/');
        const maxMb = isVideo ? 100 : 10; // Cloudinary free-plan per-file limits
        if (file.size > maxMb * 1024 * 1024) throw new ApiError(`"${file.name}" is larger than ${maxMb} MB (the free Cloudinary limit for ${isVideo ? 'videos' : 'images'}).`, 413);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('api_key', sig.apiKey);
        fd.append('timestamp', sig.timestamp);
        fd.append('signature', sig.signature);
        fd.append('folder', sig.folder);
        let res;
        try { res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, { method: 'POST', body: fd }); }
        catch { throw new ApiError('Upload failed. Check your connection and try again.', 0); }
        const out = await res.json().catch(() => ({}));
        if (!res.ok) throw new ApiError(out.error?.message || 'Cloudinary rejected the upload.', res.status);
        urls.push(out.secure_url);
      }
      return { urls };
    },
  },
};
