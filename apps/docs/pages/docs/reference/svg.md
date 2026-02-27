## React Svg

In a React component, you can import a svg as React component with

```javascript
import DatacadamiaLogo from '../../img/database.svg?react'
```

If you use [TypeScript](typescript.md), you need to add the `astro.config.mjs`
in the `include` property.

If you use a Svg Function Component in a prop attribute, we recommend to use `any` as type
if you can't get it work.