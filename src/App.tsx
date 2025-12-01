import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { TutorialProvider } from './contexts/TutorialContext';
import { tutorialSteps } from './components/Tutorial/tutorialSteps';
import TutorialWrapper from './components/Tutorial/TutorialWrapper';
import TutorialHelpButton from './components/Tutorial/TutorialHelpButton';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import ClasesPage from './pages/ClasesPage/ClasesPage';
import PresentationPage from './pages/PresentationPage/PresentationPage';
import ClassReportPage from './pages/ClassReportPage/ClassReportPage';
import ClassReportsListPage from './pages/ClassReportsListPage/ClassReportsListPage';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h1>⚠️ Error de Configuración</h1>
          <p>VITE_GOOGLE_CLIENT_ID no está configurado en .env.local</p>
          <pre className="error-code">
            {`VITE_GOOGLE_CLIENT_ID=tu-client-id-aqui
VITE_API_URL=http://localhost:3000`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          {/* TutorialProvider DENTRO del Router (para acceso a useNavigate) */}
          <TutorialProvider steps={tutorialSteps}>
            <TutorialWrapper />
            <TutorialHelpButton />
            <Routes>
              {/* Ruta pública: Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rutas protegidas con Layout (Navbar + Footer) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <HomePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/clases"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ClasesPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Presentation sin Layout (fullscreen) */}
              <Route
                path="/clases/:id/presentation"
                element={
                  <ProtectedRoute>
                    <PresentationPage />
                  </ProtectedRoute>
                }
              />

              {/* Reporte de Clase - NUEVA RUTA DE DEPLOY */}
              <Route
                path="/sessions/:sessionId"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ClassReportPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Lista de Reportes - NUEVA RUTA DE DEPLOY */}
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ClassReportsListPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TutorialProvider>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

// Layout Component (Navbar + contenido + Footer)
interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}

export default App;