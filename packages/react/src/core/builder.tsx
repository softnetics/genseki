import type { AnyContextable, ContextToRequestContext } from './context'
import {
  type ApiRoute,
  type ApiRouteHandlerInitial,
  type ApiRouteSchema,
  createEndpoint,
} from './endpoint'
import { FieldBuilder, type Fields, type FieldsOptions, type FieldsShape } from './field'
import type { ModelSchemas } from './model'

export class Builder<in out TContext extends AnyContextable, TModelSchemas extends ModelSchemas> {
  constructor(
    private readonly config: {
      schema: TModelSchemas
      context: TContext
    }
  ) {}

  fields<const TModelName extends keyof TModelSchemas, const TFieldsShape extends FieldsShape>(
    modelName: TModelName,
    configFn: (fb: FieldBuilder<TContext, TModelSchemas, TModelName>) => TFieldsShape,
    info?: { identifierColumn?: string; orderColumn?: string }
  ) {
    const fb = new FieldBuilder({
      context: this.config.context,
      modelSchemas: this.config.schema,
      modelName: modelName,
    }) as FieldBuilder<TContext, TModelSchemas, TModelName>
    return fb.fields(modelName, configFn, info)
  }

  endpoint<const TApiEndpointSchema extends ApiRouteSchema>(
    schema: TApiEndpointSchema,
    handler: ApiRouteHandlerInitial<ContextToRequestContext<TContext>, TApiEndpointSchema>
  ): ApiRoute<TApiEndpointSchema> {
    return createEndpoint(this.config.context, schema, handler)
  }

  options<const TFields extends Fields, const TOptions extends FieldsOptions<TContext, TFields>>(
    fields: TFields,
    options: TOptions
  ) {
    return options
  }
}
