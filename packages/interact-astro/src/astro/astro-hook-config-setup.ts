import remarkMdxCustomHtmlComponent from "../unified/remark-mdx-custom-html-component";
import {resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {envField} from 'astro/config';
import {glob} from 'glob';
import instantiateUnifiedPlugins from "../config/instantiateUnifiedPlugins";
import {configFileName, config as interactConfig} from "../config"

const unifiedPlugins = await instantiateUnifiedPlugins(interactConfig.plugins)

console.log(`${unifiedPlugins.rehype.length} rehypes plugins`);
console.log(`${unifiedPlugins.remark.length} remark plugins`);


import type {HookParameters} from 'astro';
import {getPackageJsonDir} from "../util/package-json-util";

export const astroHookConfigSetup = async function (params: HookParameters<'astro:config:setup'>) {
    const {updateConfig, addWatchFile, config, command, logger} = params;

    // if config.output == server, it does not produce html file
    logger.info(`Started in a ${config.output} output mode`);


    const projectDir = getPackageJsonDir(fileURLToPath(import.meta.url), true)
    let sourceProjectDir = resolve(projectDir, 'src');

    // Update the Astro config to add the unified plugin
    updateConfig({
        // With trailingSlash: always
        // https://docs.astro.build/en/reference/configuration-reference/#trailingslash
        // The file 090603/mdm-obi-forum/index.md
        //     get the url: /090603/mdm-obi-forum/
        //     and not /090603/mdm-obi-forum
        // but the file 090603/mdm-obi-forum/tommy-discover-to-obiee.md
        //     get the url 090603/mdm-obi-forum/tommy-discover-to-obiee/
        //
        // With trailingSlash: never
        //    The file 090603/mdm-obi-forum/index.md
        //    will only be accessible from the url: /090603/mdm-obi-forum
        //    and not from /090603/mdm-obi-forum/
        //
        // There is no way around as stated here:
        // https://docs.astro.build/en/guides/routing/#static-routes
        // These 2 files have equivalent route
        // src/pages/about.astro        -> mysite.com/about
        // src/pages/about/index.astro  -> mysite.com/about
        //
        // never also allows relative link
        //   The [relative](relative.md) link in the page current-page would become
        //   * with `always` /current-page/relative
        //   * with `never` /relative
        trailingSlash: 'never',
        build: {
            // https://docs.astro.build/en/reference/configuration-reference/#buildformat
            // Generate files exactly as they appear in the source folder
            // https://docs.astro.build/en/reference/configuration-reference/#effect-on-astrourl
            // Setting build.format controls what Astro.url is set to during the build.
            //
            // How it works
            //
            format: 'directory'
        },
        markdown: {
            remarkPlugins: [
                ...unifiedPlugins.remark,
                [remarkMdxCustomHtmlComponent, interactConfig.components],
                //remarkMdxComponentImport should check if the import is already imported
                //[remarkMdxComponentImport, interactConfig.components]
            ],
            rehypePlugins: unifiedPlugins.rehype
        },
        env: {
            schema: {
                ICON_PATH: envField.string({
                    context: "server",
                    access: "public",
                    default: '/favicon.ico'
                }),
            }
        },
        vite: {
            resolve: {
                // Any path in the js code with @interact will resolve to this directory
                // You can also create alias for typescript in tsconfig.json
                alias: {
                    '@interact': sourceProjectDir,
                    '@config': resolve(sourceProjectDir, 'config/index.ts')
                }
            }
        }
    });

    // Only run in dev mode and when this library is a dependency
    // https://docs.astro.build/en/reference/integrations-reference/#addwatchfile-option
    const cwd = process.cwd();
    let isCalledAsLibrary = projectDir !== cwd;
    if (command === 'dev' && isCalledAsLibrary) {
        const files = glob.sync('**/*', {
            cwd: sourceProjectDir,
            absolute: true,
            nodir: true
        });
        files.forEach(file => addWatchFile(file));
    }

    // Add the config files
    // https://docs.astro.build/en/reference/integrations-reference/#addwatchfile-option
    addWatchFile(new URL(`./${configFileName}`, config.root));
};