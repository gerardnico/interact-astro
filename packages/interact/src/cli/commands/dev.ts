import {Command} from '@oclif/core'
import {dev} from 'astro';
import * as path from 'path'
import * as fs from 'fs'
import {getAstroInlineConfig} from "../utils/astroUtil";

export default class Dev extends Command {
    static description = 'Start a dev server'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]


    async run(): Promise<void> {

        // Dev server
        await dev(getAstroInlineConfig(this.config.root));

    }
}
