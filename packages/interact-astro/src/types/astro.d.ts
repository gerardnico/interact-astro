// https://github.com/withastro/astro/issues/8364
// Avoid TS2307: Cannot find module ./Landing.astro or its corresponding type declarations.
declare module '*.astro' {
    import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
    const component: AstroComponentFactory;
    export default component;
}