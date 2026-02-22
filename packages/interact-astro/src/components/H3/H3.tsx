import React from "react";

/**
 * Custom HTML element used in markdown rendering
 * This element is injected with the remark-mdx-custom-html-component.ts plugin
 */
export default function H3({children, className, ...rest}: React.HTMLAttributes<HTMLHeadingElement>) {

    return (
        <h3 className={className || 'mb-3 h3 font-monospace'}  {...rest}>{children}</h3>
    )

}
