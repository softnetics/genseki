import {
  ArrowDownIcon,
  ArrowUpIcon,
  CircleIcon,
  DiscordLogoIcon,
  GithubLogoIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react'

import { Badge } from '@genseki/ui'

import { PlaygroundCard } from '~/src/components/card'

const INTENTS = ['gray', 'brand', 'blue', 'red', 'yellow', 'green', 'purple', 'cyan'] as const

function BadgeStatusDot() {
  return (
    <div className="flex flex-wrap gap-2">
      {INTENTS.map((intent) => (
        <Badge key={intent} intent={intent} leftIcon={<CircleIcon weight="fill" />}>
          {intent.charAt(0).toUpperCase() + intent.slice(1)}
        </Badge>
      ))}
    </div>
  )
}

function BadgeAvatar() {
  return (
    <div className="flex flex-wrap gap-2">
      {INTENTS.map((intent) => (
        <Badge
          key={intent}
          intent={intent}
          leftIcon={
            <img
              src="https://i.pravatar.cc/24"
              alt="avatar"
              className="rounded-full object-cover size-full"
            />
          }
        >
          {intent.charAt(0).toUpperCase() + intent.slice(1)}
        </Badge>
      ))}
    </div>
  )
}

function BadgeIntents() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge intent="gray">Gray</Badge>
      <Badge intent="brand">Brand</Badge>
      <Badge intent="blue">Blue</Badge>
      <Badge intent="red">Red</Badge>
      <Badge intent="yellow">Yellow</Badge>
      <Badge intent="green">Green</Badge>
      <Badge intent="purple">Purple</Badge>
      <Badge intent="cyan">Cyan</Badge>
    </div>
  )
}

function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm" intent="brand">
        Small
      </Badge>
      <Badge size="md" intent="brand">
        Medium
      </Badge>
      <Badge size="lg" intent="brand">
        Large
      </Badge>
    </div>
  )
}

function BadgeShapes() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge shape="circle" intent="green">
        Circle
      </Badge>
      <Badge shape="square" intent="green">
        Square
      </Badge>
    </div>
  )
}

function BadgeLeftIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm" intent="blue" leftIcon={<CircleIcon weight="fill" />}>
        Small
      </Badge>
      <Badge size="md" intent="blue" leftIcon={<CircleIcon weight="fill" />}>
        Medium
      </Badge>
      <Badge size="lg" intent="blue" leftIcon={<CircleIcon weight="fill" />}>
        Large
      </Badge>
    </div>
  )
}

function BadgeRightIcon() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm" intent="red" rightIcon={<XIcon />}>
        Small
      </Badge>
      <Badge size="md" intent="red" rightIcon={<XIcon />}>
        Medium
      </Badge>
      <Badge size="lg" intent="red" rightIcon={<XIcon />}>
        Large
      </Badge>
    </div>
  )
}

function BadgeBothIcons() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm" intent="purple" leftIcon={<ArrowUpIcon />} rightIcon={<ArrowDownIcon />}>
        Small
      </Badge>
      <Badge size="md" intent="purple" leftIcon={<ArrowUpIcon />} rightIcon={<ArrowDownIcon />}>
        Medium
      </Badge>
      <Badge size="lg" intent="purple" leftIcon={<ArrowUpIcon />} rightIcon={<ArrowDownIcon />}>
        Large
      </Badge>
    </div>
  )
}

function BadgeAllIntentsLeftIcon() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge intent="gray" leftIcon={<DiscordLogoIcon />}>
        Gray
      </Badge>
      <Badge intent="brand" leftIcon={<DiscordLogoIcon />}>
        Brand
      </Badge>
      <Badge intent="blue" leftIcon={<DiscordLogoIcon />}>
        Blue
      </Badge>
      <Badge intent="red" leftIcon={<DiscordLogoIcon />}>
        Red
      </Badge>
      <Badge intent="yellow" leftIcon={<DiscordLogoIcon />}>
        Yellow
      </Badge>
      <Badge intent="green" leftIcon={<DiscordLogoIcon />}>
        Green
      </Badge>
      <Badge intent="purple" leftIcon={<DiscordLogoIcon />}>
        Purple
      </Badge>
      <Badge intent="cyan" leftIcon={<DiscordLogoIcon />}>
        Cyan
      </Badge>
    </div>
  )
}

function BadgeAllIntentsRightIcon() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge intent="gray" rightIcon={<GithubLogoIcon />}>
        Gray
      </Badge>
      <Badge intent="brand" rightIcon={<GithubLogoIcon />}>
        Brand
      </Badge>
      <Badge intent="blue" rightIcon={<GithubLogoIcon />}>
        Blue
      </Badge>
      <Badge intent="red" rightIcon={<GithubLogoIcon />}>
        Red
      </Badge>
      <Badge intent="yellow" rightIcon={<GithubLogoIcon />}>
        Yellow
      </Badge>
      <Badge intent="green" rightIcon={<GithubLogoIcon />}>
        Green
      </Badge>
      <Badge intent="purple" rightIcon={<GithubLogoIcon />}>
        Purple
      </Badge>
      <Badge intent="cyan" rightIcon={<GithubLogoIcon />}>
        Cyan
      </Badge>
    </div>
  )
}

function BadgeCloseDismiss() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge intent="gray" rightIcon={<XIcon />}>
        Gray
      </Badge>
      <Badge intent="brand" rightIcon={<XIcon />}>
        Brand
      </Badge>
      <Badge intent="blue" rightIcon={<XIcon />}>
        Blue
      </Badge>
      <Badge intent="red" rightIcon={<XIcon />}>
        Red
      </Badge>
      <Badge intent="yellow" rightIcon={<XIcon />}>
        Yellow
      </Badge>
      <Badge intent="green" rightIcon={<XIcon />}>
        Green
      </Badge>
      <Badge intent="purple" rightIcon={<XIcon />}>
        Purple
      </Badge>
      <Badge intent="cyan" rightIcon={<XIcon />}>
        Cyan
      </Badge>
    </div>
  )
}

function BadgeTrending() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge intent="green" leftIcon={<ArrowUpIcon />}>
        Trending up
      </Badge>
      <Badge intent="red" leftIcon={<ArrowDownIcon />}>
        Trending down
      </Badge>
      <Badge intent="gray" leftIcon={<TrashIcon />}>
        Deleted
      </Badge>
    </div>
  )
}

export function BadgeSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Intents" categoryTitle="Component">
        <BadgeIntents />
      </PlaygroundCard>

      <PlaygroundCard title="Status Dot" categoryTitle="Component">
        <BadgeStatusDot />
      </PlaygroundCard>

      <PlaygroundCard title="Avatar Icon" categoryTitle="Component">
        <BadgeAvatar />
      </PlaygroundCard>

      <PlaygroundCard title="Sizes" categoryTitle="Component">
        <BadgeSizes />
      </PlaygroundCard>

      <PlaygroundCard title="Shapes" categoryTitle="Component">
        <BadgeShapes />
      </PlaygroundCard>

      <PlaygroundCard title="Left Icon" categoryTitle="Component">
        <BadgeLeftIcon />
      </PlaygroundCard>

      <PlaygroundCard title="Right Icon" categoryTitle="Component">
        <BadgeRightIcon />
      </PlaygroundCard>

      <PlaygroundCard title="Both Icons" categoryTitle="Component">
        <BadgeBothIcons />
      </PlaygroundCard>

      <PlaygroundCard title="All Intents — Left Icon" categoryTitle="Component">
        <BadgeAllIntentsLeftIcon />
      </PlaygroundCard>

      <PlaygroundCard title="All Intents — Right Icon" categoryTitle="Component">
        <BadgeAllIntentsRightIcon />
      </PlaygroundCard>

      <PlaygroundCard title="Close / Dismiss" categoryTitle="Composition">
        <BadgeCloseDismiss />
      </PlaygroundCard>

      <PlaygroundCard title="Trending" categoryTitle="Composition">
        <BadgeTrending />
      </PlaygroundCard>
    </div>
  )
}
