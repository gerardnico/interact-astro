import {visit} from "unist-util-visit";
import type {Root} from 'hast'


/**
 * Astro path does not have the md or mdx extension but the link checker (editor or cli) needs them
 * This plugin will delete the Markdown extension from a link
 *
 * Example:
 * * /docs/getting-started.md → /docs/getting-started
 * * /docs/getting-started.mdx → /docs/getting-started
 * * /docs/index.md → /docs
 * * /docs/index.mdx → /docs
 * * Leaves external links untouched
 *
 * Remove also the public
 * * ../../../public/static/file.pdf -> /static/file.pdf
 *
 * @param publicPattern - the public pattern to search in href
 * @param target - the external link target
 * @returns {(function(*): void)|*}
 */
export default function rehypeHrefRewrite(publicPattern = '/public/', target = "_blank"): ((publicPattern: string) => void) | any {
    return function transformer(tree: Root) {
        visit(tree, "element", (node) => {
            if (
                node.tagName === "a" &&
                node.properties &&
                typeof node.properties.href === "string"
            ) {
                const href = node.properties.href;

                if (
                    href.startsWith("http://") ||
                    href.startsWith("https://")) {
                    node.properties.target = target
                    return;
                }
                // Skip external, hash, absolute, and mailto links
                if (
                    href.startsWith("#") ||
                    href.startsWith("mailto:") ||
                    href.startsWith("/")
                ) {
                    return;
                }

                /**
                 * Special case so that the href is not empty
                 * by the replacement below
                 */
                if (href === "index.md" || href === "index.mdx") {
                    node.properties.href = ".";
                    return
                }

                // Remove .md or .mdx at the end (before optional slash)
                node.properties.href = href.replace(/(\.mdx?|\/index\.mdx?)$/, "");

                // Remove the public part
                // ie
                const publicIndex = node.properties.href.indexOf(publicPattern)
                if (publicIndex == -1) {
                    return;
                }
                node.properties.href = node.properties.href.slice(publicIndex + publicPattern.length)
            }
        });
    };
}
