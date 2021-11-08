import _ from 'lodash'
import * as configuration from '../../lib/configuration'
import Mongoose from '../../lib/services/Mongoose/Mongoose'
import seeders from '../../database/seeds'

if (configuration.app.isProduction) {
  throw new Error('You must not seed the database in other environment than the development one!')
}

/**
 * Clean the Database's Model's Collection one by one
 * @private
 * @returns {Promise<void>}
 */
async function clean() {
  const reducer = async (deferred, model) => {
    await deferred
    await model.deleteManyBy({})
  }

  await _.reduce(Mongoose.instance.models, reducer, Promise.resolve())
}

/**
 * Seed the Database
 * @private
 * @returns {Promise<void>}
 */
async function seed() {
  const reducer = async (deferred, seeder) => {
    await deferred.then(async () => {
      if (await seeder.shouldRun()) {
        await seeder.run()
      }
    })
  }

  await _.reduce(seeders, reducer, Promise.resolve())
}

/**
 * Clean and Seed the Database
 * @private
 * @returns {Promise<void>}
 */
async function main() {
  await Mongoose.connect()
  await clean()
  await seed()
  await Mongoose.disconnect()
}

main()
