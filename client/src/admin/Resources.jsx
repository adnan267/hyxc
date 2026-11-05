import CrudManager from './CrudManager.jsx';
import { PROJECT_FILTERS } from '../lib/constants.js';

const CATEGORIES = PROJECT_FILTERS.filter((c) => c !== 'All');

export const ProjectsAdmin = () => (
  <CrudManager config={{
    resource: 'projects', title: 'Projects', singular: 'project', subtitle: 'Manage portfolio projects, images and before/after photos.',
    defaults: { category: 'Residential', published: true, featured: false, isDemo: false, images: [], videos: [] },
    columns: [{ label: 'Category', render: (r) => r.category }, { label: 'Location', render: (r) => r.location || '-' }],
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'category', label: 'Category', type: 'select', options: CATEGORIES },
      { name: 'location', label: 'Location', placeholder: 'e.g. Dubai Marina' },
      { name: 'description', label: 'Description', type: 'textarea', rows: 5 },
      { name: 'coverImage', label: 'Cover image', type: 'image' },
      { name: 'images', label: 'Gallery images', type: 'images' },
      { name: 'videos', label: 'Project videos (max 100 MB each)', type: 'videos' },
      { name: 'beforeImage', label: 'Before image (optional)', type: 'image' },
      { name: 'afterImage', label: 'After image (optional)', type: 'image' },
      { name: 'featured', label: 'Featured project', type: 'checkbox' },
      { name: 'isDemo', label: 'Mark as demo / sample content', type: 'checkbox' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  }} />
);

export const ServicesAdmin = () => (
  <CrudManager config={{
    resource: 'services', title: 'Services', singular: 'service', subtitle: 'Manage the services shown on the website.',
    defaults: { published: true, order: 0, features: [] },
    columns: [{ label: 'Order', render: (r) => r.order }, { label: 'Short description', render: (r) => r.shortDescription }],
    fields: [
      { name: 'title', label: 'Title' },
      { name: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2 },
      { name: 'description', label: 'Full description', type: 'textarea', rows: 6 },
      { name: 'features', label: 'Included features', type: 'lines' },
      { name: 'image', label: 'Service image', type: 'image' },
      { name: 'order', label: 'Display order', type: 'number', help: 'Lower numbers appear first.' },
      { name: 'seoTitle', label: 'SEO title (optional)' },
      { name: 'seoDescription', label: 'SEO meta description (optional)', type: 'textarea', rows: 2 },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  }} />
);

export const TestimonialsAdmin = () => (
  <CrudManager config={{
    resource: 'testimonials', title: 'Testimonials', singular: 'testimonial', subtitle: 'Only publish genuine, authorised client reviews.',
    defaults: { published: false, rating: null, isPlaceholder: false },
    columns: [{ label: 'Rating', render: (r) => (r.rating ? `${r.rating}/5` : '-') }, { label: 'Review', render: (r) => (r.text || '').slice(0, 60) + ((r.text || '').length > 60 ? '...' : '') }],
    fields: [
      { name: 'name', label: 'Client name' },
      { name: 'role', label: 'Role / location (optional)' },
      { name: 'text', label: 'Review text', type: 'textarea', rows: 5 },
      { name: 'rating', label: 'Rating 1-5 (only if verified)', type: 'number', min: 1, max: 5 },
      { name: 'photo', label: 'Photo (only if authorised)', type: 'image' },
      { name: 'isPlaceholder', label: 'This is placeholder text (shows a "Placeholder" badge)', type: 'checkbox' },
      { name: 'published', label: 'Published', type: 'checkbox' },
    ],
  }} />
);
