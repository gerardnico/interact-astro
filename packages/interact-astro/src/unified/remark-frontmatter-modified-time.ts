import {execSync} from "child_process";
import type {Root} from "mdast";
import {VFile} from "vfile";

// https://docs.astro.build/en/recipes/modified-time/
export default function remarkFrontmatterModifiedTime() {
    return function (tree: Root, file: VFile) {

        if (file?.constructor?.name != 'VFile') {
            console.warn("it's not a VFile")
            return;
        }
        // file.data may be undefined
        const frontmatter = file?.data?.astro?.frontmatter
        if (frontmatter == undefined) {
            return
        }
        if (file.history.length === 0) {
            /**
             * Example of virtual VFile
             * {
             *   "cwd": "/home/admin/code/bytle/website",
             *   "data": {
             *     "astro": {
             *       "frontmatter": {}
             *     }
             *   },
             *   "history": [],
             *   "messages": [],
             *   "value": "## Hallo"
             * }
             * console.log(JSON.stringify(file, null, 2));
             */
            return;
        }
        const filepath = file.history[0];
        const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`);
        frontmatter.lastModified = result.toString();
    };
}