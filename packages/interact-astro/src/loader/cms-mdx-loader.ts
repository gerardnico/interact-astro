import type {Loader} from 'astro/loaders';

/**
 * An example on how to get mdx content
 * and load it
 */
export function cmsMdxLoader(): Loader {
    return {
        name: 'cms-mdx-loader',
        // @ts-ignore
        load: async ({store, generateDigest}) => {
            /**
             * Loading is done asynchronous via a module where the path is a parameter
             *
             * Example: If file not found
             * Cannot find module 'astro:content-layer-deferred-module?astro%3Acontent-layer-deferred-module=&fileName=hallo.mdx&astroContentModuleFlag=true' imported from '/home/admin/code/bytle/website/.astro/content-modules.mjs'
             *
             * The process is then get the content,
             * create the file relative to the side root
             */
            let content = 'content of hallo.mdx';
            const filepath = './dist/tmp/hallo.mdx';
            const digest = generateDigest(content);
            store.clear();
            store.set(
                {
                    id: 'hallo',
                    data: {
                        name: "world"
                    },
                    filePath: filepath,
                    digest: digest,
                    deferredRender: true,
                }
            );
        },
    };
}