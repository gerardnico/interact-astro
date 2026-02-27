---
layout: holy
title: Reasons why we didn't choose Astro as a platform to build on
---

## Main Reason

* You don't build a framework on top of a framework
* You live in the Astro world.

### Reason 1 - Astro Built-in component are Astro only

#### Image/Picture Component

The image/picture is an Astro component and cannot be used in another Jsx component (
React, ...)

Still, we succeeded to
implement [our own image React component on top of the Astro Service](https://github.com/gerardnico/interact-astro/blob/main/packages/interact-astro/src/components/Image/Image.tsx)

#### Svg Import

* A Svg import imports a Astro component, you can't use it in a React Component. You need to hookup with a `svg?react`

```javascript
vite: {
    plugins: [
        // https://www.npmjs.com/package/vite-plugin-svgr
        svgReactPlugin({
            include: '**/*.svg?react',
            svgrOptions: {
                plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
                svgoConfig: {
                    plugins: ['preset-default', 'removeTitle', 'removeDesc', 'removeDoctype', 'cleanupIds'],
                },
            },
        }),
    ]
}
```

### Reason 2 - Layout Handling

You need to have 2 because for a Markdown file, you get fixed props.

So you need one:

* and one for normal pages
* one for the Markdown pages (that calls the real layout)

It would have been better to inject them all in a sort of big frontmatter, but you can't change that.

* Image Components
* Svg Import

### Reason 3 - Collections are wrapper around vite glob import

Collections are a wrapper around [vite glob import](https://vite.dev/guide/features#glob-import).
(that's why the location for pages (`src/pages`) is a fixed directory)

### Reason 4 - Markdown/Cms is static only

* You can't inject component to Markdown, you can only do it on Mdx file.
* You can't hook up in the Astro library to do it. Therefore, you are stuck with a static compile/bundle step when
  writing Markdown
  documentation. All CMS integration just output HTML, no React component at all.
  (Mdx is JavaScript code and cannot be built to a React component without storing the JavaScript as module on the file
  system. Node.js or any runtime does not allow it if there is any import in the code)

### Reason 5 - No debug, it's not just JavaScript

There is no debug in the IDEA, even a `debugger` word will not stop execution in your ide.
The first [tips and tricks](https://docs.astro.build/en/guides/troubleshooting/) is the `console.log`

## Further documentation

Documentation was written while developing and can be
found [here](https://github.com/gerardnico/interact-astro/blob/main/apps/docs/pages/docs/reference)

Example: [note on the cli](docs/reference/cli.md)
