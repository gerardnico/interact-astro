import {Command} from '@oclif/core'
import fs from 'fs'
import path from 'path'

import {ComponentsConfigSetSchemaType} from '../../../../interact-astro/src/config/configSchema'
import {config as interactConfig} from '../../../../interact-astro/src/config'
import {getPackageJsonDir} from "../../../../interact-astro/src/util/package-json-util";
import {realpathSync} from 'fs';
import {fileURLToPath} from 'url';

/**
 * Function that called itself recursively to create the symlink
 * @param absoluteTargetDirPathToSync - the target to sync (file or dir)
 * @param absoluteBaseSourceDir - the source base directory
 * @param absoluteBaseDestDir - the target base directory
 */
function createSymlinksForDir(absoluteTargetDirPathToSync: string, absoluteBaseSourceDir: string, absoluteBaseDestDir: string) {

    let sourceRelativePath = path.relative(absoluteTargetDirPathToSync, absoluteBaseSourceDir)
    let moduleSourceBaseDir = path.basename(absoluteBaseSourceDir);
    for (const targetEntry of fs.readdirSync(absoluteTargetDirPathToSync)) {
        const absoluteSourceEntry = path.join(absoluteTargetDirPathToSync, targetEntry);
        let absoluteLinkPath = path.resolve(absoluteBaseDestDir, "src", moduleSourceBaseDir, sourceRelativePath, targetEntry);
        if (fs.existsSync(absoluteLinkPath)) {
            fs.rmSync(absoluteLinkPath)
        }
        if (fs.statSync(absoluteSourceEntry).isDirectory()) {
            createSymlinksForDir(absoluteSourceEntry, absoluteBaseSourceDir, absoluteBaseDestDir)
        } else {
            let linkDir = path.dirname(absoluteLinkPath)
            fs.mkdirSync(linkDir, {recursive: true});
            fs.symlinkSync(absoluteSourceEntry, absoluteLinkPath, "file");
            console.log(`    * Symlink created:\n       ${absoluteSourceEntry} \n    -> ${absoluteLinkPath}`)
        }
    }
}

function createComponentsModule(moduleName: string, moduleDest: string, components: ComponentsConfigSetSchemaType): void {
    // Create package.json for the module
    const packageJsonExports = {}

    for (const [component, componentProps] of Object.entries(components)) {

        console.log(`${component} Component Symlink creation:`)
        let importPath = componentProps.importPath;
        if (!importPath) {
            throw new Error(`The import path of the ${component} component is empty`)
        }
        // @ts-ignore
        let resolvedPath = fileURLToPath(import.meta.resolve(importPath)) as string;
        if (!fs.existsSync(resolvedPath)) {
            // may be a relative path
            let resolvedCwd = path.resolve(process.cwd(), importPath);
            if (!fs.existsSync(resolvedCwd)) {
                throw new Error(`No resolved path of the ${component} component exists. Module resolution Path: ${resolvedPath}, Current directory resolution: ${resolvedPath}`)
            }
            resolvedPath = resolvedCwd
        }
        const sourceFileSystemPath = realpathSync(resolvedPath);
        // the source is called the target
        // because that's what it's called in the symlink function
        let targetComponentFileName = path.basename(sourceFileSystemPath);
        let targetComponentDirName = path.basename(path.dirname(sourceFileSystemPath));

        packageJsonExports[`./${component}`] = `./src/${targetComponentDirName}/${targetComponentFileName}`

        let absoluteTargetPath = path.resolve(sourceFileSystemPath);
        if (!fs.existsSync(absoluteTargetPath)) {
            throw new Error(`The path of the ${component} component does not exist. Path: ${absoluteTargetPath}`)
        }
        if (fs.statSync(absoluteTargetPath).isDirectory()) {
            throw new Error(`The path of the ${component} component is not a file but a directory. Path: ${absoluteTargetPath}`)
        }

        let absoluteTargetDirPath = path.dirname(absoluteTargetPath);
        createSymlinksForDir(absoluteTargetDirPath, absoluteTargetDirPath, moduleDest)

    }
    console.log(`Component Symlink creation done`)

    const packageJson = {
        name: moduleName,
        version: '1.0.0',
        description: 'Interact Components',
        type: 'module',
        exports: packageJsonExports,
    }

    // Create the folder in node_modules and package.json
    fs.mkdirSync(moduleDest, {recursive: true})
    fs.writeFileSync(
        path.join(moduleDest, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    )

    const relativeModuleDestPath = path.relative(process.cwd(), moduleDest);
    console.log(`Module ${moduleName} created in ${relativeModuleDestPath}`)


}

export default class CreateComponents extends Command {
    static description = 'Create the components module in node_modules'

    static examples = [
        '<%= config.bin %> <%= command.id %>',
    ]

    static enableJsonFlag = false
    static strict = true

    async run(): Promise<void> {
        await this.parse(CreateComponents)

        const appDirectory = getPackageJsonDir(process.cwd(), false)
        const moduleName = '@combostrap/interact-components'
        const moduleDest = path.resolve(appDirectory, 'node_modules', moduleName)
        createComponentsModule(moduleName, moduleDest, interactConfig.components)
    }
}
