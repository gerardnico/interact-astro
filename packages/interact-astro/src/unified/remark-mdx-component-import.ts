import {visit} from "unist-util-visit";
import type {MdxjsEsm, MdxJsxFlowElement} from 'mdast-util-mdx';
import type {Root} from 'mdast';
import {VFile} from "vfile";
import {ComponentsConfigSetSchemaType} from "@gerardnico/interact-config/schema";

import {isCustomTag} from "./remark-mdx-custom-html-component";

/**
 * Add automatically import for the Jsx elements in a mdx file
 *
 * Note for markdown file:
 * It does not work for markdown, even by adding remark-mdx as plugin
 * the renderer will just output the import statement
 *
 * See also: https://github.com/delucis/astro-auto-import
 */
export default function remarkMdxComponentImport(components: ComponentsConfigSetSchemaType) {

    let componentKeys = Object.keys(components);
    if (componentKeys.length == 0) {
        console.log(`No Custom Components: No Components specified`)
        return null;
    }
    const customComponent = {}
    for (const [key, component] of Object.entries(components)) {
        if (isCustomTag(key)) {
            continue;
        }
        customComponent[key] = component.importPath
    }
    if (Object.keys(customComponent).length == 0) {
        console.log(`No Custom Components: None found`)
        return null;
    }

    console.log(`Custom Components specified: ${Object.keys(customComponent).join(", ")}`)

    return function (tree: Root, file: VFile) {

        if (typeof file == 'undefined' || !file.path) return;

        const addedNodes = new Set();

        visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {

            const componentName = node.name as string;
            if (addedNodes.has(componentName)) {
                return;
            }
            const componentPath = customComponent[componentName]
            if (componentPath == undefined) {
                return
            }
            addedNodes.add(node.name);
            const importElement: MdxjsEsm = {
                type: 'mdxjsEsm',
                value: `import ${componentName} from '${componentPath}';`,
                data: {
                    estree: {
                        type: 'Program',
                        sourceType: "module",
                        body: [{
                            type: 'ImportDeclaration',
                            specifiers: [{
                                type: 'ImportDefaultSpecifier',
                                local: {
                                    type: 'Identifier',
                                    name: componentName
                                }
                            }],
                            source: {
                                type: 'Literal',
                                value: componentPath
                            }
                        }]
                    }
                }
            }
            // Add to the top
            tree.children.unshift(importElement)
        });

    };

}