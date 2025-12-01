import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X } from 'lucide-react';
import './TelegramQRModal.css';

interface TelegramQRModalProps {
  deepLink: string;      // tg://resolve para QR
  webLink?: string;      // https://t.me para copiar
  onClose: () => void;
}

const TelegramQRModal: React.FC<TelegramQRModalProps> = ({ deepLink, webLink, onClose }) => {
  const [isReady, setIsReady] = useState(false); // 🔧 NUEVO: Estado de carga

  // 🔧 NUEVO: Marcar como listo después de la animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 350); // Esperar a que termine la animación slideUp (300ms + margen)

    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    try {
      // Copiar el web_link si existe, sino el deep_link
      const linkToCopy = webLink || deepLink;
      await navigator.clipboard.writeText(linkToCopy);
      alert('Enlace copiado al portapapeles.');
    } catch {
      alert('No se pudo copiar automáticamente. Puedes copiarlo manualmente.');
    }
  };

  return (
    <div className="telegram-modal-backdrop" onClick={onClose}>
      <div 
        className={`telegram-modal ${isReady ? 'ready' : ''}`} // 🔧 NUEVO: Clase condicional
        onClick={(e) => e.stopPropagation()}
        data-ready={isReady} // 🔧 NUEVO: Atributo para el tutorial
      >
        <div className="telegram-modal-header">
          <h3>Vincular con Telegram</h3>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        <div className="telegram-modal-body">
          <p className="instruction">
            1. <strong>Escanea este código QR</strong> con tu celular para abrir el bot de Telegram y vincular tu cuenta automáticamente.
          </p>

          <div className="qr-container">
            {/* QR usa tg://resolve para que siempre funcione */}
            <QRCodeCanvas value={deepLink} size={220} level="H" />
          </div>

          <p className="instruction">
            2. O también puedes <strong>copiar el enlace</strong> y abrirlo manualmente en Telegram:
          </p>

          <div className="link-container">
            {/* Mostrar el web_link que es más legible */}
            <code className="deep-link">{webLink || deepLink}</code>
            <button className="copy-btn" onClick={handleCopy}>
              Copiar enlace
            </button>
          </div>

          <small className="expiration-note">
            ⏱️ Este código es válido por 5 minutos. Después deberás generar uno nuevo.
          </small>
        </div>

        <div className="telegram-modal-footer">
          <button className="done-btn" onClick={onClose}>
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};

export default TelegramQRModal;