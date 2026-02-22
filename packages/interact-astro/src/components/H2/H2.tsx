import React from "react";

/**
 * Custom HTML element used in markdown rendering
 * This element is injected with the remark-mdx-custom-html-component.ts plugin
 */
export default function H2({children, className, ...rest}: React.HTMLAttributes<HTMLHeadingElement>) {

    return (
        <h2 className={className || 'mb-3 h2 font-monospace'}  {...rest}>{children}</h2>
    )

}
