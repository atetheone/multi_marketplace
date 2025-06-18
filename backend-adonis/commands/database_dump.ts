import { BaseCommand } from '@adonisjs/core/ace'
import { execSync } from 'node:child_process'
import env from '#start/env'

export default class DatabaseDump extends BaseCommand {
  static commandName = 'db:dump'
  static description = 'Create a database dump'

  async run() {
    const dbUser = env.get('DB_USER')
    const dbHost = env.get('DB_HOST')
    const dbPort = env.get('DB_PORT')
    const dbName = env.get('DB_DATABASE')
    const dbPassword = env.get('DB_PASSWORD')

    // Create timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `backup-${timestamp}.sql`

    this.logger.info(`Creating database dump to ${filename}...`)

    try {
      // Set password as environment variable to avoid exposing it in process list
      process.env.PGPASSWORD = dbPassword

      execSync(`pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} > ${filename}`, {
        stdio: 'inherit',
      })

      this.logger.success(`Database dump created successfully: ${filename}`)
    } catch (error) {
      this.logger.error('Failed to create database dump')
      this.logger.error(error)
    } finally {
      // Clear password from environment
      delete process.env.PGPASSWORD
    }
  }
}
