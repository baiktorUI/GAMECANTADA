const ADMIN_KEY = 'voting-admin-status';

export function setAdminStatus(isAdmin: boolean): void {
  try {
    localStorage.setItem(ADMIN_KEY, String(isAdmin));
  } catch (error) {
    console.error('Error setting admin status:', error);
  }
}

export function isAdmin(): boolean {
  return localStorage.getItem(ADMIN_KEY) === 'true';
}

export function clearAdminStatus(): void {
  localStorage.removeItem(ADMIN_KEY);
}