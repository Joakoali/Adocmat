import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type { SiteData, Autoridades, Jornada, ProximaJornada, Noticia } from '@/types'
import { cloneSiteData, sanitizeSiteData } from '@/lib/siteData'

const STORAGE_KEY = 'adocmat_data'

function loadData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return cloneSiteData()
    return sanitizeSiteData(JSON.parse(raw))
  } catch {
    return cloneSiteData()
  }
}

function saveData(data: SiteData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // quota exceeded
  }
}

interface DataContextValue {
  data: SiteData
  replaceData:          (data: unknown) => void
  updateAutoridades:    (autoridades: Autoridades) => void
  updateJornadas:       (jornadas: Jornada[]) => void
  updateProximaJornada: (proxima: ProximaJornada) => void
  updateNoticias:       (noticias: Noticia[]) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadData)

  const persistUpdater = useCallback((updater: (current: SiteData) => SiteData) => {
    setData(current => {
      const sanitized = sanitizeSiteData(updater(current))
      saveData(sanitized)
      return sanitized
    })
  }, [])

  const replaceData = useCallback((next: unknown) => {
    const sanitized = sanitizeSiteData(next)
    persistUpdater(() => sanitized)
  }, [persistUpdater])

  const updateAutoridades = useCallback((autoridades: Autoridades) => {
    persistUpdater(current => ({ ...current, autoridades }))
  }, [persistUpdater])

  const updateJornadas = useCallback((jornadas: Jornada[]) => {
    persistUpdater(current => ({ ...current, jornadas }))
  }, [persistUpdater])

  const updateProximaJornada = useCallback((proximaJornada: ProximaJornada) => {
    persistUpdater(current => ({ ...current, proximaJornada }))
  }, [persistUpdater])

  const updateNoticias = useCallback((noticias: Noticia[]) => {
    persistUpdater(current => ({ ...current, noticias }))
  }, [persistUpdater])

  const value = useMemo(() => ({
    data,
    replaceData,
    updateAutoridades,
    updateJornadas,
    updateProximaJornada,
    updateNoticias,
  }), [
    data,
    replaceData,
    updateAutoridades,
    updateJornadas,
    updateProximaJornada,
    updateNoticias,
  ])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
