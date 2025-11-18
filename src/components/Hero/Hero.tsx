import './Hero.css';
import { ArrowRight } from 'lucide-react';

const Hero = () => {

  const scrollToCards = () => {
    const cardsSection = document.getElementById('clases');
    cardsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Bienvenido a <span className='hero-highlight'>ClaseSync</span></h1>
        <p className="hero-subtitle">
          Gestiona tus presentaciones de clase de forma sencilla y efectiva
        </p>
        <button className="hero-cta" onClick={scrollToCards}>
          Comenzar <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default Hero;