import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react'
import type { SiteData, Autoridades, Jornada, ProximaJornada, Noticia } from '@/types'
import { cloneSiteData, sanitizeSiteData } from '@/lib/siteData'
import { supabase } from '@/lib/supabase'

async function loadData(): Promise<SiteData> {
  const { data, error } = await supabase
    .from('site_data')
    .select('data')
    .single()

  if (error || !data) return cloneSiteData()
  return sanitizeSiteData(data.data as unknown)
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
  const [data, setData] = useState<SiteData>(cloneSiteData)

  useEffect(() => {
    loadData().then(setData)
  }, [])

  const persistUpdater = useCallback((updater: (current: SiteData) => SiteData) => {
    setData(current => {
      const sanitized = sanitizeSiteData(updater(current))
      supabase
        .from('site_data')
        .upsert({ id: 1, data: sanitized, updated_at: new Date().toISOString() })
        .then(({ error }) => {
          if (error) console.error('[DataContext] upsert failed:', error)
        })
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
