import type { PropsWithChildren } from 'react'
import * as React from 'react'
import { Label as LabelPrimitive } from 'react-aria-components'
import type {
  Control,
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  DeepPartialSkipArrayKey,
  FieldArrayPath,
  FieldPath,
  FieldPathValue,
  FieldPathValues,
  FieldValues,
  Path,
  UseFieldArrayProps,
  UseFieldArrayReturn,
  UseFormStateReturn,
} from 'react-hook-form'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form'

import { Slot } from '@radix-ui/react-slot'
import { deepmerge } from 'deepmerge-ts'

import type { ButtonProps } from './button'
import { Button } from './button'

import { cn } from '../../utils/cn'

const Form: typeof FormProvider = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)
export const FormItemProvider = (props: { children: React.ReactNode }) => {
  const id = React.useId()
  return <FormItemContext.Provider value={{ id }}>{props.children}</FormItemContext.Provider>
}
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <FormItemProvider>
        <div ref={ref} className={cn('space-y-spacing-4', className)} {...props} />
      </FormItemProvider>
    )
  }
)
FormItem.displayName = 'FormItem'

const FormLabel: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof LabelPrimitive> &
    React.RefAttributes<React.ElementRef<typeof LabelPrimitive>>
> = React.forwardRef(({ className, ...props }, ref) => {
  const { formItemId } = useFormField()

  return <LabelPrimitive ref={ref} className={className ?? ''} htmlFor={formItemId} {...props} />
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  const reactAriaProps = {
    isInvalid: !!error,
  }

  return (
    <Slot
      ref={ref}
      id={formItemId}
      className="peer"
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...reactAriaProps}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn(
        'text-body-s font-regular text-input-text-helper peer-disabled:text-input-text-disabled',
        className
      )}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('font-regular gap-spacing-8 flex items-center text-sm text-red-500', className)}
      {...props}
    >
      {/* <FontAwesomeIcon icon={faCircleExclamation} /> */}*{body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export const FormRootMessage = React.forwardRef<
  HTMLParagraphElement,
  Omit<React.HTMLAttributes<HTMLParagraphElement>, 'children'>
>(({ className, ...props }, ref) => {
  const { errors } = useFormState()
  if (!errors.root) {
    return null
  }

  return (
    <p
      ref={ref}
      className={cn(
        'text-body-s font-regular text-input-text-error gap-spacing-8 flex items-center',
        className
      )}
      {...props}
    >
      {errors.root.message}
    </p>
  )
})
FormRootMessage.displayName = 'FormRootMessage'

type FormFieldArrayProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = 'id',
> = {
  render: (props: UseFieldArrayReturn<TFieldValues, TFieldArrayName, TKeyName>) => React.ReactNode
} & UseFieldArrayProps<TFieldValues, TFieldArrayName, TKeyName>

const FormFieldArray = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<TFieldValues> = FieldArrayPath<TFieldValues>,
  TKeyName extends string = 'id',
>({
  render,
  ...props
}: FormFieldArrayProps<TFieldValues, TFieldArrayName, TKeyName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      {render(useFieldArray(props))}
    </FormFieldContext.Provider>
  )
}

type RenderFunction<TValue> = (value: TValue) => React.ReactNode

export type FormFieldValueBaseProps<TFieldValues extends FieldValues> = {
  control?: Control<TFieldValues>
  disabled?: boolean
  exact?: boolean
}

export type FormFieldValueWithNameProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = FormFieldValueBaseProps<TFieldValues> & {
  name: TFieldName
  render: RenderFunction<FieldPathValue<TFieldValues, TFieldName>>
}

export type FormFieldValueWithNamesProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldNames extends
    | FieldPath<TFieldValues>[]
    | readonly FieldPath<TFieldValues>[] = readonly FieldPath<TFieldValues>[],
> = FormFieldValueBaseProps<TFieldValues> & {
  name: readonly [...TFieldNames]
  render: RenderFunction<FieldPathValues<TFieldValues, TFieldNames>>
}

export type FormFieldValueWithoutNameProps<TFieldValues extends FieldValues = FieldValues> =
  FormFieldValueBaseProps<TFieldValues> & {
    render: RenderFunction<DeepPartialSkipArrayKey<TFieldValues>>
  }

export type FormFieldValueProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends
    | FieldPath<TFieldValues>
    | readonly FieldPath<TFieldValues>[]
    | undefined = undefined,
> =
  TFieldName extends FieldPath<TFieldValues>
    ? FormFieldValueWithNameProps<TFieldValues, TFieldName>
    : TFieldName extends readonly FieldPath<TFieldValues>[]
      ? FormFieldValueWithNamesProps<TFieldValues, TFieldName>
      : FormFieldValueWithoutNameProps<TFieldValues>

function FormFieldValue<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends
    | FieldPath<TFieldValues>
    | readonly FieldPath<TFieldValues>[]
    | undefined = undefined,
>(props: FormFieldValueProps<TFieldValues, TFieldName>) {
  const { control, getValues } = useFormContext<TFieldValues>()
  const data = useWatch({ control: control, ...props })

  let value: any
  if ('name' in props && Array.isArray(props.name)) {
    value = (props.name as FieldPath<TFieldValues>[]).map((name, index) =>
      deepmerge(data[index], getValues(name))
    )
  } else if ('name' in props) {
    value = deepmerge(data, getValues(props.name as Path<TFieldValues>))
  } else {
    value = deepmerge(data, getValues())
  }

  return props.render(value)
}

export interface FormSubmitButtonProps extends ButtonProps {
  isLoading?: boolean
  isError?: boolean
  // TODO: implement icons
  //   leftIcon?: IconDefinition
  //   rightIcon?: IconDefinition
  loadingIconSide?: 'left' | 'right'
}
export const FormSubmitButton = React.forwardRef<HTMLButtonElement, FormSubmitButtonProps>(
  function FormSubmitButton(props, ref) {
    const {
      isLoading: isLoadingProp,
      isError: isErrorProp,
      // TODO: implement icons
      //   leftIcon,
      //   rightIcon,
      loadingIconSide = 'right',
      //   disabled,
      children,
      ...rest
    } = props
    const { isSubmitting, errors } = useFormState()
    const isFormError = Object.keys(errors).length > 0
    const isLoading = isLoadingProp ?? isSubmitting
    const isError = isErrorProp ?? isFormError
    // TODO: implement icons
    // const loadingIconElement = <FontAwesomeIcon className="animate-spin" icon={faSpinnerThird} />
    // const leftIconElement =
    //   isLoading && loadingIconSide === 'left'
    //     ? loadingIconElement
    //     : leftIcon && <FontAwesomeIcon icon={leftIcon} />
    // const rightIconElement =
    //   isLoading && loadingIconSide === 'right'
    //     ? loadingIconElement
    //     : rightIcon && <FontAwesomeIcon icon={rightIcon} />
    return (
      <Button
        type="submit"
        ref={ref}
        // disabled={isLoading || disabled}
        // scheme={isError ? 'error' : 'primary'}
        {...rest}
      >
        {/* {leftIconElement} */}
        {children}
        {/* {rightIconElement} */}
      </Button>
    )
  }
)

interface FormItemControllerContext {
  field: ControllerRenderProps<FieldValues>
  fieldState: ControllerFieldState
  formState: UseFormStateReturn<FieldValues>
}

export const FormItemControllerContext = React.createContext<FormItemControllerContext>(
  {} as FormItemControllerContext
)

export const useFormItemController = () => {
  const formField = useFormField()
  const context = React.useContext(FormItemControllerContext)
  if (!context) {
    throw new Error('useFormItemController must be used within a FormItemController')
  }
  return {
    ...context,
    ...formField,
  }
}

export function FormItemController(props: PropsWithChildren<FormItemControllerContext>) {
  return (
    <FormItem>
      <FormItemControllerContext.Provider
        value={{ field: props.field, fieldState: props.fieldState, formState: props.formState }}
      >
        {props.children}
      </FormItemControllerContext.Provider>
    </FormItem>
  )
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormFieldArray,
  FormFieldValue,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
}
