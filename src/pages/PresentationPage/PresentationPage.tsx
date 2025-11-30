import { useEffect, useReducer, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { slidesAPI, classesAPI, sessionsAPI, type ClassData, type Slide } from '../../services/api';
import Reveal from 'reveal.js';
import cable from '../../services/cable';
import { Maximize, Minimize } from 'lucide-react';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import './PresentationPage.css';

interface State {
  classData: ClassData | null;
  slides: Slide[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  isFullscreen: boolean;
  isRevealReady: boolean;
  sessionId: number | null;
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'PROCESSING_START' }
  | { type: 'CLASS_LOADED'; payload: ClassData }
  | { type: 'LOAD_SUCCESS'; payload: Slide[] }
  | { type: 'LOAD_FAILURE'; payload: string }
  | { type: 'REVEAL_READY' }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SESSION_STARTED'; payload: number };

const initialState: State = {
  classData: null,
  slides: [],
  isLoading: true,
  isProcessing: false,
  error: null,
  isFullscreen: false,
  isRevealReady: false,
  sessionId: null,
};

function presentationReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, isProcessing: false, error: null };
    case 'PROCESSING_START':
      return { ...state, isLoading: false, isProcessing: true };
    case 'CLASS_LOADED':
      return { ...state, classData: action.payload };
    case 'LOAD_SUCCESS':
      return { ...state, isLoading: false, isProcessing: false, slides: action.payload };
    case 'LOAD_FAILURE':
      return { ...state, isLoading: false, isProcessing: false, error: action.payload };
    case 'REVEAL_READY':
      return { ...state, isRevealReady: true };
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };
    case 'SESSION_STARTED':
      return { ...state, sessionId: action.payload };
    default:
      return state;
  }
}

const PresentationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [state, dispatch] = useReducer(presentationReducer, initialState);
  const { classData, slides, isLoading, isProcessing, error, isFullscreen, isRevealReady, sessionId } = state;

  const revealRef = useRef<Reveal.Api | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const revealDivRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<number | null>(null);

  // Guardamos la posición actual para restaurarla tras recargar los slides
  const currentIndicesRef = useRef<{ h: number; v: number }>({ h: 0, v: 0 });
  const syncTimeoutRef = useRef<number | null>(null);
  const sessionInitializedRef = useRef<string | null>(null);

  // ====================
  // 1. CARGAR DATOS DE CLASE
  // ====================
  useEffect(() => {
    const loadClass = async () => {
      if (!id) {
        dispatch({ type: 'LOAD_FAILURE', payload: 'ID de clase no válido' });
        return;
      }

      try {
        dispatch({ type: 'LOAD_START' });
        const data = await classesAPI.getOne(id);

        if (!data) {
          dispatch({ type: 'LOAD_FAILURE', payload: 'Clase no encontrada' });
          return;
        }

        dispatch({ type: 'CLASS_LOADED', payload: data });

        // Iniciar sesión de clase (Evitar duplicados con StrictMode)
        if (sessionInitializedRef.current !== id) {
          sessionInitializedRef.current = id;
          try {
            const session = await sessionsAPI.create(id);
            console.log('✅ Sesión iniciada:', session.id);
            dispatch({ type: 'SESSION_STARTED', payload: session.id });

            // Registrar visita a la primera slide inmediatamente
            classesAPI.sync(id, 1, slides.length || 1, session.id)
              .catch(err => console.error('Error registrando slide inicial:', err));

          } catch (err) {
            console.error('Error al iniciar sesión:', err);
            sessionInitializedRef.current = null; // Permitir reintento si falla
          }
        }
      } catch (err) {
        console.error('Error al cargar clase:', err);
        dispatch({ type: 'LOAD_FAILURE', payload: 'Error al cargar la clase' });
      }
    };

    loadClass();
  }, [id]);

  // ====================
  // 2. FUNCIÓN PARA OBTENER SLIDES
  // ====================
  const fetchSlides = useCallback(async (silent = false) => {
    if (!classData?.id) return;

    try {
      if (!silent && !isRevealReady) dispatch({ type: 'LOAD_START' });

      const slidesData = await slidesAPI.getByClass(classData.id);

      if (!slidesData || slidesData.length === 0) {
        if (!silent) dispatch({ type: 'PROCESSING_START' });
        return;
      }

      dispatch({ type: 'LOAD_SUCCESS', payload: slidesData });

      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

    } catch (err) {
      console.error('Error al cargar slides:', err);
      if (!silent) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        dispatch({ type: 'LOAD_FAILURE', payload: errorMessage });
      }
    }
  }, [classData?.id, isRevealReady]);

  // ====================
  // 3. POLLING INICIAL
  // ====================
  useEffect(() => {
    if (!classData?.id) return;

    fetchSlides();

    // Si no hay slides, intentar de nuevo cada 2s
    if (slides.length === 0) {
      pollingIntervalRef.current = window.setInterval(() => {
        fetchSlides(true);
      }, 2000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [classData?.id, fetchSlides, slides.length]);

  // ====================
  // 4. INICIALIZAR / RECARGAR REVEAL.JS (USEEFFECT)
  // ====================
  // Este efecto se dispara cada vez que `slides` cambia.
  // Se encarga de "recargar" la presentación manteniendo el estado.
  useEffect(() => {
    if (!slides.length || !revealDivRef.current) return;

    // Si ya existe una instancia, guardamos posición y destruimos
    if (revealRef.current) {
      console.log('♻️ Recargando Reveal.js (Slides actualizados)...');
      try {
        // Aseguramos tener la última posición conocida antes de destruir
        const indices = revealRef.current.getIndices();
        if (indices) {
          currentIndicesRef.current = indices;
        }
        revealRef.current.destroy();
      } catch (e) {
        console.warn("Error destruyendo instancia anterior:", e);
      }
      revealRef.current = null;
    } else {
      console.log('🎯 Inicializando Reveal.js con', slides.length, 'slides');
    }

    // Pequeño delay para asegurar que el DOM de React se actualizó
    const timer = setTimeout(() => {
      if (!revealDivRef.current) return;

      try {
        const deck = new Reveal(revealDivRef.current, {
          embedded: false,
          controls: true,
          progress: true,
          center: true,
          hash: true,
          keyboard: true,
          overview: true,
          touch: true,
          transition: 'slide',
          width: 1920,
          height: 1080,
          margin: 0.04,
          minScale: 0.2,
          maxScale: 2.0,
        });

        deck.initialize().then(() => {
          revealRef.current = deck;

          // Restaurar posición si venimos de una recarga
          if (currentIndicesRef.current) {
            const { h, v } = currentIndicesRef.current;
            // Intentamos ir a la misma slide.
            // Si se insertó una nueva, podríamos querer ir a h+1, pero Reveal.js
            // maneja índices. Si la nueva se insertó después, h sigue siendo válido.
            deck.slide(h, v, 0, 0);
          }

          // Registrar listener de cambio de slide
          deck.on('slidechanged', (event: any) => {
            if (classData?.id) {
              const indices = deck.getIndices();

              // Actualizar ref para futuras recargas
              currentIndicesRef.current = indices;

              // Sincronizar con backend (1-based index)
              const currentSlidePosition = indices.h + 1;
              const totalSlides = deck.getTotalSlides();

              // Debounce sync to avoid spamming and initial jumps
              if (syncTimeoutRef.current) {
                clearTimeout(syncTimeoutRef.current);
              }

              syncTimeoutRef.current = window.setTimeout(() => {
                console.log('📍 Slide cambiada (Synced):', currentSlidePosition, '/', totalSlides);
                classesAPI.sync(classData.id, currentSlidePosition, totalSlides, sessionId || undefined)
                  .catch(err => console.error('Error sincronizando slide:', err));
              }, 1000); // 1 second debounce
            }
          });

          dispatch({ type: 'REVEAL_READY' });
        });

      } catch (err) {
        console.error('❌ Error al inicializar Reveal.js:', err);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [slides, classData?.id]); // Dependencia crítica: `slides`

  // ====================
  // 5. ACTION CABLE
  // ====================
  useEffect(() => {
    if (!classData?.id) return; // No esperamos isRevealReady para suscribirnos, para no perder eventos de carga

    console.log('📡 Suscribiéndose a Action Cable para clase:', classData.id);

    const subscription = cable.subscriptions.create(
      { channel: 'PresentationChannel', clase_id: classData.id },
      {
        connected() {
          console.log('✅ Conectado a PresentationChannel');
        },
        disconnected() {
          console.log('❌ Desconectado de PresentationChannel');
        },
        received(data: { action: string; direction?: 'next' | 'prev' }) {
          console.log('📨 Mensaje recibido:', data);

          if (data.action === 'reload') {
            console.log('🔄 Recibida orden de recarga. Obteniendo nuevos slides...');
            // Esto actualizará el estado `slides`, disparando el useEffect de arriba
            fetchSlides(true);
          } else if (data.action === 'navigate' && revealRef.current && data.direction) {
            data.direction === 'next' ? revealRef.current.next() : revealRef.current.prev();
          }
        },
      }
    );

    return () => {
      console.log('🔌 Desuscribiéndose de Action Cable');
      subscription.unsubscribe();
    };
  }, [classData?.id, fetchSlides]);

  // ====================
  // HANDLERS Y UI
  // ====================

  const handleExit = async () => {
    if (sessionId) {
      try {
        await sessionsAPI.end(sessionId);
        console.log('🏁 Sesión finalizada');
      } catch (err) {
        console.error('Error al finalizar sesión:', err);
      }
    }
    if (revealRef.current) {
      revealRef.current.destroy();
      revealRef.current = null;
    }
    navigate('/clases');
  };

  // Auto-Fullscreen
  useEffect(() => {
    if (!isRevealReady || !containerRef.current || document.fullscreenElement) return;
    const enterFullscreen = async () => {
      try {
        await containerRef.current!.requestFullscreen();
        dispatch({ type: 'SET_FULLSCREEN', payload: true });
      } catch (err) {
        console.error('Error al entrar en fullscreen:', err);
      }
    };
    const timer = setTimeout(enterFullscreen, 500);
    return () => clearTimeout(timer);
  }, [isRevealReady]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      dispatch({ type: 'SET_FULLSCREEN', payload: !!document.fullscreenElement });
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        dispatch({ type: 'SET_FULLSCREEN', payload: false });
      } else {
        await containerRef.current.requestFullscreen();
        dispatch({ type: 'SET_FULLSCREEN', payload: true });
      }
    } catch (err) {
      console.error('Error al cambiar fullscreen:', err);
    }
  };

  if (isLoading || isProcessing || !classData) {
    return (
      <div className="presentation-loading">
        <div className="spinner"></div>
        <p>{isProcessing ? '⚙️ Procesando presentación...' : '📥 Cargando presentación...'}</p>
        <p className="loading-detail">
          {isProcessing
            ? 'Esto puede tomar unos segundos. El archivo se está convirtiendo a imágenes.'
            : 'Por favor espera...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="presentation-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleExit} className="btn-exit">
          Volver a Clases
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`presentation-container ${isFullscreen ? 'fullscreen' : ''}`}
    >
      {!isFullscreen && (
        <div className="presentation-header">
          <div className="presentation-info">
            <h1>{classData.name}</h1>
            <p>{classData.subject}</p>
          </div>
          <div className="presentation-controls">
            <button
              onClick={toggleFullscreen}
              className="btn-fullscreen"
              title="Pantalla completa"
            >
              <Maximize size={24} />
            </button>
            <button onClick={handleExit} className="btn-exit-presentation">
              ✕ Salir
            </button>
          </div>
        </div>
      )}

      {isFullscreen && (
        <div className="fullscreen-controls">
          <button
            onClick={toggleFullscreen}
            className="btn-fullscreen-exit"
            title="Salir de pantalla completa"
          >
            <Minimize size={20} />
          </button>
          <button onClick={handleExit} className="btn-exit-presentation">
            ✕ Salir
          </button>
        </div>
      )}

      <div className="reveal" ref={revealDivRef}>
        <div className="slides">
          {slides.map((slide) => (
            <section key={slide.id} data-slide-number={slide.position}>
              <div dangerouslySetInnerHTML={{ __html: slide.content }} />
              {slide.notes && <aside className="notes">{slide.notes}</aside>}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PresentationPage;