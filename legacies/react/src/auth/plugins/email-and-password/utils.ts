import crypto, { randomBytes } from 'crypto'
import { promisify } from 'util'

const scrypt = promisify(crypto.scrypt)

export abstract class Password {
  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex')
    const derivedKey = await scrypt(password, salt, 64)
    return salt + ':' + (derivedKey as Buffer).toString('hex')
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [salt, key] = hashedPassword.split(':')
    const keyBuffer = Buffer.from(key, 'hex')
    const derivedKey = await scrypt(password, salt, 64)
    return crypto.timingSafeEqual(keyBuffer, derivedKey as any)
  }
}
