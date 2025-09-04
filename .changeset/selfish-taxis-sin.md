---
"@genseki/react": patch
---

- Reduce type inference by utilize type caching and unnecessary type utilities
- Add "use client" to `useCollectionForm` to ensure that the hook is used only in the client-side
