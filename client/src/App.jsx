import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import { About, Contact, Faq, Legal, NotFound, Process, ProjectDetail, Projects, ServiceDetail, Services } from './pages/PublicPages.jsx';
import { LoadingBlock } from './components/ui.jsx';

// Admin area is code-split so public visitors never download it.
const AdminRoot = lazy(() => import('./admin/AdminShell.jsx').then((m) => ({ default: m.AdminRoot })));
const AdminShell = lazy(() => import('./admin/AdminShell.jsx'));
const Login = lazy(() => import('./admin/Login.jsx'));
const Dashboard = lazy(() => import('./admin/Dashboard.jsx'));
const Enquiries = lazy(() => import('./admin/Enquiries.jsx'));
const Homepage = lazy(() => import('./admin/Homepage.jsx'));
const SeoAdmin = lazy(() => import('./admin/SeoAdmin.jsx'));
const ProjectsAdmin = lazy(() => import('./admin/Resources.jsx').then((m) => ({ default: m.ProjectsAdmin })));
const ServicesAdmin = lazy(() => import('./admin/Resources.jsx').then((m) => ({ default: m.ServicesAdmin })));
const TestimonialsAdmin = lazy(() => import('./admin/Resources.jsx').then((m) => ({ default: m.TestimonialsAdmin })));

export default function App() {
  return (
    <Suspense fallback={<div className="pt-40"><LoadingBlock /></div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:slug" element={<ProjectDetail />} />
          <Route path="process" element={<Process />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<Legal type="privacy" />} />
          <Route path="terms-and-conditions" element={<Legal type="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<AdminRoot />}>
          <Route path="login" element={<Login />} />
          <Route element={<AdminShell />}>
            <Route index element={<Dashboard />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="homepage" element={<Homepage />} />
            <Route path="seo" element={<SeoAdmin />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
