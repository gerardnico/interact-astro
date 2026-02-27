---
layout: holy
title: Astro plugin
---


This page shows you how to add the [Interact Astro plugin](https://github.com/gerardnico/interact-astro/blob/main/packages/interact-astro/src/astro/astro.ts)

## Installation

### Manually

* Add interact as a [dependency](installation.md)
* Configure your `astro.config.mjs`

```javascript
import {defineConfig} from 'astro/config';
import interact from '@gerardnico/interact-astro';

export default defineConfig({
    integrations: [
        interact()
    ]
});
```

### With Astro Add

> ![IMPORTANT]
> Will not work as `@gerardnico/interact-astro` is not published

```bash
yarn astro add @gerardnico/interact-astro
```