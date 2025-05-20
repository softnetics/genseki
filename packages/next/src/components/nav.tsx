import { useParams } from 'next/navigation'

interface NavProps {}

export function Nav(props: NavProps) {
  const params = useParams<{ params: string[] }>()

  const slug = params.params[0] as string

  return (
    <nav>
      <span>Logo</span>
    </nav>
  )
}
