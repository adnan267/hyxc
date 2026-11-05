import { motion } from 'framer-motion';
import { waLink } from '../lib/constants.js';
import { useSite } from '../context/SiteContext.jsx';
import WhatsAppIcon from './WhatsAppIcon.jsx';

// Floating WhatsApp button shown on every public page.
export default function WhatsAppButton() {
  const { contact } = useSite();
  return (
    <motion.a
      href={waLink(contact.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with HYXC Interiors on WhatsApp"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/30 sm:bottom-7 sm:right-7"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </motion.a>
  );
}
