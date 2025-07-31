import type { z } from 'zod/v4'

import type {
  AnyApiRouteSchema,
  ApiHttpStatus,
  ApiRouteHandler,
  ApiRouteHandlerPayload,
  ApiRouteSchema,
} from './endpoint'

export function withValidator<TApiRouteSchema extends ApiRouteSchema>(
  schema: TApiRouteSchema,
  handler: ApiRouteHandler<TApiRouteSchema>
): ApiRouteHandler<TApiRouteSchema> {
  const wrappedHandler = async (
    payload: ApiRouteHandlerPayload<TApiRouteSchema>,
    { request, response }: { request: Request; response: Response }
  ) => {
    const zodErrors = await validateRequestBody(schema, payload)
    if (zodErrors) {
      return {
        status: 400,
        body: {
          error: 'Validation failed',
          details: zodErrors,
        },
      }
    }

    const responseBody = await handler(payload, { request, response })

    const validationError = validateResponseBody(
      schema,
      responseBody.status as ApiHttpStatus,
      responseBody.body
    )

    if (validationError) {
      return {
        status: 500,
        body: {
          error: 'Response validation failed',
          details: validationError.issues,
        },
      }
    }

    return responseBody
  }

  return wrappedHandler as ApiRouteHandler<TApiRouteSchema>
}

async function validateRequestBody<TApiRouteSchema extends ApiRouteSchema = AnyApiRouteSchema>(
  schema: TApiRouteSchema,
  payload: ApiRouteHandlerPayload<TApiRouteSchema>
) {
  let zodErrors:
    | Partial<Record<'query' | 'pathParams' | 'headers' | 'body', z.core.$ZodIssue[]>>
    | undefined

  if (schema.query) {
    const err = await schema.query.safeParseAsync((payload as any).query)
    if (!err.success) {
      zodErrors = {
        ...zodErrors,
        query: err.error.issues,
      }
    }
  }

  if (schema.pathParams) {
    const err = await schema.pathParams.safeParseAsync((payload as any).pathParams)
    if (!err.success) {
      zodErrors = {
        ...zodErrors,
        pathParams: err.error.issues,
      }
    }
  }

  if (schema.headers) {
    const err = await schema.headers.safeParseAsync((payload as any).headers)
    if (!err.success) {
      zodErrors = {
        ...zodErrors,
        headers: err.error.issues,
      }
    }
  }

  if (schema.method !== 'GET' && schema.body) {
    const err = await schema.body.safeParseAsync((payload as any).body)
    if (!err.success) {
      zodErrors = {
        ...zodErrors,
        body: err.error.issues,
      }
    }
  }

  return zodErrors
}

function validateResponseBody<TApiRouteSchema extends ApiRouteSchema = AnyApiRouteSchema>(
  schema: TApiRouteSchema,
  statusCode: ApiHttpStatus,
  response: any
) {
  if (!schema.responses[statusCode]) {
    throw new Error(`No response schema defined for status code ${statusCode}`)
  }

  const result = schema.responses[statusCode].safeParse(response)
  return result.error
}
