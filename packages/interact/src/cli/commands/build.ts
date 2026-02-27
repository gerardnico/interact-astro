import {Command} from '@oclif/core'
import {build} from 'astro';

import {getAstroInlineConfig} from "../utils/astroUtil";


export default class Build extends Command {

    static description = 'Build the website'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]


    async run(): Promise<void> {

        await build(getAstroInlineConfig(this.config.root));

    }
}
