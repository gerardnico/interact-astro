# The layout system


Astro has the possibility to pass a layout props in `Markdown`.

We hacked on that with:
* a [remark plugin](../../../../../packages/interact-astro/src/unified/remark-layout.ts)
* that injects the [layouts](../../../../../packages/interact-astro/src/themes/default)

There is 2 layout:
* the standard layout
* the [Markdown layout](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout-property) (with the md suffix)