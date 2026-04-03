import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LinkButton } from "./ui/Button";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Noticias", href: "#noticias" },
  { label: "Jornadas", href: "#jornadas" },
  { label: "Autoridades", href: "#autoridades" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const next = window.scrollY > 20;
      setScrolled((prev) => (prev === next ? prev : next));
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy-900/95 backdrop-blur-xs shadow-lg py-3"
          : "bg-transparent py-5",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#inicio" className="flex items-center gap-3 group">
          <div className="size-10 rounded-full bg-accent flex items-center justify-center font-serif text-accent-foreground font-bold text-lg shadow-md group-hover:bg-gold-400 transition-colors">
            π
          </div>
          <span className="text-white font-serif font-semibold text-lg tracking-wide hidden sm:block">
            ADOCMAT
          </span>
        </a>

        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Navegación principal"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-white/80 hover:text-gold-400 text-sm font-medium tracking-wider uppercase transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        <LinkButton
          href="#contacto"
          variant="primary"
          size="md"
          className="hidden md:inline-flex"
        >
          Asociarse
        </LinkButton>

        <button
          className="md:hidden text-white p-2"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <div
            className={cn(
              "w-6 h-0.5 bg-white mb-1.5 transition-transform",
              menuOpen && "rotate-45 translate-y-2",
            )}
          />
          <div
            className={cn(
              "w-6 h-0.5 bg-white mb-1.5 transition-opacity",
              menuOpen && "opacity-0",
            )}
          />
          <div
            className={cn(
              "w-6 h-0.5 bg-white transition-transform",
              menuOpen && "-rotate-45 -translate-y-2",
            )}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-navy-900/98 backdrop-blur-xs px-6 py-4 space-y-3 border-t border-white/10 animate-fade-in">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="block text-white/80 hover:text-gold-400 py-2 text-sm font-medium tracking-wider uppercase transition-colors"
            >
              {label}
            </a>
          ))}
          <LinkButton
            href="#contacto"
            variant="primary"
            size="md"
            className="w-full justify-center mt-2"
            onClick={closeMenu}
          >
            Asociarse
          </LinkButton>
        </div>
      )}
    </header>
  );
}
