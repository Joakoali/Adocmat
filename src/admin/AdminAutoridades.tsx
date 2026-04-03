import { useState, useCallback, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/Button";
import { cloneAutoridades } from "@/lib/siteData";
import type { Autoridades, Miembro } from "@/types";

type MiembroKey = "consejo" | "sindicatura";

function MiembroRow({
  miembro,
  onUpdate,
  onRemove,
}: {
  miembro: Miembro;
  onUpdate: (field: keyof Miembro, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center bg-white border border-border rounded-xl p-3">
      {(["cargo", "nombre", "universidad"] as const).map((field) => (
        <input
          key={field}
          value={miembro[field]}
          onChange={(e) => onUpdate(field, e.target.value)}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className="border border-border rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:border-navy-400 transition-all"
        />
      ))}
      <button
        onClick={onRemove}
        className="text-destructive hover:text-red-700 text-xs px-2 transition-colors"
        aria-label="Eliminar miembro"
      >
        ×
      </button>
    </div>
  );
}

export default function AdminAutoridades() {
  const { data, updateAutoridades } = useData();
  const [autoridades, setAutoridades] = useState<Autoridades>(() =>
    cloneAutoridades(data.autoridades),
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAutoridades(cloneAutoridades(data.autoridades));
  }, [data.autoridades]);

  const updateMiembro = useCallback(
    (tipo: MiembroKey, idx: number, field: keyof Miembro, value: string) => {
      setAutoridades((prev) => ({
        ...prev,
        [tipo]: prev[tipo].map((miembro, currentIdx) =>
          currentIdx === idx ? { ...miembro, [field]: value } : miembro,
        ),
      }));
      setSaved(false);
    },
    [],
  );

  const addMiembro = useCallback((tipo: MiembroKey) => {
    setAutoridades((prev) => ({
      ...prev,
      [tipo]: [...prev[tipo], { cargo: "", nombre: "", universidad: "" }],
    }));
    setSaved(false);
  }, []);

  const removeMiembro = useCallback((tipo: MiembroKey, idx: number) => {
    if (!confirm("Eliminar este miembro?")) return;

    setAutoridades((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((_, currentIdx) => currentIdx !== idx),
    }));
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    updateAutoridades(autoridades);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }, [autoridades, updateAutoridades]);

  const renderTable = (tipo: MiembroKey, label: string) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground text-sm">{label}</h3>
        <button
          onClick={() => addMiembro(tipo)}
          className="text-xs text-navy-600 border border-border hover:bg-muted px-3 py-1.5 rounded-lg transition-colors"
        >
          + Agregar
        </button>
      </div>
      <div className="space-y-2">
        {autoridades[tipo].map((miembro, idx) => (
          <MiembroRow
            key={`${tipo}-${idx}-${miembro.nombre}`}
            miembro={miembro}
            onUpdate={(field, value) => updateMiembro(tipo, idx, field, value)}
            onRemove={() => removeMiembro(tipo, idx)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-foreground text-lg">Autoridades</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Los cambios se reflejan en la pagina publica
          </p>
        </div>
        <Button
          onClick={handleSave}
          variant="dark"
          className={`rounded-xl px-6 py-2.5 ${saved ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}
        >
          {saved ? "✓ Guardado" : "Guardar cambios"}
        </Button>
      </div>

      <div className="bg-white border border-border rounded-2xl p-6 mb-6">
        <label
          htmlFor="periodo"
          className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2"
        >
          Periodo del consejo directivo
        </label>
        <input
          id="periodo"
          value={autoridades.periodo}
          onChange={(e) => {
            setAutoridades((prev) => ({ ...prev, periodo: e.target.value }));
            setSaved(false);
          }}
          placeholder="Ej: 2024 - 2026"
          className="border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-navy-400 w-full max-w-xs transition-all"
        />
      </div>

      <div className="bg-white border border-border rounded-2xl p-6">
        {renderTable("consejo", "Consejo Directivo")}
        {renderTable("sindicatura", "Sindicatura")}
      </div>
    </div>
  );
}
