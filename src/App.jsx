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
import './index.css';

const App = () => {
  return (
    <div className="app-wrapper">
      <Navbar />
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
    </div>
  );
};

export default App;
