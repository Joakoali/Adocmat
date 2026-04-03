import { useState, useCallback } from 'react'
import { useData } from '@/context/DataContext'
import { Button } from '@/components/ui/Button'
import type { Noticia } from '@/types'

type EditMode = 'new' | number | null

const EMPTY_NOTICIA: Omit<Noticia, 'id'> = { titulo: '', resumen: '', fecha: '', imagen: '' }

interface FormFieldProps {
  label: string
  name: keyof Omit<Noticia, 'id'>
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  type?: string
  placeholder?: string
  multiline?: boolean
}

function FormField({ label, name, value, onChange, type = 'text', placeholder, multiline }: FormFieldProps) {
  const inputClass = "w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-navy-400 transition-all"
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</label>
      {multiline
        ? <textarea id={name} name={name} value={value} onChange={onChange} rows={4} className={`${inputClass} resize-none`} placeholder={placeholder} />
        : <input id={name} type={type} name={name} value={value} onChange={onChange} className={inputClass} placeholder={placeholder} />}
    </div>
  )
}

export default function AdminNoticias() {
  const { data, updateNoticias } = useData()
  const [editMode, setEditMode]   = useState<EditMode>(null)
  const [form, setForm]           = useState<Omit<Noticia, 'id'>>(EMPTY_NOTICIA)
  const [savedId, setSavedId]     = useState<number | null>(null)

  const startNew = useCallback(() => {
    setForm(EMPTY_NOTICIA)
    setEditMode('new')
    setSavedId(null)
  }, [])

  const startEdit = useCallback((n: Noticia) => {
    const { id, ...rest } = n
    setForm(rest)
    setEditMode(id)
    setSavedId(null)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSave = useCallback(() => {
    const newId = editMode === 'new' ? Date.now() : (editMode as number)
    const nuevas = editMode === 'new'
      ? [{ id: newId, ...form }, ...data.noticias]
      : data.noticias.map(n => n.id === editMode ? { id: editMode, ...form } : n)
    updateNoticias(nuevas)
    setSavedId(newId)
    setTimeout(() => setEditMode(null), 800)
  }, [editMode, form, data.noticias, updateNoticias])

  const handleDelete = useCallback((id: number) => {
    if (!confirm('¿Eliminar esta noticia?')) return
    updateNoticias(data.noticias.filter(n => n.id !== id))
  }, [data.noticias, updateNoticias])

  if (editMode !== null) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 max-w-2xl">
        <h2 className="font-semibold text-foreground text-lg mb-6">
          {editMode === 'new' ? 'Nueva noticia' : 'Editar noticia'}
        </h2>
        <div className="space-y-4">
          <FormField label="Título *" name="titulo" value={form.titulo} onChange={handleChange} />
          <FormField label="Resumen *" name="resumen" value={form.resumen} onChange={handleChange} multiline placeholder="Descripción breve..." />
          <FormField label="Fecha" name="fecha" value={form.fecha} onChange={handleChange} type="date" />
          <FormField label="URL de imagen (opcional)" name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleSave}
            variant={savedId !== null ? 'dark' : 'dark'}
            className={`rounded-xl px-6 py-2.5 ${savedId !== null ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
          >
            {savedId !== null ? '✓ Guardado' : 'Guardar'}
          </Button>
          <Button onClick={() => setEditMode(null)} variant="ghost" className="rounded-xl border border-border px-6 py-2.5">
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-foreground text-lg">Noticias ({data.noticias.length})</h2>
        <Button onClick={startNew} variant="dark" className="rounded-xl px-5 py-2.5">
          + Nueva noticia
        </Button>
      </div>

      {data.noticias.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-muted-foreground">
          <p className="text-4xl mb-3">📰</p>
          <p>No hay noticias publicadas</p>
        </div>
      )}

      <div className="space-y-3">
        {data.noticias.map(n => (
          <div key={n.id} className="bg-white border border-border rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-muted-foreground/20 transition-colors">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm truncate">{n.titulo}</h3>
              <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{n.resumen}</p>
              {n.fecha && <time className="text-muted-foreground text-xs mt-1 block" dateTime={n.fecha}>{n.fecha}</time>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => startEdit(n)} className="text-xs text-navy-600 hover:text-navy-900 border border-border hover:border-navy-300 px-3 py-1.5 rounded-lg transition-colors">
                Editar
              </button>
              <button onClick={() => handleDelete(n.id)} className="text-xs text-destructive hover:text-red-700 border border-red-100 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
