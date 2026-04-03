import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
  createAdminSession,
  getAdminSessionTtlMinutes,
} from "@/lib/adminSession";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "";
const IS_ADMIN_PASSWORD_CONFIGURED = ADMIN_PASSWORD.trim().length > 0;

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!IS_ADMIN_PASSWORD_CONFIGURED) {
        setError("Falta configurar VITE_ADMIN_PASSWORD en el archivo .env.");
        setPass("");
        return;
      }

      if (pass === ADMIN_PASSWORD) {
        createAdminSession();
        setError(null);
        onLogin();
        return;
      }

      setError("Contrasena incorrecta.");
      setPass("");
    },
    [onLogin, pass],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPass(e.target.value);
      if (error) setError(null);
    },
    [error],
  );

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="size-14 rounded-full bg-accent flex items-center justify-center font-serif text-accent-foreground font-bold text-2xl mx-auto mb-4">
            π
          </div>
          <h1 className="text-white font-serif text-2xl font-bold">
            Panel Admin
          </h1>
          <p className="text-white/40 text-sm mt-1">ADOCMAT</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-white/40 uppercase tracking-wide mb-2"
            >
              Contrasena
            </label>
            <input
              id="password"
              type="password"
              value={pass}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              spellCheck={false}
              aria-invalid={Boolean(error)}
              autoFocus
              className="w-full bg-white border border-white/15 rounded-xl px-4 py-3 text-black placeholder-black/25 text-sm focus:outline-hidden focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/10 transition-all"
            />
            {error && (
              <p role="alert" className="text-red-400 text-xs mt-2">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={!IS_ADMIN_PASSWORD_CONFIGURED}
            className="w-full justify-center rounded-xl py-3"
          >
            Ingresar
          </Button>
        </form>

        <p className="text-center mt-4 text-white/30 text-xs">
          La sesion expira tras {getAdminSessionTtlMinutes()} minutos de
          inactividad.
        </p>

        <p className="text-center mt-3">
          <a
            href="/"
            className="text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            ← Volver al sitio
          </a>
        </p>
      </div>
    </div>
  );
}
