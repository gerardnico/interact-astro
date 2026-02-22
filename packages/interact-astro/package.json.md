# Comments on package.json

## astro-integration keywords

Why `astro-integration` as keywords
It allows the use of the `astro add @combostrap/astro` command
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

## real favicon

Used to generate the favicon and the manifest [](../interact/src/cli/commands/generate-favicon.ts)

## Export

Astro components: We export Astro components directly not through a barrel so that the typescript server
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