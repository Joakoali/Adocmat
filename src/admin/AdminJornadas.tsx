import { useState, useCallback, useMemo, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/Button";
import type { Jornada, ProximaJornada } from "@/types";

type EditMode = "nueva" | number | null;

const ROMAN: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII",
  13: "XIII",
  14: "XIV",
  15: "XV",
  16: "XVI",
  17: "XVII",
  18: "XVIII",
  19: "XIX",
  20: "XX",
  21: "XXI",
  22: "XXII",
  23: "XXIII",
  24: "XXIV",
  25: "XXV",
  26: "XXVI",
  27: "XXVII",
  28: "XXVIII",
  29: "XXIX",
  30: "XXX",
  31: "XXXI",
  32: "XXXII",
  33: "XXXIII",
  34: "XXXIV",
  35: "XXXV",
  36: "XXXVI",
  37: "XXXVII",
  38: "XXXVIII",
  39: "XXXIX",
  40: "XL",
};

const EMPTY_JORNADA: Omit<Jornada, "numero"> = {
  numeroArabigo: 0,
  fecha: "",
  ciudad: "",
  provincia: "",
  facultad: "",
  universidad: "",
  actas: false,
};

const EMPTY_PROXIMA: ProximaJornada = {
  activa: false,
  numero: "",
  fecha: "",
  ciudad: "",
  provincia: "",
  universidad: "",
  descripcion: "",
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: FieldProps) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-navy-400 transition-all"
      />
    </div>
  );
}

function ProximaEditor() {
  const { data, updateProximaJornada } = useData();
  const [form, setForm] = useState<ProximaJornada>(() => ({
    ...EMPTY_PROXIMA,
    ...data.proximaJornada,
  }));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      ...EMPTY_PROXIMA,
      ...data.proximaJornada,
    });
  }, [data.proximaJornada]);

  const set = useCallback(
    <K extends keyof ProximaJornada>(key: K, val: ProximaJornada[K]) => {
      setForm((prev) => ({ ...prev, [key]: val }));
      setSaved(false);
    },
    [],
  );

  const handleSave = useCallback(() => {
    updateProximaJornada(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [form, updateProximaJornada]);

  return (
    <div className="bg-white border border-border rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">
          Próxima Jornada
        </h3>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.activa}
            onChange={(e) => set("activa", e.target.checked)}
            className="w-4 h-4 accent-navy-900 cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">
            Mostrar en el sitio
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Field
          label="Número (ej: XXXVIII)"
          value={form.numero}
          onChange={(v) => set("numero", v)}
          placeholder="XXXVIII"
        />
        <Field
          label="Fecha"
          value={form.fecha}
          onChange={(v) => set("fecha", v)}
          placeholder="Octubre 2025"
        />
        <Field
          label="Ciudad"
          value={form.ciudad}
          onChange={(v) => set("ciudad", v)}
          placeholder="Buenos Aires"
        />
        <Field
          label="Provincia"
          value={form.provincia}
          onChange={(v) => set("provincia", v)}
          placeholder="Buenos Aires"
        />
        <Field
          label="Universidad"
          value={form.universidad}
          onChange={(v) => set("universidad", v)}
          className="col-span-2"
          placeholder="UBA"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Descripción
        </label>
        <textarea
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          rows={3}
          placeholder="Descripción breve de la jornada..."
          className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-navy-400 resize-none transition-all"
        />
      </div>

      <Button
        onClick={handleSave}
        variant="dark"
        className={`rounded-xl px-6 py-2.5 ${saved ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}
      >
        {saved ? "✓ Guardado" : "Guardar próxima jornada"}
      </Button>
    </div>
  );
}

export default function AdminJornadas() {
  const { data, updateJornadas } = useData();
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [form, setForm] = useState<Omit<Jornada, "numero">>(EMPTY_JORNADA);
  const [savedIdx, setSavedIdx] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const items = q
      ? data.jornadas.filter(
          (j) =>
            j.ciudad.toLowerCase().includes(q) ||
            j.universidad.toLowerCase().includes(q) ||
            j.fecha.toLowerCase().includes(q) ||
            j.numero.toLowerCase().includes(q),
        )
      : data.jornadas;

    return [...items].sort((a, b) => b.numeroArabigo - a.numeroArabigo);
  }, [data.jornadas, search]);

  const startNew = useCallback(() => {
    const nextNum = data.jornadas.length + 1;
    setForm({ ...EMPTY_JORNADA, numeroArabigo: nextNum });
    setEditMode("nueva");
    setSavedIdx(null);
  }, [data.jornadas.length]);

  const startEdit = useCallback((j: Jornada) => {
    const { numero: _numero, ...rest } = j;
    setForm(rest);
    setEditMode(j.numeroArabigo);
    setSavedIdx(null);
  }, []);

  const setField = useCallback(
    <K extends keyof typeof form>(key: K, val: (typeof form)[K]) => {
      setForm((prev) => ({ ...prev, [key]: val }));
    },
    [],
  );

  const handleSave = useCallback(() => {
    const numero = ROMAN[form.numeroArabigo] ?? String(form.numeroArabigo);
    const jornada: Jornada = { numero, ...form };

    const nuevas =
      editMode === "nueva"
        ? [...data.jornadas, jornada].sort(
            (a, b) => a.numeroArabigo - b.numeroArabigo,
          )
        : data.jornadas.map((j) =>
            j.numeroArabigo === editMode ? jornada : j,
          );

    updateJornadas(nuevas);
    setSavedIdx(form.numeroArabigo);
    setTimeout(() => setEditMode(null), 800);
  }, [editMode, form, data.jornadas, updateJornadas]);

  const handleDelete = useCallback(
    (numeroArabigo: number) => {
      if (!confirm("¿Eliminar esta jornada?")) return;
      updateJornadas(
        data.jornadas.filter((j) => j.numeroArabigo !== numeroArabigo),
      );
    },
    [data.jornadas, updateJornadas],
  );

  if (editMode !== null) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 max-w-2xl">
        <h2 className="font-semibold text-foreground text-lg mb-6">
          {editMode === "nueva"
            ? "Nueva jornada"
            : `Editar jornada ${ROMAN[form.numeroArabigo] ?? form.numeroArabigo}`}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Número arábigo *
            </label>
            <input
              type="number"
              value={form.numeroArabigo || ""}
              onChange={(e) =>
                setField("numeroArabigo", parseInt(e.target.value) || 0)
              }
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-navy-400 transition-all"
              placeholder="38"
            />
            {form.numeroArabigo > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Romano: {ROMAN[form.numeroArabigo] ?? "—"}
              </p>
            )}
          </div>
          <Field
            label="Fecha *"
            value={form.fecha}
            onChange={(v) => setField("fecha", v)}
            placeholder="Octubre 2024"
          />
          <Field
            label="Ciudad *"
            value={form.ciudad}
            onChange={(v) => setField("ciudad", v)}
            placeholder="Buenos Aires"
          />
          <Field
            label="Provincia"
            value={form.provincia}
            onChange={(v) => setField("provincia", v)}
            placeholder="Buenos Aires"
          />
          <Field
            label="Facultad"
            value={form.facultad}
            onChange={(v) => setField("facultad", v)}
            className="col-span-2"
            placeholder="Facultad de Ciencias Económicas"
          />
          <Field
            label="Universidad"
            value={form.universidad}
            onChange={(v) => setField("universidad", v)}
            className="col-span-2"
            placeholder="UBA"
          />
          <div className="col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.actas}
                onChange={(e) => setField("actas", e.target.checked)}
                className="w-4 h-4 accent-navy-900"
              />
              <span className="text-sm text-foreground">Actas disponibles</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            onClick={handleSave}
            variant="dark"
            className={`rounded-xl px-6 py-2.5 ${savedIdx !== null ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}
          >
            {savedIdx !== null ? "✓ Guardado" : "Guardar"}
          </Button>
          <Button
            onClick={() => setEditMode(null)}
            variant="ghost"
            className="rounded-xl border border-border px-6 py-2.5"
          >
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-foreground text-lg">
          Jornadas ({data.jornadas.length})
        </h2>
        <Button
          onClick={startNew}
          variant="dark"
          className="rounded-xl px-5 py-2.5"
        >
          + Nueva jornada
        </Button>
      </div>

      <ProximaEditor />

      <div className="bg-white border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground text-sm">
            Historial de jornadas
          </h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ciudad, universidad..."
            className="border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-hidden focus:border-navy-400 w-56 transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-semibold text-muted-foreground">
                  N°
                </th>
                <th className="pb-2 pr-4 font-semibold text-muted-foreground">
                  Fecha
                </th>
                <th className="pb-2 pr-4 font-semibold text-muted-foreground">
                  Ciudad
                </th>
                <th className="pb-2 pr-4 font-semibold text-muted-foreground">
                  Universidad
                </th>
                <th className="pb-2 pr-4 font-semibold text-muted-foreground">
                  Actas
                </th>
                <th className="pb-2 font-semibold text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr
                  key={j.numeroArabigo}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-2.5 pr-4 font-medium text-foreground">
                    {j.numero}
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {j.fecha}
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {j.ciudad}
                  </td>
                  <td className="py-2.5 pr-4 text-muted-foreground max-w-45 truncate">
                    {j.universidad}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${j.actas ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                    >
                      {j.actas ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(j)}
                        className="text-navy-600 hover:text-navy-900 border border-border hover:border-navy-300 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(j.numeroArabigo)}
                        className="text-destructive hover:text-red-700 border border-red-100 hover:border-red-300 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No se encontraron jornadas
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
