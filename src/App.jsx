import { useState } from 'react';
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
