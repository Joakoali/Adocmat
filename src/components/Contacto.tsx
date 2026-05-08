import { useState, useCallback } from "react";
import { Button } from "./ui/Button";
import type { FormStatus } from "@/types";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";
const CONTACT_RATE_LIMIT_MS = 60_000;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 2_000;

interface ContactForm {
  nombre: string;
  email: string;
  mensaje: string;
  _trap: string;
}

const EMPTY_FORM: ContactForm = {
  nombre: "",
  email: "",
  mensaje: "",
  _trap: "",
};

const CONTACT_FIELDS = [
  {
    name: "nombre" as const,
    type: "text",
    label: "Nombre completo",
    placeholder: "Tu nombre",
    autoComplete: "name",
    maxLength: MAX_NAME_LENGTH,
  },
  {
    name: "email" as const,
    type: "email",
    label: "Correo electronico",
    placeholder: "tu@email.com",
    autoComplete: "email",
    maxLength: MAX_EMAIL_LENGTH,
  },
] as const;

const CONTACT_INFO = [
  { icon: "📧", label: "Email", value: "info@adocmat.com" },
  { icon: "🌐", label: "Web", value: "adocmat.com" },
  { icon: "📍", label: "Pais", value: "Republica Argentina" },
  { icon: "📸", label: "Instagram", value: "@adocmat_org", href: "https://www.instagram.com/adocmat_org/" },
] as const satisfies ReadonlyArray<{ icon: string; label: string; value: string; href?: string }>;

function normalizeContactForm(form: ContactForm): ContactForm {
  return {
    nombre: form.nombre.trim().slice(0, MAX_NAME_LENGTH),
    email: form.email.trim().slice(0, MAX_EMAIL_LENGTH),
    mensaje: form.mensaje.trim().slice(0, MAX_MESSAGE_LENGTH),
    _trap: form._trap.trim(),
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function Contacto() {
  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [status, setStatus] = useState<FormStatus>({ type: "idle" });
  const [isSending, setIsSending] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const emailjsConfigured =
    EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const normalized = normalizeContactForm(form);

      if (!emailjsConfigured) {
        setStatus({
          type: "error",
          message:
            "El formulario aun no esta configurado. Completar las variables VITE_EMAILJS_* en el archivo .env.",
        });
        return;
      }

      if (normalized._trap) {
        setStatus({ type: "sent" });
        setForm(EMPTY_FORM);
        return;
      }

      if (
        !normalized.nombre ||
        !normalized.mensaje ||
        !isValidEmail(normalized.email)
      ) {
        setStatus({
          type: "error",
          message:
            "Revisa los datos ingresados y usa un correo electronico valido.",
        });
        return;
      }

      setIsSending(true);
      setStatus({ type: "sending" });

      try {
        const { default: emailjs } = await import("@emailjs/browser");

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            nombre: normalized.nombre,
            email: normalized.email,
            mensaje: normalized.mensaje,
            reply_to: normalized.email,
          },
          {
            publicKey: EMAILJS_PUBLIC_KEY,
            blockHeadless: true,
            limitRate: {
              id: "adocmat-contact-form",
              throttle: CONTACT_RATE_LIMIT_MS,
            },
          },
        );

        setStatus({ type: "sent" });
        setForm(EMPTY_FORM);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("EmailJS error:", error);
        }

        setStatus({
          type: "error",
          message: "Hubo un error al enviar. Por favor intenta de nuevo.",
        });
      } finally {
        setIsSending(false);
      }
    },
    [emailjsConfigured, form],
  );

  const resetForm = useCallback(() => setStatus({ type: "idle" }), []);

  return (
    <section id="contacto" className="bg-background py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="section-label">
          <span aria-hidden />
          <span>Contacto e inscripcion</span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Forma parte de{" "}
              <span className="text-navy-600">nuestra comunidad</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
              Completa el formulario para contactarte con la asociacion,
              solicitar informacion sobre como asociarte, o consultar sobre las
              Jornadas Nacionales.
            </p>

            <ul className="space-y-6">
              {CONTACT_INFO.map((item) => (
                <li key={item.label} className="flex items-center gap-4">
                  <div
                    className="size-10 bg-navy-900 rounded-xl flex items-center justify-center text-lg shrink-0"
                    aria-hidden
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {item.label}
                    </div>
                    {"href" in item ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${item.label} de ADOCMAT (abre en nueva pestana)`}
                        className="text-navy-600 hover:text-navy-800 hover:underline transition-colors font-medium text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-foreground font-medium text-sm">
                        {item.value}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-xs border border-border p-8">
            {status.type === "sent" ? (
              <div className="text-center py-12">
                <div className="size-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Mensaje enviado
                </h3>
                <p className="text-muted-foreground text-sm">
                  Nos comunicaremos a la brevedad al correo indicado.
                </p>
                <button
                  onClick={resetForm}
                  className="mt-6 text-sm text-navy-600 hover:text-navy-800 underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {CONTACT_FIELDS.map((field) => (
                  <div key={field.name}>
                    <label
                      htmlFor={field.name}
                      className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      required
                      autoComplete={field.autoComplete}
                      maxLength={field.maxLength}
                      placeholder={field.placeholder}
                      className="w-full border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 text-sm focus:outline-hidden focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-all"
                    />
                  </div>
                ))}

                <div className="hidden" aria-hidden>
                  <label htmlFor="_trap">No completar</label>
                  <input
                    id="_trap"
                    type="text"
                    name="_trap"
                    value={form._trap}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mensaje"
                    className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    maxLength={MAX_MESSAGE_LENGTH}
                    placeholder="En que podemos ayudarte?"
                    className="w-full border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground/50 text-sm focus:outline-hidden focus:border-navy-500 focus:ring-2 focus:ring-navy-500/10 transition-all resize-none"
                  />
                </div>

                {status.type === "error" && (
                  <p
                    role="alert"
                    className="text-destructive text-xs bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                  >
                    {status.message}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="dark"
                  disabled={isSending}
                  className="w-full rounded-xl py-3.5 justify-center"
                >
                  {isSending ? (
                    <>
                      <span
                        className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        aria-hidden
                      />
                      Enviando...
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
