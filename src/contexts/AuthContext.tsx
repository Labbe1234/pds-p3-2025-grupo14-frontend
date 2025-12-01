import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { usersAPI } from '../services/api'; // ✅ Solo importar usersAPI
import type { User } from '../services/api'; // ✅ Importar User como tipo

// ====================
// TIPOS
// ====================

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: (googleCredential: string) => Promise<LoginResult>;
  logout: () => void;
  getToken: () => string | null;
  isAuthenticated: () => boolean;
  refreshUser: () => Promise<void>;
}

interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface JwtPayload {
  user_id: number;
  exp: number;
}

// ====================
// CONTEXTO
// ====================

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

// ====================
// PROVIDER
// ====================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ====================
  // INICIALIZACIÓN
  // ====================

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔍 Inicializando autenticación...');

      const token = localStorage.getItem('token');

      if (token) {
        console.log('🎫 Token encontrado en localStorage');

        try {
          const decoded = jwtDecode<JwtPayload>(token);
          const now = Date.now() / 1000;

          if (decoded.exp && decoded.exp > now) {
            // ✅ Obtener perfil actualizado desde el backend
            try {
              const { user: userData } = await usersAPI.getProfile();
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
              console.log('✅ Usuario restaurado desde backend:', userData.email, 'Tutorial:', userData.tutorial_completed);
            } catch (error) {
              console.error('❌ Error al obtener perfil:', error);
              // Fallback: usar datos de localStorage
              const userDataStr = localStorage.getItem('user');
              if (userDataStr) {
                const userData = JSON.parse(userDataStr) as User;
                setUser(userData);
                console.log('⚠️ Usuario restaurado desde localStorage (fallback):', userData.email);
              } else {
                logout();
              }
            }
          } else {
            console.log('⏰ Token expirado');
            logout();
          }
        } catch (error) {
          console.error('❌ Error al decodificar token:', error);
          logout();
        }
      } else {
        console.log('ℹ️ No hay token guardado');
      }

      setLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ====================
  // LOGIN
  // ====================

  const loginWithGoogle = async (googleCredential: string): Promise<LoginResult> => {
    console.log('🔐 Iniciando login con Google...');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const url = `${apiUrl}/auth/google`;
      
      console.log('📡 URL completa:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: googleCredential
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Login exitoso');
        console.log('📊 Usuario recibido:', data.user);

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        setUser(data.user);

        return { success: true, user: data.user };
      } else {
        console.error('❌ Error del backend:', data.error);
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  // ====================
  // LOGOUT
  // ====================

  const logout = () => {
    console.log('👋 Cerrando sesión...');

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tutorialCompleted');

    setUser(null);
  };

  // ====================
  // REFRESH USER
  // ====================

  const refreshUser = async () => {
    console.log('🔄 Refrescando datos del usuario...');
    
    try {
      const { user: userData } = await usersAPI.getProfile();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ Usuario actualizado:', userData.email, 'Tutorial:', userData.tutorial_completed);
    } catch (error) {
      console.error('❌ Error al refrescar usuario:', error);
    }
  };

  // ====================
  // HELPERS
  // ====================

  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  const isAuthenticated = (): boolean => {
    return !!user;
  };

  // ====================
  // VALUE
  // ====================

  const value: AuthContextType = {
    user,
    loading,
    loginWithGoogle,
    logout,
    getToken,
    isAuthenticated,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};