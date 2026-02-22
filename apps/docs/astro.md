# Astro plugin

This page shows you how to interact `interact` as Astro plugin

## Installation

### Manually

* Add interact as a [dependency](installation.md)
* Configure your `astro.config.mjs`

```javascript
import {defineConfig} from 'astro/config';
import interact from '@combostrap/interact/astro';

export default defineConfig({
    integrations: [
        interact()
    ]
});
```

### With Astro Add

```bash
yarn astro add @combostrap/interact
```