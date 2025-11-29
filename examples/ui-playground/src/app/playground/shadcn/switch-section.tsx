'use client'

import * as React from 'react'

import { BellIcon, MoonIcon, ShieldIcon, WifiHighIcon } from '@phosphor-icons/react'

import { Label, Typography } from '@genseki/ui'
import { Switch } from '@genseki/ui'

import { PlaygroundCard } from '~/src/components/card'

// Basic Switch
function BasicSwitch() {
  const [isEnabled, setIsEnabled] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="basic-switch" checked={isEnabled} onCheckedChange={setIsEnabled} />
        <Label htmlFor="basic-switch">Enable notifications</Label>
      </div>
      <Typography type="body" className="text-text-secondary">
        Switch is {isEnabled ? 'enabled' : 'disabled'}
      </Typography>
    </div>
  )
}

// Switch with Label
function SwitchWithLabel() {
  const [notifications, setNotifications] = React.useState(true)
  const [darkMode, setDarkMode] = React.useState(false)
  const [autoSave, setAutoSave] = React.useState(true)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Push Notifications</Label>
            <Typography type="body" className="text-text-secondary">
              Receive notifications about new messages and updates.
            </Typography>
          </div>
          <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Typography type="body" className="text-text-secondary">
              Switch between light and dark themes.
            </Typography>
          </div>
          <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-save">Auto Save</Label>
            <Typography type="body" className="text-text-secondary">
              Automatically save your work as you type.
            </Typography>
          </div>
          <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
        </div>
      </div>
    </div>
  )
}

// Switch with Icons
function SwitchWithIcons() {
  const [darkMode, setDarkMode] = React.useState(false)
  const [notifications, setNotifications] = React.useState(true)
  const [wifi, setWifi] = React.useState(true)
  const [security, setSecurity] = React.useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-4">
            <MoonIcon className="size-8 text-muted-foreground translate-y-[2px]" />
            <div>
              <Label htmlFor="dark-mode-icon">Dark Mode</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Toggle dark theme
              </Typography>
            </div>
          </div>
          <Switch id="dark-mode-icon" checked={darkMode} onCheckedChange={setDarkMode} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-4">
            <BellIcon className="size-8 text-muted-foreground translate-y-[2px]" />
            <div>
              <Label htmlFor="notifications-icon">Notifications</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Get notified about updates
              </Typography>
            </div>
          </div>
          <Switch
            id="notifications-icon"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-4">
            <WifiHighIcon className="size-8 text-muted-foreground translate-y-[2px]" />
            <div>
              <Label htmlFor="wifi-icon">WiFi</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Connect to wireless networks
              </Typography>
            </div>
          </div>
          <Switch id="wifi-icon" checked={wifi} onCheckedChange={setWifi} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-4">
            <ShieldIcon className="size-8 text-muted-foreground translate-y-[2px]" />
            <div>
              <Label htmlFor="security-icon">Security</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Enable security features
              </Typography>
            </div>
          </div>
          <Switch id="security-icon" checked={security} onCheckedChange={setSecurity} />
        </div>
      </div>
    </div>
  )
}

// Disabled Switch
function DisabledSwitch() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="disabled-on" className="text-muted-foreground">
              Disabled (On)
            </Label>
            <Typography type="body" className="text-text-secondary">
              This switch is disabled and turned on.
            </Typography>
          </div>
          <Switch id="disabled-on" checked={true} disabled />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="disabled-off" className="text-muted-foreground">
              Disabled (Off)
            </Label>
            <Typography type="body" className="text-text-secondary">
              This switch is disabled and turned off.
            </Typography>
          </div>
          <Switch id="disabled-off" checked={false} disabled />
        </div>
      </div>
    </div>
  )
}

// Switch with Form
function SwitchWithForm() {
  const [formData, setFormData] = React.useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    weeklyDigest: true,
    autoBackup: false,
  })

  const handleSwitchChange = (key: keyof typeof formData) => (checked: boolean) => {
    setFormData((prev) => ({ ...prev, [key]: checked }))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Typography type="h4" weight="semibold">
          Notification Preferences
        </Typography>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Receive notifications via email
              </Typography>
            </div>
            <Switch
              id="email-notifications"
              checked={formData.emailNotifications}
              onCheckedChange={handleSwitchChange('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Receive notifications via SMS
              </Typography>
            </div>
            <Switch
              id="sms-notifications"
              checked={formData.smsNotifications}
              onCheckedChange={handleSwitchChange('smsNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Receive promotional and marketing content
              </Typography>
            </div>
            <Switch
              id="marketing-emails"
              checked={formData.marketingEmails}
              onCheckedChange={handleSwitchChange('marketingEmails')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="security-alerts">Security Alerts</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Get notified about security-related events
              </Typography>
            </div>
            <Switch
              id="security-alerts"
              checked={formData.securityAlerts}
              onCheckedChange={handleSwitchChange('securityAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Receive a weekly summary of activity
              </Typography>
            </div>
            <Switch
              id="weekly-digest"
              checked={formData.weeklyDigest}
              onCheckedChange={handleSwitchChange('weeklyDigest')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-backup">Auto Backup</Label>
              <Typography type="body" className="text-text-secondary text-sm">
                Automatically backup your data
              </Typography>
            </div>
            <Switch
              id="auto-backup"
              checked={formData.autoBackup}
              onCheckedChange={handleSwitchChange('autoBackup')}
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <Typography type="body" className="text-text-secondary">
          <strong>Current Settings:</strong>{' '}
          {Object.entries(formData)
            .filter(([_, value]) => value)
            .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
            .join(', ') || 'None enabled'}
        </Typography>
      </div>
    </div>
  )
}

// Switch with Custom Styling
function CustomStyledSwitch() {
  const [customSwitch, setCustomSwitch] = React.useState(false)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="custom-switch">Custom Styled Switch</Label>
            <Typography type="body" className="text-text-secondary">
              Switch with custom colors and styling
            </Typography>
          </div>
          <Switch
            id="custom-switch"
            checked={customSwitch}
            onCheckedChange={setCustomSwitch}
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-200"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="gradient-switch">Gradient Switch</Label>
            <Typography type="body" className="text-text-secondary">
              Switch with gradient background
            </Typography>
          </div>
          <Switch
            id="gradient-switch"
            checked={customSwitch}
            onCheckedChange={setCustomSwitch}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
          />
        </div>
      </div>
    </div>
  )
}

export function SwitchSection() {
  return (
    <div className="grid gap-8">
      <PlaygroundCard title="Basic Switch" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          A simple switch component with basic functionality and state tracking.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <BasicSwitch />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Switch with Labels" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Switches with descriptive labels and helper text for better user experience.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <SwitchWithLabel />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Switch with Icons" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Switches enhanced with icons to improve visual recognition and user experience.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <SwitchWithIcons />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Disabled Switch" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Disabled switches in both on and off states to prevent user interaction.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <DisabledSwitch />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Switch with Form" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Switches integrated into a form with multiple options and state management.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <SwitchWithForm />
        </div>
      </PlaygroundCard>

      <PlaygroundCard title="Custom Styled Switch" categoryTitle="Component">
        <Typography type="body" className="text-muted-foreground mb-4">
          Switches with custom styling and colors for different visual themes.
        </Typography>
        <div className="p-4 bg-secondary w-full rounded-lg">
          <CustomStyledSwitch />
        </div>
      </PlaygroundCard>
    </div>
  )
}
