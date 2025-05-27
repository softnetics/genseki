import { parse as parseCookies, serialize } from 'cookie-es'

function setCookie(
  headers: Record<string, string> | undefined,
  name: string,
  value: string,
  options: { expires?: Date } = { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) } // Default to 1 day expiration
) {
  serialize
  if (!headers) return
  headers['Set-Cookie'] = serialize(name, value, options)
}

function deleteCookie(headers: Record<string, string> | undefined, name: string, expiresAt?: Date) {
  if (!headers) return
  headers['Set-Cookie'] = `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}

const SESSION_COOKIE_NAME = 'SESSION_ID'

export function getSessionCookie(headers: Record<string, string> | undefined): string | undefined {
  const cookies = parseCookies(headers?.['cookie'] || '')
  return cookies[SESSION_COOKIE_NAME]
}

export function setSessionCookie(headers: Record<string, string> | undefined, value: string) {
  setCookie(headers, SESSION_COOKIE_NAME, value)
}

export function deleteSessionCookie(headers?: Record<string, string>) {
  deleteCookie(headers, SESSION_COOKIE_NAME)
}
