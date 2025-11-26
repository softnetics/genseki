'use client'

import * as React from 'react'

import { BellIcon, GearIcon, HeartIcon, StarIcon, UserIcon } from '@phosphor-icons/react'

import { Label, Typography } from '@genseki/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@genseki/ui'

import { PlaygroundCard } from '~/src/components/card'

// Basic Tabs
function BasicTabs() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="account" className="w-full">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              Account Information
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Manage your account settings and preferences here.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              Password Settings
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Update your password and security settings.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              General Settings
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Configure your general application preferences.
            </Typography>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Basic Tabs
function BasicUnderlineTabs() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="account" className="w-full" variant="underline">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              Account Information
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Manage your account settings and preferences here.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              Password Settings
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Update your password and security settings.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              General Settings
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Configure your general application preferences.
            </Typography>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Tabs with Icons
function TabsWithIcons() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <GearIcon />
            Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <BellIcon />
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              User Profile
            </Typography>
            <Typography type="body" className="text-text-secondary">
              View and edit your personal information and profile details.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              Account Settings
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Configure your account preferences and privacy settings.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              Notification Preferences
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Manage how and when you receive notifications.
            </Typography>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
// Tabs with Icons
function UnderlineTabsWithIcons() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="profile" className="w-full" variant="underline">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon />
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <GearIcon />
            Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <BellIcon />
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              User Profile
            </Typography>
            <Typography type="body" className="text-text-secondary">
              View and edit your personal information and profile details.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              Account Settings
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Configure your account preferences and privacy settings.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="flex flex-col p-4 border rounded-lg bg-background">
            <Typography type="h4" weight="semibold" className="mb-2">
              Notification Preferences
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Manage how and when you receive notifications.
            </Typography>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Vertical Tabs
function VerticalTabs() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" orientation="vertical" className="w-full">
        <TabsList className="flex-col h-auto w-fit">
          <TabsTrigger value="overview" className="w-full justify-start">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="w-full justify-start">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports" className="w-full justify-start">
            Reports
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start">
            Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Dashboard Overview
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Get a comprehensive view of your dashboard metrics and key performance indicators.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Analytics Dashboard
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Detailed analytics and insights about your data and user behavior.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Reports & Exports
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Generate and download various reports for your business needs.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="security">
          <div className="p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Security Center
            </Typography>
            <Typography type="body" className="text-text-secondary">
              Monitor security events and configure security settings.
            </Typography>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Disabled Tabs
function DisabledTabs() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Tab</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled Tab
          </TabsTrigger>
          <TabsTrigger value="another">Another Tab</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Active Content
            </Typography>
            <Typography type="body" className="text-text-secondary">
              This tab is active and fully functional.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="disabled">
          <div className="p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Disabled Content
            </Typography>
            <Typography type="body" className="text-text-secondary">
              This content is associated with a disabled tab.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="another">
          <div className="p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Another Active Tab
            </Typography>
            <Typography type="body" className="text-text-secondary">
              This is another active tab with content.
            </Typography>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Tabs with Badge
function TabsWithBadge() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="messages" className="w-full">
        <TabsList>
          <TabsTrigger value="messages" className="gap-2 flex items-center">
            Messages
            <div className="in-data-[state=active]:bg-primary in-data-[state=active]:text-primary-foreground bg-background text-secondary-foreground px-2 py-1 grid place-items-center rounded-full">
              <Typography type="label">3</Typography>
            </div>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            <HeartIcon />
            Favorites
            <span className="in-data-[state=active]:bg-primary in-data-[state=active]:text-primary-foreground bg-background text-secondary-foreground px-2 py-1 rounded-full">
              12
            </span>
          </TabsTrigger>
          <TabsTrigger value="starred" className="gap-2">
            <StarIcon />
            Starred
          </TabsTrigger>
        </TabsList>
        <TabsContent value="messages">
          <div className="flex flex-col bg-background p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Messages
            </Typography>
            <Typography type="body" className="text-text-secondary">
              You have 3 unread messages in your inbox.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="favorites">
          <div className="flex flex-col bg-background p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Favorite Items
            </Typography>
            <Typography type="body" className="text-text-secondary">
              You have 12 items marked as favorites.
            </Typography>
          </div>
        </TabsContent>
        <TabsContent value="starred">
          <div className="flex flex-col bg-background p-4 border rounded-lg">
            <Typography type="h4" weight="semibold" className="mb-2">
              Starred Content
            </Typography>
            <Typography type="body" className="text-text-secondary">
              View all your starred items and important content.
            </Typography>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Tabs with Form Content
function TabsWithForm() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    bio: '',
  })

  return (
    <div className="space-y-4">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <div className="p-4 border rounded-lg space-y-4">
            <Typography type="h4" weight="semibold" className="mb-2">
              Personal Information
            </Typography>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Name</Label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bio</Label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="contact">
          <div className="p-4 border rounded-lg space-y-4">
            <Typography type="h4" weight="semibold" className="mb-2">
              Contact Details
            </Typography>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Phone</Label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preferences">
          <div className="p-4 border rounded-lg space-y-4">
            <Typography type="h4" weight="semibold" className="mb-2">
              Preferences
            </Typography>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Language</Label>
              <select className="w-full p-2 border rounded-md">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Timezone</Label>
              <select className="w-full p-2 border rounded-md">
                <option>UTC-8 (PST)</option>
                <option>UTC-5 (EST)</option>
                <option>UTC+0 (GMT)</option>
              </select>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Tabs with Dynamic Content
function DynamicTabs() {
  const [activeTab, setActiveTab] = React.useState('tab1')
  const [tabs, setTabs] = React.useState([
    { id: 'tab1', label: 'Tab 1', content: 'Content for Tab 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content for Tab 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content for Tab 3' },
  ])

  const addTab = () => {
    const newId = `tab${tabs.length + 1}`
    setTabs([
      ...tabs,
      { id: newId, label: `Tab ${tabs.length + 1}`, content: `Content for Tab ${tabs.length + 1}` },
    ])
    setActiveTab(newId)
  }

  const removeTab = (id: string) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((tab) => tab.id !== id)
      setTabs(newTabs)
      if (activeTab === id) {
        setActiveTab(newTabs[0].id)
      }
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-2" asChild>
                <div>
                  {tab.label}
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTab(tab.id)
                      }}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      x
                    </button>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <button
            onClick={addTab}
            className="px-3 py-1 text-sm border rounded-md hover:bg-secondary"
          >
            + Add Tab
          </button>
        </div>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <div className="p-4 border rounded-lg">
              <Typography type="h4" weight="semibold" className="mb-2">
                {tab.label}
              </Typography>
              <Typography type="body" className="text-text-secondary">
                {tab.content}
              </Typography>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export function TabsSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Tabs" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Simple tabs with basic content switching functionality.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicTabs />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Basic Underline Tabs" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Simple underline tabs with basic content switching functionality.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicUnderlineTabs />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Tabs with Icons" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Tabs with icons to enhance visual recognition and user experience.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <TabsWithIcons />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Tabs with Icons" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Underline Tabs with icons to enhance visual recognition and user experience.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <UnderlineTabsWithIcons />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Vertical Tabs" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Vertical orientation tabs for sidebar-style navigation.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <VerticalTabs />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Disabled Tabs" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Tabs with disabled states to prevent user interaction.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DisabledTabs />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Tabs with Badges" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Tabs with badge indicators to show counts or status information.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <TabsWithBadge />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Tabs with Forms" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Tabs containing form elements for multi-step form experiences.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <TabsWithForm />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Dynamic Tabs" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Tabs with dynamic content - add and remove tabs dynamically.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DynamicTabs />
        </div>
      </PlaygroundCard>
    </div>
  )
}
