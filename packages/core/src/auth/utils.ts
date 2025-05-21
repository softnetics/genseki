function setCookie(headers: Record<string, string> | undefined, name: string, value: string) {
  if (!headers) return
  headers['Set-Cookie'] = `${name}=${value}; Path=/; HttpOnly; SameSite=Strict`
}

function getCookie(headers: Record<string, string> | undefined, name: string) {
  if (!headers) return null
  const cookie = headers[name]
  if (!cookie) return null
  const cookies = cookie.split('; ')
  for (const c of cookies) {
    const [key, val] = c.split('=')
    if (key === name) return val
  }
  return null
}

function deleteCookie(headers: Record<string, string> | undefined, name: string) {
  if (!headers) return
  headers['Set-Cookie'] = `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}

const SESSION_COOKIE_NAME = 'SESSION_ID'

export function getSessionCookie(headers: Record<string, string> | undefined) {
  return getCookie(headers, SESSION_COOKIE_NAME)
}

export function setSessionCookie(headers: Record<string, string> | undefined, value: string) {
  setCookie(headers, SESSION_COOKIE_NAME, value)
}

export function deleteSessionCookie(headers?: Record<string, string>) {
  deleteCookie(headers, SESSION_COOKIE_NAME)
}
