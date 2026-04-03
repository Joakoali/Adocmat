const ADMIN_SESSION_KEY = "adocmat_admin_session";
const ADMIN_SESSION_TTL_MS = 30 * 60 * 1000;

interface AdminSession {
  expiresAt: number;
}

function readAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("expiresAt" in parsed) ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    return { expiresAt: parsed.expiresAt };
  } catch {
    return null;
  }
}

function writeAdminSession(expiresAt: number): void {
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ expiresAt }));
}

export function createAdminSession(now = Date.now()): void {
  writeAdminSession(now + ADMIN_SESSION_TTL_MS);
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function hasValidAdminSession(now = Date.now()): boolean {
  const session = readAdminSession();
  if (!session) return false;
  if (session.expiresAt <= now) {
    clearAdminSession();
    return false;
  }
  return true;
}

export function refreshAdminSession(now = Date.now()): void {
  if (!hasValidAdminSession(now)) return;
  writeAdminSession(now + ADMIN_SESSION_TTL_MS);
}

export function getAdminSessionTtlMinutes(): number {
  return Math.round(ADMIN_SESSION_TTL_MS / 60_000);
}
