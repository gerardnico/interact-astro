import {expect, test} from "vitest";
import {Marki} from "../src/Marki";
import {renderToStaticMarkup} from "react-dom/server";
// @ts-ignore
import React from "react";

/**
 * Markdoc Callout
 * https://markdoc.dev/sandbox?mode=preview
 */
test('RenderReactCalloutComponent', async () => {

    let doc = "<Callout type=\"check\">A [callout](https://markdoc.dev/sandbox?mode=preview)</Callout>";


    let mdast = Marki.toMdast(doc);
    let hast = Marki.toHast(mdast);

    // Import to create chunk
    let components = {
        Callout: (await import("./components/Callout")).default
    }
    // not happy with Callout
    // @ts-ignore
    let jsx = Marki.toReact(hast, components);
    let html = renderToStaticMarkup(jsx);

    // jsdom test
    document.body.innerHTML = html;
    let calloutElement = document.querySelector('.callout');
    expect(calloutElement).toHaveClass('check')
    let calloutLink = calloutElement.querySelector('span a')
    expect(calloutLink).toHaveTextContent('callout')
    expect(calloutLink).toHaveAttribute('href', 'https://markdoc.dev/sandbox?mode=preview')
    console.log(html);

})


/**
 * Example / Components taken from
 * https://mdxjs.com/docs/using-mdx/#components
 *
 * See also: https://mdxjs.com/table-of-components/
 */
test('RenderReactElementMdxComponentsExample', () => {

    let doc = "# Hello *<Planet />*";
    let ast = Marki.toMdast(doc);
    let hast = Marki.toHast(ast);


    let components = {
        // Map `h1` (`# heading`) to use `h2`s.
        h1: 'h2',
        // Rewrite `em`s (`*like so*`) to `i` with a goldenrod foreground color.
        em: (props) => <i style={{color: 'goldenrod'}} {...props} />,
        // Pass a layout (using the special `'wrapper'` key).
        //wrapper: ({components, ...rest}) => <main {...rest} />,
        // Pass a component.
        Planet: () => 'Neptune',
        // This nested component can be used as `<theme.text>hi</theme.text>`
        //theme: {text: (props) => <span style={{color: 'grey'}} {...props} />}
    }
    // not happy with h1
    // @ts-ignore
    let jsx = Marki.toReact(hast, components);
    let html = renderToStaticMarkup(jsx);
    console.log(html);
    expect(html).toBe('<h2>Hello <i style="color:goldenrod">Neptune</i></h2>')

})
