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
    { request, response, rawBody }: { request: Request; response: Response; rawBody?: string }
  ) => {
    const result = await validateRequestBody(schema, payload)
    if (result.success === false) {
      return {
        status: 400,
        body: {
          error: 'Validation failed',
          details: result.error,
        },
      }
    }

    const validatedPayload = result.data
    const responseBody = await handler(validatedPayload as any, { request, response, rawBody })

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
  const [bodyResult, pathParamsResult, queryResult, headersResult] = await Promise.all([
    schema.body
      ? schema.body.safeParseAsync((payload as any).body)
      : Promise.resolve({ success: true, data: (payload as any).body, error: null }),
    schema.pathParams
      ? schema.pathParams.safeParseAsync((payload as any).pathParams)
      : Promise.resolve({ success: true, data: (payload as any).pathParams, error: null }),
    schema.query
      ? schema.query.safeParseAsync((payload as any).query)
      : Promise.resolve({ success: true, data: (payload as any).query, error: null }),
    schema.headers
      ? schema.headers.safeParseAsync((payload as any).headers)
      : Promise.resolve({ success: true, data: (payload as any).headers, error: null }),
  ])

  if (
    bodyResult.success &&
    pathParamsResult.success &&
    queryResult.success &&
    headersResult.success
  ) {
    return {
      success: true,
      data: {
        ...(bodyResult.data ? { body: bodyResult.data } : {}),
        ...(pathParamsResult.data ? { pathParams: pathParamsResult.data } : {}),
        ...(queryResult.data ? { query: queryResult.data } : {}),
        ...(headersResult.data ? { headers: headersResult.data } : {}),
      },
    } as const
  }

  return {
    success: false,
    error: {
      ...(bodyResult.error ? { body: bodyResult.error.issues } : {}),
      ...(pathParamsResult.error ? { pathParams: pathParamsResult.error.issues } : {}),
      ...(queryResult.error ? { query: queryResult.error.issues } : {}),
      ...(headersResult.error ? { headers: headersResult.error.issues } : {}),
    },
  } as const
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
