import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { slugify } from '../utils/helpers.js';

const { Schema, model } = mongoose;

/* ---------- Admin ---------- */
const adminSchema = new Schema(
  {
    name: { type: String, default: 'Administrator' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);
adminSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};
export const Admin = model('Admin', adminSchema);

/* ---------- Service ---------- */
const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    shortDescription: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);
serviceSchema.pre('validate', function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  next();
});
export const Service = model('Service', serviceSchema);

/* ---------- Project ---------- */
export const PROJECT_CATEGORIES = ['Residential', 'Commercial', 'Flooring', 'Media Walls', 'Kitchens', 'Outdoor'];

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: { type: String, enum: PROJECT_CATEGORIES, required: true },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    images: [{ type: String }],
    videos: [{ type: String }], // Cloudinary video URLs
    beforeImage: { type: String, default: '' },
    afterImage: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    isDemo: { type: Boolean, default: false }, // clearly flags sample content
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);
projectSchema.pre('validate', function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  next();
});
export const Project = model('Project', projectSchema);

/* ---------- Enquiry ---------- */
export const ENQUIRY_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];
const enquirySchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    projectLocation: { type: String, default: '' },
    propertyType: { type: String, default: '' },
    service: { type: String, default: '' },
    budget: { type: String, default: '' },
    details: { type: String, default: '' },
    status: { type: String, enum: ENQUIRY_STATUSES, default: 'new' },
    notes: { type: String, default: '' },
    sourcePage: { type: String, default: '' },
  },
  { timestamps: true }
);
export const Enquiry = model('Enquiry', enquirySchema);

/* ---------- Testimonial ---------- */
const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '' },
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: null }, // only set when verified
    photo: { type: String, default: '' },
    isPlaceholder: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Testimonial = model('Testimonial', testimonialSchema);

/* ---------- Site settings (single document) ---------- */
const settingsSchema = new Schema(
  {
    key: { type: String, default: 'main', unique: true },
    heroHeadingLine1: { type: String, default: 'Transform Your Space.' },
    heroHeadingLine2: { type: String, default: 'Elevate Your Lifestyle.' },
    heroDescription: { type: String, default: 'Premium Interior Design & Fit-Out Solutions Across the UAE.' },
    heroImage: { type: String, default: '' },
    aboutImage: { type: String, default: '' },
    contactPhone: { type: String, default: '+971 52 886 8393' },
    contactWhatsapp: { type: String, default: '971528868393' },
    contactEmail: { type: String, default: 'info@hyxc.ae' },
    contactAddress: { type: String, default: 'Ajman, United Arab Emirates' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    featuredProjects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);
export const Settings = model('Settings', settingsSchema);

/* ---------- Page SEO ---------- */
const seoSchema = new Schema(
  {
    page: { type: String, required: true, unique: true }, // home, about, services, projects, process, faq, contact, privacy, terms
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    keywords: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    canonical: { type: String, default: '' },
  },
  { timestamps: true }
);
export const Seo = model('Seo', seoSchema);
