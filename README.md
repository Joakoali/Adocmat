# ADOCMAT

Landing page institucional de ADOCMAT con panel de administración de contenido.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- EmailJS (formulario de contacto)

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno

Crear un archivo `.env` en la raíz tomando como base `.env.example`:

```env
VITE_ADMIN_PASSWORD=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

## Panel de administración

Ruta: `/admin`

Permite gestionar:

- **Noticias**
- **Autoridades**
- **Jornadas**

Los cambios se guardan en `localStorage` y pueden exportarse/importarse como JSON para hacer backups.

Detalles de seguridad:
- La contraseña del admin se lee desde la variable de entorno `VITE_ADMIN_PASSWORD`, no está hardcodeada
- La sesión expira automáticamente tras inactividad
- Los backups importados se validan y sanean antes de aplicarse
- Al ser client-side, no reemplaza una autenticación real de servidor

## Formulario de contacto

Usa EmailJS con carga diferida (se importa solo al enviar). Incluye validación de campos, honeypot anti-spam y cooldown de 30 segundos entre envíos.

## Build

```bash
npm run build
```

El `vercel.json` incluye headers de seguridad para el deploy en Vercel.
