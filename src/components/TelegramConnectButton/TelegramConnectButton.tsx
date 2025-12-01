import React, { useState } from 'react';
import { Send } from 'lucide-react';
import TelegramQRModal from '../TelegramQRModal/TelegramQRModal';
import { authAPI } from '../../services/api';
import './TelegramConnectButton.css';

const TelegramConnectButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [telegramDeepLink, setTelegramDeepLink] = useState<string>('');
  const [telegramWebLink, setTelegramWebLink] = useState<string>('');

  const handleConnectTelegram = async () => {
    try {
      setLoading(true);
      const data = await authAPI.generateTelegramToken();
      
      if (data.deep_link) {
        setTelegramDeepLink(data.deep_link);
        setTelegramWebLink(data.web_link || data.deep_link);
        setShowQRModal(true);
      } else {
        alert('Error al generar el código QR');
      }
    } catch (error) {
      console.error('Error connecting Telegram:', error);
      alert('Error al generar el código QR. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowQRModal(false);
    setTelegramDeepLink('');
    setTelegramWebLink('');
  };

  return (
    <>
      <button
        onClick={handleConnectTelegram}
        disabled={loading}
        className="telegram-floating-btn"
        aria-label="Conectar con Telegram"
        title="Conectar con Telegram"
      >
        <Send size={24} />
      </button>

      {showQRModal && telegramDeepLink && (
        <TelegramQRModal
          deepLink={telegramDeepLink}
          webLink={telegramWebLink}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default TelegramConnectButton;