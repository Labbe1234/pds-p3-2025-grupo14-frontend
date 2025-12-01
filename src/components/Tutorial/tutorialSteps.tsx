import type { Step } from 'react-joyride';

export const tutorialSteps: Step[] = [
  // ========== HOME PAGE (Pasos 0-3) - Solo Next Step ==========
  
  {
    target: '.navbar-inicio',
    content: (
      <div>
        <h2>🏠 Bienvenido a ClaseSync</h2>
        <p>Este es tu punto de inicio. Aquí encontrarás un resumen de tu actividad.</p>
        <p><strong>📌 Consejo:</strong> Puedes volver aquí en cualquier momento haciendo clic en el logo o en "Inicio".</p>
      </div>
    ),
    placement: 'bottom',
    disableBeacon: true,
  },

  {
    target: '.btn-comenzar',
    content: (
      <div>
        <h2>🚀 Comienza tu experiencia</h2>
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
        <h2>📚 Sección de Clases</h2>
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
        <h2>📋 Gestiona tus Clases</h2>
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
        <h2>📚 Página de Clases</h2>
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
        <h2>✨ Crear tu Primera Clase</h2>
        <p>Haz clic aquí para abrir el formulario de creación.</p>
        <p>Necesitarás:</p>
        <ul>
          <li>📝 Nombre de la clase (mínimo 5 caracteres)</li>
          <li>📚 Asignatura</li>
          <li>📊 Nivel del curso</li>
          <li>📄 Archivo de presentación (PPTX o PDF)</li>
        </ul>
        <p className="tutorial-action-hint">👉 <strong>Haz clic en "Crear Primera Clase"</strong></p>
      </div>
    ),
    placement: 'bottom',
    spotlightClicks: true,
  },

  {
    target: '#className',
    content: (
      <div>
        <h3>📝 Nombre de la Clase</h3>
        <p>Haz clic en el campo y escribe el nombre de tu clase.</p>
        <p><strong>Ejemplo:</strong> "Introducción a React"</p>
        <p className="tutorial-action-hint">💡 Escribe el nombre y presiona "Siguiente"</p>
      </div>
    ),
    placement: 'bottom',
    spotlightClicks: true,
  },

  {
    target: '#subject',
    content: (
      <div>
        <h3>📚 Asignatura</h3>
        <p>Indica a qué materia pertenece esta clase.</p>
        <p><strong>Ejemplo:</strong> "Programación Web"</p>
        <p className="tutorial-action-hint">💡 Escribe la asignatura y presiona "Siguiente"</p>
      </div>
    ),
    placement: 'bottom',
    spotlightClicks: true,
  },

  {
    target: '#level',
    content: (
      <div>
        <h3>📊 Nivel del Curso</h3>
        <p>Haz clic para seleccionar el nivel de dificultad:</p>
        <ul>
          <li>🟢 Básico</li>
          <li>🟡 Intermedio</li>
          <li>🔴 Avanzado</li>
        </ul>
        <p className="tutorial-action-hint">👆 Selecciona un nivel y presiona "Siguiente"</p>
      </div>
    ),
    placement: 'bottom',
    spotlightClicks: true,
  },

  {
    target: '#file-upload-container',
    content: (
      <div>
        <h3>📄 Subir Presentación</h3>
        <p>Haz clic en el botón "Seleccionar archivo (PDF, PPTX)" para elegir tu presentación.</p>
        <p><strong>Formatos aceptados:</strong></p>
        <ul>
          <li>📄 PDF (.pdf)</li>
          <li>📊 PowerPoint (.pptx, .ppt)</li>
        </ul>
        <p className="tutorial-action-hint">📎 <strong>Sube tu archivo y presiona "Siguiente"</strong></p>
        <p><strong>⏱️ Nota:</strong> El procesamiento puede tardar algunos segundos.</p>
      </div>
    ),
    placement: 'right',
    spotlightClicks: true,
  },

  {
    target: '.btn-crear-clase',
    content: (
      <div>
        <h3>💾 Crear Clase</h3>
        <p>Una vez completado el formulario, haz clic aquí para crear tu clase.</p>
        <p className="tutorial-action-hint">👉 <strong>Haz clic en "Crear Clase"</strong></p>
        <p><strong>📌 Importante:</strong> El tutorial esperará a que se procese la presentación.</p>
      </div>
    ),
    placement: 'top',
    spotlightClicks: true,
  },

  {
    target: '.saving-indicator',
    content: (
      <div>
        <h2>⏳ Procesando Presentación...</h2>
        <p>Estamos procesando tu presentación para extraer los slides.</p>
        <p><strong>Esto puede tardar entre 10 y 90 segundos.</strong></p>
        <p className="tutorial-action-hint">⚠️ <strong>Espera a que termine de cargar antes de presionar "Siguiente"</strong></p>
        <p>Por favor, no cierres esta ventana.</p>
      </div>
    ),
    placement: 'center',
  },

  {
    target: '.class-card',
    content: (
      <div>
        <h2>🎉 ¡Clase Creada Exitosamente!</h2>
        <p>Así se verá tu clase una vez creada:</p>
        <ul>
          <li>📝 Nombre y asignatura</li>
          <li>🏷️ Nivel del curso</li>
          <li>📄 Archivo adjunto y cantidad de slides</li>
          <li>⚡ Acciones rápidas (Iniciar, Editar, Eliminar)</li>
        </ul>
        <p className="tutorial-action-hint">👉 Presiona "Siguiente" para continuar</p>
      </div>
    ),
    placement: 'right',
  },

  // ========== TELEGRAM INTEGRATION (Pasos 13-18) ==========

  // PASO 13: Descargar y Buscar Telegram Bot
  {
    target: 'body',
    content: (
      <div>
        <h2>📱 Paso 1: Descargar Telegram</h2>
        <p>Para controlar tus presentaciones de forma remota, necesitas:</p>
        <ol>
          <li>📥 <strong>Descargar Telegram</strong> en tu teléfono (si no lo tienes)</li>
          <li>🔍 <strong>Buscar el bot:</strong> <code>@class_assistant_labonso_bot</code></li>
        </ol>
        <div style={{
          background: '#EEF2FF',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          border: '2px solid #4F46E5'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#4F46E5' }}>
            🤖 Bot: @class_assistant_labonso_bot
          </p>
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#6B7280' }}>
          <strong>Imagen:</strong> [AGREGAR CAPTURA DE PANTALLA DE TELEGRAM]
        </p>
      </div>
    ),
    placement: 'center',
  },

  // PASO 14: Conectar Bot con cuenta
  {
    target: 'body',
    content: (
      <div>
        <h2>🔗 Paso 2: Conectar el Bot</h2>
        <p>Una vez que encuentres el bot:</p>
        <ol>
          <li>✅ Presiona <strong>"INICIAR"</strong> o <strong>"START"</strong></li>
          <li>🔑 Haz clic en <strong>"Conectar cuenta"</strong></li>
          <li>📧 Ingresa las mismas credenciales de ClaseSync</li>
        </ol>
        <div style={{
          background: '#FEF3C7',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '15px',
          border: '1px solid #F59E0B'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            ⚠️ <strong>Importante:</strong> Usa el mismo correo con el que creaste tu cuenta en ClaseSync
          </p>
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#6B7280' }}>
          <strong>Imagen:</strong> [AGREGAR CAPTURA DEL PROCESO DE CONEXIÓN]
        </p>
      </div>
    ),
    placement: 'center',
  },

  // PASO 15: Conectar con clase específica
  {
    target: 'body',
    content: (
      <div>
        <h2>📚 Paso 3: Conectar con tu Clase</h2>
        <p>Para vincular el bot con la clase que acabas de crear:</p>
        <ol>
          <li>📝 Escribe el comando: <code>/listclasses</code></li>
          <li>📋 Se mostrará una lista de tus clases</li>
          <li>👆 Selecciona la clase que quieres controlar</li>
        </ol>
        <div style={{
          background: '#1F2937',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          fontFamily: 'monospace',
          color: '#10B981'
        }}>
          <p style={{ margin: 0 }}>
            <strong>/listclasses</strong>
          </p>
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#6B7280' }}>
          <strong>Imagen:</strong> [AGREGAR CAPTURA DE /listclasses]
        </p>
      </div>
    ),
    placement: 'center',
  },

  // PASO 16: Botones de navegación
  {
    target: 'body',
    content: (
      <div>
        <h2>🎮 Paso 4: Controles de Navegación</h2>
        <p>Una vez conectado a una clase, verás botones para controlar la presentación:</p>
        <ul>
          <li>⏮️ <strong>Anterior:</strong> Retroceder un slide</li>
          <li>⏭️ <strong>Siguiente:</strong> Avanzar un slide</li>
          <li>🏠 <strong>Inicio:</strong> Ir al primer slide</li>
          <li>🔚 <strong>Final:</strong> Ir al último slide</li>
        </ul>
        <div style={{
          background: '#F3F4F6',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '24px' }}>
            ⏮️ ⏭️ 🏠 🔚
          </p>
        </div>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#6B7280' }}>
          <strong>Imagen:</strong> [AGREGAR CAPTURA DE LOS BOTONES]
        </p>
      </div>
    ),
    placement: 'center',
  },

  // PASO 17: Comandos especiales
  {
    target: 'body',
    content: (
      <div>
        <h2>✨ Paso 5: Comandos Especiales</h2>
        <p>El bot incluye comandos potenciados con IA:</p>
        
        <div style={{ marginTop: '15px' }}>
          <div style={{
            background: '#DBEAFE',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '10px',
            border: '1px solid #3B82F6'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#1E40AF' }}>
              📝 /ejemplo
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
              Genera un ejemplo práctico sobre el contenido del slide actual
            </p>
          </div>

          <div style={{
            background: '#DCFCE7',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #10B981'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#065F46' }}>
              ❓ /pregunta
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
              Crea una pregunta de evaluación basada en el slide actual
            </p>
          </div>
        </div>

        <p style={{ marginTop: '15px', fontSize: '14px', color: '#6B7280' }}>
          <strong>Imagen:</strong> [AGREGAR CAPTURA DE COMANDOS EN USO]
        </p>
      </div>
    ),
    placement: 'center',
  },

  // PASO 18: Flujo completo de uso
  {
    target: 'body',
    content: (
      <div>
        <h2>🎯 Paso 6: ¡Listo para Usar!</h2>
        <p>Para usar el bot durante una clase:</p>
        <ol>
          <li>▶️ <strong>Inicia la presentación</strong> desde ClaseSync (botón "Iniciar")</li>
          <li>📱 <strong>Abre Telegram</strong> en tu teléfono</li>
          <li>🎮 <strong>Usa los botones o comandos</strong> para controlar la presentación</li>
          <li>✨ <strong>Prueba los comandos IA</strong> durante la clase</li>
        </ol>
        
        <div style={{
          background: '#FEF3C7',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          border: '1px solid #F59E0B'
        }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            💡 <strong>Tip:</strong> Primero inicia la presentación en ClaseSync, luego usa el bot de Telegram
          </p>
        </div>

        <p style={{ marginTop: '15px', fontSize: '14px', color: '#6B7280' }}>
          <strong>Imagen:</strong> [AGREGAR CAPTURA DEL FLUJO COMPLETO]
        </p>
      </div>
    ),
    placement: 'center',
  },

  // ========== CONCLUSIÓN FINAL (Paso 19) ==========

  {
    target: 'body',
    content: (
      <div>
        <h2>🎉 ¡Tutorial Completado!</h2>
        <p>Ya conoces todas las funciones de ClaseSync:</p>
        <ul>
          <li>✅ Crear y gestionar clases</li>
          <li>✅ Subir presentaciones (PDF/PPTX)</li>
          <li>✅ Iniciar presentaciones interactivas</li>
          <li>✅ Controlar con Telegram Bot</li>
          <li>✅ Usar comandos IA (ejemplos y preguntas)</li>
        </ul>
        <p><strong>💡 Recuerda:</strong> Puedes volver a ver este tutorial haciendo clic en el botón de ayuda (?) en la esquina inferior derecha.</p>
        <p><strong>¡Disfruta creando y presentando tus clases! 🚀</strong></p>
      </div>
    ),
    placement: 'center',
  },
];