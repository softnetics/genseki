---
"@example/erp": patch
"@genseki/react": minor
---

Customizable create page, developer can render a customized page via `config.page` when adding create page with `CollectionBuilder.create`.

```ts
collection.create(fields, { options: options, page: /* Your customized create page */ })
```

For working example, see https://github.com/softnetics/genseki/blob/8b38a1ab9379330e290eb8633dcbf8106ae435b8/examples/erp/genseki/collections/posts.client.tsx#L318-L390
