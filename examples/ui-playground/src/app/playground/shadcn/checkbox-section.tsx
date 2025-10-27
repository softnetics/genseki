import React from 'react'

import { CheckIcon, MinusIcon, XIcon } from '@phosphor-icons/react'

import { Checkbox, Label, Typography } from '@genseki/react/v2'

import { PlaygroundCard } from '~/src/components/card'

// Basic Checkbox
function BasicCheckbox() {
  return (
    <div className="flex justify-start space-x-2 flex-col gap-y-8">
      <Typography type="body" weight="semibold">
        Square
      </Typography>
      <div className="flex gap-x-4">
        <Checkbox defaultChecked id="basic-checkbox" />
        <Label htmlFor="basic-checkbox">Accept terms and conditions (Default variant)</Label>
      </div>
      <div className="flex gap-x-4">
        <Checkbox defaultChecked id="basic-checkbox-undetermine" icon={MinusIcon} />
        <Label htmlFor="basic-checkbox-undetermine">
          Accept terms and conditions (Default gvariant with undetermine icon)
        </Label>
      </div>
      <div className="flex gap-x-4">
        <Checkbox defaultChecked id="basic-checkbox-incorrect" variant="incorrect" icon={XIcon} />
        <Label htmlFor="basic-checkbox-incorrect">
          Accept terms and conditions (Incorrect variant)
        </Label>
      </div>
      <div className="flex gap-x-4">
        <Checkbox defaultChecked id="basic-checkbox-correct" variant="correct" icon={CheckIcon} />
        <Label htmlFor="basic-checkbox-correct">
          Accept terms and conditions (Correct variant)
        </Label>
      </div>
      <Typography type="body" weight="semibold">
        Rounded
      </Typography>
      <div className="flex gap-x-4">
        <Checkbox defaultChecked shape="rounded" id="rounded-basic-checkbox" />
        <Label htmlFor="rounded-basic-checkbox">
          Accept terms and conditions (Default variant)
        </Label>
      </div>
      <div className="flex gap-x-4">
        <Checkbox
          defaultChecked
          shape="rounded"
          id="rounded-basic-checkbox-undetermine"
          icon={MinusIcon}
        />
        <Label htmlFor="rounded-basic-checkbox-undetermine">
          Accept terms and conditions (Default gvariant with undetermine icon)
        </Label>
      </div>
      <div className="flex gap-x-4">
        <Checkbox
          defaultChecked
          shape="rounded"
          id="rounded-basic-checkbox-incorrect"
          variant="incorrect"
          icon={XIcon}
        />
        <Label htmlFor="rounded-basic-checkbox-incorrect">
          Accept terms and conditions (Incorrect variant)
        </Label>
      </div>
      <div className="flex gap-x-4">
        <Checkbox
          defaultChecked
          shape="rounded"
          id="rounded-basic-checkbox-correct"
          variant="correct"
          icon={CheckIcon}
        />
        <Label htmlFor="rounded-basic-checkbox-correct">
          Accept terms and conditions (Correct variant)
        </Label>
      </div>
    </div>
  )
}

// Checked State
function CheckedCheckbox() {
  const [checked, setChecked] = React.useState(true)

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="checked-checkbox"
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value === true || false)
        }}
      />
      <Label htmlFor="checked-checkbox">This is checked by default</Label>
    </div>
  )
}

// Disabled Checkbox
function DisabledCheckbox() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled checked />
        <Label htmlFor="disabled-checked">Disabled checked</Label>
      </div>
    </div>
  )
}

// Checkbox with Error State
function CheckboxWithError() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="error-checkbox" aria-invalid="true" />
        <Label htmlFor="error-checkbox">This field has an error</Label>
      </div>
      <Typography type="caption" className="text-destructive">
        You must accept the terms to continue
      </Typography>
    </div>
  )
}

// Checkbox Group
function CheckboxGroup() {
  const [items, setItems] = React.useState({
    apples: false,
    oranges: false,
    bananas: false,
  })

  return (
    <div className="flex flex-col gap-4">
      <Label>Select your favorite fruits:</Label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="apples"
            checked={items.apples}
            onCheckedChange={(checked) => setItems({ ...items, apples: checked as boolean })}
          />
          <Label htmlFor="apples">Apples</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="oranges"
            checked={items.oranges}
            onCheckedChange={(checked) => setItems({ ...items, oranges: checked as boolean })}
          />
          <Label htmlFor="oranges">Oranges</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bananas"
            checked={items.bananas}
            onCheckedChange={(checked) => setItems({ ...items, bananas: checked as boolean })}
          />
          <Label htmlFor="bananas">Bananas</Label>
        </div>
      </div>
    </div>
  )
}

// Controlled Checkbox
function ControlledCheckbox() {
  const [agreed, setAgreed] = React.useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-4">
        <Checkbox
          id="controlled"
          checked={agreed}
          onCheckedChange={(value) => setAgreed(value === true || false)}
        />
        <Label htmlFor="controlled">
          I agree to the terms and conditions. I understand that this is a binding agreement.
        </Label>
      </div>
      <Typography type="caption" className="text-muted-foreground">
        Status: {agreed ? 'Agreed' : 'Not agreed'}
      </Typography>
    </div>
  )
}

// Checkbox with Description
function CheckboxWithDescription() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start space-x-2">
        <Checkbox id="newsletter" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="newsletter" className="leading-5">
            Subscribe to newsletter
          </Label>
          <Typography type="caption" className="text-muted-foreground">
            Get notified about new features and updates.
          </Typography>
        </div>
      </div>
    </div>
  )
}

// Custom Styled Checkbox
function CustomStyledCheckbox() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="custom-checkbox"
        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <Label htmlFor="custom-checkbox" className="text-primary">
        Custom styled checkbox
      </Label>
    </div>
  )
}

// All Checkbox States
function AllCheckboxStates() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="checked" checked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="indeterminate" checked="indeterminate" />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="focused" />
        <Label htmlFor="focused">Focused (click to see)</Label>
      </div>
    </div>
  )
}

export function CheckboxSection() {
  return (
    <>
      <div className="grid gap-8">
        <PlaygroundCard title="Basic Checkbox" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A basic checkbox input with a label.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <BasicCheckbox />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Checked State" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            A checkbox that is checked by default with controlled state.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <CheckedCheckbox />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Disabled Checkbox" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Checkbox in disabled state, both checked and unchecked.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <DisabledCheckbox />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Checkbox with Error State" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Checkbox in error state with validation feedback.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <CheckboxWithError />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Checkbox Group" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Multiple checkboxes used together in a group.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <CheckboxGroup />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Controlled Checkbox" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Checkbox with controlled state and real-time status feedback.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <ControlledCheckbox />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Checkbox with Description" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Checkbox with additional descriptive text.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <CheckboxWithDescription />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="Custom Styled Checkbox" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Checkbox with custom styling for checked and unchecked states.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <CustomStyledCheckbox />
          </div>
        </PlaygroundCard>

        <PlaygroundCard title="All Checkbox States" categoryTitle="Component">
          <Typography type="body" className="text-muted-foreground mb-4">
            Demonstration of all possible checkbox states.
          </Typography>
          <div className="p-4 bg-background w-full rounded-lg">
            <AllCheckboxStates />
          </div>
        </PlaygroundCard>
      </div>
    </>
  )
}
