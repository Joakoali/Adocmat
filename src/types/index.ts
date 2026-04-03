export interface Miembro {
  cargo: string
  nombre: string
  universidad: string
}

export interface Autoridades {
  periodo: string
  consejo: Miembro[]
  sindicatura: Miembro[]
}

export interface Jornada {
  numero: string
  numeroArabigo: number
  fecha: string
  ciudad: string
  provincia: string
  facultad: string
  universidad: string
  actas: boolean
}

export interface ProximaJornada {
  activa: boolean
  numero: string
  fecha: string
  ciudad: string
  provincia: string
  universidad: string
  descripcion: string
}

export interface Noticia {
  id: number
  titulo: string
  resumen: string
  fecha: string
  imagen: string
}

export interface SiteData {
  autoridades: Autoridades
  jornadas: Jornada[]
  proximaJornada: ProximaJornada
  noticias: Noticia[]
}

export type FormStatus =
  | { type: 'idle' }
  | { type: 'sending' }
  | { type: 'sent' }
  | { type: 'error'; message: string }

export type AdminTab = 'noticias' | 'autoridades' | 'jornadas'
