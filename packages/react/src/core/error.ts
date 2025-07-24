import type { ZodError } from 'zod/v4'
import type { $ZodIssue } from 'zod/v4/core'

interface HttpError<TBody> {
  status: number
  body: TBody
}

export class HttpBadRequestError implements HttpError<{ message: string; issues: $ZodIssue[] }> {
  status: number
  body: { message: string; issues: $ZodIssue[] }

  constructor(error: ZodError, message?: string) {
    this.status = 400
    this.body = {
      message: message || 'Bad Request',
      issues: error.issues,
    }
  }
}

export class HttpUnauthorizedError implements HttpError<{ message: string }> {
  status: number
  body: { message: string }

  constructor(message?: string) {
    this.status = 401
    this.body = {
      message: message || 'unauthorized',
    }
  }
}

export class HttpForbiddenError implements HttpError<{ message: string }> {
  status: number
  body: { message: string }

  constructor(message?: string) {
    this.status = 403
    this.body = {
      message: message || 'forbidden',
    }
  }
}

export class HttpInternalServerError implements HttpError<{ message: string }> {
  status: number
  body: { message: string }

  constructor(message?: string) {
    this.status = 500
    this.body = {
      message: message || 'internal server error',
    }
  }
}

export class HttpNotFoundError implements HttpError<{ message: string }> {
  status: number
  body: { message: string }

  constructor(message?: string) {
    this.status = 404
    this.body = {
      message: message || 'not found',
    }
  }
}
