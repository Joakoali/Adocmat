import { LinkButton } from "./ui/Button";

interface Hito {
  año: string;
  desc: string;
}

const HITOS: Hito[] = [
  {
    año: "1984–1986",
    desc: "Gestación en el Departamento de Matemática de la Facultad de Ciencias Económicas de la UNR.",
  },
  {
    año: "1986",
    desc: "I Jornadas en Rosario: 77 docentes de 16 universidades. Asamblea Constitutiva.",
  },
  {
    año: "1989",
    desc: "Se instituye el Premio «Ing. Ricardo S. Carbajo» en homenaje a uno de sus fundadores.",
  },
  {
    año: "2009",
    desc: "Firma del Acta Constitutiva como Asociación Civil con personería jurídica en Rosario.",
  },
  {
    año: "2011",
    desc: "La Inspección General de Personas Jurídicas de Santa Fe autoriza su funcionamiento.",
  },
];

export default function About() {
  return (
    <section id="nosotros" className="bg-background py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="section-label">
          <span aria-hidden />
          <span>Presentación e historia</span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Cuatro décadas de{" "}
              <span className="text-navy-600">excelencia matemática</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-5 text-lg">
              ADOCMAT es una entidad de carácter académico que nuclea a los
              docentes de matemáticas de las Facultades de Ciencias Económicas y
              carreras afines de toda la República Argentina.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Nació en el Departamento de Matemática de la Facultad de Ciencias
              Económicas de la Universidad Nacional de Rosario entre 1984 y
              1986, impulsada por los Ingenieros Eduardo Cisneros y Ricardo S.
              Carbajo, tras el restablecimiento de la democracia y la
              normalización institucional de las universidades nacionales.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Anualmente reúne a docentes de Matemática y Estadística de
              universidades de todo el país para compartir experiencias, debatir
              metodologías y fortalecer la disciplina en el ámbito de las
              ciencias económicas.
            </p>
            <LinkButton href="#contacto" variant="dark" size="md">
              Asociarme a ADOCMAT
            </LinkButton>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
              Hitos históricos
            </p>
            <ol className="space-y-0">
              {HITOS.map(({ año, desc }, i) => (
                <li key={año} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-3 rounded-full bg-gold-500 shrink-0 mt-1" />
                    {i < HITOS.length - 1 && (
                      <div className="w-px flex-1 bg-border my-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className="text-xs font-bold text-gold-600 tracking-widest uppercase">
                      {año}
                    </span>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
