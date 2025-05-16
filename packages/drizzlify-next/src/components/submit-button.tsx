'use client'

import { useFormStatus } from 'react-dom'

import { Button } from '../intentui/ui/button'

interface SubmitButtonProps {
  children: React.ReactNode
}

export function SubmitButton(props: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full">
      {pending ? 'Submitting...' : <>{props.children}</>}
    </Button>
  )
}
