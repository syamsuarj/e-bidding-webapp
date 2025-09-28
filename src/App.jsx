import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Stats from './components/Stats.jsx';
import ProductShowcase from './components/ProductShowcase.jsx';
import PlatformModules from './components/PlatformModules.jsx';
import Features from './components/Features.jsx';
import Process from './components/Process.jsx';
import SupplyNetwork from './components/SupplyNetwork.jsx';
import Testimonials from './components/Testimonials.jsx';
import FAQ from './components/FAQ.jsx';
import CTA from './components/CTA.jsx';
import Footer from './components/Footer.jsx';
import LoginModal from './components/LoginModal.jsx';
import './index.css';

const App = () => {
  const [loginOpen, setLoginOpen] = useState(false);

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    window.location.hash = '/dashboard';
  };

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      elements.forEach((element) => {
        element.classList.add('is-visible');
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const { target } = entry;
          const delay = target.getAttribute('data-reveal-delay');
          const duration = target.getAttribute('data-reveal-duration');

          if (delay) {
            const resolvedDelay = delay.endsWith('ms') || delay.endsWith('s') ? delay : `${delay}ms`;
            target.style.setProperty('--reveal-delay', resolvedDelay);
          }

          if (duration) {
            const resolvedDuration = duration.endsWith('ms') || duration.endsWith('s') ? duration : `${duration}ms`;
            target.style.setProperty('--reveal-duration', resolvedDuration);
          }

          target.classList.add('is-visible');
          observer.unobserve(target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-wrapper">
      <Navbar onLoginClick={() => setLoginOpen(true)} />
      <main>
        <Hero />
        <Stats />
        <ProductShowcase />
        <PlatformModules />
        <Features />
        <Process />
        <SupplyNetwork />
    <Testimonials />
    <FAQ />
        <CTA />
      </main>
      <Footer />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default App;
