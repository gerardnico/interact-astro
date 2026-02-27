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

#### Jsx Component in Astro, not the other way around

When creating an Astro component, you can import component from other Jsx Runtime such as React, Vue,....
They are then transformed as Astro component.

It means that if you use a React Component, you will see the child as raw HTML
so you cannot change your child. The children have 2 props:

* hydrate: true/false
* and a slotValue : the HTML value

See [children-parsing](https://docs.astro.build/en/guides/integrations-guide/react/#children-parsing).
There is an experimental mode, but you got `style` weird errors when it's on as React expects the style to be an object,
not a string.

### Reason 2 - Layout Handling

You need to have 2 because for a Markdown file, you
get [fixed props](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout-property).

So you need one:

* and one for normal pages
* one for the Markdown pages (that calls the real layout)

It would have been better to inject them all in a sort of big frontmatter, but you can't change that.

* Image Components
* Svg Import

### Reason 3 - Markdown/Cms has no interactive component

Interactive component are client/browser components.

* You can't inject them to Markdown, you can only do it on Mdx file.
* You can't hook up in the Astro library to do it.

Therefore, you are stuck with a static compile/bundle step when
writing interactive documentation.

All CMS integration just output HTML (maybe they add JavaScript),
but there is for sure no React component at all.

Mdx is JavaScript code and cannot be built to a React component without storing the JavaScript as module on the file
system. Node.js or any runtime does not allow it if there is any import in the code.

### Reason 4 - No debug, it's not just JavaScript

There is no debug in the IDEA, even a `debugger` word will not stop execution in your ide.
The first [tips and tricks](https://docs.astro.build/en/guides/troubleshooting/) is the `console.log`

## Conclusion

You don't build a framework on top of a framework, you build it on top of a bundler.

Astro is built on top of Vite by the way
