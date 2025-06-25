'use client'
import { FieldErrorContext } from 'react-aria-components'

import { FieldError } from './field'

export const CustomFieldError = (props: { errorMessage?: string }) => {
  return (
    <FieldErrorContext
      value={{
        isInvalid: !!props.errorMessage,
        validationErrors: props.errorMessage ? [props.errorMessage] : [],
        validationDetails: {
          badInput: false,
          customError: false,
          patternMismatch: false,
          rangeOverflow: false,
          rangeUnderflow: false,
          stepMismatch: false,
          tooLong: false,
          tooShort: false,
          typeMismatch: false,
          valid: true,
          valueMissing: false,
        },
      }}
    >
      <FieldError>{props.errorMessage}</FieldError>
    </FieldErrorContext>
  )
}
