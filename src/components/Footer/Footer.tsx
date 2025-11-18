import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Mi Proyecto</h3>
          <p>Creando clases con IA</p>
        </div>
        
        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Email: contacto@miuandes.cl</p>
          <p>Telefono: +569 1234 5678</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Mi Proyecto. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer