import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { CallBackProps, Step } from 'react-joyride';
import { useLocation, useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { useAuth } from './AuthContext';

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
  13: '/clases', // Telegram: Botón flotante
  14: '/clases', // Telegram: Modal QR
  15: '/clases', // Telegram: Comando /listclases
  16: '/clases', // Telegram: Comandos IA
  17: '/clases', // Telegram: Flujo completo
  18: '/clases', // Conclusión final
};

export const TutorialProvider = ({ children, steps: initialSteps }: TutorialProviderProps) => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  // Flag para indicar que estamos en transición automática
  const isAutoTransitioning = useRef(false);

  // Auto-iniciar tutorial si el usuario NO lo ha completado
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
    // NO reanudar si estamos en transición automática
    if (isAutoTransitioning.current) return;
    
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

  // Esperar a que el modal del formulario se abra (Paso 6)
  useEffect(() => {
    // Solo activar si estamos en paso 6 y el tutorial está PAUSADO
    if (stepIndex !== 6 || run) return;

    console.log('⏳ Paso 6: Esperando a que el modal de crear clase se abra...');
    
    // Polling para detectar cuando el modal está listo
    const checkModalInterval = setInterval(() => {
      const nameInput = document.querySelector('#className');
      
      if (nameInput) {
        console.log('✅ Modal de crear clase abierto y listo, reanudando tutorial en paso 6');
        clearInterval(checkModalInterval);
        
        setTimeout(() => {
          setRun(true);
        }, 300);
      }
    }, 100);

    // Timeout de seguridad (5 segundos)
    const timeout = setTimeout(() => {
      clearInterval(checkModalInterval);
      console.warn('⚠️ Timeout: Modal de crear clase no detectado, reanudando de todas formas');
      setRun(true);
    }, 5000);

    // Cleanup
    return () => {
      clearInterval(checkModalInterval);
      clearTimeout(timeout);
    };
  }, [stepIndex, run]);

  // 🔧 MEJORADO: Esperar a que el modal de Telegram se abra (Paso 14)
  useEffect(() => {
    // Solo activar si estamos en paso 14 y el tutorial está PAUSADO
    if (stepIndex !== 14 || run) return;

    console.log('⏳ Paso 14: Esperando a que el modal de Telegram se abra...');
    
    // Polling para detectar cuando el modal está listo Y completamente renderizado
    const checkTelegramModalInterval = setInterval(() => {
      const telegramModal = document.querySelector('.telegram-modal');
      const qrCanvas = document.querySelector('.telegram-modal canvas'); // 🆕 Verificar que el QR se renderizó
      const isReady = telegramModal?.getAttribute('data-ready') === 'true'; // 🆕 Verificar estado interno
      
      // 🆕 Verificar que el modal está visible, el QR cargado y el estado interno es ready
      if (telegramModal && qrCanvas && isReady) {
        const isVisible = window.getComputedStyle(telegramModal).opacity !== '0';
        
        if (isVisible) {
          console.log('✅ Modal de Telegram completamente cargado (con QR y animación terminada), reanudando tutorial en paso 14');
          clearInterval(checkTelegramModalInterval);
          
          // 🆕 Esperar un poco más para asegurar estabilidad visual
          setTimeout(() => {
            setRun(true);
          }, 500); // Aumentado de 300ms a 500ms
        }
      }
    }, 150); // 🆕 Aumentado de 100ms a 150ms para reducir carga

    // 🆕 Timeout aumentado para producción (latencia de red)
    const timeout = setTimeout(() => {
      clearInterval(checkTelegramModalInterval);
      console.warn('⚠️ Timeout: Modal de Telegram no detectado después de 10 segundos, reanudando de todas formas');
      setRun(true);
    }, 10000); // 🆕 Aumentado de 5s a 10s

    // Cleanup
    return () => {
      clearInterval(checkTelegramModalInterval);
      clearTimeout(timeout);
    };
  }, [stepIndex, run]);

  // Avanzar automáticamente cuando la clase se crea (Paso 11 → 12)
  useEffect(() => {
    // Solo activar si estamos en paso 11 (procesando clase) y el tutorial está activo
    if (stepIndex !== 11 || !run) {
      return;
    }

    console.log('⏳ PASO 11: Iniciando detector de clase creada...');
    
    // Polling para detectar cuando desaparece el indicador de carga y aparece la tarjeta
    const checkClassCreatedInterval = setInterval(() => {
      const savingIndicator = document.querySelector('.saving-indicator');
      const classCard = document.querySelector('.class-card');
      
      // Condición: Ya NO hay indicador de carga Y SÍ hay tarjeta de clase
      if (!savingIndicator && classCard) {
        console.log('✅ Clase creada detectada, avanzando automáticamente al paso 12');
        clearInterval(checkClassCreatedInterval);
        
        // Desactivar completamente Joyride antes de cambiar el índice
        setRun(false);
        
        // Esperar un momento para que Joyride se desmonte
        setTimeout(() => {
          setStepIndex(12);
          
          // Activar flag para evitar interferencia del useEffect de reanudación
          isAutoTransitioning.current = true;
          
          // Reactivar Joyride en el paso 12
          setTimeout(() => {
            isAutoTransitioning.current = false;
            setRun(true);
          }, 500);
        }, 200);
      }
    }, 300);

    // Timeout de seguridad (3 minutos)
    const timeout = setTimeout(() => {
      clearInterval(checkClassCreatedInterval);
      console.warn('⚠️ TIMEOUT: La clase tardó más de 3 minutos en procesarse');
      isAutoTransitioning.current = false;
    }, 180000);

    // Cleanup
    return () => {
      clearInterval(checkClassCreatedInterval);
      clearTimeout(timeout);
    };
  }, [stepIndex, run]);

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
      
      usersAPI.completeTutorial()
        .then(() => {
          console.log('✅ Tutorial marcado como completado en backend');
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
    
    // 🔧 CASO ESPECIAL: Del paso 5 al 6 (abrir modal de crear clase)
    if (stepIndex === 5 && nextIndex === 6) {
      console.log('🎯 Transición especial: Paso 5 → 6 (abriendo modal de crear clase)');
      
      const createButton = document.querySelector('.btn-crear-primera-clase') as HTMLButtonElement;
      if (createButton) {
        console.log('✅ Haciendo click en botón crear clase...');
        createButton.click();
      } else {
        console.error('❌ No se encontró el botón .btn-crear-primera-clase');
      }
      
      setStepIndex(nextIndex);
      setRun(false); // El useEffect se encargará de reanudar cuando el modal esté listo
      return;
    }

    // 🔧 CASO ESPECIAL: Del paso 13 al 14 (abrir modal de Telegram)
    if (stepIndex === 13 && nextIndex === 14) {
      console.log('🎯 Transición especial: Paso 13 → 14 (abriendo modal de Telegram)');
      
      const telegramButton = document.querySelector('.telegram-floating-btn') as HTMLButtonElement;
      if (telegramButton) {
        console.log('✅ Haciendo click en botón de Telegram...');
        telegramButton.click();
      } else {
        console.error('❌ No se encontró el botón .telegram-floating-btn');
      }
      
      setStepIndex(nextIndex);
      setRun(false); // El useEffect se encargará de reanudar cuando el modal esté listo
      return;
    }
    
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
    else if (status === 'finished' || status === 'skipped' || action === 'close') {
      console.log('❌ Tutorial cerrado/completado por el usuario');
      
      usersAPI.completeTutorial()
        .then(() => {
          console.log('✅ Tutorial marcado como completado en backend');
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