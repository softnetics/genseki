import { parse as parseCookies, serialize } from 'cookie-es'
import crypto, { randomBytes } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(crypto.scrypt)

const SESSION_COOKIE_NAME = 'GENSEKI_SESSION'

export function getSessionCookie(request: Request): string | undefined {
  const cookies = parseCookies(request.headers.get('Cookie') || '')
  return cookies[SESSION_COOKIE_NAME]
}

export abstract class ResponseHelper {
  static setSessionCookie(response: Response, value: string) {
    response.headers.set(
      'Set-Cookie',
      serialize(SESSION_COOKIE_NAME, value, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        sameSite: 'strict',
      })
    )
  }

  static deleteSessionCookie(response: Response) {
    response.headers.set(
      'Set-Cookie',
      serialize(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        expires: new Date(0), // Set to past date to delete
        sameSite: 'strict',
      })
    )
  }
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
