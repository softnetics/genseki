'use client'

import { UserIcon } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

interface AvatarProps {
  src?: string | null
  initials?: string
  alt?: string
  label?: string
  subLabel?: string
  className?: string
  isSquare?: boolean
  isShowIndicator?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Avatar = ({
  src = null,
  isSquare = false,
  size = 'md',
  initials,
  alt = '',
  label,
  subLabel,
  className,
  isShowIndicator = false,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<'span'>) => {
  const indicatorSize = {
    xs: 'size-3',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
    xl: 'size-7',
  }
  const avatarSize = {
    xs: 'size-8',
    sm: 'size-10',
    md: 'size-12',
    lg: 'size-14',
    xl: 'size-15',
  }
  return (
    <div className="flex items-center gap-4">
      <span
        data-slot="avatar"
        {...props}
        className={twMerge(
          '-outline-offset-1 inline-grid shrink-0 align-middle outline-1 outline-fg/(--ring-opacity) [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1 border border-bluegray-300 relative',
          size === 'xs' && 'size-12',
          size === 'sm' && 'size-16',
          size === 'md' && 'size-20',
          size === 'lg' && 'size-24',
          size === 'xl' && 'size-28',
          isSquare
            ? 'rounded-(--avatar-radius) *:rounded-(--avatar-radius)'
            : 'rounded-full *:rounded-full',
          className
        )}
      >
        {isShowIndicator && (
          <div
            className={twMerge(
              'absolute bottom-0 right-0 bg-palm-500 rounded-full z-10 border border-white shrink-0',
              indicatorSize[size]
            )}
          />
        )}
        {initials && (
          <svg
            className="size-full select-none fill-current p-[5%] font-md text-[48px] uppercase"
            viewBox="0 0 100 100"
            aria-hidden={alt ? undefined : 'true'}
          >
            {alt && <title>{alt}</title>}
            <text
              x="50%"
              y="50%"
              alignmentBaseline="middle"
              dominantBaseline="middle"
              textAnchor="middle"
              dy=".125em"
            >
              {initials}
            </text>
          </svg>
        )}
        {src ? (
          <img className="size-full object-cover object-center" src={src} alt={alt} />
        ) : (
          <div className="flex items-center justify-center">
            <UserIcon
              className={twMerge('object-cover object-center text-bluegray-400', avatarSize[size])}
            />
          </div>
        )}
      </span>
      {(label || subLabel) && (
        <div className="flex flex-col">
          {label && <p className="text-base font-medium text-muted-fg">{label}</p>}
          {subLabel && <p className="text-sm text-bluegray-400">{subLabel}</p>}
        </div>
      )}
    </div>
  )
}

export type { AvatarProps }
export { Avatar }
