---
'@genseki/ui': patch
---

[FIX] General UI fixes

- Consistent disabled state tokens across form primitives (Input, Textarea, Select, Switch, RadioGroup, Checkbox, Toggle, Tabs, Slider, Command, ColorPicker, Calendar)
- InputGroup auto-detects disabled descendant input/textarea and aria-disabled, so wrappers around RichTextEditor and fieldset-disabled forms render the disabled chrome consistently
- InputGroup wrapping a direct `<input>` is now exactly h-18 to match sibling Buttons (was 74px due to wrapper border on top of inner Input h-18)
- Filter popover: trigger keeps a focus ring while the popover is open, and the popover content aligns to the trigger's end edge
- Filter popover: highlight the currently active column in the left list
- Filter popover: disable "Reset All" when no filter is selected
