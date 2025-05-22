import { Link } from '../../../intentui/ui/link'

export const TermAndPrivacy = () => {
  return (
    <p className="text-muted-foreground text-center text-xs">
      By clicking continue, you agree to our{' '}
      <Link href="/terms" className="underline">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link href="/privacy" className="underline">
        Privacy Policy
      </Link>
      .
    </p>
  )
}
