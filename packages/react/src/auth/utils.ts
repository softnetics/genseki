import { parse as parseCookies, serialize } from 'cookie-es'
import crypto, { randomBytes } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(crypto.scrypt)

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

function deleteCookie(headers: Record<string, string> | undefined, name: string) {
  if (!headers) return
  headers['Set-Cookie'] = `${name}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}

const SESSION_COOKIE_NAME = 'GENSEKI_SESSION'

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

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(8).toString('hex')
  const derivedKey = await scrypt(password, salt, 64)
  return salt + ':' + (derivedKey as Buffer).toString('hex')
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, key] = hashedPassword.split(':')
  const keyBuffer = Buffer.from(key, 'hex')
  const derivedKey = await scrypt(password, salt, 64)
  return crypto.timingSafeEqual(keyBuffer, derivedKey as any)
}
