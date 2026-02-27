## Dependencies

### In the root

Most dependencies are declared in the project root, otherwise vite may have problem finding it.
If the dependency is in a sibling, we may get:

```
Failed to load url @astrojs/react/server.js (resolved id: @astrojs/react/server.js). Does the file exist?
```

## Node

Bigger than 22 because of
https://github.com/ExodusOSS/bytes/issues/13#issuecomment-3701705767

## Vite

Vite should be the same version as astro. `vite` is `6.4.1`
Otherwise we get TypeScript error when the calculate version is 7.
