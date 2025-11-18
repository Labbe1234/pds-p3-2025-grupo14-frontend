import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

export interface ClassData {
  id: string;
  name: string;
  subject: string;
  level: 'basico' | 'intermedio' | 'avanzado';
  file?: File | null;
  has_file?: boolean;
  file_name?: string | null;
  file_url?: string | null;
  slides_count?: number;
  createdAt: Date;
}

export interface Slide {
  id: number;
  position: number;
  content: string;
  notes?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ INTERCEPTOR: Agregar token automáticamente a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ✅ INTERCEPTOR: Manejar errores 401 (token inválido/expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - redirigir a login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Mock toggle
const USE_MOCK = false

// helper de mock
const generateMockSlides = (className: string, subject: string): Slide[] => {
  return [
    {
      id: 1,
      position: 1,
      content: `<h1>📚 ${className}</h1><h3>${subject}</h3><p style="margin-top:2rem;color:#667eea">Presentación de ejemplo</p>`,
      notes: 'Slide de bienvenida'
    },
    {
      id: 2,
      position: 2,
      content: `<h2>Contenido del Curso</h2><ul style="text-align: left; font-size: 1.2rem;"><li>Introducción</li><li>Desarrollo</li><li>Conclusión</li></ul>`,
      notes: 'Puntos principales'
    },
    {
      id: 3,
      position: 3,
      content: `<h2>¡Gracias!</h2><p>Fin de la presentación</p>`,
      notes: 'Cierre'
    }
  ]
}

// Endpoints apuntando a /clases
export const classesAPI = {
  getAll: async (): Promise<ClassData[]> => {
    if (USE_MOCK) {
      const stored = localStorage.getItem('classes')
      const classes = stored ? JSON.parse(stored) : []
      return classes.map((c: any) => ({ ...c, createdAt: new Date(c.createdAt) }))
    }
    const response = await api.get<ClassData[]>('/clases')
    return response.data
  },

  getOne: async (id: string): Promise<ClassData | null> => {
    if (USE_MOCK) {
      const stored = localStorage.getItem('classes')
      const classes: ClassData[] = stored ? JSON.parse(stored) : []
      const found = classes.find((c: any) => c.id === id)
      return found ? { ...found, createdAt: new Date(found.createdAt) } : null
    }
    const response = await api.get<ClassData>(`/clases/${id}`)
    return response.data
  },

  create: async (classData: ClassData): Promise<ClassData> => {
    if (USE_MOCK) {
      const stored = localStorage.getItem('classes')
      const classes: ClassData[] = stored ? JSON.parse(stored) : []
      const newClass = { ...classData, id: Date.now().toString(), createdAt: new Date() }
      classes.unshift(newClass)
      localStorage.setItem('classes', JSON.stringify(classes))
      return newClass
    }

    const formData = new FormData()
    formData.append('clase[name]', classData.name)
    formData.append('clase[subject]', classData.subject)
    formData.append('clase[level]', classData.level)
    if (classData.file) {
      formData.append('clase[presentation_file]', classData.file)
    }
    const response = await api.post<ClassData>('/clases', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  update: async (id: string, classData: Partial<ClassData>): Promise<ClassData> => {
    if (USE_MOCK) {
      const stored = localStorage.getItem('classes')
      const classes: ClassData[] = stored ? JSON.parse(stored) : []
      const index = classes.findIndex(c => c.id === id)
      if (index !== -1) {
        classes[index] = { ...classes[index], ...classData, createdAt: classes[index].createdAt }
        localStorage.setItem('classes', JSON.stringify(classes))
        return classes[index]
      }
      throw new Error('Class not found')
    }

    const formData = new FormData()
    if (classData.name) formData.append('clase[name]', classData.name)
    if (classData.subject) formData.append('clase[subject]', classData.subject)
    if (classData.level) formData.append('clase[level]', classData.level)
    if (classData.file) formData.append('clase[presentation_file]', classData.file)

    const response = await api.patch<ClassData>(`/clases/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      const stored = localStorage.getItem('classes')
      const classes: ClassData[] = stored ? JSON.parse(stored) : []
      const filtered = classes.filter((c: any) => c.id !== id)
      localStorage.setItem('classes', JSON.stringify(filtered))
      return
    }
    await api.delete(`/clases/${id}`)
  },
}

export const slidesAPI = {
  getByClass: async (classId: string): Promise<Slide[]> => {
    if (USE_MOCK) {
      const classData = await classesAPI.getOne(classId)
      if (!classData) return []
      return generateMockSlides(classData.name, classData.subject)
    }
    const response = await api.get<Slide[]>(`/clases/${classId}/slides`)
    return response.data
  }
}

export const authAPI = {
  googleLogin: async (credential: string) => {
    const response = await api.post('/auth/google', { credential })
    return response.data
  }
}

export default api