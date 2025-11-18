import { useEffect, useReducer, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { slidesAPI, classesAPI, type ClassData, type Slide } from '../../services/api';
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
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'PROCESSING_START' }
  | { type: 'CLASS_LOADED'; payload: ClassData }
  | { type: 'LOAD_SUCCESS'; payload: Slide[] }
  | { type: 'LOAD_FAILURE'; payload: string }
  | { type: 'REVEAL_READY' }
  | { type: 'SET_FULLSCREEN'; payload: boolean };

const initialState: State = {
  classData: null,
  slides: [],
  isLoading: true,
  isProcessing: false,
  error: null,
  isFullscreen: false,
  isRevealReady: false,
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
    default: 
      return state;
  }
}

const PresentationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [state, dispatch] = useReducer(presentationReducer, initialState);
  const { classData, slides, isLoading, isProcessing, error, isFullscreen, isRevealReady } = state;
  const revealRef = useRef<Reveal.Api | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  const revealDivRef = useRef<HTMLDivElement>(null);

  // Cargar datos de la clase primero
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
      } catch (err) {
        console.error('Error al cargar clase:', err);
        dispatch({ type: 'LOAD_FAILURE', payload: 'Error al cargar la clase' });
      }
    };

    loadClass();
  }, [id]);

  // Cargar slides con polling
  useEffect(() => {
    if (!classData?.id) return;

    const loadSlides = async () => {
      try {
        const slidesData = await slidesAPI.getByClass(classData.id);

        if (!slidesData || slidesData.length === 0) {
          dispatch({ type: 'PROCESSING_START' });
          return;
        }

        dispatch({ type: 'LOAD_SUCCESS', payload: slidesData });

        // Detener polling cuando tengamos slides
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }

      } catch (err) {
        console.error('Error al cargar slides:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        dispatch({ type: 'LOAD_FAILURE', payload: errorMessage });
      }
    };

    // Primera carga
    loadSlides();

    // Iniciar polling
    pollingIntervalRef.current = window.setInterval(() => {
      loadSlides();
    }, 2000);

    // Cleanup
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [classData?.id]);

  // Inicializar Reveal.js cuando tengamos slides Y el DOM esté listo
  useEffect(() => {
    if (!slides.length || revealRef.current || !revealDivRef.current) return;

    console.log('🎯 Inicializando Reveal.js con', slides.length, 'slides');

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
          console.log('✅ Reveal.js inicializado correctamente');
          revealRef.current = deck;
          dispatch({ type: 'REVEAL_READY' });
        });

      } catch (err) {
        console.error('❌ Error al inicializar Reveal.js:', err);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (revealRef.current) {
        console.log('🧹 Destruyendo Reveal.js');
        revealRef.current.destroy();
        revealRef.current = null;
      }
    };
  }, [slides]);
  
  // Entrar automáticamente en fullscreen
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
  
  // Detectar cambios de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      dispatch({ type: 'SET_FULLSCREEN', payload: !!document.fullscreenElement });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Suscribirse a Action Cable
  useEffect(() => {
    if (!classData?.id || !isRevealReady) return;

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
        received(data: { action: string; direction: 'next' | 'prev' }) {
          console.log('📨 Mensaje recibido:', data);
          if (data.action === 'navigate' && revealRef.current) {
            data.direction === 'next' ? revealRef.current.next() : revealRef.current.prev();
          }
        },
      }
    );

    return () => {
      console.log('🔌 Desuscribiéndose de Action Cable');
      subscription.unsubscribe();
    };
  }, [classData?.id, isRevealReady]);

  const handleExit = () => {
    navigate('/clases');
  };

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