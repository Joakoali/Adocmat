import { LinkButton } from "./ui/Button";

const MATH_DECORATIONS = (
  <div
    className="absolute inset-0 overflow-hidden pointer-events-none select-none"
    aria-hidden
  >
    <span className="absolute top-1/4 left-10 text-white/5 font-serif text-9xl">
      ∑
    </span>
    <span className="absolute bottom-1/3 right-12 text-white/5 font-serif text-8xl">
      ∫
    </span>
    <span className="absolute top-16 right-1/4 text-white/5 font-serif text-7xl">
      ∂
    </span>
    <span className="absolute bottom-1/4 left-1/4 text-white/5 font-serif text-6xl">
      √
    </span>
    <span className="absolute top-1/2 right-1/3 text-gold-500/10 font-serif text-[10rem]">
      π
    </span>
  </div>
);

const STATS = [
  { value: "+40", label: "Años de trayectoria" },
  { value: "XXXIX", label: "Jornadas nacionales" },
  { value: "∞", label: "Compromiso docente" },
] as const;

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-900 math-bg"
    >
      <div
        className="absolute inset-0 bg-linear-to-br from-navy-950 via-navy-900 to-navy-800"
        aria-hidden
      />
      <div
        className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-background to-transparent"
        aria-hidden
      />

      {MATH_DECORATIONS}

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <span>Desde 1985</span>
          <span className="size-1 rounded-full bg-gold-400" aria-hidden />
          <span>Argentina</span>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Asociación Civil de{"\u00A0"}
          <span className="text-gold-400">Docentes de{"\u00A0"}Matemática</span>
          <br />
          de Facultades de Ciencias Económicas y{"\u00A0"}Afines
        </h1>

        <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
          Promovemos la excelencia académica y{"\u00A0"}la colaboración entre
          docentes de{"\u00A0"}matemática en la República Argentina.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LinkButton href="#nosotros" variant="primary" size="lg">
            Conocer la asociación
          </LinkButton>
          <LinkButton href="#jornadas" variant="outline" size="lg">
            Ver jornadas →
          </LinkButton>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto border-t border-white/10 pt-10">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-gold-400 font-serif font-bold text-2xl md:text-3xl">
                {value}
              </div>
              <div className="text-white/40 text-xs mt-1 leading-tight">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
