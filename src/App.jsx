import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Stats from './components/Stats.jsx';
import Features from './components/Features.jsx';
import Process from './components/Process.jsx';
import Testimonials from './components/Testimonials.jsx';
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
        <Features />
        <Process />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
