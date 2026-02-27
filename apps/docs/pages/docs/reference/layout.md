---
layout: holy
title: The layout system
---

## How it works?

Astro has the possibility to pass a layout props in `Markdown`.

We hacked on that with:

* a [remark plugin](https://github.com/gerardnico/interact-astro/blob/main/packages/interact-astro/src/unified/remark-layout.ts)

* that injects
  the [layouts](https://github.com/gerardnico/interact-astro/blob/main/packages/interact-astro/src/themes/default)

## Layout Levels

There are 2 layouts:

* the standard layout that can be imported from a Astro component (non-markdown page)
* the [Markdown layout](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout-property) (with the md
  suffix)