import { Gem, MapPinned, PenTool, ShieldCheck } from 'lucide-react';

export const COMPANY = {
  name: 'HYXC Interiors',
  url: 'https://hyxc.ae',
  phone: '+971 52 886 8393',
  whatsapp: '971528868393', // international format, digits only (wa.me)
  email: 'info@hyxc.ae',
  address: 'Ajman, United Arab Emirates',
};

export const WA_MESSAGE = 'Hello HYXC Interiors, I am interested in your interior design services. I would like to request a consultation.';

export const waLink = (number = COMPANY.whatsapp, message = WA_MESSAGE) =>
  `https://wa.me/${String(number).replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/services', dropdown: true },
  { label: 'Projects', to: '/projects' },
  { label: 'Our Process', to: '/process' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export const PROJECT_FILTERS = ['All', 'Residential', 'Commercial', 'Flooring', 'Media Walls', 'Kitchens', 'Outdoor'];

export const WHY_CHOOSE = [
  { icon: Gem, title: 'Premium Materials', text: 'Quality-focused materials and finishes.' },
  { icon: PenTool, title: 'Custom Designs', text: 'Solutions tailored to your space.' },
  { icon: ShieldCheck, title: 'Professional Installation', text: 'Dedicated installation services.' },
  { icon: MapPinned, title: 'UAE-Wide Service', text: 'Serving clients across the UAE.' },
];

export const PROCESS_STEPS = [
  { title: 'Consultation', text: 'Understand customer requirements and ideas.' },
  { title: 'Site Visit & Assessment', text: 'Inspect the property and discuss materials.' },
  { title: 'Design & Quotation', text: 'Prepare proposed solutions and pricing.' },
  { title: 'Execution & Installation', text: 'Bring the approved design to life.' },
  { title: 'Final Handover', text: 'Complete the project and review the results.' },
];

export const PROPERTY_TYPES = ['Villa', 'Apartment', 'Townhouse', 'Office', 'Retail / Showroom', 'Restaurant / Cafe', 'Other'];
export const BUDGETS = ['Under AED 20,000', 'AED 20,000 - 50,000', 'AED 50,000 - 100,000', 'AED 100,000 - 250,000', 'Above AED 250,000', 'Not sure yet'];

export const FAQS = [
  { q: 'Do you offer a free consultation and site visit?', a: 'Yes. Request a free consultation through the contact form or WhatsApp and our team will arrange a site visit to understand your space and requirements.' },
  { q: 'Which areas of the UAE do you serve?', a: 'We are based in Ajman and serve clients in Dubai, Ajman, Sharjah, Abu Dhabi and other UAE locations.' },
  { q: 'What services does HYXC provide?', a: 'Interior design, renovation and fit-out, flooring (SPC and vinyl), wall panels and treatments, kitchen makeovers, media walls, outdoor solutions (artificial grass and WPC decking), and curtains and custom décor.' },
  { q: 'How does the process work?', a: 'We start with a consultation, followed by a site visit and assessment, then prepare a design and quotation. Once approved, we execute and install, and finish with a final handover and review.' },
  { q: 'Can you work on both homes and commercial spaces?', a: 'Yes. We handle villas, apartments and townhouses as well as offices, retail units and other commercial spaces.' },
  { q: 'How do I get a quotation?', a: 'After the consultation and site assessment we prepare a proposed solution with pricing. You can start by sending us your project details through the contact form.' },
  { q: 'Can I contact you on WhatsApp?', a: `Yes. Message us on WhatsApp at ${COMPANY.phone} and we will respond as soon as possible.` },
];
