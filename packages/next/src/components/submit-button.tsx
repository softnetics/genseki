'use client'

import { useFormStatus } from 'react-dom'

import { Button } from '../intentui/ui/button'

interface SubmitButtonProps {
  children: React.ReactNode
}

export function SubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button size="md" variant="primary" type="submit" className="w-full" isDisabled={pending}>
      {pending ? 'Submitting...' : <>{props.children}</>}
    </Button>
  )
}
