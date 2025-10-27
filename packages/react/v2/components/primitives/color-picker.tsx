'use client'
import {
  type ComponentProps,
  type HTMLAttributes,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { EyedropperIcon } from '@phosphor-icons/react'
import * as Slider from '@radix-ui/react-slider'
import Color from 'color'

import { Button } from './button'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Typography } from './typography'

import { createRequiredContext } from '../../../src/react/hooks/create-required-context'
import { cn } from '../../../src/react/utils/cn'

interface ColorPickerContextValue {
  hue: number
  saturation: number
  lightness: number
  alpha: number
  mode: string
  setHue: (hue: number) => void
  setSaturation: (saturation: number) => void
  setLightness: (lightness: number) => void
  setAlpha: (alpha: number) => void
  setMode: (mode: string) => void
}

export const [ColorPickerContextProvider, useColorPicker] =
  createRequiredContext<ColorPickerContextValue>('Color picker context')

export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
  value?: Parameters<typeof Color>[0]
  defaultValue?: Parameters<typeof Color>[0]
  onChange?: (value: Parameters<typeof Color.rgb>[0]) => void
}
export const ColorPicker = ({
  value,
  defaultValue = '#000000',
  onChange,
  className,
  ...props
}: ColorPickerProps) => {
  // Handle controlled vs uncontrolled
  const currentValue = value !== undefined ? value : defaultValue
  const initialColor = Color(currentValue)

  const [hue, setHue] = useState(() => {
    try {
      return initialColor.hue() || 0
    } catch {
      return 0
    }
  })
  const [saturation, setSaturation] = useState(() => {
    try {
      return initialColor.saturationl() || 100
    } catch {
      return 100
    }
  })
  const [lightness, setLightness] = useState(() => {
    try {
      return initialColor.lightness() || 50
    } catch {
      return 50
    }
  })
  const [alpha, setAlpha] = useState(() => {
    try {
      return initialColor.alpha() * 100 || 100
    } catch {
      return 100
    }
  })
  const [mode, setMode] = useState('hex')
  const isInitialMount = useRef(true)

  // Update color when controlled value changes
  useEffect(() => {
    if (value !== undefined && !isInitialMount.current) {
      try {
        const color = Color(value)
        setHue(color.hue() || 0)
        setSaturation(color.saturationl() || 100)
        setLightness(color.lightness() || 50)
        setAlpha(color.alpha() * 100 || 100)
      } catch (error) {
        console.error('Failed to parse color value:', error)
      }
    }
  }, [value])

  // Notify parent of changes (skip initial mount)
  useEffect(() => {
    if (onChange && !isInitialMount.current) {
      const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100)
      const rgba = color.rgb().array()
      onChange([rgba[0], rgba[1], rgba[2], alpha / 100])
    }
    isInitialMount.current = false
  }, [hue, saturation, lightness, alpha, onChange])
  return (
    <ColorPickerContextProvider
      hue={hue}
      saturation={saturation}
      lightness={lightness}
      alpha={alpha}
      mode={mode}
      setHue={setHue}
      setSaturation={setSaturation}
      setLightness={setLightness}
      setAlpha={setAlpha}
      setMode={setMode}
    >
      <div className={cn('flex size-full flex-col gap-8', className)} {...props} />
    </ColorPickerContextProvider>
  )
}
export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>
export const ColorPickerSelection = memo(({ className, ...props }: ColorPickerSelectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const { hue, setSaturation, setLightness } = useColorPicker()
  const backgroundGradient = useMemo(() => {
    return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`
  }, [hue])
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!(isDragging && containerRef.current)) {
        return
      }
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
      setPositionX(x)
      setPositionY(y)
      setSaturation(x * 100)
      const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x)
      const lightness = topLightness * (1 - y)
      setLightness(lightness)
    },
    [isDragging, setSaturation, setLightness]
  )
  useEffect(() => {
    const handlePointerUp = () => setIsDragging(false)
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDragging, handlePointerMove])
  return (
    <div
      className={cn('relative size-full min-h-40 cursor-crosshair rounded', className)}
      onPointerDown={(e) => {
        e.preventDefault()
        setIsDragging(true)
        handlePointerMove(e.nativeEvent)
      }}
      ref={containerRef}
      style={{
        background: backgroundGradient,
      }}
      {...props}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-8 w-8 rounded-full border-4 border-white"
        style={{
          left: `${positionX * 100}%`,
          top: `${positionY * 100}%`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  )
})
ColorPickerSelection.displayName = 'ColorPickerSelection'

export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>

export const ColorPickerHue = ({ className, ...props }: ColorPickerHueProps) => {
  const { hue, setHue } = useColorPicker()
  return (
    <Slider.Root
      className={cn('relative flex h-8 w-full touch-none', className)}
      max={360}
      onValueChange={([hue]) => setHue(hue)}
      step={1}
      value={[hue]}
      {...props}
    >
      <Slider.Track className="relative my-1 h-6 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Slider.Range className="absolute h-full" />
      </Slider.Track>
      <Slider.Thumb className="block h-8 w-8 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  )
}
export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>

export const ColorPickerAlpha = ({ className, ...props }: ColorPickerAlphaProps) => {
  const { alpha, setAlpha } = useColorPicker()
  return (
    <Slider.Root
      className={cn('relative flex h-8 w-full touch-none', className)}
      max={100}
      onValueChange={([alpha]) => setAlpha(alpha)}
      step={1}
      value={[alpha]}
      {...props}
    >
      <Slider.Track
        className="relative my-1 h-6 w-full grow rounded-full"
        style={{
          background:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-black/50" />
        <Slider.Range className="absolute h-full rounded-full bg-transparent" />
      </Slider.Track>
      <Slider.Thumb className="block h-8 w-8 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </Slider.Root>
  )
}
export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>
export const ColorPickerEyeDropper = ({ className, ...props }: ColorPickerEyeDropperProps) => {
  const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker()
  const handleEyeDropper = async () => {
    try {
      // @ts-expect-error - EyeDropper API is experimental
      const eyeDropper = new EyeDropper()
      const result = await eyeDropper.open()
      const color = Color(result.sRGBHex)
      const [h, s, l] = color.hsl().array()
      setHue(h)
      setSaturation(s)
      setLightness(l)
      setAlpha(100)
    } catch (error) {
      console.error('EyeDropper failed:', error)
    }
  }
  return (
    <Button
      className={cn('shrink-0 text-muted-foreground', className)}
      onClick={handleEyeDropper}
      size="icon"
      variant="outline"
      type="button"
      {...props}
    >
      <EyedropperIcon size={16} />
    </Button>
  )
}

const formats = ['hex', 'rgb', 'css', 'hsl']

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>

export const ColorPickerOutput = ({ className, ...props }: ColorPickerOutputProps) => {
  const { mode, setMode } = useColorPicker()

  return (
    <Select onValueChange={setMode} value={mode}>
      <SelectTrigger className={cn('w-40 shrink-0 ', className)} {...props}>
        <SelectValue placeholder="Mode" asChild>
          <Typography className="text-sm">{mode.toUpperCase()}</Typography>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => (
          <SelectItem className="text-sm" key={format} value={format}>
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
type PercentageInputProps = ComponentProps<typeof Input>
const PercentageInput = ({ className, ...props }: PercentageInputProps) => {
  return (
    <div className="relative">
      <Input
        readOnly
        type="text"
        {...props}
        className={cn(
          'w-[3.25rem] rounded-l-none bg-secondary px-4 text-sm shadow-none',
          className
        )}
      />
      <span className="-translate-y-1/2 absolute top-1/2 right-4 text-muted-foreground text-sm">
        %
      </span>
    </div>
  )
}
export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>
export const ColorPickerFormat = ({ className, ...props }: ColorPickerFormatProps) => {
  const { hue, saturation, lightness, alpha, mode } = useColorPicker()
  const color = Color.hsl(hue, saturation, lightness, alpha / 100)
  if (mode === 'hex') {
    const hex = color.hex()
    return (
      <div
        className={cn(
          '-space-x-px relative flex w-full items-center rounded-md shadow-sm',
          className
        )}
        {...props}
      >
        <Input
          className="rounded-r-none bg-secondary px-4 text-sm shadow-none focus:z-10"
          readOnly
          type="text"
          value={hex}
        />
        <PercentageInput value={alpha} className="focus:z-10" />
      </div>
    )
  }
  if (mode === 'rgb') {
    const rgb = color
      .rgb()
      .array()
      .map((value) => Math.round(value))
    return (
      <div
        className={cn('-space-x-px flex items-center rounded-md shadow-sm', className)}
        {...props}
      >
        {rgb.map((value, index) => (
          <Input
            className={cn(
              'rounded-r-none bg-secondary px-4 text-sm shadow-none focus:z-10',
              index && 'rounded-l-none',
              className
            )}
            key={index}
            readOnly
            type="text"
            value={value}
          />
        ))}
        <PercentageInput value={alpha} />
      </div>
    )
  }
  if (mode === 'css') {
    const rgb = color
      .rgb()
      .array()
      .map((value) => Math.round(value))
    return (
      <div className={cn('w-full rounded-md shadow-sm', className)} {...props}>
        <Input
          className="w-full bg-secondary px-4 text-sm shadow-none focus:z-10"
          readOnly
          type="text"
          value={`rgba(${rgb.join(', ')}, ${alpha}%)`}
          {...props}
        />
      </div>
    )
  }
  if (mode === 'hsl') {
    const hsl = color
      .hsl()
      .array()
      .map((value) => Math.round(value))
    return (
      <div
        className={cn('-space-x-px flex items-center rounded-md shadow-sm', className)}
        {...props}
      >
        {hsl.map((value, index) => (
          <Input
            className={cn(
              'rounded-r-none bg-secondary px-4 text-sm shadow-none focus:z-10',
              index && 'rounded-l-none',
              className
            )}
            key={index}
            readOnly
            type="text"
            value={value}
          />
        ))}
        <PercentageInput value={alpha} />
      </div>
    )
  }
  return null
}
