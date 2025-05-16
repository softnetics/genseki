import { UIPlayground } from '@repo/drizzlify-next'

interface PlaygroundPageProps {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export default async function Playground(props: PlaygroundPageProps) {
  return <UIPlayground />
}
