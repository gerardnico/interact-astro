## jsx

[jsx](https://www.typescriptlang.org/tsconfig/#jsx) is set to `react-jsx` so that only React component are compiled.

## jsxImportSource

[jsxImportSource](https://www.typescriptlang.org/tsconfig/#jsxImportSource) = `react` means
that the jsx engine is `react` (could have been preact)

## lib

Default type definition are set in [lib](https://www.typescriptlang.org/tsconfig/#lib)

* `DOM` definition of browser globals like window, document, localStorage, etc.
* `DOM.Iterable` adds iterable support to DOM collections.

## Include

Specify the ts files to include
https://www.typescriptlang.org/tsconfig/#include

## astro/client type

```json
{
  "types": [
    "astro/client"
  ]
}
```
so that I get no error with the `astro:assets` virtual modules
```typescript
import { getImage, imageConfig, type LocalImageProps, type RemoteImageProps } from 'astro:assets';
```