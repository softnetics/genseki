'use client'

import {
  ProgressBar as ProgressBarPrimitive,
  type ProgressBarProps as ProgressBarPrimitiveProps,
} from 'react-aria-components'

import { motion } from 'motion/react'

import { AriaLabel } from './field'
import { composeTailwindRenderProps } from './primitive'

interface ProgressBarProps extends ProgressBarPrimitiveProps {
  label?: string
  ref?: React.RefObject<HTMLDivElement>
  isShowPercent?: boolean
  isShowPercentPopup?: boolean
}

const ProgressBar = ({
  label,
  ref,
  className,
  isShowPercent = false,
  isShowPercentPopup = false,
  ...props
}: ProgressBarProps) => {
  return (
    <ProgressBarPrimitive
      ref={ref}
      className={composeTailwindRenderProps(className, 'flex items-center gap-6 relative')}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <div className="-outline-offset-1 relative mt-1 h-4 min-w-64 w-full overflow-hidden rounded-full bg-secondary outline-1 outline-transparent">
            {!isIndeterminate ? (
              <motion.div
                data-slot="progress-content"
                className={`absolute top-0 left-0 h-full rounded-full bg-primary forced-colors:bg-[Highlight] ${
                  percentage === 100 ? 'bg-success' : 'bg-primary'
                }`}
                initial={{ width: '0%' }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            ) : (
              <motion.div
                data-slot="progress-content"
                className="absolute top-0 h-full rounded-full bg-primary forced-colors:bg-[Highlight]"
                initial={{ left: '0%', width: '40%' }}
                animate={{ left: ['0%', '100%', '0%'] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: 'easeInOut',
                }}
              />
            )}
          </div>

          {/* percent popup */}
          {isShowPercentPopup && (
            <div
              className={`absolute -top-20 bg-white rounded-md text-base shrink-0 border border-bluegray-300 shadow px-6 py-4 -translate-x-1/2`}
              style={{
                left: `${(percentage ?? 0) / 2}%`,
              }}
            >
              <span className="text-muted-fg text-sm tabular-nums">{valueText}</span>
            </div>
          )}

          {/* percent */}
          {isShowPercent && (
            <div className="flex justify-between gap-2">
              {label && <AriaLabel>{label}</AriaLabel>}
              <span className="text-muted-fg text-sm tabular-nums">{valueText}</span>
            </div>
          )}
        </>
      )}
    </ProgressBarPrimitive>
  )
}

export type { ProgressBarProps }
export { ProgressBar }
