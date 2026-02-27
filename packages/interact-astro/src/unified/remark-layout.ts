import {existsSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import type {Root} from "mdast";
import {VFile} from "vfile";

function kebabToPascalCase(str: string) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

export default function layoutWrapper() {
    return function (tree: Root, file: VFile) {

        if (file?.data == undefined) {
            return;
        }

        const frontmatter = file.data.astro?.frontmatter;

        if (!frontmatter?.layout) return;

        const layoutName = kebabToPascalCase(frontmatter.layout);

        // If layoutName is a relative path that points to an existing file, return early
        if (layoutName.startsWith('.')) {
            const markdownFilePath = file.path || file.history?.[0];
            if (markdownFilePath) {
                const markdownDir = dirname(markdownFilePath);
                const absoluteLayoutPath = resolve(markdownDir, layoutName);
                if (existsSync(absoluteLayoutPath)) {
                    return;
                }
            }
        }

        frontmatter.layout = `@gerardnico/interact-astro/layout/${layoutName}Md`;

        // We could have wrapped with the below code but the TOC is then gone
        // because it's created from the first level heading, and they will become a second level
        //
        // // Wrap the entire tree with the layout component
        // const originalChildren = tree.children;
        //
        // tree.children = [
        //     {
        //         type: 'mdxJsxFlowElement',
        //         name: 'Layout',
        //         attributes: [],
        //         children: originalChildren
        //     },
        //     {
        //         type: 'mdxjsEsm',
        //         value: `import Layout from '${layoutPath}';`,
        //         data: {
        //             estree: {
        //                 type: 'Program',
        //                 body: [{
        //                     type: 'ImportDeclaration',
        //                     specifiers: [{
        //                         type: 'ImportDefaultSpecifier',
        //                         local: {type: 'Identifier', name: 'Layout'}
        //                     }],
        //                     source: {
        //                         type: 'Literal',
        //                         value: layoutPath
        //                     }
        //                 }]
        //             }
        //         }
        //     }
        // ];
    };
}