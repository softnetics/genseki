---
"@example/erp": patch
"@example/ui-playground": patch
"@genseki/react": patch
---

migrate `date-picker`, `time-input` and more fixes

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
