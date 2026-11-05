/**
 * Seed script: creates the admin account (from env vars) and starter CMS content.
 *
 *   npm run seed
 *
 * - Admin credentials come from ADMIN_EMAIL / ADMIN_PASSWORD in server/.env (never hardcoded).
 * - Service records describe HYXC's real service lines.
 * - Projects and testimonials are CLEARLY MARKED demo/placeholder content. Replace them in the admin panel.
 * - Image URLs are sample stock photography; replace with HYXC's own photos via the admin panel.
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Admin, Project, Seo, Service, Settings, Testimonial } from './models/index.js';

const u = (id, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMG = {
  living: u('photo-1618221195710-dd6b41faaea6'),
  villa: u('photo-1600585154340-be6161a56a0c'),
  apartment: u('photo-1560448204-e02f11c3d0e2'),
  kitchen: u('photo-1556911220-bff31c812dba'),
  lounge: u('photo-1600210492486-724fe5c67fb0'),
  modern: u('photo-1600607687939-ce8a6c25118c'),
  office: u('photo-1497366216548-37526070297c'),
  bedroom: u('photo-1616594039964-ae9021a400a0'),
  floor: u('photo-1615873968403-89e068629265'),
  outdoor: u('photo-1600566753190-17f0baa2a6c3'),
  curtains: u('photo-1615874959474-d609969a20ed'),
};

const SERVICES = [
  { title: 'Interior Design', shortDescription: 'Residential and commercial interior design.', image: IMG.living,
    description: 'Concept-to-completion interior design for villas, apartments, offices and retail spaces. We balance beauty, comfort and function so every room works as well as it looks.',
    features: ['Space planning and layout', 'Material and finish selection', 'Furniture and lighting guidance', '3D visuals on request'] },
  { title: 'Renovation & Fit-Out', shortDescription: 'Complete space transformations and renovation.', image: IMG.modern,
    description: 'Full renovation and fit-out for homes and commercial units, managed from site assessment through to final handover.',
    features: ['Site assessment and scope planning', 'Civil, joinery and finishing works', 'Single point of coordination', 'Clean handover and snagging'] },
  { title: 'Flooring Solutions', shortDescription: 'SPC, vinyl and flooring installation.', image: IMG.floor,
    description: 'Supply and professional installation of SPC, vinyl and other flooring systems suited to UAE homes and commercial spaces.',
    features: ['SPC and vinyl flooring', 'Subfloor preparation', 'Skirting and trims', 'Residential and commercial installation'] },
  { title: 'Wall Panels & Treatments', shortDescription: 'Decorative wall panels and premium finishes.', image: IMG.lounge,
    description: 'Decorative wall panels, feature walls and premium finishes that add depth, texture and character to any room.',
    features: ['Decorative panels', 'Feature walls', 'Premium paint and finishes', 'Custom designs'] },
  { title: 'Kitchen Makeovers', shortDescription: 'Cabinet wrapping and kitchen upgrades.', image: IMG.kitchen,
    description: 'Refresh your kitchen without a full rebuild. Cabinet wrapping and targeted upgrades give a modern look at a practical cost.',
    features: ['Kitchen cabinet wrapping', 'Door and surface refresh', 'Hardware and finishing upgrades', 'Fast turnaround'] },
  { title: 'Media Walls', shortDescription: 'Custom television media wall design and installation.', image: IMG.apartment,
    description: 'Custom-designed media walls that hide cabling, add storage and become the focal point of your living room.',
    features: ['Bespoke design', 'Integrated TV and lighting', 'Cable concealment', 'Professional installation'] },
  { title: 'Outdoor Solutions', shortDescription: 'Artificial grass and WPC decking.', image: IMG.outdoor,
    description: 'Artificial grass and WPC decking for gardens, terraces and balconies, built for the UAE climate and low maintenance.',
    features: ['Artificial grass installation', 'WPC decking', 'Terrace and garden upgrades', 'Low-maintenance materials'] },
  { title: 'Curtains & Custom Décor', shortDescription: 'Curtains, blinds and bespoke decorative solutions.', image: IMG.curtains,
    description: 'Curtains, blinds and bespoke décor to complete the room, made to measure and professionally fitted.',
    features: ['Made-to-measure curtains', 'Blinds', 'Decorative accessories', 'On-site measurement and fitting'] },
].map((s, i) => ({ ...s, order: i + 1, published: true }));

// DEMO projects: not real HYXC work. Flagged isDemo so the site labels them as samples.
const PROJECTS = [
  { title: 'Sample Villa Living Room', category: 'Residential', location: 'Dubai', coverImage: IMG.living, images: [IMG.living, IMG.lounge], featured: true },
  { title: 'Sample Kitchen Upgrade', category: 'Kitchens', location: 'Ajman', coverImage: IMG.kitchen, images: [IMG.kitchen], featured: true,
    beforeImage: u('photo-1484154218962-a197022b5858'), afterImage: IMG.kitchen },
  { title: 'Sample Media Wall Apartment', category: 'Media Walls', location: 'Sharjah', coverImage: IMG.apartment, images: [IMG.apartment], featured: true },
  { title: 'Sample Office Fit-Out', category: 'Commercial', location: 'Abu Dhabi', coverImage: IMG.office, images: [IMG.office], featured: true },
  { title: 'Sample SPC Flooring Project', category: 'Flooring', location: 'Dubai', coverImage: IMG.floor, images: [IMG.floor] },
  { title: 'Sample Garden Decking', category: 'Outdoor', location: 'Ajman', coverImage: IMG.outdoor, images: [IMG.outdoor] },
].map((p) => ({ ...p, isDemo: true, published: true,
  description: 'DEMO CONTENT: this is a sample project shown until real HYXC project information is added in the admin dashboard.' }));

const SEO = [
  ['home', 'HYXC Interiors | Interior Design & Fit-Out Company in UAE', 'Premium interior design, renovation, SPC flooring, media walls, kitchen makeovers and outdoor solutions across Dubai, Ajman, Sharjah and the UAE. Request a free consultation.', 'interior design UAE, interior design company Dubai, interior fit-out Dubai, interior design Ajman'],
  ['about', 'About HYXC Interiors | Interior Design Company in Ajman, UAE', 'Learn about HYXC Interiors, an Ajman-based interior design and fit-out company delivering tailored residential and commercial spaces across the UAE.', 'about HYXC, interior design Ajman'],
  ['services', 'Interior Design & Fit-Out Services in UAE | HYXC Interiors', 'Interior design, renovation, flooring, wall panels, kitchen makeovers, media walls, outdoor solutions and curtains for homes and businesses across the UAE.', 'interior renovation Dubai, SPC flooring Dubai, media wall design Dubai'],
  ['projects', 'Interior Design Projects & Portfolio | HYXC Interiors', 'Browse HYXC Interiors project transformations across residential, commercial, flooring, media wall, kitchen and outdoor spaces in the UAE.', 'interior design portfolio UAE'],
  ['process', 'Our Interior Design Process | HYXC Interiors', 'From consultation and site visit to design, quotation, installation and handover: how HYXC delivers your interior project in five clear steps.', 'interior design process UAE'],
  ['faq', 'Interior Design FAQ | HYXC Interiors UAE', 'Answers to common questions about interior design, renovation, flooring, kitchen wrapping, media walls and outdoor installations with HYXC Interiors.', 'interior design FAQ UAE'],
  ['contact', 'Contact HYXC Interiors | Free Consultation & Site Visit', 'Request a free interior design consultation and site visit anywhere in the UAE. Call or WhatsApp +971 52 886 8393 or email info@hyxc.ae.', 'contact interior designer Ajman'],
  ['privacy', 'Privacy Policy | HYXC Interiors', 'How HYXC Interiors collects, uses and protects your personal information.', ''],
  ['terms', 'Terms & Conditions | HYXC Interiors', 'Terms and conditions for using the HYXC Interiors website and services.', ''],
].map(([page, title, description, keywords]) => ({ page, title, description, keywords }));

async function run() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before seeding.');
  if (ADMIN_PASSWORD.length < 10) throw new Error('ADMIN_PASSWORD must be at least 10 characters.');

  await connectDB();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await Admin.findOneAndUpdate({ email: ADMIN_EMAIL.toLowerCase() }, { $set: { passwordHash, name: 'HYXC Admin' } }, { upsert: true });
  console.log(`Admin ready: ${ADMIN_EMAIL}`);

  // Content is only inserted when the collection is empty, so re-running never overwrites admin edits.
  if (!(await Service.countDocuments())) { await Service.create(SERVICES); console.log(`Inserted ${SERVICES.length} services`); }
  if (!(await Project.countDocuments())) { await Project.create(PROJECTS); console.log(`Inserted ${PROJECTS.length} DEMO projects`); }
  if (!(await Testimonial.countDocuments())) {
    await Testimonial.create([
      { name: 'Client Name', role: 'Placeholder review', isPlaceholder: true, published: true,
        text: 'Placeholder: replace this with a genuine, authorised client review from the admin dashboard.' },
      { name: 'Client Name', role: 'Placeholder review', isPlaceholder: true, published: true,
        text: 'Placeholder: add real testimonials (and ratings only where verified) in Admin → Testimonials.' },
    ]);
    console.log('Inserted placeholder testimonials');
  }
  if (!(await Seo.countDocuments())) { await Seo.create(SEO); console.log('Inserted page SEO defaults'); }

  let settings = await Settings.findOne({ key: 'main' });
  if (!settings) {
    const featured = await Project.find({ featured: true }).limit(4);
    settings = await Settings.create({ key: 'main', heroImage: IMG.living, aboutImage: IMG.lounge, featuredProjects: featured.map((p) => p._id) });
    console.log('Inserted site settings');
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
}

run().catch(async (e) => { console.error(e.message); await mongoose.disconnect(); process.exit(1); });
