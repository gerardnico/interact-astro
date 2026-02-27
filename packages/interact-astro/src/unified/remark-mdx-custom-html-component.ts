import {visit} from "unist-util-visit";
import type {MdxjsEsm} from 'mdast-util-mdx';
import type {ImportDeclaration, Property} from 'estree'
import type {Heading, Root} from 'mdast';
import {VFile} from "vfile";
import {ComponentsConfigSetSchemaType} from "@gerardnico/interact-config/schema";

type ComponentMap = {
    [htmlElement: string]: string;
};

type GenerateImportsResult = {
    /**
     * Literal Value Example
     * import H2 from '@interact/components/H2.tsx'
     * import H3 from '@interact/components/H3.tsx'
     * export const components = {h2: H2, h3: H3}
     */
    literalValue: string;
    /**
     * The estree representation of: `import H2 from '@interact/components/H2.tsx`
     */
    importEstreeDeclarations: ImportDeclaration[];
    /**
     * The estree representation of: `{h2: H2, h3: H3}`
     */
    variableEstreeDeclarations: Property[]
};

function generateEsmProperties(componentMap: ComponentMap): GenerateImportsResult {
    const importDeclarations: ImportDeclaration[] = [];
    const variableDeclarations: Property[] = [];

    const imports = Object.entries(componentMap)
        .map(([htmlElement, path]) => {
            const componentName = path.split('/').pop()?.replace('.tsx', '') || '';

            // Add to AST array
            importDeclarations.push({
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
                    value: path
                }
            });
            variableDeclarations.push({
                type: "Property",
                method: false,
                shorthand: false,
                computed: false,
                key: {
                    type: "Identifier",
                    name: htmlElement,
                },
                value: {
                    type: "Identifier",
                    name: componentName,
                },
                kind: "init",
            })

            return `import ${componentName} from '${path}'`;
        })
        .join('\n');

    const exports = Object.entries(componentMap)
        .map(([htmlElement, path]) => {
            const componentName = path.split('/').pop()?.replace('.tsx', '') || '';
            return `${htmlElement}: ${componentName}`;
        })
        .join(', ');

    const importString = `${imports}\nexport const components = {${exports}}`;

    return {
        literalValue: importString,
        importEstreeDeclarations: importDeclarations,
        variableEstreeDeclarations: variableDeclarations
    };
}

const allowedTags = [
    'a', 'blockquote', 'br', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'hr', 'img', 'li', 'ol', 'p', 'pre', 'strong', 'ul'
];

export function isCustomTag(tag: string) {

    return allowedTags.includes(tag);
}

/**
 * Add automatically import and definition for the parsed markdown built-in elements in a mdx file
 * H1, H2, ....
 *
 * https://docs.astro.build/en/guides/integrations-guide/mdx/#assigning-custom-components-to-html-elements
 * ie in mdx, components should be exported
 * import Blockquote from '../components/Blockquote.astro';
 * export const components = {blockquote: Blockquote}
 *
 * For now, this plugin integrate only the H2 custom element
 * Note that a visit could also just add a className
 * Later, we may add an interactive component for instance with the code element
 * in order to copy it
 */
export default function remarkMdxCustomHtmlComponent(components: ComponentsConfigSetSchemaType) {

    let componentKeys = Object.keys(components);
    if (componentKeys.length == 0) {
        console.log(`No Custom HTML Components: No Components specified`)
        return null;
    }
    const customHtmlComponent = {}
    for (const [key, component] of Object.entries(components)) {
        if (!isCustomTag(key)) {
            continue;
        }
        customHtmlComponent[key] = component.importPath
    }
    if (Object.keys(customHtmlComponent).length == 0) {
        console.log(`No Custom HTML Components: None found`)
        return null;
    }

    console.log(`Custom HTML Components specified: ${Object.keys(customHtmlComponent).join(", ")}`)

    /**
     * We need to return a function has this
     */

    return function transformer(tree: Root, file: VFile) {

        if (file.extname != '.mdx') {
            // only for mdx file as we add import
            return;
        }
        const foundComponents: ComponentMap = {};

        // Visit
        visit(tree, (node) => {
            let nodeType = node?.type;
            if (nodeType == undefined) {
                return
            }
            // https://mdxjs.com/table-of-components/
            let htmlElement = nodeType
            if (nodeType == 'heading') {
                htmlElement = 'h' + (node as Heading).depth;
            }
            if (!isCustomTag(htmlElement) || foundComponents[htmlElement] != undefined) {
                return;
            }
            let component = components[htmlElement];
            if (component == undefined) {
                return;
            }
            if (!component.importPath) {
                throw new Error(`The component ${htmlElement} has no importPath defined (in the configuration file)`)
            }
            foundComponents[htmlElement] = component.importPath
        });

        let foundCustomComponents = Object.keys(foundComponents).length;
        if (foundCustomComponents == 0) {
            console.log(`No Custom HTML Components found in page in ${file.path}`)
            return;
        }
        console.log(`Custom HTML Components found ${foundCustomComponents} in ${file.path}`)
        // After visit completes
        let esm = generateEsmProperties(foundComponents)
        const importElement: MdxjsEsm = {
            type: 'mdxjsEsm',
            value: esm.literalValue,
            data: {
                estree: {
                    type: 'Program',
                    sourceType: "module",
                    body: [
                        ...esm.importEstreeDeclarations,
                        {
                            type: "ExportNamedDeclaration",
                            declaration: {
                                type: "VariableDeclaration",
                                declarations: [
                                    {
                                        type: "VariableDeclarator",
                                        id: {
                                            type: "Identifier",
                                            name: "components",
                                        },
                                        init: {
                                            type: "ObjectExpression",
                                            properties: esm.variableEstreeDeclarations,
                                        },
                                    }
                                ],
                                kind: "const",
                            },
                            specifiers: [],
                            source: null,
                        }
                    ]
                }
            }
        }
        // Add to the top
        tree.children.unshift(importElement)

    };
}