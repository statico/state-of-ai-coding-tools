import { promises as fs } from 'fs'
import path from 'path'
import { FileMigrationProvider, Migrator } from 'kysely'
import { db } from './db'

export async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

export async function migrateDown() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(process.cwd(), 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was reverted successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to revert migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate down')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

if (require.main === module) {
  const command = process.argv[2]
  
  if (command === 'up' || !command) {
    migrateToLatest()
  } else if (command === 'down') {
    migrateDown()
  } else {
    console.error('Usage: npm run migrate [up|down]')
    process.exit(1)
  }
}