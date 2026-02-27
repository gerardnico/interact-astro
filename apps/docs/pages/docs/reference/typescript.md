---
layout: holy
title: Typescript Support
---


You need to add `astro.config.mjs` to get automatic TypeScript support

* for [React Svg](svg.md)
* and [Layout Props](layout.md)

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [
    "astro.config.mjs",
    ".astro/types.d.ts",
    "src/**/*"
  ]
}
```