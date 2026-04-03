const NAV_LINKS = [
  "Inicio",
  "Nosotros",
  "Jornadas",
  "Autoridades",
  "Contacto",
] as const;

export default function Footer() {
  return (
    <footer className="bg-navy-950 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-accent flex items-center justify-center font-serif text-accent-foreground font-bold">
            π
          </div>
          <div>
            <div className="text-white font-serif font-semibold text-sm">
              ADOCMAT
            </div>
            <div className="text-white/30 text-xs">
              Asociación Civil de Docentes de Matemática
            </div>
          </div>
        </div>

        <nav
          className="flex flex-wrap justify-center gap-6 text-xs text-white/40 font-medium tracking-wider uppercase"
          aria-label="Footer"
        >
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="hover:text-gold-400 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-end gap-1">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} ADOCMAT · Argentina
          </p>
          <a
            href="/admin"
            className="text-white/15 hover:text-white/40 text-xs transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
