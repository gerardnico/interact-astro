import {Command} from '@oclif/core'
import {dev} from 'astro';
import * as path from 'path'
import * as fs from 'fs'

export default class Dev extends Command {
    static description = 'Start a dev server'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]


    async run(): Promise<void> {

        // Not that all dependency should be in the node_modules going down the tree of the root
        // (If the dependency is in a sibling, it needs to be moved in the monorepo project root)
        // otherwise cannot vite cannot find any we get:
        // Failed to load url @astrojs/react/server.js (resolved id: @astrojs/react/server.js). Does the file exist?
        let root = path.resolve(this.config.root);

        let astroConfigRelativePath = 'resources/astro.config.mjs';

        const configPath = path.resolve(this.config.root, astroConfigRelativePath)
        if (!fs.existsSync(configPath)) {
            throw new Error(`The astro config file ${configPath} was not found`)
        }
        let projectDir = process.cwd()

        // Dev server
        await dev({
            // By default, the current directory
            // https://docs.astro.build/en/reference/configuration-reference/#root
            root: root,
            // configfile cannot be absolute, it should be relative to root
            configFile: astroConfigRelativePath,
            // https://docs.astro.build/en/reference/configuration-reference/#srcdir
            // the pages needs to be below at pages
            srcDir: projectDir,
            // https://docs.astro.build/en/reference/configuration-reference/#publicdir
            publicDir: path.resolve(projectDir, "./public"),
            // https://docs.astro.build/en/reference/configuration-reference/#outdir
            outDir: path.resolve(projectDir, "./dist"),
            // by default .astro if there is no node_modules
            // https://docs.astro.build/en/reference/configuration-reference/#cachedir
            cacheDir: path.resolve(projectDir, ".interact/.astro"),
            logLevel: "debug"
        });

    }
}
