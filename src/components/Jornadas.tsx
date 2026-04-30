import { useState, useCallback } from "react";
import { useData } from "@/context/DataContext";
import { Badge } from "./ui/Badge";
import { LinkButton } from "./ui/Button";
import type { Jornada } from "@/types";

function JornadaCard({
  jornada,
  featured = false,
}: {
  jornada: Jornada;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 border transition-all duration-200 ${
        featured ? "bg-white/8 border-white/20" : "bg-white/4 border-white/8"
      }`}
    >
      <div
        className={`font-serif text-4xl font-bold mb-3 ${featured ? "text-gold-400" : "text-white/25"}`}
      >
        {jornada.numero}
      </div>
      <p className="text-white/70 text-sm font-medium mb-1">{jornada.fecha}</p>
      <p className="text-white/50 text-xs flex items-center gap-1.5 mb-0.5">
        <span aria-hidden>📍</span>
        {[jornada.ciudad, jornada.provincia].filter(Boolean).join(", ")}
      </p>
      <p className="text-white/35 text-xs mt-2 leading-relaxed">
        {jornada.universidad}
      </p>
      {jornada.actas && (
        <Badge variant="outline" className="mt-4">
          Libro de actas disponible
        </Badge>
      )}
    </div>
  );
}

export default function Jornadas() {
  const { data } = useData();
  const { jornadas, proximaJornada } = data;
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const jornadasDesc = [...jornadas].sort(
    (a, b) => b.numeroArabigo - a.numeroArabigo,
  );

  const toggleHistorial = useCallback(
    () => setMostrarTodas((prev) => !prev),
    [],
  );

  const recientes = jornadasDesc.slice(0, 3);

  return (
    <section
      id="jornadas"
      className="bg-navy-900 py-28 px-6 relative overflow-hidden math-bg"
    >
      <div
        className="absolute inset-0 bg-linear-to-br from-navy-950/80 to-navy-800/80"
        aria-hidden
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="section-label">
          <span className="bg-gold-500" aria-hidden />
          <span className="text-gold-400">Desde 1986</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">
            Jornadas <span className="text-gold-400">Nacionales</span>
          </h2>
          <p className="text-white/50 max-w-xs text-sm leading-relaxed">
            {jornadas.length} ediciones ininterrumpidas desde 1986.
          </p>
        </div>

        {proximaJornada.activa && (
          <div className="bg-gold-500/10 border border-gold-500/40 rounded-2xl p-7 mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-bold tracking-widest uppercase mb-2">
                  <span
                    className="size-2 rounded-full bg-gold-400 animate-pulse"
                    aria-hidden
                  />
                  Próxima jornada
                </span>
                <h3 className="text-white font-serif text-2xl font-bold">
                  {proximaJornada.numero} Jornadas Nacionales
                </h3>
                <p className="text-white/60 mt-1 text-sm">
                  {proximaJornada.fecha}
                  {proximaJornada.ciudad && ` · ${proximaJornada.ciudad}`}
                  {proximaJornada.provincia && `, ${proximaJornada.provincia}`}
                </p>
                {proximaJornada.universidad && (
                  <p className="text-white/40 text-xs mt-0.5">
                    {proximaJornada.universidad}
                  </p>
                )}
                {proximaJornada.descripcion && (
                  <p className="text-white/50 text-sm mt-3">
                    {proximaJornada.descripcion}
                  </p>
                )}
              </div>
              <LinkButton
                href="#contacto"
                variant="primary"
                size="md"
                className="shrink-0"
              >
                Más información →
              </LinkButton>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {recientes.map((j, i) => (
            <JornadaCard key={j.numero} jornada={j} featured={i === 0} />
          ))}
        </div>

        <div>
          <button
            onClick={toggleHistorial}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors mb-6"
            aria-expanded={mostrarTodas}
          >
            {mostrarTodas
              ? "▲ Ocultar historial completo"
              : `▼ Ver historial completo (${jornadas.length} ediciones)`}
          </button>

          {mostrarTodas && (
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-white/40 uppercase tracking-wider">
                      <th className="text-left px-5 py-3 font-medium">Ed.</th>
                      <th className="text-left px-5 py-3 font-medium">
                        Fechas
                      </th>
                      <th className="text-left px-5 py-3 font-medium hidden md:table-cell">
                        Ciudad
                      </th>
                      <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">
                        Universidad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jornadasDesc.map((j, i) => (
                      <tr
                        key={j.numero}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 !== 0 ? "bg-white/2" : ""}`}
                      >
                        <td className="px-5 py-2.5 text-gold-400 font-serif font-bold whitespace-nowrap">
                          {j.numero}
                        </td>
                        <td className="px-5 py-2.5 text-white/70 whitespace-nowrap">
                          {j.fecha}
                        </td>
                        <td className="px-5 py-2.5 text-white/50 hidden md:table-cell whitespace-nowrap">
                          {[j.ciudad, j.provincia].filter(Boolean).join(", ")}
                        </td>
                        <td className="px-5 py-2.5 text-white/35 hidden lg:table-cell text-xs">
                          {j.universidad}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
