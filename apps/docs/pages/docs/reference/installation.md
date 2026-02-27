---
layout: holy
title: installation
---

## From a remote Repository Installation

Does not work as the package are not published.
You need to use the [linking functionality of your package manager](#linking)

```bash
npm install @gerardnico/interact
# or
yarn add @gerardnico/interact
```

## Linking

Example of the linking functionality of the yarn package manager known as `resolutions`.

```json
{
  "resolutions": {
    "@gerardnico/interact": "portal:../../gerardnico/interact-astro/packages/interact",
    "@gerardnico/interact-astro": "portal:../../gerardnico/interact-astro/packages/interact-astro",
    "@gerardnico/interact-config": "portal:../../gerardnico/interact-astro/packages/interact-config"
  }
}
```
