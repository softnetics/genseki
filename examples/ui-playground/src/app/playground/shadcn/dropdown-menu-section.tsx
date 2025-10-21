import React from 'react'

import {
  CopyIcon,
  DotsThreeIcon,
  DotsThreeVerticalIcon,
  DownloadIcon,
  FolderIcon,
  HeartIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  UserIcon,
} from '@phosphor-icons/react'

import { Button } from '@genseki/react/v2'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Typography,
} from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Dropdown Menu
function BasicDropdown() {
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PencilIcon />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HeartIcon />
            Favorites
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Dropdown with Icons and Shortcuts
function DropdownWithIconsAndShortcuts() {
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <DotsThreeIcon />
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Copy
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            Share
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DownloadIcon />
            Download
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Dropdown with Groups
function DropdownWithGroups() {
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">File Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>File Operations</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <PencilIcon />
              New File
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FolderIcon />
              Open Folder
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadIcon />
              Save As
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Export</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <ShareIcon />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadIcon />
              Export as Image
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Dropdown with Checkboxes
function DropdownWithCheckboxes() {
  const [showStatusBar, setShowStatusBar] = React.useState(true)
  const [showPanel, setShowPanel] = React.useState(false)
  const [showSidebar, setShowSidebar] = React.useState(true)

  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">View Options</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            onSelect={(e) => {
              e.preventDefault()
            }}
            checked={showStatusBar}
            onCheckedChange={setShowStatusBar}
          >
            Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onSelect={(e) => {
              e.preventDefault()
            }}
            checked={showPanel}
            onCheckedChange={setShowPanel}
          >
            Panel
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onSelect={(e) => {
              e.preventDefault()
            }}
            checked={showSidebar}
            onCheckedChange={setShowSidebar}
          >
            Sidebar
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Dropdown with Radio Items
function DropdownWithRadioItems() {
  const [theme, setTheme] = React.useState('light')

  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Theme: {theme}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Dropdown with Submenus
function DropdownWithSubmenus() {
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">More Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ShareIcon />
              Share
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Twitter</DropdownMenuItem>
              <DropdownMenuItem>LinkedIn</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// Context Menu Style
function ContextMenuStyle() {
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <DotsThreeVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ShareIcon />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function DropdownMenuSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Dropdown Menu" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple dropdown menu with basic menu items and separators.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <BasicDropdown />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Dropdown with Icons and Shortcuts" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Dropdown menus can include icons and keyboard shortcuts for better UX.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <DropdownWithIconsAndShortcuts />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Dropdown with Groups" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Organize menu items into logical groups with labels and separators.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <DropdownWithGroups />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Dropdown with Checkboxes" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Interactive checkboxes for toggleable options within dropdown menus.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <DropdownWithCheckboxes />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Dropdown with Radio Items" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Radio button groups for selecting one option from multiple choices.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <DropdownWithRadioItems />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Dropdown with Submenus" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Nested dropdown menus for organizing complex menu structures.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <DropdownWithSubmenus />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Context Menu Style" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A compact dropdown menu suitable for context menus and action buttons.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <ContextMenuStyle />
        </div>
      </PlaygroundCard>
    </div>
  )
}
