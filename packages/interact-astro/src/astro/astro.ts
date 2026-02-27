/// <reference path="../types/index.d.ts" />

import type {AstroIntegration} from 'astro';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import type {LayoutProps} from "../types";
import {astroHookConfigSetup} from "./astro-hook-config-setup";
import {config as interactConfig} from "@gerardnico/interact-config"

export type {LayoutProps}
import type {HookParameters} from 'astro';

/**
 * Interact Astro integration
 *
 * @returns Astro integration
 *
 */
function interact(): AstroIntegration {

    return {
        name: '@gerardnico/interact',
        hooks: {
            // Run at config setup time
            // https://docs.astro.build/en/reference/integrations-reference/#astroconfigsetup
            'astro:config:setup': astroHookConfigSetup,
            // Vite Dev server setup
            // Run only in dev mode then (Astro middleware run only on page rendering)
            // can be used to add indexing, ...
            // https://docs.astro.build/en/reference/integrations-reference/#astroserversetup
            // Example of URL
            // URL /@fs/home/admin/code/combostrap/interact/packages/interact/src/themes/default/style/global.css was requested
            // URL /@vite/client was requested
            // URL /@fs/home/admin/code/combostrap/interact/packages/interact/src/components/Block/hero.css was requested
            // URL /@fs/home/admin/code/combostrap/interact/packages/interact/src/themes/default/style/global.css?url was requested
            // URL /src/components/PortfolioCard/portfolio.css was requested
            // URL /src/pages/index.astro?astro&type=style&index=0&lang.css was requested
            // URL /@id/__x00__astro:toolbar:internal was requested
            // URL /node_modules/vite/dist/client/env.mjs was requested
            // URL /favicon.svg was requested
            "astro:server:setup": async (params: HookParameters<'astro:server:setup'>) => {
                const viteDevServer = params.server;
                viteDevServer.middlewares.use((req, res, next) => {
                    if (!req.url?.startsWith("/_hello_world") || req.method !== 'GET') {
                        next();
                        return
                    }
                    // Basic example
                    const data = {foo: 'Hello', bar: 'World'}
                    res.setHeader('Content-Type', 'application/json')
                    res.statusCode = 200
                    res.end(JSON.stringify(data))
                });
            },
            'astro:build:done': async ({dir, logger}) => {
                logger.info('Interact: Astro build done');
            },
        },
    };
}

// for sitemap generation
// We set the site
// https://docs.astro.build/en/reference/configuration-reference/#site
function siteMapConfig(): AstroIntegration {

    return {
        name: '@gerardnico/interact-site-map',
        hooks: {
            'astro:config:setup': async function (params: HookParameters<'astro:config:setup'>) {
                const {updateConfig} = params;
                updateConfig({
                    // for sitemap generation
                    // https://docs.astro.build/en/reference/configuration-reference/#site
                    site: process.env.INTERACT_SITE || interactConfig.theme.site.url
                });
            }
        },
    };
}

/**
 * Return multiple integration thanks to preset
 * https://docs.astro.build/en/reference/integrations-reference/#combine-integrations-into-presets
 */
const interactPreset = () => [
    interact(),
    siteMapConfig(),
    sitemap(),
    mdx(),
    react({
        // https://docs.astro.build/en/guides/integrations-guide/react/#children-parsing
        experimentalReactChildren: false
    })
]
export default interactPreset;