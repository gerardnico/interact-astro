import {Command} from '@oclif/core'
import {preview} from 'astro';

import {getAstroInlineConfig} from "../utils/astroUtil";


export default class Build extends Command {

    static description = 'Preview the website'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]


    async run(): Promise<void> {

        await preview(getAstroInlineConfig(this.config.root));

    }
}
