import React, { useState } from 'react'

import { CheckCircleIcon, InfoIcon, TrashIcon, UserIcon, WarningIcon } from '@phosphor-icons/react'

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Typography,
} from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Dialog
function BasicDialog() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Basic Dialog</DialogTitle>
            <DialogDescription>
              This is a basic dialog example. Click outside or press escape to close.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              This dialog contains basic content and demonstrates the standard dialog structure.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dialog without Close Button
function DialogWithoutCloseButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Open Dialog (No Close Button)</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Dialog Without Close Button</DialogTitle>
            <DialogDescription>
              This dialog does not have a close button in the top-right corner.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              You can only close this dialog using the buttons below or by clicking outside.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Confirmation Dialog
function ConfirmationDialog() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Delete Item
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
                <TrashIcon className="size-8 text-destructive" />
              </div>
              <div>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the item.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              Are you sure you want to delete this item? This action will remove it from your
              account and cannot be undone.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Form Dialog
function FormDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setOpen(false)
    setFormData({ name: '', email: '' })
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Open Form Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new user account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Typography type="label" weight="medium">
                Name
              </Typography>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="space-y-2">
              <Typography type="label" weight="medium">
                Email
              </Typography>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Alert Dialog Variants
function AlertDialogVariants() {
  const [successOpen, setSuccessOpen] = useState(false)
  const [warningOpen, setWarningOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setSuccessOpen(true)} variant="secondary">
          Success Alert
        </Button>
        <Button onClick={() => setWarningOpen(true)} variant="secondary">
          Warning Alert
        </Button>
        <Button onClick={() => setInfoOpen(true)} variant="secondary">
          Info Alert
        </Button>
        <Button onClick={() => setErrorOpen(true)} variant="secondary">
          Error Alert
        </Button>
      </div>

      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircleIcon className="size-8 text-green-600" />
              </div>
              <div>
                <DialogTitle>Success!</DialogTitle>
                <DialogDescription>Your action was completed successfully.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              The operation has been completed without any issues. You can now proceed with your
              next task.
            </Typography>
          </div>
          <DialogFooter>
            <Button onClick={() => setSuccessOpen(false)}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Warning Dialog */}
      <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-yellow-100">
                <WarningIcon className="size-8 text-yellow-600" />
              </div>
              <div>
                <DialogTitle>Warning</DialogTitle>
                <DialogDescription>
                  Please review the following information before proceeding.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              This action may have unintended consequences. Please make sure you understand the
              implications before continuing.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setWarningOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setWarningOpen(false)}>Proceed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Info Dialog */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-blue-100">
                <InfoIcon className="size-8 text-blue-600" />
              </div>
              <div>
                <DialogTitle>Information</DialogTitle>
                <DialogDescription>
                  Here is some important information you should know.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              This feature is currently in beta. Some functionality may not work as expected. We
              appreciate your patience as we continue to improve the experience.
            </Typography>
          </div>
          <DialogFooter>
            <Button onClick={() => setInfoOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-6">
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
                <WarningIcon className="size-8 text-red-600" />
              </div>
              <div>
                <DialogTitle>Error</DialogTitle>
                <DialogDescription>Something went wrong. Please try again.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              An unexpected error occurred while processing your request. Please check your
              connection and try again. If the problem persists, contact support.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setErrorOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setErrorOpen(false)}>Try Again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Large Content Dialog
function LargeContentDialog() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Open Large Content Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              Please read and accept our terms of service to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto space-y-4 py-4">
            <Typography type="body" className="text-text-secondary">
              <strong>1. Acceptance of Terms</strong>
              <br />
              By accessing and using this service, you accept and agree to be bound by the terms and
              provision of this agreement.
            </Typography>
            <Typography type="body" className="text-text-secondary">
              <strong>2. Use License</strong>
              <br />
              Permission is granted to temporarily download one copy of the materials on our website
              for personal, non-commercial transitory viewing only.
            </Typography>
            <Typography type="body" className="text-text-secondary">
              <strong>3. Disclaimer</strong>
              <br />
              The materials on our website are provided on an {"'"}as is{"'"} basis. We make no
              warranties, expressed or implied, and hereby disclaim and negate all other warranties
              including without limitation, implied warranties or conditions of merchantability,
              fitness for a particular purpose, or non-infringement of intellectual property or
              other violation of rights.
            </Typography>
            <Typography type="body" className="text-text-secondary">
              <strong>4. Limitations</strong>
              <br />
              In no event shall our company or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business
              interruption) arising out of the use or inability to use the materials on our website,
              even if we or our authorized representative has been notified orally or in writing of
              the possibility of such damage.
            </Typography>
            <Typography type="body" className="text-text-secondary">
              <strong>5. Accuracy of Materials</strong>
              <br />
              The materials appearing on our website could include technical, typographical, or
              photographic errors. We do not warrant that any of the materials on its website are
              accurate, complete, or current.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Decline
            </Button>
            <Button onClick={() => setOpen(false)}>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Custom Styled Dialog
function CustomStyledDialog() {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setOpen(true)}>Open Custom Styled Dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gradient-to-br from-background to-secondary/5 backdrop-blur-sm">
          <DialogHeader>
            <div className="flex items-center gap-6">
              <div className="flex size-20 items-center justify-center rounded-full bg-primary/5 ">
                <UserIcon className="size-12 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Welcome!</DialogTitle>
                <DialogDescription>
                  This is a custom styled dialog with enhanced visual appeal.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-6">
            <Typography type="body" className="text-text-secondary">
              This dialog features custom styling including gradient backgrounds, enhanced borders,
              and larger icons to create a more engaging user experience.
            </Typography>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Maybe Later
            </Button>
            <Button onClick={() => setOpen(false)}>Get Started</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Nested Dialog
function NestedDialog() {
  const [outerOpen, setOuterOpen] = useState(false)
  const [innerOpen, setInnerOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setOuterOpen(true)}>Open Nested Dialog</Button>

      {/* Outer Dialog */}
      <Dialog open={outerOpen} onOpenChange={setOuterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Outer Dialog</DialogTitle>
            <DialogDescription>
              This is the outer dialog. You can open another dialog from here.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              Click the button below to open a nested dialog. This demonstrates how dialogs can be
              layered on top of each other.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOuterOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setInnerOpen(true)}>Open Inner Dialog</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inner Dialog */}
      <Dialog open={innerOpen} onOpenChange={setInnerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inner Dialog</DialogTitle>
            <DialogDescription>
              This is the nested dialog opened from the outer dialog.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Typography type="body" className="text-text-secondary">
              This dialog is layered on top of the previous one. Notice how the backdrop is darker,
              indicating the layered structure.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setInnerOpen(false)}>
              Close Inner
            </Button>
            <Button
              onClick={() => {
                setInnerOpen(false)
                setOuterOpen(false)
              }}
            >
              Close Both
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function DialogSection() {
  return (
    <div className="space-y-8 grid grid-cols-[repeat(3,1fr)] gap-4">
      <PlaygroundCard title="Basic Dialog" className="w-full h-full">
        <BasicDialog />
      </PlaygroundCard>

      <PlaygroundCard title="Dialog Without Close Button" className="w-full h-full">
        <DialogWithoutCloseButton />
      </PlaygroundCard>

      <PlaygroundCard title="Confirmation Dialog" className="w-full h-full">
        <ConfirmationDialog />
      </PlaygroundCard>

      <PlaygroundCard title="Form Dialog" className="w-full h-full">
        <FormDialog />
      </PlaygroundCard>

      <PlaygroundCard title="Alert Dialog Variants" className="w-full h-full">
        <AlertDialogVariants />
      </PlaygroundCard>

      <PlaygroundCard title="Large Content Dialog" className="w-full h-full">
        <LargeContentDialog />
      </PlaygroundCard>

      <PlaygroundCard title="Custom Styled Dialog" className="w-full h-full">
        <CustomStyledDialog />
      </PlaygroundCard>

      <PlaygroundCard title="Nested Dialog" className="w-full h-full">
        <NestedDialog />
      </PlaygroundCard>
    </div>
  )
}
