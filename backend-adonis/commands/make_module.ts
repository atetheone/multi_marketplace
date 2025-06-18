import { BaseCommand, args } from '@adonisjs/core/ace'
import { join } from 'node:path'
import { promises as fs } from 'node:fs'

export default class MakeModule extends BaseCommand {
  static commandName = 'make:module'
  static description = 'Generate a new module with all necessary directories'

  @args.string({ description: 'Name of the module' })
  moduleName: string

  async run() {
    const moduleName = this.moduleName
    const basePath = join('app', 'modules', moduleName)

    const directories = ['controllers', 'models', 'services', 'validators', 'types', 'routes']

    try {
      for (const dir of directories) {
        const dirPath = join(basePath, dir)
        await fs.mkdir(dirPath, { recursive: true })
        this.logger.info(`Created directory: ${dirPath}`)
      }

      // Update package.json with new aliases
      const packageJsonPath = join(process.cwd(), 'package.json')
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))

      const aliasBasePath = `./app/modules/${moduleName}`
      const newAliases = {
        [`#${moduleName}/controllers/*`]: `${aliasBasePath}/controllers/*.js`,
        [`#${moduleName}/models/*`]: `${aliasBasePath}/models/*.js`,
        [`#${moduleName}/services/*`]: `${aliasBasePath}/services/*.js`,
        [`#${moduleName}/validators/*`]: `${aliasBasePath}/validators/*.js`,
        [`#${moduleName}/types/*`]: `${aliasBasePath}/types/*.js`,
        [`#${moduleName}/routes/*`]: `${aliasBasePath}/routes/*.js`,
      }

      packageJson.imports = {
        ...packageJson.imports,
        ...newAliases,
      }

      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
      this.logger.success(`Updated package.json with aliases for module ${moduleName}`)

      this.logger.success(`Module ${moduleName} created successfully!`)
    } catch (error) {
      this.logger.error(`Failed to create module ${moduleName}: ${error.message}`)
    }
  }
}
