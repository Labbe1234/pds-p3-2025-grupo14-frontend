import { useState, useEffect } from 'react'
import { classesAPI, type ClassData } from '../../services/api'
import { Play, Edit, Trash2, FileText, BookOpen, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import './ClasesPage.css'

const ClasesPage = () => {
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassData | null>(null)
  const [className, setClassName] = useState('')
  const [subject, setSubject] = useState('')
  const [level, setLevel] = useState<'basico' | 'intermedio' | 'avanzado' | ''>('')
  const [file, setFile] = useState<File | null>(null)
  const [classes, setClasses] = useState<ClassData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false) // Nuevo estado
  const [savingProgress, setSavingProgress] = useState('') // Nuevo estado para mensaje de progreso

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      setIsLoading(true)
      const data = await classesAPI.getAll()
      setClasses(data)
    } catch (error) {
      console.error('Error al cargar clases:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSaving) return // Evitar doble envío
    
    try {
      setIsSaving(true)
      
      if (editingClass) {
        setSavingProgress('Actualizando clase...')
        
        const updateData: Partial<ClassData> = {
          name: className,
          subject: subject,
          level: level as 'basico' | 'intermedio' | 'avanzado',
        }

        // ¿Hay archivo nuevo?
        const hasNewFile = !!file
        if (file) {
          updateData.file = file
          setSavingProgress('Subiendo y procesando archivo...')
        }

        // Actualizar en backend
        const updatedClass = await classesAPI.update(editingClass.id, updateData)

        let finalClass = updatedClass

        // 👇 Si hubo archivo nuevo, esperamos a que se procesen los slides
        if (hasNewFile) {
          const classWithSlides = await waitForSlides(updatedClass.id)
          if (classWithSlides) {
            finalClass = classWithSlides
            setSavingProgress('Presentación procesada correctamente ✅')
          } else {
            setSavingProgress('Clase actualizada. Los slides se siguen procesando...')
          }
        }

        // Actualizar lista en pantalla
        setClasses(classes.map(c => c.id === editingClass.id ? finalClass : c))
        alert(`Clase "${className}" actualizada exitosamente!`)
        resetForm()

      } else {
        setSavingProgress('Creando clase...')
        
        // Crear nueva clase
        const newClass = await classesAPI.create({
          id: '',
          name: className,
          subject: subject,
          level: level as 'basico' | 'intermedio' | 'avanzado',
          file: file,
          createdAt: new Date()
        })
        
        setSavingProgress('Procesando presentación...')
        
        // Después de crear, hacer polling para obtener los slides actualizados
        const classWithSlides = await waitForSlides(newClass.id)
        
        if (classWithSlides) {
          setClasses([classWithSlides, ...classes.filter(c => c.id !== newClass.id)])
          setSavingProgress('Clase creada exitosamente!')
        } else {
          // Si no se procesaron los slides, agregar la clase sin slides
          setClasses([newClass, ...classes])
          setSavingProgress('Clase creada. Los slides se están procesando...')
        }
        
        // Esperar 2 segundos para mostrar el mensaje de éxito
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        resetForm()
        await loadClasses() // Recargar clases
      }
      
    } catch (error) {
      console.error('Error al guardar clase:', error)
      alert('Error al guardar la clase. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
      setSavingProgress('')
    }
  }

  const waitForSlides = async (
    claseId: string,
    timeoutMs = 90000,      // ⏱️ tiempo máximo total: 90s
    intervalMs = 3000       // 🔁 intervalo entre consultas: 3s
  ) => {
    const maxAttempts = Math.ceil(timeoutMs / intervalMs)

    for (let i = 0; i < maxAttempts; i++) {
      setSavingProgress(`V2 Esperando slides... (${i + 1}/${maxAttempts})`)

      // Esperar antes de preguntar de nuevo
      await new Promise(resolve => setTimeout(resolve, intervalMs))

      try {
        const updatedClass = await classesAPI.getOne(claseId)
        if (updatedClass && updatedClass.slides_count && updatedClass.slides_count > 0) {
          return updatedClass
        }
      } catch (error) {
        console.error('Error al hacer polling de slides:', error)
        // Si hay error puntual seguimos intentando, salvo que quieras cortar en 404, etc.
      }
    }

    // Si llegamos aquí, no se generaron slides dentro del timeout
    return null
  }

  const handleEdit = (classItem: ClassData) => {
    setClassName(classItem.name)
    setSubject(classItem.subject)
    setLevel(classItem.level)
    setFile(null) // No prellenar el archivo al editar
    setEditingClass(classItem)
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta clase?')) {
      try {
        await classesAPI.delete(id)
        setClasses(classes.filter(c => c.id !== id))
        alert('Clase eliminada exitosamente!')
      } catch (error) {
        console.error('Error al eliminar clase:', error)
        alert('Error al eliminar la clase.')
      }
    }
  }

  const handleStartClass = (classItem: ClassData) => {
    if (!classItem.slides_count || classItem.slides_count === 0) {
      alert('Esta clase aún no tiene slides procesados. Por favor espera unos segundos y recarga la página.')
      return
    }
    // Navegar a la presentación pasando los datos por state
    navigate(`/clases/${classItem.id}/presentation`, { 
      state: { classItem } 
    });
  }

  const handleCancelEdit = () => {
    resetForm()
  }

  const resetForm = () => {
    setClassName('')
    setSubject('')
    setLevel('')
    setFile(null)
    setEditingClass(null)
    setShowCreateForm(false)
  }

  const getLevelLabel = (level: string) => {
    const labels = {
      'basico': 'Básico',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado'
    }
    return labels[level as keyof typeof labels] || level
  }

  if (isLoading) {
    return (
      <div className="clases-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando clases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="clases-page">
      <div className="clases-header">
        <h1>CREA TUS CLASES</h1>
        {showCreateForm && (
          <button 
            className="btn-create-class"
            onClick={() => {
              if (!isSaving) {
                handleCancelEdit()
              }
            }}
            disabled={isSaving}
          >
            ← Volver
          </button>
        )}
      </div>

      {showCreateForm ? (
        <div className="create-class-section">
          <h2>{editingClass ? 'Editar Clase' : 'Crear Nueva Clase'}</h2>
          
          {/* Indicador de progreso */}
          {isSaving && (
            <div className="saving-indicator">
              <div className="spinner"></div>
              <p>{savingProgress}</p>
              <p className="saving-detail">Por favor espera, no cierres esta ventana...</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="class-form" style={{ opacity: isSaving ? 0.5 : 1 }}>
            <div className="form-group">
              <label htmlFor="className">Nombre de la Clase</label>
              <input
                type="text"
                id="className"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Ej: Introducción a React"
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asignatura</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: Programación Web"
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="level">Nivel del Curso</label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value as 'basico' | 'intermedio' | 'avanzado')}
                required
                disabled={isSaving}
              >
                <option value="">Seleccione un nivel</option>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="presentation">
                {editingClass ? 'Cambiar Presentación (opcional)' : 'Subir Presentación'}
              </label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="presentation"
                  accept=".pdf,.pptx,.ppt"
                  onChange={handleFileChange}
                  className="file-input"
                  required={!editingClass}
                  disabled={isSaving}
                />
                <label htmlFor="presentation" className="file-label">
                  <FileText size={20} />
                  {file 
                    ? ` ${file.name}` 
                    : editingClass && editingClass.has_file
                      ? ` ${editingClass.file_name || 'Archivo actual'} (Click para cambiar)`
                      : ' Seleccionar archivo (PDF, PPTX)'}
                </label>
              </div>
              {file && (
                <p className="file-info">
                  Nuevo archivo: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
              {!file && editingClass && editingClass.has_file && (
                <p className="file-info">
                  Archivo actual: {editingClass.file_name || 'Sin nombre'} 
                  {editingClass.slides_count && ` (${editingClass.slides_count} slides)`}
                </p>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={isSaving}>
                {isSaving 
                  ? ' Procesando...' 
                  : editingClass 
                    ? 'Guardar Cambios' 
                    : 'Crear Clase'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="classes-list-section">
          <h2>Mis Clases ({classes.length})</h2>
          {classes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <BookOpen size={80} strokeWidth={1.5} />
              </div>
              <h3>No tienes clases creadas</h3>
              <p>Comienza creando tu primera clase</p>
              <button 
                className="btn-create-first"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus size={20} /> Crear Primera Clase
              </button>
            </div>
          ) : (
            <div className="classes-grid">
              {classes.map((classItem) => (
                <div key={classItem.id} className="class-card">
                  <div className="class-header">
                    <h3>{classItem.name}</h3>
                    <span className={`class-badge ${classItem.level}`}>
                      {getLevelLabel(classItem.level)}
                    </span>
                  </div>
                  <p className="class-subject">{classItem.subject}</p>
                  
                  {classItem.has_file && (
                    <div className="class-file-info">
                      <p><FileText size={16} /> {classItem.file_name || 'Archivo adjunto'}</p>
                      <p className="slides-count">
                        <BookOpen size={16} /> {classItem.slides_count || 0} slides
                      </p>
                    </div>
                  )}
                  
                  <div className="class-actions">
                    <button 
                      className="btn-action btn-start"
                      onClick={() => handleStartClass(classItem)}
                      disabled={!classItem.slides_count || classItem.slides_count === 0}
                      title={
                        !classItem.slides_count || classItem.slides_count === 0
                          ? 'Esperando procesamiento de slides...'
                          : 'Iniciar presentación'
                      }
                    >
                      <Play size={18} /> Iniciar
                    </button>
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => handleEdit(classItem)}
                    >
                      <Edit size={18} /> Editar
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(classItem.id)}
                    >
                      <Trash2 size={18} /> Eliminar
                    </button>
                  </div>
                </div>
              ))}

              <div 
                className="class-card create-card"
                onClick={() => setShowCreateForm(true)}
              >
                <div className="create-card-content">
                  <Plus size={64} strokeWidth={2} className="create-icon" />
                  <p>Crear Nueva Clase</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ClasesPage