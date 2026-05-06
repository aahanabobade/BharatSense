import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Landing page sections
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Modules from './components/Modules';
import Impact from './components/Impact';
import Architecture from './components/Architecture';
import Domains from './components/Domains';
import Privacy from './components/Privacy';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Module pages
import M01CropAdvisor from './components/M01CropAdvisor';

// ── Landing page (unchanged) ──────────────────────────────────────────────────
function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen font-body">
      <Cursor />
      <Nav />
      <Hero />
      <Ticker />
      <Modules />
      <Impact />
      <Architecture />
      <Domains />
      <Privacy />
      <CTA />
      <Footer />
    </div>
  );
}

// ── App with routing ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<LandingPage />} />
        <Route path="/modules/m01"   element={<M01CropAdvisor />} />
        {/* Add more module routes here as you build them:      */}
        {/* <Route path="/modules/m02" element={<M02MandiPrice />} /> */}
      </Routes>
    </BrowserRouter>
  );
}