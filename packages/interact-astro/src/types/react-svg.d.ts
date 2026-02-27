// https://github.com/facebook/create-react-app/blob/0ee4765c39f820e5f4820abf4bf2e47b3324da7f/packages/react-scripts/lib/react-app.d.ts#L47-L56
// See also: export * from "vite-plugin-svgr/client"

declare module '*.svg?react' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    export default ReactComponent;
}

