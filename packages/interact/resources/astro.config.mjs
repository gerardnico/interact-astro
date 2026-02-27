import {defineConfig} from 'astro/config';
import interact from '@gerardnico/interact-astro';

export default defineConfig({
    integrations: [
        interact()
    ],
    // vite: {
    //     ssr: {
    //         noExternal: [
    //             '@gerardnico/interact-astro',
    //             '@astrojs/react',
    //         ]
    //     }
    // }
});