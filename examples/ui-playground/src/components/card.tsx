import { StarIcon } from '@phosphor-icons/react/dist/ssr'

import { Typography } from '@genseki/react'

type PlaygroundCardProps = React.PropsWithChildren<{
  title: string
  categoryTitle?: string
}>

export const PlaygroundCard = ({
  title,
  categoryTitle = 'Feature',
  children,
}: PlaygroundCardProps) => {
  return (
    <div className="border-border inline-flex min-w-[260px] flex-col rounded-lg border bg-background">
      <div className="border-border flex w-full flex-col gap-y-4 border-b px-4 py-6">
        <div className="flex items-center gap-x-2">
          <div className="rounded-md bg-blue-500 p-2">
            <StarIcon className="text-text-inverse" />
          </div>
          <Typography type="caption" weight="medium" className="text-blue-500">
            {categoryTitle}
          </Typography>
        </div>
        <Typography type="h4" weight="bold" className="text-fg">
          {title}
        </Typography>
      </div>
      <div className="flex w-full flex-col items-start gap-y-2 px-4 py-4">
        <Typography type="label" weight="medium" className="text-muted-fg bg-muted rounded-sm p-2">
          Description
        </Typography>
        {children}
      </div>
    </div>
  )
}
