import React from 'react'

import {
  CheckCircleIcon,
  DownloadIcon,
  EnvelopeIcon,
  HeartIcon,
  ShareIcon,
} from '@phosphor-icons/react'

import { Typography } from '@genseki/react'
import { Button, toast } from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Toast
function BasicToast() {
  const showToast = () => {
    toast('Hello, this is a basic toast!')
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showToast}>Show Basic Toast</Button>
    </div>
  )
}

// Toast Types
function ToastTypes() {
  const showSuccess = () => {
    toast.success('Operation completed successfully!')
  }

  const showDefault = () => {
    toast.loading('asda')
  }

  const showError = () => {
    toast.error('Something went wrong!')
  }

  const showWarning = () => {
    toast.warning('Please check your input')
  }

  const showInfo = () => {
    toast.info('Here is some information')
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showDefault} variant="outline">
        Default toast
      </Button>
      <Button onClick={showSuccess} variant="outline">
        Success Toast
      </Button>
      <Button onClick={showInfo} variant="outline">
        Info Toast
      </Button>
      <Button onClick={showError} variant="destructive">
        Error Toast
      </Button>
      <Button onClick={showWarning} variant="destructive">
        Warning Toast
      </Button>
    </div>
  )
}

// Toast with Description
function ToastWithDescription() {
  const showDefaultToast = () => {
    toast('Email is already registered.', {
      description: "Your item's in the cart. Tap here to check it out.",
      action: {
        label: 'View',
        onClick(event) {},
      },
      cancel: {
        label: 'Cancel',
        onClick(event) {},
      },
    })
  }

  const showSuccessToast = () => {
    toast.success('Email is already registered.', {
      description: "Your item's in the cart. Tap here to check it out.",
      action: {
        label: 'View',
        onClick(event) {},
      },
      cancel: {
        label: 'Cancel',
        onClick(event) {},
      },
    })
  }

  const showInfoToast = () => {
    toast.info('Email is already registered.', {
      description: "Your item's in the cart. Tap here to check it out.",
      action: {
        label: 'View',
        onClick(event) {},
      },
      cancel: {
        label: 'Cancel',
        onClick(event) {},
      },
    })
  }

  const showErrorToast = () => {
    toast.error('Email is already registered.', {
      description: "Your item's in the cart. Tap here to check it out.",
      action: {
        label: 'View',
        onClick(event) {},
      },
      cancel: {
        label: 'Cancel',
        onClick(event) {},
      },
    })
  }

  const showWarningToast = () => {
    toast.warning('Email is already registered.', {
      description: "Your item's in the cart. Tap here to check it out.",
      action: {
        label: 'View',
        onClick(event) {},
      },
      cancel: {
        label: 'Cancel',
        onClick(event) {},
      },
    })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showDefaultToast}>
        <EnvelopeIcon />
        Send Email (Default)
      </Button>
      <Button onClick={showSuccessToast}>
        <EnvelopeIcon />
        Send Email (Success)
      </Button>
      <Button onClick={showInfoToast}>
        <EnvelopeIcon />
        Send Email (Info)
      </Button>
      <Button onClick={showErrorToast} variant="destructive">
        <EnvelopeIcon />
        Send Email (Error)
      </Button>
      <Button onClick={showWarningToast} variant="destructive">
        <EnvelopeIcon />
        Send Email (Warning)
      </Button>
    </div>
  )
}

// Toast with Action
function ToastWithAction() {
  const showToast = () => {
    toast('File uploaded successfully', {
      description: 'Your file has been uploaded to the cloud.',
      action: {
        label: 'View',
        onClick: () => console.log('View clicked'),
      },
    })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showToast}>Show Toast with Action</Button>
    </div>
  )
}

// Toast with Custom Duration
function ToastWithCustomDuration() {
  const showQuickToast = () => {
    toast('This will disappear quickly', {
      duration: 1000,
    })
  }

  const showLongToast = () => {
    toast('This will stay for a while', {
      duration: 10000,
    })
  }

  const showPersistentToast = () => {
    toast('This will stay until dismissed', {
      duration: Infinity,
    })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showQuickToast} variant="outline">
        Quick Toast (1s)
      </Button>
      <Button onClick={showLongToast} variant="outline">
        Long Toast (10s)
      </Button>
      <Button onClick={showPersistentToast} variant="outline">
        Persistent Toast
      </Button>
    </div>
  )
}

// Toast with Custom Icons
function ToastWithCustomIcons() {
  const showHeartToast = () => {
    toast('Added to favorites', {
      icon: <HeartIcon />,
      description: 'This item has been added to your favorites.',
    })
  }

  const showDownloadToast = () => {
    toast('Download started', {
      icon: <DownloadIcon />,
      description: 'Your download will begin shortly.',
    })
  }

  const showShareToast = () => {
    toast('Link copied to clipboard', {
      icon: <ShareIcon />,
      description: 'You can now paste it anywhere.',
    })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showHeartToast} variant="outline">
        <HeartIcon />
        Heart Toast
      </Button>
      <Button onClick={showDownloadToast} variant="outline">
        <DownloadIcon />
        Download Toast
      </Button>
      <Button onClick={showShareToast} variant="outline">
        <ShareIcon />
        Share Toast
      </Button>
    </div>
  )
}

// Loading Toast
function LoadingToast() {
  const showLoadingToast = () => {
    const toastId = toast.loading('Processing your request...')

    // Simulate async operation
    setTimeout(() => {
      toast.success('Request completed!', {
        id: toastId,
      })
    }, 3000)
  }

  const showLoadingWithUpdate = () => {
    const toastId = toast.loading('Uploading file...', {
      description: 'Please wait while we upload your file.',
    })

    // Simulate progress updates
    setTimeout(() => {
      toast.loading('Processing file...', {
        id: toastId,
        description: 'Almost done!',
      })
    }, 2000)

    setTimeout(() => {
      toast.success('Upload complete!', {
        id: toastId,
        description: 'Your file has been uploaded successfully.',
      })
    }, 4000)
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showLoadingToast} variant="outline">
        Show Loading Toast
      </Button>
      <Button onClick={showLoadingWithUpdate} variant="outline">
        Show Loading with Updates
      </Button>
    </div>
  )
}

// Promise Toast
function PromiseToast() {
  const showPromiseToast = () => {
    const promise = () => new Promise((resolve) => setTimeout(resolve, 2000))

    toast.promise(promise, {
      loading: 'Loading...',
      success: 'Data has been saved!',
      error: 'Error saving data!',
    })
  }

  const showPromiseWithError = () => {
    const promise = () => new Promise((_resolve, reject) => setTimeout(reject, 2000))

    toast.promise(promise, {
      loading: 'Processing...',
      success: 'Success!',
      error: 'Something went wrong!',
    })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showPromiseToast} variant="outline">
        Show Promise Toast
      </Button>
      <Button onClick={showPromiseWithError} variant="destructive">
        Show Promise Error
      </Button>
    </div>
  )
}

// Toast Positioning
function ToastPositioning() {
  const showTopLeftToast = () => {
    toast('Top Left Toast', {
      position: 'top-left',
    })
  }

  const showTopRightToast = () => {
    toast('Top Right Toast', {
      position: 'top-right',
    })
  }

  const showBottomLeftToast = () => {
    toast('Bottom Left Toast', {
      position: 'bottom-left',
    })
  }

  const showBottomRightToast = () => {
    toast('Bottom Right Toast', {
      position: 'bottom-right',
    })
  }

  const showTopCenterToast = () => {
    toast('Top Center Toast', {
      position: 'top-center',
    })
  }

  const showBottomCenterToast = () => {
    toast('Bottom Center Toast', {
      position: 'bottom-center',
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button onClick={showTopLeftToast} variant="outline" size="sm">
        Top Left
      </Button>
      <Button onClick={showTopCenterToast} variant="outline" size="sm">
        Top Center
      </Button>
      <Button onClick={showTopRightToast} variant="outline" size="sm">
        Top Right
      </Button>
      <Button onClick={showBottomLeftToast} variant="outline" size="sm">
        Bottom Left
      </Button>
      <Button onClick={showBottomCenterToast} variant="outline" size="sm">
        Bottom Center
      </Button>
      <Button onClick={showBottomRightToast} variant="outline" size="sm">
        Bottom Right
      </Button>
    </div>
  )
}

// Dismissible Toast
function DismissibleToast() {
  const showDismissibleToast = () => {
    toast('This toast can be dismissed', {
      description: 'Click the X button or swipe to dismiss.',
      dismissible: true,
    })
  }

  const showNonDismissibleToast = () => {
    toast('This toast cannot be dismissed', {
      description: 'You cannot dismiss this toast manually.',
      dismissible: false,
    })
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showDismissibleToast} variant="outline">
        Dismissible Toast
      </Button>
      <Button onClick={showNonDismissibleToast} variant="outline">
        Non-Dismissible Toast
      </Button>
    </div>
  )
}

// Toast with Custom Styling
function ToastWithCustomStyling() {
  const showCustomToast = () => {
    toast('Custom styled toast', {
      description: 'This toast has custom styling.',
      className: 'bg-blue-500 text-white',
      style: {
        border: '2px solid #3b82f6',
      },
    })
  }

  const showRichToast = () => {
    toast(
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="text-green-500" />
        <Typography className="font-semibold">Success!</Typography>
      </div>,
      {
        description: 'Your action was completed successfully.',
      }
    )
  }

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={showCustomToast} variant="outline">
        Custom Styled Toast
      </Button>
      <Button onClick={showRichToast} variant="outline">
        Rich Content Toast
      </Button>
    </div>
  )
}

export function ToastSection() {
  return (
    <>
      <div className="grid gap-8">
        <PlaygroundCard title="Basic Toast" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A simple toast notification that appears temporarily.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <BasicToast />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Toast Types" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Different types of toast notifications for various scenarios.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ToastTypes />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Toast with Description" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Toast notifications with additional descriptive text.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ToastWithDescription />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Toast with Action" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Toast notifications with actionable buttons.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ToastWithAction />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Toast with Custom Duration" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Control how long toast notifications stay visible.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ToastWithCustomDuration />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Toast with Custom Icons" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Toast notifications with custom icons for better visual context.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ToastWithCustomIcons />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Loading Toast" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Toast notifications for loading states and async operations.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <LoadingToast />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Promise Toast" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Toast notifications that automatically update based on promise states.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <PromiseToast />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Toast Positioning" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Control where toast notifications appear on the screen.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ToastPositioning />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Dismissible Toast" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Control whether users can manually dismiss toast notifications.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <DismissibleToast />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Toast with Custom Styling" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Customize the appearance of toast notifications with styles and rich content.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ToastWithCustomStyling />
          </div>
        </PlaygroundCard>
      </div>
    </>
  )
}
