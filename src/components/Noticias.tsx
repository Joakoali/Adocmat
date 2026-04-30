import { useData } from "@/context/DataContext";
import type { Noticia } from "@/types";

function formatFecha(iso: string): string {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  return (
    <article className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
      {noticia.imagen ? (
        <div className="h-44 overflow-hidden">
          <img
            src={noticia.imagen}
            alt={noticia.titulo}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div
          className="h-24 bg-linear-to-br from-navy-900 to-navy-700 flex items-center justify-center text-gold-400 font-serif text-4xl"
          aria-hidden
        >
          π
        </div>
      )}
      <div className="p-6">
        <time
          className="text-xs text-muted-foreground font-medium"
          dateTime={noticia.fecha}
        >
          {formatFecha(noticia.fecha)}
        </time>
        <h3 className="font-semibold text-foreground mt-1 mb-2 leading-snug">
          {noticia.titulo}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {noticia.resumen}
        </p>
      </div>
    </article>
  );
}

export default function Noticias() {
  const { data } = useData();
  const noticias = data.noticias;

  if (noticias.length === 0) return null;

  return (
    <section id="noticias" className="bg-muted py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="section-label">
          <span aria-hidden />
          <span>Novedades</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10">
          Últimas <span className="text-navy-600">noticias</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((n) => (
            <NoticiaCard key={n.id} noticia={n} />
          ))}
        </div>
      </div>
    </section>
  );
}
