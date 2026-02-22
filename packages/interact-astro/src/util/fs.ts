/**
 * Utility over a path in a file format
 * (ie name separated by /)
 * * the Astro.url.pathname
 * * or file path
 */

/**
 * Return the pages directory
 * @param filePath - A path in a file format (the Astro.url.pathname or file)
 */
export function getDirectoryFromFilePath(filePath: string) {
    // Find the last occurrence of '/'
    const lastSlashIndex = filePath.lastIndexOf('/');

    // Extract substring up to and including the last '/'
    // because it's a directory
    return filePath.substring(0, lastSlashIndex + 1);
}

/**
 * Return the default name of a page based on its file path
 * @param filePath - A path in a file format (the Astro.url.pathname or file)
 */
export function getPageNameFromFilePath(filePath: string) {
    // Extract filename from path
    let pathNames = filePath.split('/');
    let fileName = pathNames.pop();
    if (fileName.startsWith("index.")) {
        // take the directory
        fileName = pathNames.pop();
    }

    // Remove file extension
    const nameWithoutExt = fileName.replace(/\.[^.]+$/, '');

    // Split by common separators (-, _, .)
    const words = nameWithoutExt.split(/[-_.]/);

    // Convert to Title Case (first letter uppercase, rest lowercase)
    return words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Return the file name without extension
 * @param filePath - A path in a file format (the Astro.url.pathname or file)
 */
export function getFileNameWithoutExtensionFromFilePath(filePath: string) {
    // Extract filename from path
    let fileName = filePath.split('/').pop();
    // Find the last occurrence of '.'
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex == -1) {
        return fileName
    }
    // Extract substring up to
    return fileName.substring(0, lastDotIndex);
}