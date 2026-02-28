---
layout: holy
title: Interact on top of Astro project
---

This website is the documentation of the [interact-astro project](https://github.com/gerardnico/interact-astro). It was an attempt to build
the [combo wiki documentation framework](https://www.combostrap.com) on top of
Astro with:

* layout
* image processing
* and interactive component

This page was even deployed with the [developed interact cli](docs/reference/cli.md) via
a [GitHub deployment workflow](https://github.com/gerardnico/interact-astro/blob/main/.github/workflows/deploy.yml)

## The elements developed

At its core, [Interact-astro project](https://github.com/gerardnico/interact-astro) is an [astro integration plugin](docs/reference/astro.md) with:

* a [cli](docs/reference/cli.md)
* a [layout system](docs/reference/layout.md)
* the import of [Svg as React component](docs/reference/svg.md)
* [favicons generation](docs/reference/favicons.md)
* [various unified plugin to change Markdown and mdx parsing](docs/reference/unified-plugins.md)
* [various Publication Components](https://github.com/gerardnico/interact-astro/tree/main/packages/interact-astro/src/components)
* [React Image component on top of Astro](docs/reference/image.md)
* a [Website GitHub deployment workflow with the Interact cli](https://github.com/gerardnico/interact-astro/blob/main/.github/workflows/deploy.yml)

## Why Astro is not a good fit for a framework

See the dedicated page: [Why Not Astro from a framework development](why-not.md)

## More documentation?

Documentation was written while developing and can be
found [here](https://github.com/gerardnico/interact-astro/blob/main/apps/docs/pages/docs/reference)

Example: [note on the cli](docs/reference/cli.md)
