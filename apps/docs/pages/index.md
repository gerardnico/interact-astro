---
layout: holy
title: Interact on top of Astro project
---

This project was an attempt to build a documentation framework on top of Astro
with:

* layout
* image processing
* and interactive component

## Why Not Astro for a framework

See [Why Not](why-not.md)

## The elements developed

At its core, interact astro is an [astro integration plugin](docs/reference/astro.md) with:

* a [cli](docs/reference/cli.md) on top of Astro
* a [layout system](docs/reference/layout.md)
* the import of [Svg as React component](docs/reference/svg.md)
* [favicons generation](docs/reference/favicons.md)
* [various unified plugin to change Markdown and mdx parsing](docs/reference/unified-plugins.md)
* [various Publication Components](../../../packages/interact-astro/src/components) such
  * as
    the [React Image component on top of Astro service](../../../packages/interact-astro/src/components/Image/Image.tsx)

## More documentation?

Documentation was written while developing and can be
found [here](https://github.com/gerardnico/interact-astro/blob/main/apps/docs/pages/docs/reference)

Example: [note on the cli](docs/reference/cli.md)
