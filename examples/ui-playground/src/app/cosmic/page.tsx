'use client'

import { useState } from 'react'

import {
  ArrowRight,
  Check,
  Download,
  Edit,
  Heart,
  Plus,
  Settings,
  Star,
  Trash2,
  Upload,
  X,
} from 'lucide-react'

import { Button } from '@genseki/theme/cosmic'

export default function CosmicPlayground() {
  const [loading, setLoading] = useState(false)

  const handleLoadingDemo = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Cosmic Theme Playground</h1>
          <p className="text-lg text-muted-foreground">
            Explore the cosmic-themed button component with various variants and sizes
          </p>
        </div>

        {/* Button Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Button Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Primary</h3>
              <div className="space-y-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="primary" size="sm">
                  Small Primary
                </Button>
                <Button variant="primary" size="lg">
                  Large Primary
                </Button>
                <Button variant="primary" leadingIcon={<Plus />}>
                  With Icon
                </Button>
                <Button variant="primary" loading={loading} onClick={handleLoadingDemo}>
                  Loading Demo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Secondary</h3>
              <div className="space-y-3">
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="secondary" size="sm">
                  Small Secondary
                </Button>
                <Button variant="secondary" size="lg">
                  Large Secondary
                </Button>
                <Button variant="secondary" leadingIcon={<Settings />}>
                  With Icon
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Tertiary</h3>
              <div className="space-y-3">
                <Button variant="tertiary">Tertiary Button</Button>
                <Button variant="tertiary" size="sm">
                  Small Tertiary
                </Button>
                <Button variant="tertiary" size="lg">
                  Large Tertiary
                </Button>
                <Button variant="tertiary" leadingIcon={<Edit />}>
                  With Icon
                </Button>
                <Button variant="tertiary" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Outline</h3>
              <div className="space-y-3">
                <Button variant="outline">Outline Button</Button>
                <Button variant="outline" size="sm">
                  Small Outline
                </Button>
                <Button variant="outline" size="lg">
                  Large Outline
                </Button>
                <Button variant="outline" leadingIcon={<Download />}>
                  With Icon
                </Button>
                <Button variant="outline" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Ghost</h3>
              <div className="space-y-3">
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="ghost" size="sm">
                  Small Ghost
                </Button>
                <Button variant="ghost" size="lg">
                  Large Ghost
                </Button>
                <Button variant="ghost" leadingIcon={<Heart />}>
                  With Icon
                </Button>
                <Button variant="ghost" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Destructive</h3>
              <div className="space-y-3">
                <Button variant="destructive">Destructive Button</Button>
                <Button variant="destructive" size="sm">
                  Small Destructive
                </Button>
                <Button variant="destructive" size="lg">
                  Large Destructive
                </Button>
                <Button variant="destructive" leadingIcon={<Trash2 />}>
                  With Icon
                </Button>
                <Button variant="destructive" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Special Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Special Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Naked</h3>
              <div className="space-y-3">
                <Button variant="naked">Naked Button</Button>
                <Button variant="naked" size="sm">
                  Small Naked
                </Button>
                <Button variant="naked" size="lg">
                  Large Naked
                </Button>
                <Button variant="naked" leadingIcon={<Upload />}>
                  With Icon
                </Button>
                <Button variant="naked" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Vanish</h3>
              <div className="space-y-3">
                <Button variant="vanish">Vanish Button</Button>
                <Button variant="vanish" size="sm">
                  Small Vanish
                </Button>
                <Button variant="vanish" size="lg">
                  Large Vanish
                </Button>
                <Button variant="vanish" leadingIcon={<Star />}>
                  With Icon
                </Button>
                <Button variant="vanish" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Size Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Size Variants</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="xxs">
                XXS
              </Button>
              <Button variant="primary" size="xs">
                XS
              </Button>
              <Button variant="primary" size="sm">
                SM
              </Button>
              <Button variant="primary" size="md">
                MD
              </Button>
              <Button variant="primary" size="lg">
                LG
              </Button>
              <Button variant="primary" size="square-petite">
                Square
              </Button>
            </div>
          </div>
        </section>

        {/* Icon Combinations */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Icon Combinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Button variant="primary" leadingIcon={<Plus />}>
                Add Item
              </Button>
              <Button variant="secondary" leadingIcon={<Download />}>
                Download
              </Button>
              <Button variant="outline" leadingIcon={<Upload />}>
                Upload
              </Button>
            </div>
            <div className="space-y-3">
              <Button variant="primary" trailingIcon={<ArrowRight />}>
                Continue
              </Button>
              <Button variant="secondary" trailingIcon={<Check />}>
                Confirm
              </Button>
              <Button variant="outline" trailingIcon={<X />}>
                Cancel
              </Button>
            </div>
            <div className="space-y-3">
              <Button variant="primary" leadingIcon={<Settings />} trailingIcon={<ArrowRight />}>
                Settings
              </Button>
              <Button variant="secondary" leadingIcon={<Edit />} trailingIcon={<Check />}>
                Edit & Save
              </Button>
              <Button variant="destructive" leadingIcon={<Trash2 />} trailingIcon={<X />}>
                Delete
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Interactive Demo</h2>
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Click the buttons below to see different states and interactions:
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" onClick={() => alert('Primary clicked!')}>
                  Click Me
                </Button>
                <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
                  Secondary Action
                </Button>
                <Button variant="outline" onClick={() => alert('Outline clicked!')}>
                  Outline Action
                </Button>
                <Button variant="destructive" onClick={() => alert('Destructive clicked!')}>
                  Destructive Action
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Usage Examples</h2>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium text-foreground mb-2">Basic Usage</h3>
              <code className="text-sm text-muted-foreground">
                {`import { Button } from '@genseki/theme'

<Button variant="primary" size="md">
  Click me
</Button>`}
              </code>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium text-foreground mb-2">With Icons</h3>
              <code className="text-sm text-muted-foreground">
                {`<Button 
  variant="primary" 
  leadingIcon={<Plus />}
  trailingIcon={<ArrowRight />}
>
  Add Item
</Button>`}
              </code>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="text-sm font-medium text-foreground mb-2">Loading State</h3>
              <code className="text-sm text-muted-foreground">
                {`<Button 
  variant="primary" 
  loading={isLoading}
  onClick={handleSubmit}
>
  Submit
</Button>`}
              </code>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
