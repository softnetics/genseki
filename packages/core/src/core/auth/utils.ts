function setCookie(headers: Headers, name: string, value: string) {
  headers.append('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Strict`)
}

function getCookie(headers: Headers, name: string) {
  const cookie = headers.get('Cookie')
  if (!cookie) return null
  const cookies = cookie.split('; ')
  for (const c of cookies) {
    const [key, val] = c.split('=')
    if (key === name) return val
  }
  return null
}

function deleteCookie(headers: Headers, name: string) {
  headers.append('Set-Cookie', `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`)
}

const SESSION_COOKIE_NAME = 'SESSION_ID'

export function getSessionCookie(headers: Headers) {
  return getCookie(headers, SESSION_COOKIE_NAME)
}

export function setSessionCookie(headers: Headers, value: string) {
  setCookie(headers, SESSION_COOKIE_NAME, value)
}

export function deleteSessionCookie(headers: Headers) {
  deleteCookie(headers, SESSION_COOKIE_NAME)
}
