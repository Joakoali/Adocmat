import { useMemo } from "react";
import { useData } from "@/context/DataContext";
import { Badge } from "./ui/Badge";
import { LinkButton } from "./ui/Button";
import type { Miembro } from "@/types";

const CARGOS_DESTACADOS = new Set([
  "Presidente",
  "Vicepresidente",
  "Secretaria",
  "Tesorero",
]);

function getInitial(nombre: string): string {
  return nombre.trim().charAt(0).toUpperCase();
}

function AvatarCircle({
  nombre,
  size = "md",
}: {
  nombre: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={`rounded-full bg-navy-900 flex items-center justify-center text-gold-400 font-serif font-bold shrink-0 ${
        size === "md" ? "size-14 text-xl" : "size-9 text-sm"
      }`}
    >
      {getInitial(nombre)}
    </div>
  );
}

function MiembroCard({ miembro }: { miembro: Miembro }) {
  return (
    <div className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border hover:border-navy-200 hover:shadow-lg transition-all duration-200 bg-muted hover:bg-white">
      <AvatarCircle nombre={miembro.nombre} size="md" />
      <h3 className="font-semibold text-foreground text-sm mb-0.5 mt-3">
        {miembro.nombre}
      </h3>
      <p className="text-xs text-muted-foreground mb-2">
        {miembro.universidad}
      </p>
      <Badge variant="navy">{miembro.cargo}</Badge>
    </div>
  );
}

function MiembroRow({ miembro }: { miembro: Miembro }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-border">
      <AvatarCircle nombre={miembro.nombre} size="sm" />
      <div className="min-w-0">
        <div className="font-medium text-foreground text-sm truncate">
          {miembro.nombre}
        </div>
        <div className="text-muted-foreground text-xs truncate">
          {miembro.cargo} · {miembro.universidad.replace("Universidad ", "U. ")}
        </div>
      </div>
    </div>
  );
}

export default function Autoridades() {
  const { data } = useData();
  const { consejo, sindicatura, periodo } = data.autoridades;

  const { destacados, vocales } = useMemo(
    () => ({
      destacados: consejo.filter((m) => CARGOS_DESTACADOS.has(m.cargo)),
      vocales: consejo.filter((m) => !CARGOS_DESTACADOS.has(m.cargo)),
    }),
    [consejo],
  );

  return (
    <section id="autoridades" className="bg-white py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="section-label">
          <span aria-hidden />
          <span>Comisión directiva</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Consejo <span className="text-navy-600">Directivo</span>
          </h2>
          <Badge variant="muted" size="md">
            Período {periodo}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {destacados.map((m) => (
            <MiembroCard key={m.cargo} miembro={m} />
          ))}
        </div>

        <div className="bg-muted rounded-2xl border border-border p-6 mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Vocales
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vocales.map((m) => (
              <MiembroRow key={m.cargo + m.nombre} miembro={m} />
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-2xl border border-border p-6 mb-14">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
            Sindicatura
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sindicatura.map((m) => (
              <MiembroRow key={m.cargo} miembro={m} />
            ))}
          </div>
        </div>

        <div className="bg-navy-900 rounded-2xl p-10 flex flex-col md:flex-row items-center gap-8">
          <div
            className="size-20 shrink-0 rounded-2xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-4xl"
            role="img"
            aria-label="Trofeo"
          >
            🏆
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-white font-serif text-2xl font-bold mb-2">
              Premio «Ing. Ricardo S. Carbajo»
            </h3>
            <p className="text-white/55 leading-relaxed text-sm">
              Reconocimiento anual para estudiantes avanzados de Ciencias
              Económicas que presenten trabajos inéditos aplicando conceptos
              matemáticos. El ganador recibe un premio en dinero, certificado y
              la publicación en los anales de las Jornadas.
            </p>
          </div>
          <LinkButton
            href="#contacto"
            variant="goldBorder"
            size="md"
            className="shrink-0 whitespace-nowrap"
          >
            Consultar →
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
