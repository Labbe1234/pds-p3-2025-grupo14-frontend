import type { Step } from 'react-joyride';

export const tutorialSteps: Step[] = [
  // ========== HOME PAGE (Pasos 0-3) - Solo Next Step ==========
  
  {
    target: '.navbar-inicio',
    content: (
      <div>
        <h2>Bienvenido a ClaseSync</h2>
        <p>Este es tu punto de inicio. Aquí encontrarás un resumen de tu actividad.</p>
        <p><strong>Consejo:</strong> Puedes volver aquí en cualquier momento haciendo clic en el logo o en "Inicio".</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },

  {
    target: '.btn-comenzar',
    content: (
      <div>
        <h2>Comienza tu experiencia</h2>
        <p>Este botón te permite desplazarte a la sección de clases disponibles.</p>
        <p><strong>Presiona "Siguiente" para continuar el tutorial.</strong></p>
      </div>
    ),
    placement: 'top',
  },

  {
    target: '#clases',
    content: (
      <div>
        <h2>Sección de Clases</h2>
        <p>Aquí puedes ver las clases disponibles y acciones rápidas.</p>
        <p><strong>Desde aquí puedes acceder a la gestión completa de tus clases.</strong></p>
      </div>
    ),
    placement: 'top',
  },

  {
    target: '.card-clickable',
    content: (
      <div>
        <h2>Gestiona tus Clases</h2>
        <p>Esta tarjeta te permite acceder a todas tus clases y crear nuevas.</p>
        <p><strong>Presiona "Siguiente" para ir a la página de clases.</strong></p>
      </div>
    ),
    placement: 'right',
  },

  // ========== CLASES PAGE (Pasos 4-12) ==========
  
  {
    target: 'body',
    content: (
      <div>
        <h2>Página de Clases</h2>
        <p>Aquí verás todas tus clases creadas y podrás gestionarlas.</p>
        <p><strong>Si no tienes clases, verás un botón para crear tu primera clase.</strong></p>
      </div>
    ),
    placement: 'center',
  },

  {
    target: '.btn-crear-primera-clase',
    content: (
      <div>
        <h2>Crear tu Primera Clase</h2>
        <p>Este botón abre el formulario de creación de clases.</p>
        <p>Para crear una clase necesitarás:</p>
        <ul>
          <li>Nombre de la clase (mínimo 5 caracteres)</li>
          <li>Asignatura</li>
          <li>Nivel del curso</li>
          <li>Archivo de presentación (PPTX o PDF)</li>
        </ul>
        <p className="tutorial-action-hint">
          <strong>Presiona "Siguiente" para ver el formulario</strong>
        </p>
      </div>
    ),
    placement: 'bottom',
    spotlightClicks: false,
  },

  {
    target: '#className',
    content: (
      <div>
        <h3>Nombre de la Clase</h3>
        <p>Haz clic en el campo y escribe el nombre de tu clase.</p>
        <p><strong>Ejemplo:</strong> "Introducción a React"</p>
        <p className="tutorial-action-hint">Escribe el nombre y presiona "Siguiente"</p>
      </div>
    ),
    placement: 'bottom',
    spotlightClicks: true,
  },

  {
    target: '#subject',
    content: (
      <div>
        <h3>Asignatura</h3>
        <p>Indica a qué materia pertenece esta clase.</p>
        <p><strong>Ejemplo:</strong> "Programación Web"</p>
        <p className="tutorial-action-hint">Escribe la asignatura y presiona "Siguiente"</p>
      </div>
    ),
    placement: 'bottom',
    spotlightClicks: true,
  },

  {
    target: '#level',
    content: (
      <div>
        <h3>Nivel del Curso</h3>
        <p>Haz clic para seleccionar el nivel de dificultad:</p>
        <ul>
          <li>Básico</li>
          <li>Intermedio</li>
          <li>Avanzado</li>
        </ul>
        <p className="tutorial-action-hint">Selecciona un nivel y presiona "Siguiente"</p>
      </div>
    ),
    placement: 'bottom',
    spotlightClicks: true,
  },

  {
    target: '#file-upload-container',
    content: (
      <div>
        <h3>Subir Presentación</h3>
        <p>Haz clic en el botón "Seleccionar archivo recomendado (PPTX)" para elegir tu presentación.</p>
        <p><strong>Formatos aceptados:</strong></p>
        <ul>
          <li>PDF</li>
          <li>PowerPoint (PPTX)</li>
        </ul>
        <p className="tutorial-action-hint"><strong>Sube tu archivo y presiona "Siguiente"</strong></p>
      </div>
    ),
    placement: 'right',
    spotlightClicks: true,
  },

  {
    target: '.btn-crear-clase',
    content: (
      <div>
        <h3>Crear Clase</h3>
        <p>Una vez completado el formulario, haz clic aquí para crear tu clase.</p>
        <p className="tutorial-action-hint"><strong>Haz clic en "Crear Clase"</strong></p>
        <p><strong>Importante:</strong> El tutorial esperará a que se procese la presentación. Después de apretar "Crear Clase" presiona Siguiente</p>
      </div>
    ),
    placement: 'top',
    spotlightClicks: true,
  },

  {
    target: '.saving-indicator',
    content: (
      <div>
        <h2>Procesando Presentación...</h2>
        <p>Estamos procesando tu presentación para extraer los slides.</p>
        <p><strong>Esto puede tardar entre 10 y 90 segundos.</strong></p>
        <p className="tutorial-action-hint"><strong>Espera a que termine de cargar, el tutorial avanzará automáticamente</strong></p>
        <p>Por favor, no cierres esta ventana.</p>
      </div>
    ),
    placement: 'center',
  },

  {
    target: '.class-card',
    content: (
      <div>
        <h2>Clase Creada Exitosamente</h2>
        <p>Así se verá tu clase una vez creada:</p>
        <ul>
          <li>Nombre y asignatura</li>
          <li>Nivel del curso</li>
          <li>Archivo adjunto y cantidad de slides</li>
          <li>Acciones rápidas (Iniciar, Editar, Eliminar)</li>
        </ul>
        <p className="tutorial-action-hint">Presiona "Siguiente" para aprender sobre el control remoto por Telegram</p>
      </div>
    ),
    placement: 'right',
  },

  // ========== TELEGRAM INTEGRATION (Pasos 13-17) - NUEVA ESTRUCTURA ==========

  // PASO 13: Botón de Telegram (🔧 ARREGLADO: z-index y placement)
  {
    target: '.telegram-floating-btn',
    content: (
      <div>
        <h2>Control Remoto con Telegram</h2>
        <p>Este botón te permite conectar tu cuenta de Telegram para controlar tus presentaciones desde tu celular.</p>
        
        <div style={{
          background: '#EEF2FF',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '12px',
          border: '2px solid #4F46E5'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#4F46E5', fontSize: '14px' }}>
            ¿Para qué sirve?
          </p>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '13px' }}>
            <li>Controlar slides desde tu celular</li>
            <li>Generar ejemplos con IA durante la clase</li>
            <li>Crear preguntas de evaluación al instante</li>
          </ul>
        </div>

        <p className="tutorial-action-hint" style={{ marginTop: '12px', fontSize: '14px' }}>
          <strong>Presiona "Siguiente" para ver cómo conectar</strong>
        </p>
      </div>
    ),
    placement: 'top', // 🔧 CAMBIO CRÍTICO: 'top' en vez de 'right'
    disableBeacon: true,
    spotlightClicks: false,
    disableScrolling: true,
    styles: {
      options: {
        zIndex: 10000,
      },
      tooltip: {
        maxWidth: '400px', // 🆕 Limitar ancho
      },
    },
    floaterProps: {
      disableAnimation: true,
      offset: 20, // 🆕 Más separación del botón
    },
  },

  // PASO 14: Modal QR (Mostrar el modal cuando se abre)
  {
    target: '.telegram-modal',
    content: (
      <div>
        <h2>Escanea el Código QR</h2>
        <p>Para conectar tu cuenta de Telegram:</p>
        
        <ol style={{ marginTop: '12px', paddingLeft: '20px', fontSize: '14px' }}>
          <li><strong>Escanea el código QR</strong> con la cámara de tu celular</li>
        </ol>

        <div style={{
          background: '#DBEAFE',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '12px',
          border: '1px solid #3B82F6'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#1E40AF', fontSize: '13px' }}>
            El bot se llama:
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', fontFamily: 'monospace', color: '#1E40AF' }}>
            @class_assistant_labonso_bot
          </p>
        </div>

        <p className="tutorial-action-hint" style={{ marginTop: '12px', fontSize: '14px' }}>
          <strong>Presiona "Siguiente" para ver los controles disponibles</strong>
        </p>
      </div>
    ),
    placement: 'right', // 🔧 CAMBIO: 'right' para estar al lado del modal
    disableBeacon: true,
    disableOverlay: false,
    spotlightClicks: false,
    disableScrolling: true, // 🔧 CRÍTICO: Desactivar scroll
    styles: {
      options: {
        zIndex: 10000,
      },
      spotlight: {
        borderRadius: '16px',
      },
      tooltip: {
        maxWidth: '380px', // 🔧 NUEVO: Limitar ancho del tooltip
      },
    },
    floaterProps: {
      disableAnimation: true,
      offset: 15, // 🔧 NUEVO: Separación del modal
    },
  },

  // PASO 15: Controles de navegación y /listclasses
  {
    target: 'body',
    content: (
      <div>
        <h2>Controlar tus Clases</h2>
        <p>Una vez conectado, podrás controlar tus presentaciones desde Telegram:</p>

        <div style={{
          background: '#F3F4F6',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '12px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
            Listar tus clases:
          </p>
          <div style={{
            background: '#1F2937',
            padding: '8px',
            borderRadius: '6px',
            marginTop: '8px',
            fontFamily: 'monospace',
            color: '#10B981',
            fontSize: '13px'
          }}>
            /listclasses
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
            Muestra todas tus clases para seleccionar cuál controlar
          </p>
        </div>

        <div style={{
          background: '#F3F4F6',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '10px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px' }}>
            Botones de navegación:
          </p>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '13px' }}>
            <li><strong>⏮️ Anterior:</strong> Retroceder un slide</li>
            <li><strong>⏭️ Siguiente:</strong> Avanzar un slide</li>
          </ul>
        </div>

        <p className="tutorial-action-hint" style={{ marginTop: '12px', fontSize: '14px' }}>
          <strong>Presiona "Siguiente" para conocer los comandos IA</strong>
        </p>
      </div>
    ),
    placement: 'center',
    styles: {
      tooltip: {
        maxWidth: '480px', // 🔧 NUEVO: Limitar ancho
      },
    },
  },

  // PASO 16: Comandos IA (🔧 ARREGLADO: Reducir tamaño)
  {
    target: 'body',
    content: (
      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Comandos con IA</h2>
        <p style={{ fontSize: '14px', margin: '0 0 12px 0' }}>
          El bot incluye comandos potenciados por IA:
        </p>
        
        <div style={{ marginTop: '10px' }}>
          <div style={{
            background: '#DBEAFE',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '8px',
            border: '1px solid #3B82F6'
          }}>
            <div style={{
              background: '#1E40AF',
              padding: '4px 10px',
              borderRadius: '6px',
              marginBottom: '6px',
              fontFamily: 'monospace',
              color: 'white',
              display: 'inline-block',
              fontSize: '13px'
            }}>
              /ejemplo
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#1E3A8A' }}>
              Genera un <strong>ejemplo práctico</strong> del slide actual
            </p>
          </div>

          <div style={{
            background: '#DCFCE7',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '8px',
            border: '1px solid #10B981'
          }}>
            <div style={{
              background: '#065F46',
              padding: '4px 10px',
              borderRadius: '6px',
              marginBottom: '6px',
              fontFamily: 'monospace',
              color: 'white',
              display: 'inline-block',
              fontSize: '13px'
            }}>
              /pregunta
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#065F46' }}>
              Crea una <strong>pregunta de evaluación</strong>
            </p>
          </div>

          <div style={{
            background: '#FEF3C7',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #F59E0B'
          }}>
            <div style={{
              background: '#D97706',
              padding: '4px 10px',
              borderRadius: '6px',
              marginBottom: '6px',
              fontFamily: 'monospace',
              color: 'white',
              display: 'inline-block',
              fontSize: '13px'
            }}>
              /resumen
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#92400E' }}>
              Genera un <strong>resumen completo</strong> de la presentación
            </p>
          </div>
        </div>

        <p className="tutorial-action-hint" style={{ marginTop: '12px', fontSize: '14px' }}>
          <strong>Presiona "Siguiente" para ver el flujo recomendado</strong>
        </p>
      </div>
    ),
    placement: 'center',
    styles: {
      tooltip: {
        maxWidth: '420px', // 🔧 CRÍTICO: Reducir ancho máximo del tooltip
        padding: '16px', // 🔧 NUEVO: Reducir padding interno
      },
    },
  },

  // PASO 17: Consejo de uso (Conectar primero, luego iniciar clase)
  {
    target: 'body',
    content: (
      <div>
        <h2>Flujo de Uso Recomendado</h2>
        <p>Para usar ClaseSync correctamente:</p>

        <div style={{
          background: '#F9FAFB',
          padding: '15px',
          borderRadius: '12px',
          marginTop: '12px',
          border: '2px solid #E5E7EB'
        }}>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.7' }}>
            <li>
              <strong>Conecta Telegram primero</strong>
              <p style={{ margin: '4px 0 10px 0', color: '#6B7280', fontSize: '13px' }}>
                Escanea el QR y vincula tu cuenta antes de iniciar la clase
              </p>
            </li>
            <li>
              <strong>Selecciona tu clase en Telegram</strong>
              <p style={{ margin: '4px 0 10px 0', color: '#6B7280', fontSize: '13px' }}>
                Usa <code style={{ background: '#E5E7EB', padding: '2px 6px', borderRadius: '4px' }}>/listclasses</code> para elegir qué clase presentar
              </p>
            </li>
            <li>
              <strong>Inicia la presentación</strong>
              <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '13px' }}>
                Presiona el botón "Iniciar" en la tarjeta de tu clase
              </p>
            </li>
          </ol>
        </div>

        <p className="tutorial-action-hint" style={{ marginTop: '12px', fontSize: '14px' }}>
          <strong>Presiona "Siguiente" para finalizar el tutorial</strong>
        </p>
      </div>
    ),
    placement: 'center',
    styles: {
      tooltip: {
        maxWidth: '480px',
      },
    },
  },

  // ========== CONCLUSIÓN FINAL (Paso 18) ==========

  {
    target: 'body',
    content: (
      <div>
        <h2>Tutorial Completado</h2>
        <p>Ya conoces todas las funciones de ClaseSync:</p>
        
        <div style={{
          background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '15px'
        }}>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '15px' }}>
            <li><strong>Crear y gestionar clases</strong></li>
            <li><strong>Subir presentaciones</strong> (PDF/PPTX)</li>
            <li><strong>Iniciar presentaciones interactivas</strong></li>
            <li><strong>Controlar desde Telegram</strong></li>
            <li><strong>Usar comandos IA</strong> (ejemplos y preguntas)</li>
          </ul>
        </div>

        <div style={{
          background: '#EEF2FF',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          border: '2px solid #4F46E5'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#4F46E5' }}>
            ¿Necesitas ayuda?
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#4338CA' }}>
            Haz clic en el botón <strong>?</strong> (esquina inferior derecha) para volver a ver este tutorial en cualquier momento.
          </p>
        </div>

        <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
          ¡Disfruta creando y presentando tus clases!
        </p>
      </div>
    ),
    placement: 'center',
  },
];