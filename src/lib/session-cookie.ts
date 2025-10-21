import Cookies from "js-cookie";

const SESSION_COOKIE_NAME = "survey_session_id";

export function getSessionIdFromCookie(): string | undefined {
  return Cookies.get(SESSION_COOKIE_NAME);
}

export function setSessionIdCookie(sessionId: string): void {
  // Set cookie to expire in 10 years (essentially permanent)
  Cookies.set(SESSION_COOKIE_NAME, sessionId, { expires: 3650 });
}

export function clearSessionIdCookie(): void {
  Cookies.remove(SESSION_COOKIE_NAME);
}
