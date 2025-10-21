import React from 'react'

import {
  CaretDownIcon,
  CaretRightIcon,
  FileIcon,
  FolderIcon,
  FolderOpenIcon,
  ImageIcon,
  MusicNoteIcon,
  VideoIcon,
} from '@phosphor-icons/react'

import { Button, Typography } from '@genseki/react/v2'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Collapsible
function BasicCollapsible() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex flex-wrap gap-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {isOpen ? <CaretDownIcon /> : <CaretRightIcon />}
                Toggle Content
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="space-y-2 mt-4">
          <div className="rounded-md border px-4 py-3 ">
            This is the collapsible content that can be shown or hidden.
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// File Tree Style
function FileTreeStyle() {
  const [isDocumentsOpen, setIsDocumentsOpen] = React.useState(true)
  const [isImagesOpen, setIsImagesOpen] = React.useState(false)
  const [isVideosOpen, setIsVideosOpen] = React.useState(false)

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full space-y-2">
        <Collapsible open={isDocumentsOpen} onOpenChange={setIsDocumentsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 h-auto p-2">
              {isDocumentsOpen ? <FolderOpenIcon /> : <FolderIcon />}
              Documents
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 space-y-1">
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <FileIcon />
              report.pdf
            </div>
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <FileIcon />
              presentation.pptx
            </div>
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <FileIcon />
              notes.txt
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isImagesOpen} onOpenChange={setIsImagesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 h-auto p-2">
              {isImagesOpen ? <FolderOpenIcon /> : <FolderIcon />}
              Images
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 space-y-1">
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <ImageIcon />
              photo1.jpg
            </div>
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <ImageIcon />
              photo2.png
            </div>
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <ImageIcon />
              screenshot.png
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={isVideosOpen} onOpenChange={setIsVideosOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 h-auto p-2">
              {isVideosOpen ? <FolderOpenIcon /> : <FolderIcon />}
              Videos
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 space-y-1">
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <VideoIcon />
              tutorial.mp4
            </div>
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <VideoIcon />
              demo.mov
            </div>
            <div className="flex items-center gap-2 p-2  text-muted-foreground">
              <MusicNoteIcon />
              audio.mp3
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

// FAQ Style
function FAQStyle() {
  const [openItems, setOpenItems] = React.useState<string[]>([])

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const faqItems = [
    {
      id: '1',
      question: 'What is this component library?',
      answer:
        'This is a comprehensive React component library built with modern design principles and accessibility in mind.',
    },
    {
      id: '2',
      question: 'How do I install the components?',
      answer:
        'You can install the components using npm or yarn. Check the documentation for detailed installation instructions.',
    },
    {
      id: '3',
      question: 'Is it free to use?',
      answer:
        'Yes, this component library is open source and free to use in both personal and commercial projects.',
    },
  ]

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full space-y-4">
        {faqItems.map((item) => (
          <Collapsible
            key={item.id}
            open={openItems.includes(item.id)}
            onOpenChange={() => toggleItem(item.id)}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-auto p-4 text-left">
                <Typography className="font-medium">{item.question}</Typography>
                {openItems.includes(item.id) ? <CaretDownIcon /> : <CaretRightIcon />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 py-4">
              <Typography className="text-muted-foreground">{item.answer}</Typography>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}

// Settings Panel Style
function SettingTypographyelStyle() {
  const [openSections, setOpenSections] = React.useState<string[]>(['general'])

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    )
  }

  const settingsSections = [
    {
      id: 'general',
      title: 'General Settings',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Typography className="">Dark Mode</Typography>
            <Button variant="outline" size="sm">
              Toggle
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Typography className="">Notifications</Typography>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Typography className="">Language</Typography>
            <Button variant="outline" size="sm">
              English
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Typography className="">Two-Factor Authentication</Typography>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Typography className="">Data Export</Typography>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Typography className="">Account Deletion</Typography>
            <Button variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'advanced',
      title: 'Advanced Options',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Typography className="">Debug Mode</Typography>
            <Button variant="outline" size="sm">
              Off
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Typography className="">Cache Management</Typography>
            <Button variant="outline" size="sm">
              Clear
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Typography className="">Reset Settings</Typography>
            <Button variant="destructive" size="sm">
              Reset
            </Button>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full space-y-2">
        {settingsSections.map((section) => (
          <div key={section.id} className="border rounded-lg">
            <Collapsible
              open={openSections.includes(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-auto p-4 data-[state=open]:rounded-bl-none data-[state=open]:rounded-br-none"
                >
                  <Typography className="font-medium">{section.title}</Typography>
                  {openSections.includes(section.id) ? <CaretDownIcon /> : <CaretRightIcon />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pl-6 border-t border-border">
                {section.content}
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    </div>
  )
}

// Multiple Independent Collapsibles
function MultipleIndependentCollapsibles() {
  const [openStates, setOpenStates] = React.useState<Record<string, boolean>>({
    section1: false,
    section2: true,
    section3: false,
  })

  const toggleSection = (sectionId: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full space-y-4">
        <Collapsible open={openStates.section1} onOpenChange={() => toggleSection('section1')}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Section 1{openStates.section1 ? <CaretDownIcon /> : <CaretRightIcon />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="rounded-md border p-4">
              <p className="">
                This is the content for section 1. Each collapsible can be controlled independently.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openStates.section2} onOpenChange={() => toggleSection('section2')}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Section 2 (Open by default)
              {openStates.section2 ? <CaretDownIcon /> : <CaretRightIcon />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="rounded-md border p-4">
              <p className="">
                This section starts open by default. You can see how the state is managed
                independently.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openStates.section3} onOpenChange={() => toggleSection('section3')}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              Section 3{openStates.section3 ? <CaretDownIcon /> : <CaretRightIcon />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="rounded-md border p-4">
              <p className="">
                This is the third section. Notice how each collapsible maintains its own state.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}

export function CollapsibleSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Collapsible" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple collapsible component that can show or hide content.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <BasicCollapsible />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="File Tree Style" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Collapsible components styled like a file tree with folders and files.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <FileTreeStyle />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="FAQ Style" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Frequently asked questions styled as collapsible sections.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <FAQStyle />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Settings Panel Style" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A settings panel with collapsible sections for different categories.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <SettingTypographyelStyle />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Multiple Independent Collapsibles" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Multiple collapsible sections that can be controlled independently.
        </Typography>
        <div className="p-4 bg-background w-full rounded-lg">
          <MultipleIndependentCollapsibles />
        </div>
      </PlaygroundCard>
    </div>
  )
}
