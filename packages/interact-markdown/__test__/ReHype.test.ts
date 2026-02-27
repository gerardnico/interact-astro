import {test} from "vitest";
import {unified} from "unified";
import remarkRehype from "remark-rehype";
import remarkParse from "remark-parse";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import {reporter} from "vfile-reporter";
import rehypeRaw from "rehype-raw";
import remarkMdx from "remark-mdx";
import rehypeReact from "rehype-react";
import {createElement, Fragment} from "react";
import * as ReactDOMServer from 'react-dom/server';
import {jsx, jsxs} from "react/jsx-runtime";


test('MarkdownWithCustomComponentViaRaw', async () => {

    let markup = `
## Hello, *world*!

<hallo>Hallo</hallo>

<discard>Discarded</discard>
`;
    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype,
            {
                // https://github.com/syntax-tree/mdast-util-to-hast#example-supporting-custom-nodes
                // They can be passed to remark-rehype
                // https://github.com/remarkjs/remark-rehype#optionshandlers
                handlers: {
                    html(state, node) {
                        if (!(node.value === "<hallo>" || node.value === "</hallo>")) {
                            // discarded
                            return null;
                        }
                        /**
                         * The `raw` function parse
                         * and create the tree with children
                         */
                        return {
                            type: 'raw',
                            value: node.value
                        }
                    }
                }
            })
        .use(rehypeRaw)
        .use(rehypeDocument, {title: '👋🌍'})
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(markup)

    console.error(reporter(file))
    console.log(String(file))


})

/**
 * https://mdxjs.com/docs/using-mdx/#mdx-provider
 *
 */
test('MarkdownWithCustomComponentViaJsx', async () => {

    let markup = `
## Hello, *world*!

<hallo>Hallo</hallo>

<discard>Discarded</discard>
`;
    const file = await unified()
        .use(remarkParse)
        // https://github.com/remarkjs/remark/tree/main/packages/remark-parse
        .use(remarkMdx)
        .use(remarkRehype,
            {
                // https://github.com/syntax-tree/mdast-util-to-hast#example-supporting-custom-nodes
                // They can be passed to remark-rehype
                // https://github.com/remarkjs/remark-rehype#optionshandlers
                handlers: {
                    mdxJsxTextElement(state, node) {
                        if (node.name === "discard") {
                            return null;
                        }
                        let properties = {};
                        for (const attribute of node.attributes) {
                            let value = attribute.value;
                            if (value === null) {
                                value = true;
                            }
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
        .use(rehypeDocument, {title: '👋🌍'})
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(markup)

    console.error(reporter(file))
    console.log(String(file))


})

test('MarkdownToReactWithCustomComponent', async () => {

    const text = `
## Hello, *world*!

<hallo>Hallo</hallo>

<discard>Discarded</discard>
`;

    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeReact, {createElement, Fragment, jsx, jsxs})
        .process(text);

    let result = file.result;
    const toHydrateHtml = ReactDOMServer.renderToString(result);
    console.log(toHydrateHtml);

})

