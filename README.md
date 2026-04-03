# ADOCMAT

Landing page institucional de ADOCMAT construida con React, Vite y Tailwind CSS.

## Requisitos

- Node.js 18+
- npm

## Desarrollo

```bash
npm install
npm run dev
```

## Variables de entorno

Crea un archivo `.env` tomando como base `.env.example`.

Variables usadas por el proyecto:

- `VITE_ADMIN_PASSWORD`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## Panel admin

Ruta: `/admin`

El panel permite editar:

- Noticias
- Autoridades
- Jornadas

Los cambios se guardan en `localStorage` del navegador y pueden exportarse o importarse como JSON.

Notas importantes:

- La clave del admin ya no esta hardcodeada en el codigo.
- La sesion del admin expira automaticamente tras inactividad.
- La importacion de backups valida y sanea los datos antes de guardarlos.
- Al ser un panel client-side, no reemplaza una autenticacion real de servidor.

## Formulario de contacto

El formulario usa EmailJS con estas variables:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

Ademas:

- EmailJS se carga de forma diferida solo al enviar.
- Hay validacion basica del formulario.
- Se aplica limitacion simple de frecuencia y honeypot anti-spam.

## Build

```bash
npm run build
```

La configuracion de `vercel.json` incluye headers de seguridad para despliegue en Vercel.
