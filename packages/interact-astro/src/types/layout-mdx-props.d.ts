// A .d.ts file (a type declaration file)

// https://docs.astro.build/en/basics/layouts/#markdown-layout-props
import type {MarkdownLayoutProps, MDXInstance, MDXLayoutProps} from 'astro';

// Define the frontmatter structure for markdown files or added info by plugins
export interface Frontmatter {
    name?: string;
    title?: string;
    layout?: string;
    description?:string;
    keyWords?:string;
    robots?:string;
}

// List of props
// https://docs.astro.build/en/basics/layouts/#markdown-layout-props

interface MDXLayoutPropsOptional<T extends Record<string, any>> extends Omit<MarkdownLayoutProps<T>, 'rawContent' | 'compiledContent'> {
    components: MDXInstance<T>['components'];
}
// Create a new type that extends MDXLayoutProps with our custom frontmatter
// The props are passed automatically by Astro
// We can't change it, it's hard-written so if you want to use a Layout without Markdown,
// you need to conform to it
// https://docs.astro.build/en/basics/layouts/#markdown-layout-props
export type LayoutProps = MDXLayoutProps<Frontmatter>;

