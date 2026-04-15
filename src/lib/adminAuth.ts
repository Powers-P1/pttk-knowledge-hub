const ADMIN_SESSION_KEY = 'pttk_admin_session_v1';
let adminSecretInMemory: string | null = null;

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1' && !!adminSecretInMemory;
}

export function loginAdmin(password: string): boolean {
  const normalized = password.trim();
  if (!normalized) return false;
  sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
  adminSecretInMemory = normalized;
  return true;
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  adminSecretInMemory = null;
}

export function getAdminSessionSecret(): string | null {
  return adminSecretInMemory;
}
