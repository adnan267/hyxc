import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAdmin, validate } from '../middleware/index.js';
import * as c from '../controllers/index.js';

const router = Router();

const enquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many requests. Please try again later or contact us on WhatsApp.' } });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many login attempts. Try again in a few minutes.' } });

router.get('/health', (_req, res) => res.json({ ok: true }));

/* ---------- Public ---------- */
router.get('/services', c.services.listPublic);
router.get('/services/:slug', c.services.getPublic);
router.get('/projects', c.projects.listPublic);
router.get('/projects/:slug', c.projects.getPublic);
router.get('/testimonials', c.testimonials.listPublic);
router.get('/settings', c.getSettings);
router.get('/seo/:page', c.getSeoPublic);
router.post('/enquiries', enquiryLimiter, validate(c.enquirySchema), c.createEnquiry);

/* ---------- Auth ---------- */
router.post('/auth/login', loginLimiter, validate(c.loginSchema), c.login);
router.get('/auth/me', requireAdmin, c.me);

/* ---------- Admin (JWT protected) ---------- */
const admin = Router();
admin.use(requireAdmin);

admin.get('/stats', c.stats);

for (const [name, ctrl] of [['services', c.services], ['projects', c.projects], ['testimonials', c.testimonials]]) {
  admin.get(`/${name}`, ctrl.listAdmin);
  admin.get(`/${name}/:id`, ctrl.getAdmin);
  admin.post(`/${name}`, ctrl.create);
  admin.put(`/${name}/:id`, ctrl.update);
  admin.delete(`/${name}/:id`, ctrl.remove);
}

admin.get('/enquiries', c.listEnquiries);
admin.patch('/enquiries/:id', c.updateEnquiry);
admin.delete('/enquiries/:id', c.deleteEnquiry);

admin.get('/settings', c.getSettingsAdmin);
admin.put('/settings', c.updateSettings);

admin.get('/seo', c.listSeo);
admin.put('/seo/:page', c.upsertSeo);

admin.post('/upload-signature', c.uploadSignature);

router.use('/admin', admin);

export default router;
