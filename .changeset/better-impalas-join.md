---
'@example/ui-playground': patch
'@genseki/react': patch
'@example/erp': patch
---

- Migrate from `tv` to `cva`
- Introducing `create-required-context`
- Incremental adopting Intent UI color system to Shadcn color system from 
- Rename and deprecated react aria
  - `textfield`
  - `label`
  - `button`
  - `popover` _(with children composible components too)_
  - `dialog` _(with children composible components too)_
  - `modal` _(with children composible components too)_
  - `sheet` _(with children composible components too)_
  - `base-icon`
  - `combobox` _(with children composible components too)_
  - `field-group`
- Migrate `textfield` to Shadcn _(Not completely 100% from entirely project perspective, since some compound component required react aria primitive component as a base, __the change will incrementally adopt__)_
- Migrate `button` to Shadcn _(Not completely 100% from entirely project perspective, since some compound component required react aria primitive component as a base, __the change will incrementally adopt__)_
- Create `Shadcn` UI playground  for Shadcn particularly
- Change UI playground project structure
- Introducing to new components by Shadcn
  - Input
  - Input group
  - Button
  - Label
  - Dialog
  - Menu
  - Popover
  - Combobox composition
  - Command __(from cmdk)__