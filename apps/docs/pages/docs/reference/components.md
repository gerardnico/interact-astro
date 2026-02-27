# Components Sharing and overwriting

Through the creation of a module with symlink

## Analyse

### MDX IDE

There is no typescript compilation,
therefore the path is resolved in the IDE only against `node_modules`

Vite and Typescript handles it with alias but the IDE is not happy.

## Steps

* Create the directory

```bash
mkdir -p ./node_modules/@gerardnico/interact-components/src
```

* Create the symlink with full path for each component

```bash
# with full path !
ln -s $PWD/node_modules/@gerardnico/interact-astro/src/components/StarRating/StarRating.tsx  $PWD/node_modules/@gerardnico/interact-components/src/StarRating.tsx
```

* Create the `./node_modules/@gerardnico/interact-components/package.json` file

```json
{
  "name": "@gerardnico/interact-components",
  "version": "0.1.0",
  "description": "Interact Components",
  "type": "module",
  "exports": {
    "./StarRating": "./src/StarRating.tsx"
  }
}
```
