import { useState } from 'react';
import { Send } from 'lucide-react';
import Hero from '../../components/Hero/Hero';
import Cards from '../../components/Cards/Cards';
import { authAPI } from '../../services/api';
import './HomePage.css';

const HomePage = () => {
  const [loading, setLoading] = useState(false);

  const handleConnectTelegram = async () => {
    try {
      setLoading(true);
      const data = await authAPI.generateTelegramToken();
      if (data.deep_link) {
        window.open(data.deep_link, '_blank');
      } else {
        alert('Error al generar el enlace de Telegram');
      }
    } catch (error) {
      console.error('Error connecting Telegram:', error);
      alert('Error al conectar con Telegram');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Hero />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <button
          onClick={handleConnectTelegram}
          disabled={loading}
          className="connect-telegram-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            backgroundColor: '#0088cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 4px 6px rgba(0, 136, 204, 0.2)',
            transition: 'all 0.2s ease'
          }}
        >
          <Send size={20} />
          {loading ? 'Generando enlace...' : 'Conectar con Telegram'}
        </button>
      </div>

      <Cards />
    </div>
  );
};

export default HomePage;