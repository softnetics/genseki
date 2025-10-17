'use client'

import React, { use } from 'react'
import {
  ColorPicker as ColorPickerPrimitive,
  type ColorPickerProps as ColorPickerPrimitiveProps,
  ColorPickerStateContext,
} from 'react-aria-components'

import { EyedropperIcon } from '@phosphor-icons/react'
import { parseColor } from '@react-stately/color'
import { twMerge } from 'tailwind-merge'

import { Button } from './button'
import { ColorArea } from './color-area'
import { ColorField } from './color-field'
import { ColorSlider } from './color-slider'
import { ColorSwatch } from './color-swatch'
import { Description } from './field'
import { Popover, PopoverContent, type PopoverContentProps } from './popover'

import { BaseIcon } from '../../components/primitives/base-icon'
import { cn } from '../../utils/cn'

interface ColorPickerProps
  extends ColorPickerPrimitiveProps,
    Pick<PopoverContentProps, 'placement'> {
  label?: React.ReactNode
  className?: string
  children?: React.ReactNode
  showArrow?: boolean
  isDisabled?: boolean
  description?: string
  eyeDropper?: boolean
  buttonClassName?: string
  onPopupOpenChange?: (open: boolean) => void
}

const ColorPicker = ({
  showArrow = false,
  placement = 'bottom start',
  label,
  isDisabled,
  children,
  description,
  eyeDropper,
  className,
  buttonClassName,
  onPopupOpenChange,
  ...props
}: ColorPickerProps) => {
  return (
    <div className={twMerge('flex flex-col items-start gap-y-4', className)}>
      <ColorPickerPrimitive {...props}>
        <Popover
          onOpenChange={(open) => {
            onPopupOpenChange?.(open)
          }}
        >
          <Button
            isDisabled={isDisabled}
            size="md"
            variant="ghost"
            className={cn(
              '*:data-[slot=color-swatch]:mx-0 w-auto gap-x-4 duration-150 ease-out transition-all',
              buttonClassName
            )}
          >
            <ColorSwatch className="size-14" />
            {label && label}
          </Button>
          <PopoverContent
            className="overflow-auto **:data-[slot=color-area]:w-full **:data-[slot=color-slider]:w-full sm:min-w-min sm:max-w-96 sm:**:data-[slot=color-area]:size-96 *:[[role=dialog]]:p-4 sm:*:[[role=dialog]]:p-2"
            showArrow={showArrow}
            placement={placement}
          >
            <div className="flex flex-col gap-y-1.5">
              {children || (
                <>
                  <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
                  <div className="px-3 pb-3">
                    <ColorSlider
                      showOutput={true}
                      colorSpace="hsb"
                      channel="hue"
                      className="pt-4 pb-8"
                    />
                    <div className="flex items-center gap-1.5">
                      {eyeDropper && <EyeDropper />}
                      <ColorField className="h-auto" aria-label="Hex" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </ColorPickerPrimitive>
      {description && <Description>{description}</Description>}
    </div>
  )
}

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
  }
}

const EyeDropper = () => {
  const state = use(ColorPickerStateContext)!

  if (!window.EyeDropper) {
    return 'EyeDropper is not supported in your browser.'
  }

  return (
    <Button
      aria-label="Eye dropper"
      size="md"
      variant="outline"
      onPress={() => {
        const eyeDropper = window.EyeDropper ? new window.EyeDropper() : null
        eyeDropper
          ?.open()
          .then((result) => state.setColor(parseColor(result.sRGBHex)))
          .catch((error) => {
            error instanceof Error && console.log(error.message)
          })
      }}
    >
      <BaseIcon icon={EyedropperIcon} size="sm" weight="duotone" />
    </Button>
  )
}

export type { ColorPickerProps }
export { ColorPicker, EyeDropper }
