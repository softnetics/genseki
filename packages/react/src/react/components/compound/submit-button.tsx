'use client'

import { useFormStatus } from 'react-dom'

import { Button } from '../primitives/button'

interface SubmitButtonProps {
  children: React.ReactNode
  pending?: boolean
}

export function SubmitButton(props: SubmitButtonProps) {
  const { pending: _pending } = useFormStatus()
  const pending = _pending || props.pending

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : <>{props.children}</>}
    </Button>
  )
}
