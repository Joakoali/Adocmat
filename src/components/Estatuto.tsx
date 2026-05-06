import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { estatuto } from "@/data/estatuto";

function isListItem(text: string): boolean {
  return /^[a-záéíóúñüA-ZÁÉÍÓÚÑÜ]\)/.test(text);
}

export const Estatuto = () => {
  const [activeId, setActiveId] = useState<string>("titulo-I");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    estatuto.titulos.forEach((t) => {
      const el = document.getElementById(`titulo-${t.numero}`);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section className="min-h-screen bg-background pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <p className="section-label">Estatuto</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy-950 mt-2 max-w-3xl leading-tight">
            {estatuto.titulo}
          </h1>
        </div>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <nav className="sticky top-28 space-y-0.5">
              <p className="text-xs font-bold uppercase tracking-widest text-navy-400 mb-3">
                Índice
              </p>
              {estatuto.titulos.map((t) => {
                const id = `titulo-${t.numero}`;
                const isActive = activeId === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={cn(
                      "block text-xs py-1.5 px-2 rounded transition-colors leading-snug",
                      isActive
                        ? "text-gold-500 font-semibold bg-gold-50"
                        : "text-navy-500 hover:text-navy-800",
                    )}
                  >
                    Título {t.numero}
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-14">
            {estatuto.titulos.map((titulo) => (
              <div key={titulo.numero} id={`titulo-${titulo.numero}`}>
                <h2 className="font-serif text-xl font-bold text-navy-900 border-b border-gold-400/30 pb-3 mb-6">
                  <span className="text-gold-500">Título {titulo.numero}.</span>{" "}
                  {titulo.nombre}
                </h2>

                <div className="space-y-5">
                  {titulo.articulos.map((art) => (
                    <div key={art.numero}>
                      {art.subtitulo && (
                        <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mt-8 mb-2">
                          {art.subtitulo}
                        </p>
                      )}

                      <div className="text-sm text-navy-800 leading-relaxed">
                        <span className="font-semibold text-navy-950">
                          Artículo {art.numero}º:
                        </span>{" "}
                        {typeof art.contenido === "string" ? (
                          art.contenido
                        ) : (
                          <>
                            {!isListItem(art.contenido[0]) && (
                              <span>{art.contenido[0]}</span>
                            )}
                            <ol className="list-none mt-2 space-y-1.5 pl-4">
                              {art.contenido
                                .slice(isListItem(art.contenido[0]) ? 0 : 1)
                                .map((item, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-gold-600 font-medium shrink-0">
                                      {item.split(")")[0]})
                                    </span>
                                    <span>
                                      {item
                                        .split(")")
                                        .slice(1)
                                        .join(")")
                                        .trimStart()}
                                    </span>
                                  </li>
                                ))}
                            </ol>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
