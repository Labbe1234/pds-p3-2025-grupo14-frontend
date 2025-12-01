import { BookOpen, ClipboardList, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import './Cards.css'

const Cards = () => {
  const navigate = useNavigate();

  const handleNavigateToClases = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate('/clases');
    }, 10);
  };

  return (
    <section className="cards-section" id="clases">
      <h2 className="cards-title">Nuestras Clases</h2>
      <div className="cards-container">
        <div className="card card-clickable" onClick={handleNavigateToClases}>
          <div className="card-icon">
            <BookOpen size={48} strokeWidth={2} />
          </div>
          <h3>CREA TUS CLASES</h3>
          <p>Crea y gestiona tus clases de forma sencilla.</p>
          <button className="card-link-btn btn-ir-clases">Ir a Clases →</button>
        </div>

        <div className="card card-clickable" onClick={() => navigate('/reports')}>
          <div className="card-icon">
            <ClipboardList size={48} strokeWidth={2} />
          </div>
          <h3>REGISTRO DE TUS CLASES</h3>
          <p>Lleva un registro completo de todas tus clases y su progreso.</p>
          <button className="card-link-btn">Ver Reportes →</button>
        </div>

        <div className="card">
          <div className="card-icon">
            <GraduationCap size={48} strokeWidth={2} />
          </div>
          <h3>APRENDE A USAR NUESTRA PLATAFORMA</h3>
          <p>Comandos y funcionalidades para el buen uso de la web.</p>
        </div>
      </div>
    </section>
  )
}

export default Cards