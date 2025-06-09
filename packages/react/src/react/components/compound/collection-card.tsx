import { CaretRightIcon, CubeIcon, FolderIcon } from '@phosphor-icons/react/dist/ssr'

import { Badge } from '../../icons/badge'
import { BaseIcon } from '../primitives/base-icon'
import { Link } from '../primitives/link'
import { Typography } from '../primitives/typography'

interface CollectionCardProps {
  collectionName: string
  amounts: number
  description: string
  url: string
}

export const CollectionCard = ({
  collectionName,
  amounts,
  description,
  url,
}: CollectionCardProps) => {
  return (
    <div className="bg-overlay border-border relative flex w-full flex-col rounded-xl border p-2 shadow-md">
      <div className="absolute left-6 z-10 -translate-y-1/2">
        <Badge width={50} height={50} className="dark:brightness-[40%] dark:contrast-150"></Badge>
        <BaseIcon
          icon={CubeIcon}
          size="md"
          weight="duotone"
          className="absolute inset-0 z-10 m-auto"
        />
      </div>
      <div className="border-secondary relative flex items-center justify-between overflow-hidden border-b px-8 pb-4 pt-14">
        <div className="absolute -left-2 -top-1/2 aspect-square h-36 [background-image:radial-gradient(circle,--alpha(var(--color-fg)/25%)_2px,--alpha(var(--color-fg)/25%)_2px,transparent_2px)] [background-repeat:repeat] [background-size:8px_8px] [mask-image:radial-gradient(circle,black,transparent_80%)]" />
        <Typography type="h4" weight="semibold" className="text-text-nontrivial">
          {collectionName}
        </Typography>
        <div className="flex items-center">
          <BaseIcon icon={FolderIcon} size="sm" weight="duotone" />
          <Typography type="caption" weight="normal" className="text-nowrap">
            {amounts} items
          </Typography>
        </div>
      </div>
      <div className="min-h-[100px] flex-1 p-8 pt-6">
        <Typography
          content={description}
          type="body"
          weight="normal"
          className="text-text-trivial line-clamp-3"
        >
          {description}
        </Typography>
      </div>
      <Link
        href={url}
        className="[&>*]:text-primary group flex w-full justify-end rounded-[calc(var(--spacing)*4)] p-5 text-end transition-all [background-image:linear-gradient(120deg,_--alpha(var(--color-primary)/5%)_35%,--alpha(var(--color-primary)/10%)_40%,--alpha(var(--color-primary)/0%)_80%,--alpha(var(--color-primary)/5%))] hover:[background-position:40px_0]"
      >
        <span className="mt-0.5 transition-transform group-hover:translate-x-2">
          View collection
        </span>
        <BaseIcon
          icon={CaretRightIcon}
          size="md"
          weight="regular"
          className="transition-transform group-hover:translate-x-2"
        />
      </Link>
    </div>
  )
}
