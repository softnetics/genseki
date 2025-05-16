import { ComponentType, createContext } from 'react'
import { Controller, FormProvider } from 'react-hook-form'
import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

export const Form: typeof FormProvider = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TName> & { component: ComponentType<{ name: TName }> }
) => {
  const Component = props.component

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} render={({ field }) => <Component name={field.name} />} />
    </FormFieldContext.Provider>
  )
}
