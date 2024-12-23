const USER_ID_KEY = 'voting-user-id';

export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    userId = `user_${crypto.randomUUID()}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}