import {mdxJsx} from "micromark-extension-mdx-jsx";
import {Fragment, jsx, jsxs} from 'react/jsx-runtime'
// Acorn is a JavaScript parser
// * as acorn is needed otherwise we get an error: Expected an `acorn` instance passed in as `options.acorn`
import * as acorn from "acorn";
// mdast extension to parse and serialize MDX JSX
import {mdxJsxFromMarkdown} from "mdast-util-mdx-jsx";
import {fromMarkdown} from "mdast-util-from-markdown";
import {toHast as mdastToHast} from "mdast-util-to-hast";
import {toHtml as hastToHtml} from 'hast-util-to-html'
import {Content as HastContent, type Nodes as HastNodes, Root as HastRoot} from "hast";
import {toJsxRuntime} from "hast-util-to-jsx-runtime";
import {Components} from "hast-util-to-jsx-runtime";
// Autolink: https://github.com/syntax-tree/mdast-util-gfm-autolink-literal
import {gfmAutolinkLiteral} from 'micromark-extension-gfm-autolink-literal'
import {gfmAutolinkLiteralFromMarkdown} from 'mdast-util-gfm-autolink-literal'
import {Root as MdastRoot} from "mdast";


/**
 * Wrapper around https://github.com/syntax-tree/mdast-util-from-markdown
 * @param doc
 */
function toAst(doc: string): MdastRoot {
    return fromMarkdown(doc, 'utf-8', {
        // Micromark extensions to change how markdown is parsed
        // List: https://github.com/syntax-tree/mdast-util-from-markdown?tab=readme-ov-file#list-of-extensions
        extensions: [
            mdxJsx({
                acorn: acorn,
                addResult: true
            }),
            gfmAutolinkLiteral()
        ],
        // extensions to change how tokens are turned into a tree
        mdastExtensions: [
            mdxJsxFromMarkdown(),
            gfmAutolinkLiteralFromMarkdown()
        ]
    });
}

function toHast(ast: MdastRoot): HastNodes {

    /**
     * We use the MDX plugin to parse and pass custom html node
     * (and not the raw function)
     */
    return mdastToHast(ast, {
        passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement'],
        handlers: {
            mdxJsxTextElement(state, node) {
                let properties = {};
                for (const attribute of node.attributes) {
                    let value = attribute.value;
                    if (value === null) {
                        value = true;
                    }
                    // @ts-ignore
                    properties[attribute.name] = value;
                }
                return {
                    type: 'element',
                    tagName: node.name,
                    properties: properties,
                    children: state.all(node)
                }
            }
        }
    })

}

function toHtml(hast: HastRoot | HastContent): string {
    /**
     * https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins
     * https://github.com/marekweb/rehype-components
     * https://github.com/syntax-tree/hast#list-of-utilities
     * https://github.com/syntax-tree/hast-util-to-html
     */
    if (typeof hast === 'undefined' || hast === null) {
        return '';
    }
    return hastToHtml(hast);
}


/**
 * Wrapper around https://github.com/syntax-tree/hast-util-to-jsx-runtime
 * @param hast
 * @param components - the components
 */
function toReact(hast: HastRoot, components?: Partial<Components> | null | undefined) {

    return toJsxRuntime(hast,
        {
            Fragment,
            jsx,
            jsxs,
            components
        })
}

export class Marki {
    static toMdast = toAst
    static toHast = toHast
    static toHtml = toHtml
    static toReact = toReact
}
