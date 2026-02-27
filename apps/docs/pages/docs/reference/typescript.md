## Add Extra Layout and React Svg Support

You need to add `astro.config.mjs` to get automatic TypeScript support
for [React Svg](svg.md)

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