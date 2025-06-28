---
"@example/erp": minor
"@genseki/react": minor
---

## @genseki/react: `findMany` method's `where`

Previously the server doesn't have filter functionality. 
The only way to do this is via client-side, which will be sophisticated and troublesome; i.e., filtering data that are limited to the first n records would give the user an incomplete result.

Nevertheless, providing a trivial filter, such as `like` would not be sufficient for real-world use cases. 
So it's better to give them all [operators that drizzle provided](https://github.com/softnetics/genseki/pull/61/files#diff-64e2e95728cdee0c91653b1fe43241682ab23fb39642970eb9f054d709202690). 

Along with type-safety capability, that would help developers from foot-gunning themselves by mistyping or unknowingly using the where filter in a misconceived way.

See [simple](https://github.com/softnetics/genseki/pull/61/files?diff=unified&w=0#diff-57a06782ec15e2e9a736382771d2f201304e359479752f893038c5bab01d76dcR33-R46) and [complex filter samples](https://github.com/softnetics/genseki/pull/61/files?diff=unified&w=0#diff-0a8eec2eb4f9356b504b16d81f11d60b5b6e6566d24fed79a4c2bd92b2ec588eR305-R383) for reference. 

## @example/erp: new `/admin/collections/custom-food-page` page

intended to demonstrate how to use a filter in source code.

https://github.com/user-attachments/assets/53cb2a21-ac7a-4c8f-a238-b107cda00c59

> [!TIP] 
> Also added a [custom list component](https://github.com/softnetics/genseki/pull/61/files?diff=unified&w=0#diff-bb8bf64086ef44df2aa775aa4431016d1b340674be456571131bf9ea38bc16c7) to demonstrate how to display data with custom cell rendering.
>
> see [renderFoodsCells](https://github.com/softnetics/genseki/pull/61/files?diff=unified&w=0#diff-e0a7d24561c070f8468733072ef63f60f8960a2e752d7334cc0979b98d313076) for reference.
