'use client'
import { createContext, use } from 'react'
import type { BreadcrumbProps, BreadcrumbsProps, LinkProps } from 'react-aria-components'
import { Breadcrumb, Breadcrumbs as BreadcrumbsPrimitive } from 'react-aria-components'

import { IconChevronLgRight } from '@intentui/icons'
import { twMerge } from 'tailwind-merge'

import { AriaLink } from './link'
import { composeTailwindRenderProps } from './primitive'

interface BreadcrumbsContextProps {
  separator?: 'chevron' | 'slash' | boolean
}

const BreadcrumbsProvider = createContext<BreadcrumbsContextProps>({
  separator: 'slash',
})

const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T> & BreadcrumbsContextProps) => {
  return (
    <BreadcrumbsProvider value={{ separator: props.separator }}>
      <BreadcrumbsPrimitive {...props} className={twMerge('flex items-center gap-2', className)} />
    </BreadcrumbsProvider>
  )
}

interface BreadcrumbsItemProps extends BreadcrumbProps, BreadcrumbsContextProps {
  href?: string
  trailing?: React.ReactNode
}

const BreadcrumbsItem = ({
  href,
  separator = true,
  trailing,
  className,
  ...props
}: BreadcrumbsItemProps & Partial<Omit<LinkProps, 'className'>>) => {
  const { separator: contextSeparator } = use(BreadcrumbsProvider)
  separator = contextSeparator ?? separator
  const separatorValue = separator === true ? 'slash' : separator

  return (
    <Breadcrumb
      {...props}
      className={composeTailwindRenderProps(
        className,
        'flex items-center gap-2 text-base font-medium'
      )}
    >
      {({ isCurrent }) => (
        <>
          <AriaLink href={href} {...props} />
          {trailing}
          {!isCurrent && separator !== false && <Separator separator={separatorValue} />}
        </>
      )}
    </Breadcrumb>
  )
}

const Separator = ({ separator = 'slash' }: { separator?: BreadcrumbsItemProps['separator'] }) => {
  return (
    <span className="*:text-text-muted-fg *:shrink-0 *:data-[slot=icon]:size-3.5">
      {separator === 'chevron' && <IconChevronLgRight />}
      {separator === 'slash' && <span className="text-bluegray-400">/</span>}
    </span>
  )
}

export type { BreadcrumbsItemProps, BreadcrumbsProps }
export { Breadcrumbs, BreadcrumbsItem }
