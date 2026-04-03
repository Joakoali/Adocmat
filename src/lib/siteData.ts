import defaultData from "@/data/defaultData";
import type {
  Autoridades,
  Jornada,
  Miembro,
  Noticia,
  ProximaJornada,
  SiteData,
} from "@/types";

const MAX_SHORT_TEXT = 160;
const MAX_MEDIUM_TEXT = 320;
const MAX_LONG_TEXT = 2_000;
const MAX_IMAGE_URL_LENGTH = 2_048;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeText(
  value: unknown,
  fallback = "",
  maxLength = MAX_MEDIUM_TEXT,
): string {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : fallback;
}

function sanitizeInteger(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : fallback;
}

function sanitizeBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizeImageUrl(value: unknown): string {
  const normalized = sanitizeText(value, "", MAX_IMAGE_URL_LENGTH);
  if (!normalized) return "";
  if (normalized.startsWith("/")) return normalized;
  if (normalized.startsWith("data:image/")) return normalized;

  try {
    const url = new URL(normalized);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function hasVisibleContent(values: string[]): boolean {
  return values.some((value) => value.trim().length > 0);
}

export function cloneMiembro(miembro: Miembro): Miembro {
  return { ...miembro };
}

export function cloneAutoridades(autoridades: Autoridades): Autoridades {
  return {
    periodo: autoridades.periodo,
    consejo: autoridades.consejo.map(cloneMiembro),
    sindicatura: autoridades.sindicatura.map(cloneMiembro),
  };
}

export function cloneJornada(jornada: Jornada): Jornada {
  return { ...jornada };
}

export function cloneProximaJornada(
  proximaJornada: ProximaJornada,
): ProximaJornada {
  return { ...proximaJornada };
}

export function cloneNoticia(noticia: Noticia): Noticia {
  return { ...noticia };
}

export function cloneSiteData(siteData: SiteData = defaultData): SiteData {
  return {
    autoridades: cloneAutoridades(siteData.autoridades),
    jornadas: siteData.jornadas.map(cloneJornada),
    proximaJornada: cloneProximaJornada(siteData.proximaJornada),
    noticias: siteData.noticias.map(cloneNoticia),
  };
}

function sanitizeMiembro(value: unknown): Miembro | null {
  if (!isRecord(value)) return null;

  const miembro: Miembro = {
    cargo: sanitizeText(value.cargo, "", MAX_SHORT_TEXT),
    nombre: sanitizeText(value.nombre, "", MAX_SHORT_TEXT),
    universidad: sanitizeText(value.universidad, "", MAX_SHORT_TEXT),
  };

  return hasVisibleContent([miembro.cargo, miembro.nombre, miembro.universidad])
    ? miembro
    : null;
}

function sanitizeMiembroList(value: unknown): Miembro[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const miembro = sanitizeMiembro(item);
    return miembro ? [miembro] : [];
  });
}

function sanitizeAutoridades(
  value: unknown,
  fallback: Autoridades,
): Autoridades {
  if (!isRecord(value)) return cloneAutoridades(fallback);

  return {
    periodo: sanitizeText(value.periodo, fallback.periodo, MAX_SHORT_TEXT),
    consejo: Array.isArray(value.consejo)
      ? sanitizeMiembroList(value.consejo)
      : fallback.consejo.map(cloneMiembro),
    sindicatura: Array.isArray(value.sindicatura)
      ? sanitizeMiembroList(value.sindicatura)
      : fallback.sindicatura.map(cloneMiembro),
  };
}

function sanitizeJornada(value: unknown): Jornada | null {
  if (!isRecord(value)) return null;

  const numeroArabigo = sanitizeInteger(value.numeroArabigo, 0);
  if (numeroArabigo <= 0) return null;

  return {
    numero: sanitizeText(value.numero, String(numeroArabigo), MAX_SHORT_TEXT),
    numeroArabigo,
    fecha: sanitizeText(value.fecha, "", MAX_SHORT_TEXT),
    ciudad: sanitizeText(value.ciudad, "", MAX_SHORT_TEXT),
    provincia: sanitizeText(value.provincia, "", MAX_SHORT_TEXT),
    facultad: sanitizeText(value.facultad, "", MAX_MEDIUM_TEXT),
    universidad: sanitizeText(value.universidad, "", MAX_MEDIUM_TEXT),
    actas: sanitizeBoolean(value.actas, false),
  };
}

function sanitizeJornadas(value: unknown, fallback: Jornada[]): Jornada[] {
  if (!Array.isArray(value)) return fallback.map(cloneJornada);

  const seen = new Set<number>();
  const jornadas = value.flatMap((item) => {
    const jornada = sanitizeJornada(item);
    if (!jornada || seen.has(jornada.numeroArabigo)) return [];
    seen.add(jornada.numeroArabigo);
    return [jornada];
  });

  return [...jornadas].sort((a, b) => a.numeroArabigo - b.numeroArabigo);
}

function sanitizeProximaJornada(
  value: unknown,
  fallback: ProximaJornada,
): ProximaJornada {
  if (!isRecord(value)) return cloneProximaJornada(fallback);

  return {
    activa: sanitizeBoolean(value.activa, fallback.activa),
    numero: sanitizeText(value.numero, fallback.numero, MAX_SHORT_TEXT),
    fecha: sanitizeText(value.fecha, fallback.fecha, MAX_SHORT_TEXT),
    ciudad: sanitizeText(value.ciudad, fallback.ciudad, MAX_SHORT_TEXT),
    provincia: sanitizeText(
      value.provincia,
      fallback.provincia,
      MAX_SHORT_TEXT,
    ),
    universidad: sanitizeText(
      value.universidad,
      fallback.universidad,
      MAX_MEDIUM_TEXT,
    ),
    descripcion: sanitizeText(
      value.descripcion,
      fallback.descripcion,
      MAX_LONG_TEXT,
    ),
  };
}

function sanitizeNoticia(value: unknown): Noticia | null {
  if (!isRecord(value)) return null;

  const noticia: Noticia = {
    id: sanitizeInteger(value.id, 0),
    titulo: sanitizeText(value.titulo, "", MAX_MEDIUM_TEXT),
    resumen: sanitizeText(value.resumen, "", MAX_LONG_TEXT),
    fecha: sanitizeText(value.fecha, "", MAX_SHORT_TEXT),
    imagen: sanitizeImageUrl(value.imagen),
  };

  return noticia.id > 0 && hasVisibleContent([noticia.titulo, noticia.resumen])
    ? noticia
    : null;
}

function sanitizeNoticias(value: unknown, fallback: Noticia[]): Noticia[] {
  if (!Array.isArray(value)) return fallback.map(cloneNoticia);

  const seen = new Set<number>();
  return value.flatMap((item) => {
    const noticia = sanitizeNoticia(item);
    if (!noticia || seen.has(noticia.id)) return [];
    seen.add(noticia.id);
    return [noticia];
  });
}

function hasKnownSiteDataFields(value: unknown): value is Record<string, unknown> {
  return (
    isRecord(value) &&
    ("autoridades" in value ||
      "jornadas" in value ||
      "proximaJornada" in value ||
      "noticias" in value)
  );
}

export function sanitizeSiteData(value: unknown): SiteData {
  const fallback = cloneSiteData(defaultData);
  if (!hasKnownSiteDataFields(value)) return fallback;

  return {
    autoridades: sanitizeAutoridades(value.autoridades, fallback.autoridades),
    jornadas: sanitizeJornadas(value.jornadas, fallback.jornadas),
    proximaJornada: sanitizeProximaJornada(
      value.proximaJornada,
      fallback.proximaJornada,
    ),
    noticias: sanitizeNoticias(value.noticias, fallback.noticias),
  };
}

export function parseSiteDataJson(raw: string): SiteData | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return hasKnownSiteDataFields(parsed) ? sanitizeSiteData(parsed) : null;
  } catch {
    return null;
  }
}
