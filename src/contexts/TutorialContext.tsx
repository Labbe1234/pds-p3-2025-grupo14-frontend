import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CallBackProps, Step } from 'react-joyride';
import { useLocation, useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api'; // ✅ Importar API
import { useAuth } from './AuthContext'; // ✅ Importar hook de autenticación

interface TutorialContextType {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  startTutorial: () => void;
  stopTutorial: () => void;
  resetTutorial: () => void;
  handleJoyrideCallback: (data: CallBackProps) => void;
  setSteps: (steps: Step[]) => void;
  nextStep: () => void;
  setStepIndex: (index: number) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

interface TutorialProviderProps {
  children: ReactNode;
  steps: Step[];
}

const STEP_ROUTES: { [key: number]: string } = {
  0: '/',        // Navbar: Inicio
  1: '/',        // Botón Comenzar
  2: '/',        // Cards Section
  3: '/',        // Botón "Ir a Clases"
  4: '/clases',  // Bienvenida página Clases
  5: '/clases',  // Botón "Crear Primera Clase"
  6: '/clases',  // Campo: Nombre
  7: '/clases',  // Campo: Asignatura
  8: '/clases',  // Select: Nivel
  9: '/clases',  // Input: Archivo
  10: '/clases', // Botón: Crear Clase
  11: '/clases', // Estado: Procesando
  12: '/clases', // Tarjeta: Clase creada
  13: '/clases', // Telegram: Descargar y buscar bot
  14: '/clases', // Telegram: Conectar bot
  15: '/clases', // Telegram: Comando /listclasses
  16: '/clases', // Telegram: Botones navegación
  17: '/clases', // Telegram: Comandos /ejemplo y /pregunta
  18: '/clases', // Telegram: Flujo completo
  19: '/clases', // Conclusión final
};

export const TutorialProvider = ({ children, steps: initialSteps }: TutorialProviderProps) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth(); // ✅ Obtener usuario del contexto

  // ✅ NUEVO: Auto-iniciar tutorial si el usuario NO lo ha completado
  useEffect(() => {
    const shouldAutoStart = user && !user.tutorial_completed;
    
    if (shouldAutoStart && !run && stepIndex === 0 && location.pathname === '/') {
      console.log('🚀 Auto-iniciando tutorial (usuario nuevo)');
      const timer = setTimeout(() => {
        setRun(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, run, stepIndex, location.pathname]);

  // Reanudar tutorial al cambiar de ruta
  useEffect(() => {
    if (!run && stepIndex > 0) {
      const expectedRoute = STEP_ROUTES[stepIndex];
      
      if (location.pathname === expectedRoute) {
        console.log(`✅ Ruta correcta (${expectedRoute}) - Reanudando tutorial en paso ${stepIndex}`);
        const timer = setTimeout(() => {
          setRun(true);
        }, 500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, stepIndex, run]);

  const startTutorial = useCallback(() => {
    console.log('🎬 Iniciando tutorial manualmente');
    setStepIndex(0);
    setRun(true);
    if (location.pathname !== '/') {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  const stopTutorial = useCallback(() => {
    console.log('⏹️ Deteniendo tutorial');
    setRun(false);
  }, []);

  const resetTutorial = useCallback(() => {
    console.log('🔄 Reseteando tutorial');
    setStepIndex(0);
    setRun(true);
    if (location.pathname !== '/') {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  const nextStep = useCallback(() => {
    const nextIndex = stepIndex + 1;
    
    if (nextIndex >= steps.length) {
      console.log('🎉 Tutorial completado!');
      
      // ✅ NUEVO: Marcar como completado en el backend
      usersAPI.completeTutorial()
        .then(() => {
          console.log('✅ Tutorial marcado como completado en backend');
          // Refrescar datos del usuario
          refreshUser();
        })
        .catch((error) => {
          console.error('❌ Error al marcar tutorial:', error);
        });
      
      setRun(false);
      setStepIndex(0);
      return;
    }

    const currentRoute = STEP_ROUTES[stepIndex];
    const nextRoute = STEP_ROUTES[nextIndex];
    
    if (nextRoute && currentRoute !== nextRoute && location.pathname !== nextRoute) {
      console.log(`🔀 Cambiando de ruta: ${currentRoute} → ${nextRoute}`);
      setStepIndex(nextIndex);
      setRun(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigate(nextRoute);
    } else {
      console.log(`✅ Mismo route, avanzando a paso ${nextIndex}`);
      setStepIndex(nextIndex);
    }
  }, [stepIndex, steps.length, navigate, location.pathname, refreshUser]);

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, action, type } = data;

    console.log('🎯 Joyride callback:', { status, action, type });

    if (type === 'step:after') {
      if (action === 'next') {
        nextStep();
      } else if (action === 'prev') {
        const prevIndex = Math.max(0, stepIndex - 1);
        const currentRoute = STEP_ROUTES[stepIndex];
        const prevRoute = STEP_ROUTES[prevIndex];
        
        if (prevRoute && currentRoute !== prevRoute) {
          console.log(`🔙 Retrocediendo a ruta: ${prevRoute}`);
          setStepIndex(prevIndex);
          setRun(false);
          navigate(prevRoute);
        } else {
          setStepIndex(prevIndex);
        }
      }
    } 
    // ✅ MEJORADO: Manejar cierre/finalización del tutorial
    else if (status === 'finished' || status === 'skipped' || action === 'close') {
      console.log('❌ Tutorial cerrado/completado por el usuario');
      
      // ✅ NUEVO: Marcar como completado en el backend
      usersAPI.completeTutorial()
        .then(() => {
          console.log('✅ Tutorial marcado como completado en backend');
          // Refrescar datos del usuario
          refreshUser();
        })
        .catch((error) => {
          console.error('❌ Error al marcar tutorial:', error);
        });
      
      setRun(false);
      setStepIndex(0);
    }
  }, [nextStep, stepIndex, navigate, refreshUser]);

  const value = {
    run,
    stepIndex,
    steps,
    startTutorial,
    stopTutorial,
    resetTutorial,
    handleJoyrideCallback,
    setSteps,
    nextStep,
    setStepIndex,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}