import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Admin, Enquiry, ENQUIRY_STATUSES, Project, Seo, Service, Settings, Testimonial } from '../models/index.js';
import { cloudinaryConfigured, signUpload } from '../config/cloudinary.js';
import { asyncHandler, HttpError, pick } from '../utils/helpers.js';
import { createCrud } from './crud.js';

/* ---------- CRUD controllers ---------- */
export const services = createCrud(Service, {
  fields: ['title', 'slug', 'shortDescription', 'description', 'image', 'features', 'order', 'published', 'seoTitle', 'seoDescription'],
  sort: { order: 1, createdAt: 1 },
  slugField: true,
});

export const projects = createCrud(Project, {
  fields: ['title', 'slug', 'category', 'location', 'description', 'coverImage', 'images', 'videos', 'beforeImage', 'afterImage', 'featured', 'isDemo', 'published'],
  slugField: true,
});

export const testimonials = createCrud(Testimonial, {
  fields: ['name', 'role', 'text', 'rating', 'photo', 'isPlaceholder', 'published'],
});

/* ---------- Auth ---------- */
export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const login = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email }).select('+passwordHash');
  // Same message for unknown email and wrong password (no account enumeration).
  if (!admin || !(await admin.verifyPassword(req.body.password))) throw new HttpError(401, 'Invalid email or password');
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
});

export const me = (req, res) => res.json({ id: req.admin._id, name: req.admin.name, email: req.admin.email });

/* ---------- Enquiries ---------- */
export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.string().trim().email('Enter a valid email address').max(160),
  phone: z.string().trim().min(7, 'Enter a valid phone number').max(30).regex(/^[0-9+()\-\s]+$/, 'Phone may contain digits, +, -, spaces only'),
  projectLocation: z.string().trim().max(120).optional().default(''),
  propertyType: z.string().trim().max(60).optional().default(''),
  service: z.string().trim().max(80).optional().default(''),
  budget: z.string().trim().max(60).optional().default(''),
  details: z.string().trim().max(3000).optional().default(''),
  sourcePage: z.string().trim().max(120).optional().default(''),
  website: z.string().optional().default(''), // honeypot: real users never fill this
});

export const createEnquiry = asyncHandler(async (req, res) => {
  const { website, ...data } = req.body;
  if (website) return res.status(201).json({ message: 'Thank you!' }); // silently drop bots
  await Enquiry.create(data);
  res.status(201).json({ message: 'Thank you! Our team will contact you shortly.' });
});

export const listEnquiries = asyncHandler(async (req, res) => {
  const filter = req.query.status && ENQUIRY_STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
  res.json(await Enquiry.find(filter).sort({ createdAt: -1 }).lean());
});

export const updateEnquiry = asyncHandler(async (req, res) => {
  const data = pick(req.body, ['status', 'notes']);
  if (data.status && !ENQUIRY_STATUSES.includes(data.status)) throw new HttpError(400, 'Invalid status');
  const doc = await Enquiry.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!doc) throw new HttpError(404, 'Not found');
  res.json(doc);
});

export const deleteEnquiry = asyncHandler(async (req, res) => {
  const doc = await Enquiry.findByIdAndDelete(req.params.id);
  if (!doc) throw new HttpError(404, 'Not found');
  res.json({ message: 'Deleted' });
});

/* ---------- Dashboard stats ---------- */
export const stats = asyncHandler(async (_req, res) => {
  const [totalEnquiries, newEnquiries, totalProjects, totalServices, recent] = await Promise.all([
    Enquiry.countDocuments(),
    Enquiry.countDocuments({ status: 'new' }),
    Project.countDocuments(),
    Service.countDocuments(),
    Enquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);
  res.json({ totalEnquiries, newEnquiries, totalProjects, totalServices, recent });
});

/* ---------- Site settings ---------- */
const SETTINGS_FIELDS = [
  'heroHeadingLine1', 'heroHeadingLine2', 'heroDescription', 'heroImage', 'aboutImage',
  'contactPhone', 'contactWhatsapp', 'contactEmail', 'contactAddress',
  'facebook', 'instagram', 'linkedin', 'youtube', 'featuredProjects',
];
const getSettingsDoc = async () => (await Settings.findOne({ key: 'main' })) || Settings.create({ key: 'main' });

export const getSettings = asyncHandler(async (_req, res) => {
  const doc = await getSettingsDoc();
  const featured = await Project.find({ _id: { $in: doc.featuredProjects }, published: true }).lean();
  res.json({ ...doc.toObject(), featuredProjects: featured });
});

export const getSettingsAdmin = asyncHandler(async (_req, res) => res.json(await getSettingsDoc()));

export const updateSettings = asyncHandler(async (req, res) => {
  const doc = await getSettingsDoc();
  doc.set(pick(req.body, SETTINGS_FIELDS));
  await doc.save();
  res.json(doc);
});

/* ---------- SEO ---------- */
export const getSeoPublic = asyncHandler(async (req, res) => res.json((await Seo.findOne({ page: req.params.page }).lean()) || {}));
export const listSeo = asyncHandler(async (_req, res) => res.json(await Seo.find().lean()));
export const upsertSeo = asyncHandler(async (req, res) => {
  const data = pick(req.body, ['title', 'description', 'keywords', 'ogImage', 'canonical']);
  const doc = await Seo.findOneAndUpdate({ page: req.params.page }, { $set: data, $setOnInsert: { page: req.params.page } }, { new: true, upsert: true });
  res.json(doc);
});

/* ---------- Media upload (signed, direct browser -> Cloudinary) ---------- */
export const uploadSignature = asyncHandler(async (_req, res) => {
  if (!cloudinaryConfigured()) {
    throw new HttpError(503, 'Uploads are not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the environment variables, or paste a media URL instead.');
  }
  res.json(signUpload('hyxc'));
});

/* ---------- Sitemap (dynamic, includes services + projects) ---------- */
export const sitemap = asyncHandler(async (_req, res) => {
  const base = (process.env.SITE_URL || 'https://hyxc.ae').replace(/\/$/, '');
  const [svc, prj] = await Promise.all([
    Service.find({ published: true }).select('slug updatedAt').lean(),
    Project.find({ published: true }).select('slug updatedAt').lean(),
  ]);
  const staticPaths = ['', '/about', '/services', '/projects', '/process', '/faq', '/contact', '/privacy-policy', '/terms-and-conditions'];
  const urls = [
    ...staticPaths.map((p) => ({ loc: `${base}${p}` })),
    ...svc.map((s) => ({ loc: `${base}/services/${s.slug}`, lastmod: s.updatedAt })),
    ...prj.map((p) => ({ loc: `${base}/projects/${p.slug}`, lastmod: p.updatedAt })),
  ];
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}</url>`).join('\n') +
    `\n</urlset>`;
  res.type('application/xml').send(xml);
});
