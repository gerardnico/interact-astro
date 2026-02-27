# Comments on package.json

## astro-integration keywords

Why `astro-integration` as keywords
It allows the use of the `astro add @gerardnico/astro` command
See [Ref](https://docs.astro.build/en/reference/integrations-reference/#allow-installation-with-astro-add)

## Dev Dependencies

Peer dependencies provided by Astro Mdx:

* klona
* remark/unified (ie mdast-util-mdx)
* glob: to select files by glob

## Astro Packaging and Export

As explained [here](https://docs.astro.build/en/reference/publish-to-npm/#packagejson)

Note that `tsc` will not generate a module with `.astro` file in it.
We don't export the compiled results as a result.
The astro runtime compiles the whole chain.

See the [](src/types/astro.d.ts) used to define the types at runtime

## tsx and zod-to-json-schema

To generate the schema with [](../interact/src/cli/commands/generate-schema.ts)


## Export

Astro components: We export Astro components directly not through a barrel so that the TypeScript server
is able to give intellisense and the user don't need to explode

## Dependencies

### Zod

We use the version embedded with astro

* `zod`
* `zod-to-json-schema`: generate schema file from your Zod schema
* `zod-to-ts`: generate TypeScript types from your Zod schema

```bash
cat ../../node_modules/astro/package.json | grep zod
```


## Types

The `types` field does not work at all.
`Typescript` uses only the type of imported file.
We hooks then [index.d.ts](src/types/index.d.ts) to [astro.ts](src/astro/astro.ts)
with a reference

```javascript
/// <reference path="../types/index.d.ts" />
```

Therefore, if the `astro.config.mjs` is in the `include` of `tsconfig.json` they will be imported.
