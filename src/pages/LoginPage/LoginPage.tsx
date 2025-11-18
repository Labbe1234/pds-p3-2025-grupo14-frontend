import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { FileText } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (user) {
      console.log('✅ Usuario ya autenticado, redirigiendo...');
      navigate('/');
    }
  }, [user, navigate]);

  // ====================
  // HANDLERS
  // ====================

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('🎉 Google login exitoso');

    if (!credentialResponse.credential) {
      alert('Error: No se recibió credencial de Google');
      return;
    }

    const result = await loginWithGoogle(credentialResponse.credential);

    if (result.success) {
      console.log('✅ Login procesado correctamente');
    } else {
      console.error('❌ Error en login:', result.error);
      alert(`Error: ${result.error}`);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google login falló');
    alert('Error al iniciar sesión con Google. Por favor, intenta nuevamente.');
  };

  // ====================
  // RENDER
  // ====================

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo/Icono */}
        <div className="login-header">
          <div className="login-icon">
            <FileText className="icon-svg" strokeWidth={2.5} />
          </div>
          <h1 className="login-title">
            <span className="highlight">Clase</span>Sync
          </h1>
          <p className="login-subtitle">Sistema de Gestión de Presentaciones</p>
        </div>

        {/* Descripción */}
        <div className="login-description">
          <p>
            <strong>Inicia sesión</strong> con tu cuenta de Google para acceder a tus
            presentaciones y gestionar tus clases de forma sencilla.
          </p>
        </div>

        {/* Botón de Google */}
        <div className="login-button-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
            logo_alignment="left"
            width="320"
          />
        </div>

        {/* Features */}
        <ul className="login-features">
          <li>Crea y gestiona tus presentaciones</li>
          <li>Control remoto vía Telegram Bot</li>
          <li>Sincronización en tiempo real</li>
        </ul>

        {/* Footer */}
        <div className="login-footer">
          <p className="login-terms">
            Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad.
          </p>
          <p className="login-copyright">
            © 2025 ClaseSync - PDS Proyecto 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;