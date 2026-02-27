# Interact Documentation System in Astro

This was an experiment to implement the interact documentation system in Astro.

You can read why we didn't choose Astro:

* by start the site documentation by following the [steps below](#how-to-start-the-documentation-with-the-interact-cli)
* or read the [index page](apps/docs/pages/index.md) directly

## How to start the documentation with the interact cli

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
ninteract dev
```

