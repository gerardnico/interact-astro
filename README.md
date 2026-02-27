# Documentation Framework on top of Astro

This was an experiment to create the next generation
of [ComboWiki documentation system](https://www.combostrap.com)
called `interact` on top of [Astro](https://astro.build/).

You can read more about the elements developed and why we didn't choose it:

* by reading the `index page` on:
  * the [Project Website](https://tools.gerardnico.com/interact-astro/)
  * on the [Hosted GitHub Page](apps/docs/pages/index.md)

* or by starting the demo interact site documentation by following
  the [steps below](#how-to-start-the-documentation-with-the-interact-cli) - nerds only

## How to start the documentation with the Interact cli

* Install [direnv](https://direnv.net/) or run [.envrc](.envrc) to install `ninteract` into your local bin

```bash
source .envrc
```

* Install the dependencies and build

```bash
yarn install
(cd packages/interact-config; yarn build)
```

* Start the documentation website with [interact](./contrib/scripts/ninteract)

```bash
cd apps/docs
ninteract dev
```

