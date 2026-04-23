import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (authError) {
        setError("Credenciales incorrectas.");
        setPass("");
        setLoading(false);
      } else {
        onLogin();
      }
    },
    [email, onLogin, pass],
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
              htmlFor="email"
              className="block text-xs font-semibold text-white/40 uppercase tracking-wide mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@adocmat.org"
              autoComplete="email"
              required
              autoFocus
              className="w-full bg-white border border-white/15 rounded-xl px-4 py-3 text-black placeholder-black/25 text-sm focus:outline-hidden focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/10 transition-all"
            />
          </div>
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
              onChange={(e) => {
                setPass(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              aria-invalid={Boolean(error)}
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
            disabled={loading}
            className="w-full justify-center rounded-xl py-3"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

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
