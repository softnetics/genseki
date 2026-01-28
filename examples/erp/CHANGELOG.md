# @example/erp

## 0.1.8

### Patch Changes

- Updated dependencies [[`23a9e14`](https://github.com/softnetics/genseki/commit/23a9e14ed9124c870d1af9da2ed5e1545bbb606e)]:
  - @genseki/react@0.1.8
  - @genseki/next@0.1.8
  - @genseki/plugins@0.1.8
  - @genseki/prisma-generator@0.1.8
  - @genseki/react-query@0.1.8
  - @genseki/rest@0.1.8

## 0.1.7

### Patch Changes

- Updated dependencies [[`b70772c`](https://github.com/softnetics/genseki/commit/b70772c115c96c8255519f92c247575920cb651b)]:
  - @genseki/react@0.1.7
  - @genseki/next@0.1.7
  - @genseki/plugins@0.1.7
  - @genseki/prisma-generator@0.1.7
  - @genseki/react-query@0.1.7
  - @genseki/rest@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies [[`fe66dd3`](https://github.com/softnetics/genseki/commit/fe66dd3bd5fdabfe42c02a583534383a4b0d94f9)]:
  - @genseki/next@0.1.6
  - @genseki/react@0.1.6
  - @genseki/plugins@0.1.6
  - @genseki/prisma-generator@0.1.6
  - @genseki/react-query@0.1.6
  - @genseki/rest@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies [[`4eead5b`](https://github.com/softnetics/genseki/commit/4eead5bec57523180daa0962bd225a708f9d2c61)]:
  - @genseki/react@0.1.5
  - @genseki/next@0.1.5
  - @genseki/plugins@0.1.5
  - @genseki/prisma-generator@0.1.5
  - @genseki/react-query@0.1.5
  - @genseki/rest@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [[`e3e60d6`](https://github.com/softnetics/genseki/commit/e3e60d69ad449ddb8ba10793f7a9198ef1b22546)]:
  - @genseki/react@0.1.4
  - @genseki/next@0.1.4
  - @genseki/plugins@0.1.4
  - @genseki/prisma-generator@0.1.4
  - @genseki/react-query@0.1.4
  - @genseki/rest@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [[`33f7555`](https://github.com/softnetics/genseki/commit/33f7555b1be0fc58ba6a96f3307fedbdb7edcb26)]:
  - @genseki/react@0.1.3
  - @genseki/next@0.1.3
  - @genseki/plugins@0.1.3
  - @genseki/prisma-generator@0.1.3
  - @genseki/react-query@0.1.3
  - @genseki/rest@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [[`4d4d9c4`](https://github.com/softnetics/genseki/commit/4d4d9c4961b2e28c135f4e1b89cdfcba1989227b)]:
  - @genseki/react@0.1.2
  - @genseki/next@0.1.2
  - @genseki/plugins@0.1.2
  - @genseki/prisma-generator@0.1.2
  - @genseki/react-query@0.1.2
  - @genseki/rest@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [[`72f97f9`](https://github.com/softnetics/genseki/commit/72f97f91fbdf71b137c454befff55ee0dabba53f)]:
  - @genseki/react@0.1.1
  - @genseki/next@0.1.1
  - @genseki/plugins@0.1.1
  - @genseki/prisma-generator@0.1.1
  - @genseki/react-query@0.1.1
  - @genseki/rest@0.1.1

## 0.1.0

### Minor Changes

- fa5325a: [Feat] Add combobox as a default connect autoField
- 7273ee1: [[DRIZZ-96] Richtext editor and storage plugin](https://app.plane.so/softnetics/browse/DRIZZ-96/)
- 9f29ffd: Create form and update form bugs fixed and multiple components visual improvement

### Patch Changes

- 0f10dbb: - Migrate from `tv` to `cva`
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
  - Migrate `textfield` to Shadcn _(Not completely 100% from entirely project perspective, since some compound component required react aria primitive component as a base, **the change will incrementally adopt**)_
  - Migrate `button` to Shadcn _(Not completely 100% from entirely project perspective, since some compound component required react aria primitive component as a base, **the change will incrementally adopt**)_
  - Create `Shadcn` UI playground for Shadcn particularly
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
    - Command **(from cmdk)**
- b0301bc: [Feature] Uploading image to storage in rich text
- b651962: [Fix] Prisma generator bin name
- 0c2645b: [Feature] Add options to customize Table using Tanstack table
  [Fix] Move identifierColumn under Fields
- 72ddbd9: [Feature] implement proper way to handle options and conditional disabling
- cef24e5: Upgrade Zod version to 3.25.67
- 4357c07: fix: custom list api
- cb2221f: [Feature] Upgrade to support relation table for searching and sorting
- 63c94ed: [Breaking] Change context model to user-defined context
- cb9d38e: feat: Implement Controlled RichTextEditor
- 2ad9bd3: fix genseki table ui and search
- 49927f2: Add Phone plugins
- 4f04302: [Feature] Add delete object from storage
- 8df54c5: Fix Forgot password and Change phone bugs in phone plugin
- d6f819f: [Fix] plugin type and make `userId` in verification to be optional
- 7cd8620: Convert richtext field type to `json` from `string` and new S3 Storage adapter for object storing
- e4b450c: migrate `date-picker`, `time-input` and more fixes

  1. `typography` component now in the `v2`
  2. Add example for server side sidebar toggle state as a default value (Via data hydration)
  3. Fix `breadcrumb` focus ring color
  4. Fix `sidebar-footer` example, focus ring color.
  5. Fix `group-input-addon` focusing state
  6. Fix `group-input` disable background color
  7. Change button variant `default` to `md`
  8. Make `button-section` and `input-section` default background color to secondary color, so background color of input will be noticable
  9. Add `date-picker` examples (at `date-picker-section`)
  10. Add `time-input` examples (at `input-section`)
  11. New dependencies `date-fns` for `@example/ui-playground` and `react-day-picker` as a peer dependency for `@genseki/react`

- 055a591: feat: added support for custom th className via `meta.thClassName`
- dfad76d: Custimizable list page UI and components, developer can compose the entirely page from scratch
- bb5a2bd: - move `shadcn` components to `v2` folder and export the directory
  - flatten `primary` button variant
  - fix: `aria-menu` background
  - rename back the deprecated react-aria components by removing the leading `Aria[component-name]` keyword
- b493941: [Feature] Type-safe me API endpoint
- 5ac7bc7: [Feature] Improve Email and Password flexibility
- c227c3f: [Breaking] Replace Drizzle with Prisma
- aeab5ea: [[DRIZZ-35] - [Forget Password Page]](https://app.plane.so/softnetics/browse/DRIZZ-35/)
  [[DRIZZ-34] - [Reset Password Page]](https://app.plane.so/softnetics/browse/DRIZZ-34/)
  [[DRIZZ-33] - [Change Password Page]](https://app.plane.so/softnetics/browse/DRIZZ-33/)
- a2acb52: chore: update tiptap version
- 36bb10e: Refactor Collection Model
- 7acbdc9: [Breaking] Change core model of Genseki
- 8b4de17: New media upload components with AutoField integrated, small minor modal UI improvement
- a9fc278: Functional create or connect many relations
  Fix duplicate fields when have more than one field
- c17aae8: [Fix] Improve Plugin type-guard
- 5e85599: [Feat] Add custom search placeholder
- cd6fdb4: fix: can't delete single
- 9f3aa3a: [Breaking] Allow multiple fields in one collection
- 83a5c51: Fix phone plugin bugs and simplify error code
- eea522d: [Fix] Change type date in zod schema
- b590f41: fix: add min-height of richtext
- 650bcad: [Fix] `getFieldsClient` wrong omit field
- 02f4233: [Feature] Implement a plugin for phone authentication
- d105b0d: Customizable create page, developer can render a customized page via `config.page` when adding create page with `CollectionBuilder.create`.

  ```ts
  collection.create(fields, { options: options, page: /* Your customized create page */ })
  ```

  For working example, see https://github.com/softnetics/genseki/blob/8b38a1ab9379330e290eb8633dcbf8106ae435b8/examples/erp/genseki/collections/posts.client.tsx#L318-L390

- abb3578: [Fix] Display required error message
- e88f0b7: feat: add action select
- a4812ac: feat: richtext-editor designs and add link-extension
- f88f0f2: - Deprecated `link` component
  - Remove button `link` variant
  - Add example for `link` usage
  - Update button variants
  - update design tokens
- 0b0912b: [Feat]: add limit to type 'create' and remove button
- 57862df: fix: tailwind config file path
- Updated dependencies [0f10dbb]
- Updated dependencies [218c7e3]
- Updated dependencies [b0301bc]
- Updated dependencies [b651962]
- Updated dependencies [5a5c79f]
- Updated dependencies [b56cc5e]
- Updated dependencies [833fefd]
- Updated dependencies [4e69970]
- Updated dependencies [0c2645b]
- Updated dependencies [70d8d5e]
- Updated dependencies [6e32d75]
- Updated dependencies [60794b8]
- Updated dependencies [9336c89]
- Updated dependencies [4322698]
- Updated dependencies [6a6f28f]
- Updated dependencies [72ddbd9]
- Updated dependencies [86ffa1a]
- Updated dependencies [b1908d1]
- Updated dependencies [51dd567]
- Updated dependencies [a2050f0]
- Updated dependencies [cef24e5]
- Updated dependencies [1277e45]
- Updated dependencies [4357c07]
- Updated dependencies [f6474c1]
- Updated dependencies [873044a]
- Updated dependencies [cb2221f]
- Updated dependencies [5ef0717]
- Updated dependencies [e312530]
- Updated dependencies [63c94ed]
- Updated dependencies [c03c47a]
- Updated dependencies [c22fe0b]
- Updated dependencies [cb9d38e]
- Updated dependencies [d0b6db4]
- Updated dependencies [9b9a82b]
- Updated dependencies [2ad9bd3]
- Updated dependencies [fa5325a]
- Updated dependencies [136c1bc]
- Updated dependencies [8eb7411]
- Updated dependencies [51ce530]
- Updated dependencies [78be38e]
- Updated dependencies [39e013b]
- Updated dependencies [0db7932]
- Updated dependencies [49927f2]
- Updated dependencies [28387bf]
- Updated dependencies [4f04302]
- Updated dependencies [8df54c5]
- Updated dependencies [16e83a3]
- Updated dependencies [fedeb66]
- Updated dependencies [f55637d]
- Updated dependencies [d8c4ace]
- Updated dependencies [d6f819f]
- Updated dependencies [7cd8620]
- Updated dependencies [8651a68]
- Updated dependencies [1a8874b]
- Updated dependencies [983ce71]
- Updated dependencies [e4b450c]
- Updated dependencies [b859987]
- Updated dependencies [164983e]
- Updated dependencies [9ad485e]
- Updated dependencies [0f192e5]
- Updated dependencies [055a591]
- Updated dependencies [80d8389]
- Updated dependencies [dfad76d]
- Updated dependencies [0b9269d]
- Updated dependencies [2006302]
- Updated dependencies [082b5bc]
- Updated dependencies [bb5a2bd]
- Updated dependencies [6e0a0ce]
- Updated dependencies [8c4bc36]
- Updated dependencies [1877fa0]
- Updated dependencies [b493941]
- Updated dependencies [82f9f33]
- Updated dependencies [5ac7bc7]
- Updated dependencies [1dee054]
- Updated dependencies [016175c]
- Updated dependencies [c227c3f]
- Updated dependencies [17efb99]
- Updated dependencies [aeab5ea]
- Updated dependencies [f468c02]
- Updated dependencies [a2acb52]
- Updated dependencies [7273ee1]
- Updated dependencies [3f1cfc5]
- Updated dependencies [3a9f911]
- Updated dependencies [86cb362]
- Updated dependencies [36bb10e]
- Updated dependencies [7acbdc9]
- Updated dependencies [92c78d7]
- Updated dependencies [8b4de17]
- Updated dependencies [a9fc278]
- Updated dependencies [50e50d6]
- Updated dependencies [c17aae8]
- Updated dependencies [af6664c]
- Updated dependencies [5e85599]
- Updated dependencies [9f29ffd]
- Updated dependencies [cd6fdb4]
- Updated dependencies [39f4197]
- Updated dependencies [0def80f]
- Updated dependencies [47b5852]
- Updated dependencies [454c82d]
- Updated dependencies [9f3aa3a]
- Updated dependencies [33ee207]
- Updated dependencies [7dcadee]
- Updated dependencies [82272fc]
- Updated dependencies [83a5c51]
- Updated dependencies [1a38106]
- Updated dependencies [6fc1d78]
- Updated dependencies [3912698]
- Updated dependencies [eea522d]
- Updated dependencies [ce64292]
- Updated dependencies [1b99806]
- Updated dependencies [c4f06a4]
- Updated dependencies [5aca910]
- Updated dependencies [aaf8c4f]
- Updated dependencies [1748c70]
- Updated dependencies [a1d05fc]
- Updated dependencies [f2adbb5]
- Updated dependencies [df4dc0b]
- Updated dependencies [8b8ccc9]
- Updated dependencies [ad503a7]
- Updated dependencies [bd93756]
- Updated dependencies [650bcad]
- Updated dependencies [deb33b3]
- Updated dependencies [5b9967f]
- Updated dependencies [02f4233]
- Updated dependencies [d105b0d]
- Updated dependencies [abb3578]
- Updated dependencies [e88f0b7]
- Updated dependencies [e66eaa3]
- Updated dependencies [d02a6d7]
- Updated dependencies [a4812ac]
- Updated dependencies [e5eb01c]
- Updated dependencies [bd3d4e6]
- Updated dependencies [2171612]
- Updated dependencies [3195164]
- Updated dependencies [aa58557]
- Updated dependencies [6766250]
- Updated dependencies [f88f0f2]
- Updated dependencies [cee6794]
- Updated dependencies [ba3ea68]
- Updated dependencies [0b0912b]
- Updated dependencies [32757e7]
- Updated dependencies [414c31a]
- Updated dependencies [e70d3bc]
- Updated dependencies [831b2cd]
  - @genseki/react@0.1.0
  - @genseki/react-query@0.1.0
  - @genseki/prisma-generator@0.1.0
  - @genseki/plugins@0.1.0
  - @genseki/next@0.1.0
  - @genseki/rest@0.1.0

## 0.1.0-alpha.76

### Patch Changes

- Updated dependencies [[`50e50d6`](https://github.com/softnetics/genseki/commit/50e50d61a6e388952c6693ff3f6328f186243514)]:
  - @genseki/react@0.1.0-alpha.78
  - @genseki/next@0.1.0-alpha.78
  - @genseki/plugins@0.1.0-alpha.78
  - @genseki/prisma-generator@0.1.0-alpha.78
  - @genseki/react-query@0.1.0-alpha.78
  - @genseki/rest@0.1.0-alpha.78

## 0.1.0-alpha.75

### Patch Changes

- Updated dependencies [[`f55637d`](https://github.com/softnetics/genseki/commit/f55637de53b0255421a4e13514beea6970bf1080)]:
  - @genseki/react@0.1.0-alpha.77
  - @genseki/next@0.1.0-alpha.77
  - @genseki/plugins@0.1.0-alpha.77
  - @genseki/prisma-generator@0.1.0-alpha.77
  - @genseki/react-query@0.1.0-alpha.77
  - @genseki/rest@0.1.0-alpha.77

## 0.1.0-alpha.74

### Patch Changes

- Updated dependencies [[`0db7932`](https://github.com/softnetics/genseki/commit/0db7932f1ac83b467d2726721f6b7c5a5d5e29a2)]:
  - @genseki/react@0.1.0-alpha.76
  - @genseki/next@0.1.0-alpha.76
  - @genseki/plugins@0.1.0-alpha.76
  - @genseki/prisma-generator@0.1.0-alpha.76
  - @genseki/react-query@0.1.0-alpha.76
  - @genseki/rest@0.1.0-alpha.76

## 0.1.0-alpha.73

### Patch Changes

- Updated dependencies [[`6e32d75`](https://github.com/softnetics/genseki/commit/6e32d75cad437453d0a88afcb425037258c7c295), [`873044a`](https://github.com/softnetics/genseki/commit/873044a1efbe2f0c3f093a1304887a147e8fef67), [`78be38e`](https://github.com/softnetics/genseki/commit/78be38ec735188b3b1f744618abe63e134d4767f)]:
  - @genseki/react@0.1.0-alpha.75
  - @genseki/next@0.1.0-alpha.75
  - @genseki/plugins@0.1.0-alpha.75
  - @genseki/prisma-generator@0.1.0-alpha.75
  - @genseki/react-query@0.1.0-alpha.75
  - @genseki/rest@0.1.0-alpha.75

## 0.1.0-alpha.72

### Patch Changes

- Updated dependencies [[`6a6f28f`](https://github.com/softnetics/genseki/commit/6a6f28fd739b8f3708eb0faabdbb916adc160c42), [`c4f06a4`](https://github.com/softnetics/genseki/commit/c4f06a4930a26eb4ee318452081c9739c5735677)]:
  - @genseki/react@0.1.0-alpha.74
  - @genseki/next@0.1.0-alpha.74
  - @genseki/plugins@0.1.0-alpha.74
  - @genseki/prisma-generator@0.1.0-alpha.74
  - @genseki/react-query@0.1.0-alpha.74
  - @genseki/rest@0.1.0-alpha.74

## 0.1.0-alpha.71

### Patch Changes

- Updated dependencies [[`e70d3bc`](https://github.com/softnetics/genseki/commit/e70d3bc8e276ef05103c3203adba5f3f59c071a2)]:
  - @genseki/react@0.1.0-alpha.73
  - @genseki/next@0.1.0-alpha.73
  - @genseki/plugins@0.1.0-alpha.73
  - @genseki/prisma-generator@0.1.0-alpha.73
  - @genseki/react-query@0.1.0-alpha.73
  - @genseki/rest@0.1.0-alpha.73

## 0.1.0-alpha.70

### Patch Changes

- Updated dependencies [[`8eb7411`](https://github.com/softnetics/genseki/commit/8eb7411a734fb3570426a68a4a71618b82f4a281)]:
  - @genseki/react@0.1.0-alpha.72
  - @genseki/next@0.1.0-alpha.72
  - @genseki/plugins@0.1.0-alpha.72
  - @genseki/prisma-generator@0.1.0-alpha.72
  - @genseki/react-query@0.1.0-alpha.72
  - @genseki/rest@0.1.0-alpha.72

## 0.1.0-alpha.69

### Patch Changes

- Updated dependencies [[`661f11a`](https://github.com/softnetics/genseki/commit/661f11a3f7013b44bf0fcef5ecc8e04e4b037ded)]:
  - @genseki/react@0.1.0-alpha.71
  - @genseki/next@0.1.0-alpha.71
  - @genseki/plugins@0.1.0-alpha.71
  - @genseki/prisma-generator@0.1.0-alpha.71
  - @genseki/react-query@0.1.0-alpha.71
  - @genseki/rest@0.1.0-alpha.71

## 0.1.0-alpha.68

### Patch Changes

- Updated dependencies [[`fedeb66`](https://github.com/softnetics/genseki/commit/fedeb66aeab007779bdba1cb23930573f9b398c4)]:
  - @genseki/react@0.1.0-alpha.70
  - @genseki/next@0.1.0-alpha.70
  - @genseki/plugins@0.1.0-alpha.70
  - @genseki/prisma-generator@0.1.0-alpha.70
  - @genseki/react-query@0.1.0-alpha.70
  - @genseki/rest@0.1.0-alpha.70

## 0.1.0-alpha.67

### Patch Changes

- Updated dependencies [[`60794b8`](https://github.com/softnetics/genseki/commit/60794b864df1a761e4adf50d0f1a0e746ae11eec)]:
  - @genseki/react@0.1.0-alpha.69
  - @genseki/next@0.1.0-alpha.69
  - @genseki/plugins@0.1.0-alpha.69
  - @genseki/prisma-generator@0.1.0-alpha.69
  - @genseki/react-query@0.1.0-alpha.69
  - @genseki/rest@0.1.0-alpha.69

## 0.1.0-alpha.66

### Patch Changes

- [#257](https://github.com/softnetics/genseki/pull/257) [`055a591`](https://github.com/softnetics/genseki/commit/055a5917b7afea10e40c62088f3ce5f5ed019ce2) Thanks [@intaniger](https://github.com/intaniger)! - feat: added support for custom th className via `meta.thClassName`

- Updated dependencies [[`055a591`](https://github.com/softnetics/genseki/commit/055a5917b7afea10e40c62088f3ce5f5ed019ce2), [`2171612`](https://github.com/softnetics/genseki/commit/2171612a07cf35fa397933fbe27175adf3ac646a)]:
  - @genseki/react@0.1.0-alpha.68
  - @genseki/next@0.1.0-alpha.68
  - @genseki/plugins@0.1.0-alpha.68
  - @genseki/prisma-generator@0.1.0-alpha.68
  - @genseki/react-query@0.1.0-alpha.68
  - @genseki/rest@0.1.0-alpha.68

## 0.1.0-alpha.65

### Patch Changes

- Updated dependencies [[`c03c47a`](https://github.com/softnetics/genseki/commit/c03c47a23477bcde1f5839f020c362da53704cc9)]:
  - @genseki/react@0.1.0-alpha.67
  - @genseki/next@0.1.0-alpha.67
  - @genseki/plugins@0.1.0-alpha.67
  - @genseki/prisma-generator@0.1.0-alpha.67
  - @genseki/react-query@0.1.0-alpha.67
  - @genseki/rest@0.1.0-alpha.67

## 0.1.0-alpha.64

### Patch Changes

- Updated dependencies [[`0f192e5`](https://github.com/softnetics/genseki/commit/0f192e5ee361fc40ebeba840ca7f692d3ca4fb2a)]:
  - @genseki/react@0.1.0-alpha.66
  - @genseki/next@0.1.0-alpha.66
  - @genseki/plugins@0.1.0-alpha.66
  - @genseki/prisma-generator@0.1.0-alpha.66
  - @genseki/react-query@0.1.0-alpha.66
  - @genseki/rest@0.1.0-alpha.66

## 0.1.0-alpha.63

### Patch Changes

- [#251](https://github.com/softnetics/genseki/pull/251) [`a4812ac`](https://github.com/softnetics/genseki/commit/a4812ace26992a7a95deb17d4e7e85bec008fcd3) Thanks [@TeerapatChan](https://github.com/TeerapatChan)! - feat: richtext-editor designs and add link-extension

- Updated dependencies [[`a4812ac`](https://github.com/softnetics/genseki/commit/a4812ace26992a7a95deb17d4e7e85bec008fcd3)]:
  - @genseki/react@0.1.0-alpha.65
  - @genseki/next@0.1.0-alpha.65
  - @genseki/plugins@0.1.0-alpha.65
  - @genseki/prisma-generator@0.1.0-alpha.65
  - @genseki/react-query@0.1.0-alpha.65
  - @genseki/rest@0.1.0-alpha.65

## 0.1.0-alpha.62

### Patch Changes

- [#249](https://github.com/softnetics/genseki/pull/249) [`e4b450c`](https://github.com/softnetics/genseki/commit/e4b450c29201f1e013b78cb16c81af5fa17d3194) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - migrate `date-picker`, `time-input` and more fixes

  1. `typography` component now in the `v2`
  2. Add example for server side sidebar toggle state as a default value (Via data hydration)
  3. Fix `breadcrumb` focus ring color
  4. Fix `sidebar-footer` example, focus ring color.
  5. Fix `group-input-addon` focusing state
  6. Fix `group-input` disable background color
  7. Change button variant `default` to `md`
  8. Make `button-section` and `input-section` default background color to secondary color, so background color of input will be noticable
  9. Add `date-picker` examples (at `date-picker-section`)
  10. Add `time-input` examples (at `input-section`)
  11. New dependencies `date-fns` for `@example/ui-playground` and `react-day-picker` as a peer dependency for `@genseki/react`

- Updated dependencies [[`e4b450c`](https://github.com/softnetics/genseki/commit/e4b450c29201f1e013b78cb16c81af5fa17d3194)]:
  - @genseki/react@0.1.0-alpha.64
  - @genseki/next@0.1.0-alpha.64
  - @genseki/plugins@0.1.0-alpha.64
  - @genseki/prisma-generator@0.1.0-alpha.64
  - @genseki/react-query@0.1.0-alpha.64
  - @genseki/rest@0.1.0-alpha.64

## 0.1.0-alpha.61

### Patch Changes

- Updated dependencies [[`6e0a0ce`](https://github.com/softnetics/genseki/commit/6e0a0cec1c77f0830caa5c21b65bad220ae939c6)]:
  - @genseki/react@0.1.0-alpha.63
  - @genseki/next@0.1.0-alpha.63
  - @genseki/plugins@0.1.0-alpha.63
  - @genseki/prisma-generator@0.1.0-alpha.63
  - @genseki/react-query@0.1.0-alpha.63
  - @genseki/rest@0.1.0-alpha.63

## 0.1.0-alpha.60

### Patch Changes

- [#244](https://github.com/softnetics/genseki/pull/244) [`a2acb52`](https://github.com/softnetics/genseki/commit/a2acb52870d9c91d13123a5632da1aee40856717) Thanks [@TeerapatChan](https://github.com/TeerapatChan)! - chore: update tiptap version

- Updated dependencies [[`a2acb52`](https://github.com/softnetics/genseki/commit/a2acb52870d9c91d13123a5632da1aee40856717)]:
  - @genseki/plugins@0.1.0-alpha.62
  - @genseki/react@0.1.0-alpha.62
  - @genseki/next@0.1.0-alpha.62
  - @genseki/prisma-generator@0.1.0-alpha.62
  - @genseki/react-query@0.1.0-alpha.62
  - @genseki/rest@0.1.0-alpha.62

## 0.1.0-alpha.59

### Patch Changes

- Updated dependencies [[`5ef0717`](https://github.com/softnetics/genseki/commit/5ef0717207c29e0fe2e588f3e0a056c42db36323)]:
  - @genseki/react@0.1.0-alpha.61
  - @genseki/next@0.1.0-alpha.61
  - @genseki/plugins@0.1.0-alpha.61
  - @genseki/prisma-generator@0.1.0-alpha.61
  - @genseki/react-query@0.1.0-alpha.61
  - @genseki/rest@0.1.0-alpha.61

## 0.1.0-alpha.58

### Patch Changes

- Updated dependencies [[`f468c02`](https://github.com/softnetics/genseki/commit/f468c0278c7ff330d80ae2ee079e93324c67fd4d)]:
  - @genseki/react@0.1.0-alpha.60
  - @genseki/next@0.1.0-alpha.60
  - @genseki/plugins@0.1.0-alpha.60
  - @genseki/prisma-generator@0.1.0-alpha.60
  - @genseki/react-query@0.1.0-alpha.60
  - @genseki/rest@0.1.0-alpha.60

## 0.1.0-alpha.57

### Patch Changes

- [#237](https://github.com/softnetics/genseki/pull/237) [`bb5a2bd`](https://github.com/softnetics/genseki/commit/bb5a2bd8997a2b40d895829253e66db7c5dfa3e0) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - - move `shadcn` components to `v2` folder and export the directory
  - flatten `primary` button variant
  - fix: `aria-menu` background
  - rename back the deprecated react-aria components by removing the leading `Aria[component-name]` keyword
- Updated dependencies [[`bb5a2bd`](https://github.com/softnetics/genseki/commit/bb5a2bd8997a2b40d895829253e66db7c5dfa3e0)]:
  - @genseki/react@0.1.0-alpha.59
  - @genseki/next@0.1.0-alpha.59
  - @genseki/plugins@0.1.0-alpha.59
  - @genseki/prisma-generator@0.1.0-alpha.59
  - @genseki/react-query@0.1.0-alpha.59
  - @genseki/rest@0.1.0-alpha.59

## 0.1.0-alpha.56

### Patch Changes

- [#234](https://github.com/softnetics/genseki/pull/234) [`0f10dbb`](https://github.com/softnetics/genseki/commit/0f10dbb2b46fbc48c68f65fdd1348025148121aa) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - - Migrate from `tv` to `cva`

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
  - Migrate `textfield` to Shadcn _(Not completely 100% from entirely project perspective, since some compound component required react aria primitive component as a base, **the change will incrementally adopt**)_
  - Migrate `button` to Shadcn _(Not completely 100% from entirely project perspective, since some compound component required react aria primitive component as a base, **the change will incrementally adopt**)_
  - Create `Shadcn` UI playground for Shadcn particularly
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
    - Command **(from cmdk)**

- [#236](https://github.com/softnetics/genseki/pull/236) [`f88f0f2`](https://github.com/softnetics/genseki/commit/f88f0f23d7e58436707021d66b886288bfa019d8) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - - Deprecated `link` component
  - Remove button `link` variant
  - Add example for `link` usage
  - Update button variants
  - update design tokens
- Updated dependencies [[`0f10dbb`](https://github.com/softnetics/genseki/commit/0f10dbb2b46fbc48c68f65fdd1348025148121aa), [`f88f0f2`](https://github.com/softnetics/genseki/commit/f88f0f23d7e58436707021d66b886288bfa019d8)]:
  - @genseki/react@0.1.0-alpha.58
  - @genseki/next@0.1.0-alpha.58
  - @genseki/plugins@0.1.0-alpha.58
  - @genseki/prisma-generator@0.1.0-alpha.58
  - @genseki/react-query@0.1.0-alpha.58
  - @genseki/rest@0.1.0-alpha.58

## 0.1.0-alpha.55

### Patch Changes

- Updated dependencies [[`f6474c1`](https://github.com/softnetics/genseki/commit/f6474c17dc80ffc994e2593068b68311a6b0950c)]:
  - @genseki/react@0.1.0-alpha.57
  - @genseki/next@0.1.0-alpha.57
  - @genseki/plugins@0.1.0-alpha.57
  - @genseki/prisma-generator@0.1.0-alpha.57
  - @genseki/react-query@0.1.0-alpha.57
  - @genseki/rest@0.1.0-alpha.57

## 0.1.0-alpha.54

### Patch Changes

- Updated dependencies [[`e312530`](https://github.com/softnetics/genseki/commit/e31253024f3d965cb0991988b20655f23feeaa0c)]:
  - @genseki/react@0.1.0-alpha.56
  - @genseki/next@0.1.0-alpha.56
  - @genseki/plugins@0.1.0-alpha.56
  - @genseki/prisma-generator@0.1.0-alpha.56
  - @genseki/react-query@0.1.0-alpha.56
  - @genseki/rest@0.1.0-alpha.56

## 0.1.0-alpha.53

### Patch Changes

- [#223](https://github.com/softnetics/genseki/pull/223) [`0b0912b`](https://github.com/softnetics/genseki/commit/0b0912b755394e675df1db161a5106c14e30ad03) Thanks [@Desmenez](https://github.com/Desmenez)! - [Feat]: add limit to type 'create' and remove button

- Updated dependencies [[`e5eb01c`](https://github.com/softnetics/genseki/commit/e5eb01cf587d733d4da00fb3a08d1887871dac80), [`0b0912b`](https://github.com/softnetics/genseki/commit/0b0912b755394e675df1db161a5106c14e30ad03)]:
  - @genseki/react@0.1.0-alpha.55
  - @genseki/next@0.1.0-alpha.55
  - @genseki/plugins@0.1.0-alpha.55
  - @genseki/prisma-generator@0.1.0-alpha.55
  - @genseki/react-query@0.1.0-alpha.55
  - @genseki/rest@0.1.0-alpha.55

## 0.1.0-alpha.52

### Patch Changes

- Updated dependencies [[`414c31a`](https://github.com/softnetics/genseki/commit/414c31a33983eadd3e998a35a68d006290675295)]:
  - @genseki/react-query@0.1.0-alpha.54
  - @genseki/react@0.1.0-alpha.54
  - @genseki/next@0.1.0-alpha.54
  - @genseki/rest@0.1.0-alpha.54
  - @genseki/plugins@0.1.0-alpha.54
  - @genseki/prisma-generator@0.1.0-alpha.54

## 0.1.0-alpha.51

### Patch Changes

- Updated dependencies [[`218c7e3`](https://github.com/softnetics/genseki/commit/218c7e3daa0e8397a0fecfaa749bd603f87515c4)]:
  - @genseki/react-query@0.1.0-alpha.53
  - @genseki/react@0.1.0-alpha.53
  - @genseki/next@0.1.0-alpha.53
  - @genseki/rest@0.1.0-alpha.53
  - @genseki/plugins@0.1.0-alpha.53
  - @genseki/prisma-generator@0.1.0-alpha.53

## 0.1.0-alpha.50

### Minor Changes

- [#217](https://github.com/softnetics/genseki/pull/217) [`fa5325a`](https://github.com/softnetics/genseki/commit/fa5325a0a8a6bf58b513ae944c386cb827f05b59) Thanks [@Desmenez](https://github.com/Desmenez)! - [Feat] Add combobox as a default connect autoField

### Patch Changes

- Updated dependencies [[`fa5325a`](https://github.com/softnetics/genseki/commit/fa5325a0a8a6bf58b513ae944c386cb827f05b59)]:
  - @genseki/react@0.1.0-alpha.52
  - @genseki/next@0.1.0-alpha.52
  - @genseki/plugins@0.1.0-alpha.52
  - @genseki/prisma-generator@0.1.0-alpha.52
  - @genseki/react-query@0.1.0-alpha.52
  - @genseki/rest@0.1.0-alpha.52

## 0.1.0-alpha.49

### Patch Changes

- [#220](https://github.com/softnetics/genseki/pull/220) [`4357c07`](https://github.com/softnetics/genseki/commit/4357c07ebeb4cc9f07e4106f614746853977d562) Thanks [@t0ngk](https://github.com/t0ngk)! - fix: custom list api

- [#205](https://github.com/softnetics/genseki/pull/205) [`cb9d38e`](https://github.com/softnetics/genseki/commit/cb9d38e8ddc62496b9be4a1879dda39cfbc20cb3) Thanks [@TeerapatChan](https://github.com/TeerapatChan)! - feat: Implement Controlled RichTextEditor

- [#218](https://github.com/softnetics/genseki/pull/218) [`5e85599`](https://github.com/softnetics/genseki/commit/5e855993c0b51defad43476675fa46cdc9284605) Thanks [@Desmenez](https://github.com/Desmenez)! - [Feat] Add custom search placeholder

- Updated dependencies [[`4357c07`](https://github.com/softnetics/genseki/commit/4357c07ebeb4cc9f07e4106f614746853977d562), [`cb9d38e`](https://github.com/softnetics/genseki/commit/cb9d38e8ddc62496b9be4a1879dda39cfbc20cb3), [`d8c4ace`](https://github.com/softnetics/genseki/commit/d8c4ace402196685afef033f184172af626af7a8), [`1877fa0`](https://github.com/softnetics/genseki/commit/1877fa05cbd71bdd3ad917654931bbe5b0089717), [`3f1cfc5`](https://github.com/softnetics/genseki/commit/3f1cfc5b2618d90b2c90a4edf6ca652ea59c1f41), [`5e85599`](https://github.com/softnetics/genseki/commit/5e855993c0b51defad43476675fa46cdc9284605)]:
  - @genseki/react@0.1.0-alpha.51
  - @genseki/next@0.1.0-alpha.51
  - @genseki/plugins@0.1.0-alpha.51
  - @genseki/prisma-generator@0.1.0-alpha.51
  - @genseki/react-query@0.1.0-alpha.51
  - @genseki/rest@0.1.0-alpha.51

## 0.1.0-alpha.48

### Patch Changes

- [#211](https://github.com/softnetics/genseki/pull/211) [`eea522d`](https://github.com/softnetics/genseki/commit/eea522dc4d3b1a4d4bcf771f9b943ad1c7c2503d) Thanks [@jettapat-metier](https://github.com/jettapat-metier)! - [Fix] Change type date in zod schema

- Updated dependencies [[`eea522d`](https://github.com/softnetics/genseki/commit/eea522dc4d3b1a4d4bcf771f9b943ad1c7c2503d)]:
  - @genseki/react@0.1.0-alpha.50
  - @genseki/next@0.1.0-alpha.50
  - @genseki/plugins@0.1.0-alpha.50
  - @genseki/prisma-generator@0.1.0-alpha.50
  - @genseki/react-query@0.1.0-alpha.50
  - @genseki/rest@0.1.0-alpha.50

## 0.1.0-alpha.47

### Patch Changes

- Updated dependencies [[`80d8389`](https://github.com/softnetics/genseki/commit/80d8389fe70f74867aaf6241559fa0d38d3e87c9)]:
  - @genseki/react@0.1.0-alpha.49
  - @genseki/next@0.1.0-alpha.49
  - @genseki/plugins@0.1.0-alpha.49
  - @genseki/prisma-generator@0.1.0-alpha.49
  - @genseki/react-query@0.1.0-alpha.49
  - @genseki/rest@0.1.0-alpha.49

## 0.1.0-alpha.46

### Patch Changes

- Updated dependencies [[`32757e7`](https://github.com/softnetics/genseki/commit/32757e7757b6f23f79ae7c29044eb380b391c2de)]:
  - @genseki/react-query@0.1.0-alpha.48
  - @genseki/react@0.1.0-alpha.48
  - @genseki/next@0.1.0-alpha.48
  - @genseki/rest@0.1.0-alpha.48
  - @genseki/plugins@0.1.0-alpha.48
  - @genseki/prisma-generator@0.1.0-alpha.48

## 0.1.0-alpha.45

### Patch Changes

- [#204](https://github.com/softnetics/genseki/pull/204) [`abb3578`](https://github.com/softnetics/genseki/commit/abb3578fd869e60007dc4aebbcd344aaddd89903) Thanks [@jettapat-metier](https://github.com/jettapat-metier)! - [Fix] Display required error message

- Updated dependencies [[`abb3578`](https://github.com/softnetics/genseki/commit/abb3578fd869e60007dc4aebbcd344aaddd89903)]:
  - @genseki/react@0.1.0-alpha.47
  - @genseki/next@0.1.0-alpha.47
  - @genseki/plugins@0.1.0-alpha.47
  - @genseki/prisma-generator@0.1.0-alpha.47
  - @genseki/react-query@0.1.0-alpha.47
  - @genseki/rest@0.1.0-alpha.47

## 0.1.0-alpha.44

### Patch Changes

- [#193](https://github.com/softnetics/genseki/pull/193) [`b0301bc`](https://github.com/softnetics/genseki/commit/b0301bc28d336b96816b5b932ec010b490cc1fbb) Thanks [@jettapat-metier](https://github.com/jettapat-metier)! - [Feature] Uploading image to storage in rich text

- [#198](https://github.com/softnetics/genseki/pull/198) [`cb2221f`](https://github.com/softnetics/genseki/commit/cb2221f49c979a33701598fb81b187b4a057e646) Thanks [@jettapat-metier](https://github.com/jettapat-metier)! - [Feature] Upgrade to support relation table for searching and sorting

- [#203](https://github.com/softnetics/genseki/pull/203) [`b590f41`](https://github.com/softnetics/genseki/commit/b590f4110e1f5e488d41e089fd1e5fd06152c170) Thanks [@TeerapatChan](https://github.com/TeerapatChan)! - fix: add min-height of richtext

- Updated dependencies [[`b0301bc`](https://github.com/softnetics/genseki/commit/b0301bc28d336b96816b5b932ec010b490cc1fbb), [`cb2221f`](https://github.com/softnetics/genseki/commit/cb2221f49c979a33701598fb81b187b4a057e646), [`28387bf`](https://github.com/softnetics/genseki/commit/28387bfadbb87537c21f4fbcf3ec9af53693efb3)]:
  - @genseki/react@0.1.0-alpha.46
  - @genseki/react-query@0.1.0-alpha.46
  - @genseki/next@0.1.0-alpha.46
  - @genseki/plugins@0.1.0-alpha.46
  - @genseki/prisma-generator@0.1.0-alpha.46
  - @genseki/rest@0.1.0-alpha.46

## 0.1.0-alpha.43

### Patch Changes

- Updated dependencies [[`51ce530`](https://github.com/softnetics/genseki/commit/51ce530c0bd64ec0d82b6da8954997f834e1d740), [`39e013b`](https://github.com/softnetics/genseki/commit/39e013bc52b3e5ebf4659e48698163e9a4642cdc), [`831b2cd`](https://github.com/softnetics/genseki/commit/831b2cd5c2e7d46a40df01e0c73b5cc08c5ff928)]:
  - @genseki/react@0.1.0-alpha.45
  - @genseki/next@0.1.0-alpha.45
  - @genseki/plugins@0.1.0-alpha.45
  - @genseki/prisma-generator@0.1.0-alpha.45
  - @genseki/react-query@0.1.0-alpha.45
  - @genseki/rest@0.1.0-alpha.45

## 0.1.0-alpha.42

### Patch Changes

- [#164](https://github.com/softnetics/genseki/pull/164) [`e88f0b7`](https://github.com/softnetics/genseki/commit/e88f0b7a2fd523a5e769579db9e86c9524385187) Thanks [@t0ngk](https://github.com/t0ngk)! - feat: add action select

- Updated dependencies [[`e88f0b7`](https://github.com/softnetics/genseki/commit/e88f0b7a2fd523a5e769579db9e86c9524385187)]:
  - @genseki/react@0.1.0-alpha.44
  - @genseki/next@0.1.0-alpha.44
  - @genseki/plugins@0.1.0-alpha.44
  - @genseki/prisma-generator@0.1.0-alpha.44
  - @genseki/react-query@0.1.0-alpha.44
  - @genseki/rest@0.1.0-alpha.44

## 0.1.0-alpha.41

### Patch Changes

- Updated dependencies [[`a2050f0`](https://github.com/softnetics/genseki/commit/a2050f0a29a3779514e90c7e94a8e81aa0c87eb7), [`92c78d7`](https://github.com/softnetics/genseki/commit/92c78d7bd0e2badfb106a95255bac971c2b87980)]:
  - @genseki/next@0.1.0-alpha.43
  - @genseki/plugins@0.1.0-alpha.43
  - @genseki/react@0.1.0-alpha.43
  - @genseki/rest@0.1.0-alpha.43
  - @genseki/react-query@0.1.0-alpha.43
  - @genseki/prisma-generator@0.1.0-alpha.43

## 0.1.0-alpha.40

### Patch Changes

- [#181](https://github.com/softnetics/genseki/pull/181) [`83a5c51`](https://github.com/softnetics/genseki/commit/83a5c51c744b9cc316d072e3b13ceec592065ef8) Thanks [@saenyakorn](https://github.com/saenyakorn)! - Fix phone plugin bugs and simplify error code

- Updated dependencies [[`83a5c51`](https://github.com/softnetics/genseki/commit/83a5c51c744b9cc316d072e3b13ceec592065ef8)]:
  - @genseki/plugins@0.1.0-alpha.42
  - @genseki/react@0.1.0-alpha.42
  - @genseki/next@0.1.0-alpha.42
  - @genseki/rest@0.1.0-alpha.42
  - @genseki/react-query@0.1.0-alpha.42
  - @genseki/prisma-generator@0.1.0-alpha.42

## 0.1.0-alpha.39

### Patch Changes

- Updated dependencies [[`833fefd`](https://github.com/softnetics/genseki/commit/833fefd29b42294e4f0a7b1c0b822081d9438b76)]:
  - @genseki/plugins@0.1.0-alpha.41
  - @genseki/react@0.1.0-alpha.41
  - @genseki/next@0.1.0-alpha.41
  - @genseki/rest@0.1.0-alpha.41
  - @genseki/react-query@0.1.0-alpha.41
  - @genseki/prisma-generator@0.1.0-alpha.41

## 0.1.0-alpha.38

### Patch Changes

- [#177](https://github.com/softnetics/genseki/pull/177) [`8df54c5`](https://github.com/softnetics/genseki/commit/8df54c5d450bb36de3a10a5196054eb7d269238a) Thanks [@saenyakorn](https://github.com/saenyakorn)! - Fix Forgot password and Change phone bugs in phone plugin

- Updated dependencies [[`8df54c5`](https://github.com/softnetics/genseki/commit/8df54c5d450bb36de3a10a5196054eb7d269238a), [`ce64292`](https://github.com/softnetics/genseki/commit/ce64292f015c633cd133981e2882a9ec1366b759)]:
  - @genseki/next@0.1.0-alpha.40
  - @genseki/plugins@0.1.0-alpha.40
  - @genseki/react@0.1.0-alpha.40
  - @genseki/rest@0.1.0-alpha.40
  - @genseki/react-query@0.1.0-alpha.40
  - @genseki/prisma-generator@0.1.0-alpha.40

## 0.1.0-alpha.37

### Patch Changes

- Updated dependencies [[`6766250`](https://github.com/softnetics/genseki/commit/6766250a284955f49b58120b1266d84a95faedfe)]:
  - @genseki/plugins@0.1.0-alpha.39
  - @genseki/react@0.1.0-alpha.39
  - @genseki/next@0.1.0-alpha.39
  - @genseki/prisma-generator@0.1.0-alpha.39
  - @genseki/react-query@0.1.0-alpha.39
  - @genseki/rest@0.1.0-alpha.39

## 0.1.0-alpha.36

### Patch Changes

- Updated dependencies [[`1748c70`](https://github.com/softnetics/genseki/commit/1748c704261b93eb3ac8c92dcdb552077c4d0cca)]:
  - @genseki/react@0.1.0-alpha.38
  - @genseki/next@0.1.0-alpha.38
  - @genseki/plugins@0.1.0-alpha.38
  - @genseki/prisma-generator@0.1.0-alpha.38
  - @genseki/react-query@0.1.0-alpha.38
  - @genseki/rest@0.1.0-alpha.38

## 0.1.0-alpha.35

### Patch Changes

- [#162](https://github.com/softnetics/genseki/pull/162) [`36bb10e`](https://github.com/softnetics/genseki/commit/36bb10e56c271b385e921dbac9ad202cef28d861) Thanks [@saenyakorn](https://github.com/saenyakorn)! - Refactor Collection Model

- [#167](https://github.com/softnetics/genseki/pull/167) [`cd6fdb4`](https://github.com/softnetics/genseki/commit/cd6fdb40390e585364ed3bfdf9e00d72e8e3b1f0) Thanks [@t0ngk](https://github.com/t0ngk)! - fix: can't delete single

- [#169](https://github.com/softnetics/genseki/pull/169) [`02f4233`](https://github.com/softnetics/genseki/commit/02f4233513a8a042b5844eb8393f94925b8053d1) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Feature] Implement a plugin for phone authentication

- [#170](https://github.com/softnetics/genseki/pull/170) [`d105b0d`](https://github.com/softnetics/genseki/commit/d105b0d1d42f2c76b200a8feaefec4e3325f2887) Thanks [@intaniger](https://github.com/intaniger)! - Customizable create page, developer can render a customized page via `config.page` when adding create page with `CollectionBuilder.create`.

  ```ts
  collection.create(fields, { options: options, page: /* Your customized create page */ })
  ```

  For working example, see https://github.com/softnetics/genseki/blob/8b38a1ab9379330e290eb8633dcbf8106ae435b8/examples/erp/genseki/collections/posts.client.tsx#L318-L390

- Updated dependencies [[`36bb10e`](https://github.com/softnetics/genseki/commit/36bb10e56c271b385e921dbac9ad202cef28d861), [`af6664c`](https://github.com/softnetics/genseki/commit/af6664cd347354d0f9bf8bc3d194d90964c63adc), [`cd6fdb4`](https://github.com/softnetics/genseki/commit/cd6fdb40390e585364ed3bfdf9e00d72e8e3b1f0), [`02f4233`](https://github.com/softnetics/genseki/commit/02f4233513a8a042b5844eb8393f94925b8053d1), [`d105b0d`](https://github.com/softnetics/genseki/commit/d105b0d1d42f2c76b200a8feaefec4e3325f2887)]:
  - @genseki/next@0.1.0-alpha.37
  - @genseki/plugins@0.1.0-alpha.37
  - @genseki/react-query@0.1.0-alpha.37
  - @genseki/react@0.1.0-alpha.37
  - @genseki/prisma-generator@0.1.0-alpha.37
  - @genseki/rest@0.1.0-alpha.37

## 0.1.0-alpha.34

### Patch Changes

- [#156](https://github.com/softnetics/genseki/pull/156) [`dfad76d`](https://github.com/softnetics/genseki/commit/dfad76d328581be2a322609628a920771ad0013a) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - Custimizable list page UI and components, developer can compose the entirely page from scratch

- Updated dependencies [[`dfad76d`](https://github.com/softnetics/genseki/commit/dfad76d328581be2a322609628a920771ad0013a), [`82f9f33`](https://github.com/softnetics/genseki/commit/82f9f331f8441baeb4ecece932dbc5f16c27852d)]:
  - @genseki/react@0.1.0-alpha.36
  - @genseki/next@0.1.0-alpha.36
  - @genseki/plugins@0.1.0-alpha.36
  - @genseki/prisma-generator@0.1.0-alpha.36
  - @genseki/react-query@0.1.0-alpha.36
  - @genseki/rest@0.1.0-alpha.36

## 0.1.0-alpha.33

### Patch Changes

- Updated dependencies [[`8651a68`](https://github.com/softnetics/genseki/commit/8651a686aa8c96f5e97ca0f9d67a062d499b1485)]:
  - @genseki/react@0.1.0-alpha.35
  - @genseki/next@0.1.0-alpha.35
  - @genseki/plugins@0.1.0-alpha.35
  - @genseki/prisma-generator@0.1.0-alpha.35
  - @genseki/react-query@0.1.0-alpha.35
  - @genseki/rest@0.1.0-alpha.35

## 0.1.0-alpha.32

### Patch Changes

- [#154](https://github.com/softnetics/genseki/pull/154) [`4f04302`](https://github.com/softnetics/genseki/commit/4f04302a46e85a52b2f07156ec77fe55a17a4367) Thanks [@jettapat-metier](https://github.com/jettapat-metier)! - [Feature] Add delete object from storage

- Updated dependencies [[`4f04302`](https://github.com/softnetics/genseki/commit/4f04302a46e85a52b2f07156ec77fe55a17a4367)]:
  - @genseki/react@0.1.0-alpha.34
  - @genseki/next@0.1.0-alpha.34
  - @genseki/plugins@0.1.0-alpha.34
  - @genseki/prisma-generator@0.1.0-alpha.34
  - @genseki/react-query@0.1.0-alpha.34
  - @genseki/rest@0.1.0-alpha.34

## 0.1.0-alpha.31

### Patch Changes

- Updated dependencies [[`b1908d1`](https://github.com/softnetics/genseki/commit/b1908d164c623e2e9e409e7426e5948c75783e40)]:
  - @genseki/react@0.1.0-alpha.33
  - @genseki/next@0.1.0-alpha.33
  - @genseki/plugins@0.1.0-alpha.33
  - @genseki/prisma-generator@0.1.0-alpha.33
  - @genseki/react-query@0.1.0-alpha.33
  - @genseki/rest@0.1.0-alpha.33

## 0.1.0-alpha.30

### Patch Changes

- Updated dependencies [[`3a9f911`](https://github.com/softnetics/genseki/commit/3a9f911e96104c9f7d82fc5aef4b0ddd435a0a47), [`bd93756`](https://github.com/softnetics/genseki/commit/bd93756ef1db834e49e67e6bf62e8b31fcba546d)]:
  - @genseki/react@0.1.0-alpha.32
  - @genseki/next@0.1.0-alpha.32
  - @genseki/plugins@0.1.0-alpha.32
  - @genseki/prisma-generator@0.1.0-alpha.32
  - @genseki/react-query@0.1.0-alpha.32
  - @genseki/rest@0.1.0-alpha.32

## 0.1.0-alpha.29

### Patch Changes

- [#146](https://github.com/softnetics/genseki/pull/146) [`650bcad`](https://github.com/softnetics/genseki/commit/650bcad59781c3e32b8a28f91e22e6e23759035b) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Fix] `getFieldsClient` wrong omit field

- Updated dependencies [[`650bcad`](https://github.com/softnetics/genseki/commit/650bcad59781c3e32b8a28f91e22e6e23759035b)]:
  - @genseki/react@0.1.0-alpha.31
  - @genseki/next@0.1.0-alpha.31
  - @genseki/plugins@0.1.0-alpha.31
  - @genseki/prisma-generator@0.1.0-alpha.31
  - @genseki/react-query@0.1.0-alpha.31
  - @genseki/rest@0.1.0-alpha.31

## 0.1.0-alpha.28

### Patch Changes

- [#141](https://github.com/softnetics/genseki/pull/141) [`72ddbd9`](https://github.com/softnetics/genseki/commit/72ddbd9f6d4cc931f35e71208a53e9f912101c47) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Feature] implement proper way to handle options and conditional disabling

- Updated dependencies [[`72ddbd9`](https://github.com/softnetics/genseki/commit/72ddbd9f6d4cc931f35e71208a53e9f912101c47)]:
  - @genseki/plugins@0.1.0-alpha.30
  - @genseki/react@0.1.0-alpha.30
  - @genseki/next@0.1.0-alpha.30
  - @genseki/prisma-generator@0.1.0-alpha.30
  - @genseki/react-query@0.1.0-alpha.30
  - @genseki/rest@0.1.0-alpha.30

## 0.1.0-alpha.27

### Patch Changes

- Updated dependencies [[`16e83a3`](https://github.com/softnetics/genseki/commit/16e83a305e9387389856b4d566c79df9742a301a)]:
  - @genseki/react@0.1.0-alpha.29
  - @genseki/next@0.1.0-alpha.29
  - @genseki/plugins@0.1.0-alpha.29
  - @genseki/prisma-generator@0.1.0-alpha.29
  - @genseki/react-query@0.1.0-alpha.29
  - @genseki/rest@0.1.0-alpha.29

## 0.1.0-alpha.26

### Patch Changes

- Updated dependencies [[`1b99806`](https://github.com/softnetics/genseki/commit/1b998067c7745169c9787cdd96257e5e122dfcad)]:
  - @genseki/react-query@0.1.0-alpha.28
  - @genseki/react@0.1.0-alpha.28
  - @genseki/next@0.1.0-alpha.28
  - @genseki/rest@0.1.0-alpha.28
  - @genseki/plugins@0.1.0-alpha.28
  - @genseki/prisma-generator@0.1.0-alpha.28

## 0.1.0-alpha.25

### Patch Changes

- [#135](https://github.com/softnetics/genseki/pull/135) [`b651962`](https://github.com/softnetics/genseki/commit/b651962d991bd956285a80e08ebddd51bf5506f7) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Fix] Prisma generator bin name

- Updated dependencies [[`b651962`](https://github.com/softnetics/genseki/commit/b651962d991bd956285a80e08ebddd51bf5506f7), [`164983e`](https://github.com/softnetics/genseki/commit/164983e46de25b2f016fa6208906f67e4211e3b8), [`e66eaa3`](https://github.com/softnetics/genseki/commit/e66eaa3477b2af61244cac5fea5fb60d7c02c976)]:
  - @genseki/prisma-generator@0.1.0-alpha.27
  - @genseki/react@0.1.0-alpha.27
  - @genseki/react-query@0.1.0-alpha.27
  - @genseki/next@0.1.0-alpha.27
  - @genseki/plugins@0.1.0-alpha.27
  - @genseki/rest@0.1.0-alpha.27

## 0.1.0-alpha.24

### Patch Changes

- Updated dependencies [[`983ce71`](https://github.com/softnetics/genseki/commit/983ce71ff2ba07f182ed7edf898bb05bfd785be9), [`2006302`](https://github.com/softnetics/genseki/commit/2006302a31dfda6c5d15de0b756340e0a37b30b3)]:
  - @genseki/react@0.1.0-alpha.26
  - @genseki/next@0.1.0-alpha.26
  - @genseki/plugins@0.1.0-alpha.26
  - @genseki/prisma-generator@0.1.0-alpha.26
  - @genseki/react-query@0.1.0-alpha.26
  - @genseki/rest@0.1.0-alpha.26

## 0.1.0-alpha.23

### Patch Changes

- [#124](https://github.com/softnetics/genseki/pull/124) [`2ad9bd3`](https://github.com/softnetics/genseki/commit/2ad9bd3ba73e8516005cd2a0c705d87a14d7e895) Thanks [@Desmenez](https://github.com/Desmenez)! - fix genseki table ui and search

- Updated dependencies [[`2ad9bd3`](https://github.com/softnetics/genseki/commit/2ad9bd3ba73e8516005cd2a0c705d87a14d7e895)]:
  - @genseki/react@0.1.0-alpha.25
  - @genseki/next@0.1.0-alpha.25
  - @genseki/plugins@0.1.0-alpha.25
  - @genseki/prisma-generator@0.1.0-alpha.25
  - @genseki/react-query@0.1.0-alpha.25
  - @genseki/rest@0.1.0-alpha.25

## 0.1.0-alpha.22

### Patch Changes

- [#122](https://github.com/softnetics/genseki/pull/122) [`b493941`](https://github.com/softnetics/genseki/commit/b493941c52e942dd93cce906624afe0e52cfe50f) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Feature] Type-safe me API endpoint

- Updated dependencies [[`b493941`](https://github.com/softnetics/genseki/commit/b493941c52e942dd93cce906624afe0e52cfe50f), [`5aca910`](https://github.com/softnetics/genseki/commit/5aca9102e847100fee50672e397f618e99f1eac2)]:
  - @genseki/react@0.1.0-alpha.24
  - @genseki/next@0.1.0-alpha.24
  - @genseki/plugins@0.1.0-alpha.24
  - @genseki/prisma-generator@0.1.0-alpha.24
  - @genseki/react-query@0.1.0-alpha.24
  - @genseki/rest@0.1.0-alpha.24

## 0.1.0-alpha.21

### Patch Changes

- [#109](https://github.com/softnetics/genseki/pull/109) [`0c2645b`](https://github.com/softnetics/genseki/commit/0c2645bc6f36ae2f6857442352705056b8c121e7) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Feature] Add options to customize Table using Tanstack table
  [Fix] Move identifierColumn under Fields
- Updated dependencies [[`0c2645b`](https://github.com/softnetics/genseki/commit/0c2645bc6f36ae2f6857442352705056b8c121e7), [`1a8874b`](https://github.com/softnetics/genseki/commit/1a8874b1c74515b6e8af33aed9b400e1e2b6345d), [`454c82d`](https://github.com/softnetics/genseki/commit/454c82d7c5b3ecb1c68b9fdc8e73a4c3d604ec00)]:
  - @genseki/react@0.1.0-alpha.23
  - @genseki/next@0.1.0-alpha.23
  - @genseki/plugins@0.1.0-alpha.23
  - @genseki/prisma-generator@0.1.0-alpha.23
  - @genseki/react-query@0.1.0-alpha.23
  - @genseki/rest@0.1.0-alpha.23

## 0.1.0-alpha.20

### Patch Changes

- [#117](https://github.com/softnetics/genseki/pull/117) [`d6f819f`](https://github.com/softnetics/genseki/commit/d6f819fa8a24ec94a26ce15d6f6acf507eed0d65) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Fix] plugin type and make `userId` in verification to be optional

- Updated dependencies [[`d6f819f`](https://github.com/softnetics/genseki/commit/d6f819fa8a24ec94a26ce15d6f6acf507eed0d65)]:
  - @genseki/plugins@0.1.0-alpha.22
  - @genseki/react@0.1.0-alpha.22
  - @genseki/next@0.1.0-alpha.22
  - @genseki/prisma-generator@0.1.0-alpha.22
  - @genseki/react-query@0.1.0-alpha.22
  - @genseki/rest@0.1.0-alpha.22

## 0.1.0-alpha.19

### Patch Changes

- [#115](https://github.com/softnetics/genseki/pull/115) [`c17aae8`](https://github.com/softnetics/genseki/commit/c17aae82c4065e5964c20b617e0e8d80cec97cae) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Fix] Improve Plugin type-guard

- Updated dependencies [[`c17aae8`](https://github.com/softnetics/genseki/commit/c17aae82c4065e5964c20b617e0e8d80cec97cae)]:
  - @genseki/plugins@0.1.0-alpha.21
  - @genseki/react@0.1.0-alpha.21
  - @genseki/next@0.1.0-alpha.21
  - @genseki/prisma-generator@0.1.0-alpha.21
  - @genseki/react-query@0.1.0-alpha.21
  - @genseki/rest@0.1.0-alpha.21

## 0.1.0-alpha.18

### Patch Changes

- Updated dependencies [[`86ffa1a`](https://github.com/softnetics/genseki/commit/86ffa1a1d238b38dccfa87b137e8382d611729e2)]:
  - @genseki/prisma-generator@0.1.0-alpha.20
  - @genseki/react@0.1.0-alpha.20
  - @genseki/next@0.1.0-alpha.20
  - @genseki/rest@0.1.0-alpha.20
  - @genseki/react-query@0.1.0-alpha.20
  - @genseki/plugins@0.1.0-alpha.20

## 0.1.0-alpha.17

### Patch Changes

- [#104](https://github.com/softnetics/genseki/pull/104) [`5ac7bc7`](https://github.com/softnetics/genseki/commit/5ac7bc745e526423a88ad83e8f050e18ffb22f86) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Feature] Improve Email and Password flexibility

- [#100](https://github.com/softnetics/genseki/pull/100) [`c227c3f`](https://github.com/softnetics/genseki/commit/c227c3f476349511033b23b7080010e786d650a4) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Breaking] Replace Drizzle with Prisma

- [#108](https://github.com/softnetics/genseki/pull/108) [`9f3aa3a`](https://github.com/softnetics/genseki/commit/9f3aa3a3aaafb970c091146979ee0e26dd5ca919) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Breaking] Allow multiple fields in one collection

- Updated dependencies [[`5ac7bc7`](https://github.com/softnetics/genseki/commit/5ac7bc745e526423a88ad83e8f050e18ffb22f86), [`c227c3f`](https://github.com/softnetics/genseki/commit/c227c3f476349511033b23b7080010e786d650a4), [`9f3aa3a`](https://github.com/softnetics/genseki/commit/9f3aa3a3aaafb970c091146979ee0e26dd5ca919)]:
  - @genseki/plugins@0.1.0-alpha.19
  - @genseki/react@0.1.0-alpha.19
  - @genseki/next@0.1.0-alpha.19
  - @genseki/prisma-generator@0.1.0-alpha.19
  - @genseki/react-query@0.1.0-alpha.19
  - @genseki/rest@0.1.0-alpha.19

## 0.1.0-alpha.16

### Patch Changes

- Updated dependencies [[`0b9269d`](https://github.com/softnetics/genseki/commit/0b9269dcc3830afc395363d7f1e94cecd33e6b03)]:
  - @genseki/react@0.1.0-alpha.18
  - @genseki/next@0.1.0-alpha.18
  - @genseki/plugins@0.1.0-alpha.18
  - @genseki/react-query@0.1.0-alpha.18
  - @genseki/rest@0.1.0-alpha.18

## 0.1.0-alpha.15

### Patch Changes

- Updated dependencies [[`082b5bc`](https://github.com/softnetics/genseki/commit/082b5bc747adff6c0adc5526f80b8ea2aedd0b8e), [`f2adbb5`](https://github.com/softnetics/genseki/commit/f2adbb590d9a4795eb4afebaad032cf39f25aa8d)]:
  - @genseki/react@0.1.0-alpha.17
  - @genseki/next@0.1.0-alpha.17
  - @genseki/plugins@0.1.0-alpha.17
  - @genseki/react-query@0.1.0-alpha.17
  - @genseki/rest@0.1.0-alpha.17

## 0.1.0-alpha.14

### Patch Changes

- [#90](https://github.com/softnetics/genseki/pull/90) [`63c94ed`](https://github.com/softnetics/genseki/commit/63c94ed9ff12730d2fa6121f6d3215ec906aff23) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Breaking] Change context model to user-defined context

- [#94](https://github.com/softnetics/genseki/pull/94) [`7acbdc9`](https://github.com/softnetics/genseki/commit/7acbdc902aace63590a0a45f8ac9d67a57c1c7de) Thanks [@saenyakorn](https://github.com/saenyakorn)! - [Breaking] Change core model of Genseki

- Updated dependencies [[`b56cc5e`](https://github.com/softnetics/genseki/commit/b56cc5e2135a7e15cccb0595fc266d329e027a87), [`63c94ed`](https://github.com/softnetics/genseki/commit/63c94ed9ff12730d2fa6121f6d3215ec906aff23), [`7acbdc9`](https://github.com/softnetics/genseki/commit/7acbdc902aace63590a0a45f8ac9d67a57c1c7de)]:
  - @genseki/react@0.1.0-alpha.16
  - @genseki/next@0.1.0-alpha.16
  - @genseki/plugins@0.1.0-alpha.16
  - @genseki/react-query@0.1.0-alpha.16
  - @genseki/rest@0.1.0-alpha.16

## 0.1.0-alpha.13

### Patch Changes

- Updated dependencies [[`9ad485e`](https://github.com/softnetics/genseki/commit/9ad485eedfd3e890d8f58158b7c7b25b27cdbe87), [`5b9967f`](https://github.com/softnetics/genseki/commit/5b9967f2882419867d860045e977bd3834f7bd17)]:
  - @genseki/react@0.1.0-alpha.15
  - @genseki/plugins@0.1.0-alpha.15
  - @genseki/next@0.1.0-alpha.15
  - @genseki/react-query@0.1.0-alpha.15
  - @genseki/rest@0.1.0-alpha.15

## 0.1.0-alpha.12

### Patch Changes

- Updated dependencies [[`17efb99`](https://github.com/softnetics/genseki/commit/17efb99fb6f2621cf7d808e12e38ddfc52031240)]:
  - @genseki/react@0.1.0-alpha.14
  - @genseki/next@0.1.0-alpha.14
  - @genseki/plugins@0.1.0-alpha.14
  - @genseki/react-query@0.1.0-alpha.14
  - @genseki/rest@0.1.0-alpha.14

## 0.1.0-alpha.11

### Patch Changes

- [#81](https://github.com/softnetics/genseki/pull/81) [`a9fc278`](https://github.com/softnetics/genseki/commit/a9fc2786cf838a12b3b701d0cdb008ce24da2878) Thanks [@t0ngk](https://github.com/t0ngk)! - Functional create or connect many relations
  Fix duplicate fields when have more than one field
- Updated dependencies [[`a9fc278`](https://github.com/softnetics/genseki/commit/a9fc2786cf838a12b3b701d0cdb008ce24da2878)]:
  - @genseki/react@0.1.0-alpha.13
  - @genseki/next@0.1.0-alpha.13
  - @genseki/plugins@0.1.0-alpha.13
  - @genseki/react-query@0.1.0-alpha.13
  - @genseki/rest@0.1.0-alpha.13

## 0.1.0-alpha.10

### Patch Changes

- Updated dependencies [[`4322698`](https://github.com/softnetics/genseki/commit/4322698c86e3677d031f158e0102ddd020321700)]:
  - @genseki/react@0.1.0-alpha.12
  - @genseki/next@0.1.0-alpha.12
  - @genseki/plugins@0.1.0-alpha.12
  - @genseki/react-query@0.1.0-alpha.12
  - @genseki/rest@0.1.0-alpha.12

## 0.1.0-alpha.9

### Patch Changes

- Updated dependencies [[`51dd567`](https://github.com/softnetics/genseki/commit/51dd567d24373d87a233b8993dad1fdb85c61b1b)]:
  - @genseki/next@0.1.0-alpha.11
  - @genseki/react@0.1.0-alpha.11
  - @genseki/rest@0.1.0-alpha.11
  - @genseki/react-query@0.1.0-alpha.11
  - @genseki/plugins@0.1.0-alpha.11

## 0.1.0-alpha.8

### Patch Changes

- Updated dependencies [[`ba3ea68`](https://github.com/softnetics/genseki/commit/ba3ea6839f707612ee71a5123c0eca99376ac905)]:
  - @genseki/next@0.1.0-alpha.10
  - @genseki/react@0.1.0-alpha.10
  - @genseki/rest@0.1.0-alpha.10
  - @genseki/react-query@0.1.0-alpha.10
  - @genseki/plugins@0.1.0-alpha.10

## 0.1.0-alpha.7

### Patch Changes

- Updated dependencies [[`6fc1d78`](https://github.com/softnetics/genseki/commit/6fc1d787522c0df9d17125f70fb2338f4033d002)]:
  - @genseki/react-query@0.1.0-alpha.9
  - @genseki/react@0.1.0-alpha.9
  - @genseki/next@0.1.0-alpha.9
  - @genseki/rest@0.1.0-alpha.9
  - @genseki/plugins@0.1.0-alpha.9

## 0.1.0-alpha.6

### Patch Changes

- [#67](https://github.com/softnetics/genseki/pull/67) [`49927f2`](https://github.com/softnetics/genseki/commit/49927f2f7593ad4c43895789948291b02e52f2bb) Thanks [@saenyakorn](https://github.com/saenyakorn)! - Add Phone plugins

- Updated dependencies [[`49927f2`](https://github.com/softnetics/genseki/commit/49927f2f7593ad4c43895789948291b02e52f2bb), [`39f4197`](https://github.com/softnetics/genseki/commit/39f41976fac7c62ea30456ed4a6ef411925fb7de)]:
  - @genseki/plugins@0.1.0-alpha.8
  - @genseki/react@0.1.0-alpha.8
  - @genseki/rest@0.1.0-alpha.8
  - @genseki/next@0.1.0-alpha.8
  - @genseki/react-query@0.1.0-alpha.8

## 0.1.0-alpha.5

### Patch Changes

- [#62](https://github.com/softnetics/genseki/pull/62) [`cef24e5`](https://github.com/softnetics/genseki/commit/cef24e50e0678b35af8d8a38ded86c49f0777e2f) Thanks [@saenyakorn](https://github.com/saenyakorn)! - Upgrade Zod version to 3.25.67

- Updated dependencies [[`cef24e5`](https://github.com/softnetics/genseki/commit/cef24e50e0678b35af8d8a38ded86c49f0777e2f)]:
  - @genseki/react@0.1.0-alpha.7
  - @genseki/next@0.1.0-alpha.7
  - @genseki/react-query@0.1.0-alpha.7
  - @genseki/rest@0.1.0-alpha.7

## 0.1.0-alpha.4

### Patch Changes

- Updated dependencies [[`d0b6db4`](https://github.com/softnetics/genseki/commit/d0b6db459c0b0b2aa6b91fe1da32a8394c88c369), [`a1d05fc`](https://github.com/softnetics/genseki/commit/a1d05fc4550b5a91d81710ed264e01bd29edbf8d), [`bd3d4e6`](https://github.com/softnetics/genseki/commit/bd3d4e65b8c04368c8d8ec595217b8c5c6d25ce8)]:
  - @genseki/react@0.1.0-alpha.6
  - @genseki/next@0.1.0-alpha.6
  - @genseki/react-query@0.1.0-alpha.6
  - @genseki/rest@0.1.0-alpha.6

## 0.1.0-alpha.3

### Minor Changes

- [#37](https://github.com/softnetics/genseki/pull/37) [`7273ee1`](https://github.com/softnetics/genseki/commit/7273ee143ff173483cecf5fd35d6d81d619fdddd) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - [[DRIZZ-96] Richtext editor and storage plugin](https://app.plane.so/softnetics/browse/DRIZZ-96/)

- [#52](https://github.com/softnetics/genseki/pull/52) [`9f29ffd`](https://github.com/softnetics/genseki/commit/9f29ffd462fd2b37085a51b2f18463ad65e7de05) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - Create form and update form bugs fixed and multiple components visual improvement

### Patch Changes

- [#49](https://github.com/softnetics/genseki/pull/49) [`7cd8620`](https://github.com/softnetics/genseki/commit/7cd86208b821fcc0d36f46d50a4ea207215fb1f6) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - Convert richtext field type to `json` from `string` and new S3 Storage adapter for object storing

- [#55](https://github.com/softnetics/genseki/pull/55) [`8b4de17`](https://github.com/softnetics/genseki/commit/8b4de178c9fe3d96dc6aef40086e441395ee51b1) Thanks [@SupakornNetsuwan](https://github.com/SupakornNetsuwan)! - New media upload components with AutoField integrated, small minor modal UI improvement

- Updated dependencies [[`7cd8620`](https://github.com/softnetics/genseki/commit/7cd86208b821fcc0d36f46d50a4ea207215fb1f6), [`7273ee1`](https://github.com/softnetics/genseki/commit/7273ee143ff173483cecf5fd35d6d81d619fdddd), [`8b4de17`](https://github.com/softnetics/genseki/commit/8b4de178c9fe3d96dc6aef40086e441395ee51b1), [`9f29ffd`](https://github.com/softnetics/genseki/commit/9f29ffd462fd2b37085a51b2f18463ad65e7de05)]:
  - @genseki/react@0.1.0-alpha.5
  - @genseki/next@0.1.0-alpha.5
  - @genseki/react-query@0.1.0-alpha.5
  - @genseki/rest@0.1.0-alpha.5

## 0.0.1-alpha.2

### Patch Changes

- Updated dependencies [[`47b5852`](https://github.com/softnetics/genseki/commit/47b5852dc417682b1aee80cf5c8fbd7ff97484ad)]:
  - @genseki/react@0.1.0-alpha.4
  - @genseki/next@0.1.0-alpha.4
  - @genseki/react-query@0.1.0-alpha.4
  - @genseki/rest@0.1.0-alpha.4

## 0.0.1-alpha.1

### Patch Changes

- [#18](https://github.com/softnetics/genseki/pull/18) [`aeab5ea`](https://github.com/softnetics/genseki/commit/aeab5ea296865069c006e7c6aa5d8f75e70b0743) Thanks [@masternonnolnw](https://github.com/masternonnolnw)! - [[DRIZZ-35] - [Forget Password Page]](https://app.plane.so/softnetics/browse/DRIZZ-35/)
  [[DRIZZ-34] - [Reset Password Page]](https://app.plane.so/softnetics/browse/DRIZZ-34/)
  [[DRIZZ-33] - [Change Password Page]](https://app.plane.so/softnetics/browse/DRIZZ-33/)
- Updated dependencies [[`136c1bc`](https://github.com/softnetics/genseki/commit/136c1bc5427853b7c063c96d51a3c1c6cd409303), [`aeab5ea`](https://github.com/softnetics/genseki/commit/aeab5ea296865069c006e7c6aa5d8f75e70b0743), [`3912698`](https://github.com/softnetics/genseki/commit/391269852c302a3c3ce273346786d751e4e7e4da)]:
  - @genseki/react@0.1.0-alpha.3
  - @genseki/next@0.1.0-alpha.3
  - @genseki/react-query@0.1.0-alpha.3
  - @genseki/rest@0.1.0-alpha.3

## 0.0.1-alpha.0

### Patch Changes

- [#44](https://github.com/softnetics/genseki/pull/44) [`57862df`](https://github.com/softnetics/genseki/commit/57862dfdd88862feb64d6dfc9b4a1c4c77118368) Thanks [@Anon-136](https://github.com/Anon-136)! - fix: tailwind config file path

- Updated dependencies [[`82272fc`](https://github.com/softnetics/genseki/commit/82272fcb7c752619b5929819ee694078eb26b340)]:
  - @genseki/react-query@0.1.0-alpha.2
  - @genseki/react@0.1.0-alpha.2
  - @genseki/next@0.1.0-alpha.2
  - @genseki/rest@0.1.0-alpha.2
