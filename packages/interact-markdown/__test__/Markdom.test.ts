import {expect, test} from "vitest";
import {fromMarkdown} from 'mdast-util-from-markdown'
import {visitParents} from "unist-util-visit-parents";
import {selectAll} from "unist-util-select";
import type {MdxJsxTextElement, MdxJsxAttribute} from 'mdast-util-mdx-jsx';
import {h} from "hastscript";
import {toDom} from "hast-util-to-dom"; // This wraps micromark.
import {JSDOM} from "jsdom"; // This wraps micromark.
import {DOMImplementation} from '@xmldom/xmldom';
// @ts-ignore
import xpath from 'xpath';
import {toHast} from "mdast-util-to-hast";
import {raw} from "hast-util-raw";
import {Marki} from "../src/Marki";
import type {Text} from 'mdast';


/**
 * @typedef {import('hast').Raw} Element
 * @typedef {import('mdast').Html} Html
 */

/**
 * How to create an extension for micromark that parses “variables”
 * https://github.com/micromark/micromark#extending-markdown
 */
test('ExtendMarkdownParserWithVariables', () => {

    /**
     * How to create an extension for micromark that parses “variables”
     * https://github.com/micromark/micromark#extending-markdown
     */

})

/**
 * Trying to get custom component
 * parsed directly via Jsx plugin
 *
 * https://github.com/syntax-tree/mdast-util-mdx-jsx
 *
 */
test('RenderHTML', () => {

    // noinspection HtmlUnknownAttribute
    let doc = "a <b c d=\"e\" /> f\n";
    let ast = Marki.toMdast(doc);
    let hast = Marki.toHast(ast);
    let html = Marki.toHtml(hast);
    console.log(html);

})


/**
 *
 * Main documentation
 * https://github.com/syntax-tree/mdast-util-to-hast#example-supporting-html-in-markdown-properly
 *
 * Raw will traverse the tree one more time.
 * A better solution is to use Jsx
 */
test('CustomHtmlComponentViaRaw', () => {

    let markup = `
## Hello, *world*!

<hallo class="yolo">Hallo Content</hallo>

<discarded></discarded>
`;
    // const mdast = fromMarkdown(markup, {
    //     extensions: [gfm()],
    //     mdastExtensions: [gfmFromMarkdown()]
    // })
    const mdast = Marki.toMdast(markup);
    const halloCustomNode = selectAll('mdxJsxTextElement[name=hallo]', mdast);
    expect(halloCustomNode.length).toBe(1);
    let halloNode = halloCustomNode[0] as MdxJsxTextElement;
    expect(halloNode.attributes.length).toBe(1);
    let attribute = halloNode.attributes[0] as MdxJsxAttribute;
    expect(attribute.name).toBe("class");
    expect(attribute.value).toBe("yolo");
    const textNodes = selectAll('text', halloNode)
    expect(textNodes.length).toBe(1);
    expect((textNodes[0] as Text).value).toBe("Hallo Content");

    /**
     * https://github.com/syntax-tree/mdast-util-to-hast
     *
     * `Raw` parse the `raw` nodes as html element and build the tree around
     * https://github.com/syntax-tree/hast-util-raw
     */
    const hast = raw(toHast(mdast,
        {

            //https://github.com/syntax-tree/mdast-util-to-hast#example-supporting-custom-nodes
            //They can be passed to remark-rehype
            //https://github.com/remarkjs/remark-rehype#optionshandlers
            handlers: {
                /**
                 * @param  state
                 * @param { Html } node - mdast node
                 * @returns {Element} - hast node.
                 */
                // @ts-ignore
                html(state, node) {
                    if (!(node.value === "<hallo class=\"yolo\">" || node.value === "</hallo>")) {
                        // discarded
                        return undefined;
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
        }));

    console.log(Marki.toHtml(hast));


})

/**
 *
 * This is just a visit that keeps a pointer on the parents
 *
 * https://github.com/syntax-tree/unist#list-of-utilities
 *
 * querySelect https://github.com/syntax-tree/unist-util-select
 * Example with https://github.com/gorango/unist-util-ancestor
 *
 */
test('SyntaxTreeVisitWithParent', () => {
    const tree = fromMarkdown('Some *emphasis*, **strong**, and `code`.')

    /**
     * https://github.com/syntax-tree/unist-util-is
     */
        //let test = 'strong';
    let test = null;
    /**
     * Visit nodes, with ancestral information.
     */
    visitParents(tree, test, (node, ancestors) => {
        console.log(node.type, ancestors.map(ancestor => ancestor.type))
    })
})


/**
 * Hast to JsDom
 * It's not really needed as Hast as the parent node
 * https://unifiedjs.com/explore/package/hast-util-to-dom/
 */
test('HastToJsdom', () => {
    const tree = h('main', [
        h('h1', 'Hi'),
        h('p', [h('em', 'Hello'), ', world!'])
    ])
    let dom = new JSDOM();
    const {document} = dom.window;
    const nodes = toDom(tree, {
        "document": document
    })
    document.body.append(nodes);
    console.log(dom.serialize());
})


/**
 * Hast
 * https://unifiedjs.com/explore/package/hast-util-to-dom/
 * https://github.com/xmldom/xmldom
 * can be used in other environment than the browser with only Javascript
 * (ie Without any node dependency)
 */
test('HastToXmlDomAndXpath', () => {
    const tree = h('main', [
        h('h1', 'Hi'),
        h('p', [h('em', 'Hello'), ', world!'])
    ])
    let domImplementation = new DOMImplementation();
    let document = domImplementation.createDocument(null, null, null);
    let errorOccured = false;
    try {
        toDom(tree, {
            "document": document
        })
    } catch (e) {
        if (e instanceof Error && e.message === "node.append is not a function") {
            // unfortunately, xmldom does not implement it
            errorOccured = true
        }
    }
    expect(errorOccured).toBe(true);

    // document.appendChild(nodes);
    // console.log(new XMLSerializer().serializeToString(document));

    // QuerySelector is not implemented
    // https://github.com/xmldom/xmldom/issues/92
    // let h1Element = document.querySelector("h1");
    // We implemented it with:
    // https://www.npmjs.com/package/xpath
    // https://www.npmjs.com/package/css-to-xpath
    // let xPathExpression = cssToXpath('h1');
    // let h1Elements = xpath.select(xPathExpression, document)

    // let h1 = h1Elements[0];
    // let innerText = h1.firstChild.data;
    // expect(innerText).toBe('Hi');
    // console.log(new XMLSerializer().serializeToString(h1))

})



