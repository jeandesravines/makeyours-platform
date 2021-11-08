import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import _ from 'lodash'
import * as configuration from '../../configuration'

mongoosePaginate.paginate.options = {
  customLabels: {
    totalDocs: 'total',
    docs: 'data'
  }
}

mongoose.set('debug', configuration.mongoose.debug)
mongoose.set('applyPluginsToDiscriminators', true)
mongoose.plugin(mongoosePaginate)
mongoose.plugin(schema => {
  schema
    .set('minimize', false)
    .set('versionKey', false)
    .set('timestamps', true)
})

/**
 * MongooseService
 */
export default class Mongoose {
  /**
   * Mongoose instance
   * @const {Mongoose}
   */
  static instance = mongoose

  /**
   * Connect to MongoDB
   * @returns {Promise<void>}
   */
  static async connect() {
    await Mongoose.instance.connect(configuration.mongoose.url, configuration.mongoose.options)
    await Mongoose.syncIndexes()
  }

  /**
   * Close all connections
   * @returns {Promise<void>}
   */
  static async disconnect() {
    await Mongoose.instance.disconnect()
  }

  /**
   * Sync Collections's indexes
   * @private
   * @returns {Promise<void>}
   */
  static async syncIndexes() {
    if (configuration.mongoose.options.autoIndex) {
      return
    }

    await _.reduce(Mongoose.instance.models, async (deferred, model) => {
      await deferred
      await model.createCollection()
      await model.syncIndexes()
    })
  }
}
