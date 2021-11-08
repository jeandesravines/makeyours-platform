import _ from 'lodash'
import mongoose from 'mongoose'
import * as configuration from '../../configuration'
import MongooseError from '../../errors/mongoose/MongooseError'
import DotNotation from '../../services/DotNotation/DotNotation'
import Logger from '../../services/Logger/Logger'

/**
 * @typedef {Object} Filters
 * @property {?number} limit
 * @property {?Array<string>} populate
 * @property {?string} select
 * @property {?number} offset
 * @property {?Object<('asc'|'desc')>} sort
 */

/**
 * Model's service
 * @abstract
 * @extends mongoose.Model
 */
export default class Service extends mongoose.Model {
  /**
   * Query filters
   * @private
   * @const
   * @type {Object<Function(mongoose.Query, *): mongoose.Query}
   */
  static filters = {
    limit: (q, value) => q.limit(value),
    populate: (q, value) => value.reduce((acc, p) => q.populate(p), q),
    select: (q, value) => q.select(value),
    offset: (q, value) => q.skip(value),
    sort: (q, value) => q.sort(value)
  }

  /**
   * Hooks Enum
   * @private
   * @const
   * @type {Object<String>}
   */
  static hooks = {
    postDelete: 'onPostDelete',
    postUpdate: 'onPostUpdate'
  }

  /**
   * Call a hook for each documents
   * @private
   * @param {String} hook
   * @param {Model} document
   * @returns {Promise<Model>}
   */
  static async handleHook(hook, document) {
    if (this[hook]) {
      await this[hook](document)
    }

    return document
  }

  /**
   * Return a mongoose.ObjectId representation
   * of an object
   * @private
   * @param {String} id
   * @returns {mongoose.Types.ObjectId}
   */
  static getObjectId(id) {
    return new mongoose.Types.ObjectId(id)
  }

  /**
   * Execute a callback to each chunk
   * @param {Object} where
   * @param {Filters} filters
   * @param {function(Model[])} callback
   * @returns {Promise<void>}
   */
  static async forEach(where, filters, callback) {
    await this.getQuery(where, filters)
      .find({})
      .cursor()
      .eachAsync(doc => callback(doc, filters))
  }

  /**
   * Throw a MongooseError
   * @private
   * @param {Error} error
   * @returns {void}
   * @throws {MongooseError}
   */
  static catch(error) {
    throw new MongooseError(error)
  }

  /**
   * Transform the data from the server to the DB
   * @param {Object} value
   * @returns {Object}
   */
  static normalize(value) {
    const raw = value instanceof mongoose.Document ? value.toObject() : value
    const normalized = DotNotation.toPaths(raw)

    return normalized
  }

  /**
   * Get the number of element which should returns the where
   * @protected
   * @param {Object} where
   * @param {Filters} filters
   * @returns {Promise<number>}
   */
  static async countBy(where, filters) {
    return this.getQuery(where, filters)
      .countDocuments({})
      .catch(error => this.catch(error))
  }

  /**
   * Returns the appropriate mongoose.Model for the given document
   * @private
   * @param {mongoose.Document|Object} document
   * @returns {Class<Model>}
   */
  static getDocumentModel(document) {
    return document instanceof mongoose.Document ? document.constructor : this
  }

  /**
   * Create a document
   * @protected
   * @param {Object} data
   * @returns {Promise<Model>}
   */
  static async createOne(data) {
    const normalized = this.normalize(data)

    return this.getDocumentModel(data)
      .create(normalized)
      .catch(error => this.catch(error))
  }

  /**
   * Delete the model
   * @protected
   * @param {Model} document
   * @returns {Promise<Model|null>}
   */
  static async deleteOne(document) {
    return this.deleteOneBy({ _id: document._id })
  }

  /**
   * Delete the first document targeted by the query
   * @protected
   * @param {Object} where
   * @param {Filters} filters
   * @returns {Promise<Model|null>}
   */
  static async deleteOneBy(where, filters) {
    return this.getQuery(where, filters)
      .findOneAndDelete({})
      .then(doc => this.handleHook(this.hooks.postDelete, doc))
      .catch(error => this.catch(error))
  }

  /**
   * Delete all documents targeted by the query
   * @protected
   * @param {Object} where
   * @param {Filters} filters
   * @returns {Promise<Model[]>}
   */
  static async deleteManyBy(where, filters) {
    return this.forEach(where, filters, async doc => {
      await this.deleteOneBy({ _id: doc._id }, filters)
    })
  }

  /**
   * Removes from an existing array all instances of a value or values
   * that match a specified condition.
   * @param {Object} where
   * @param {String} attribute
   * @param {Object} conditions
   * @param {Filters} filters
   * @returns {Promise<Model[]>}
   */
  static async pullManyBy(where, attribute, conditions, filters) {
    const data = {
      $pull: { [attribute]: conditions }
    }

    return this.updateManyBy(where, data, filters)
  }

  /**
   * Find one document matching the query
   * @protected
   * @param {Object} where
   * @param {Filters} filters
   * @returns {Promise<Model|null>}
   */
  static async findOneBy(where, filters) {
    return this.getQuery(where, filters)
      .findOne({})
      .catch(error => this.catch(error))
  }

  /**
   * Find all documents matching the query
   * @protected
   * @param {Object} where
   * @param {Filters} filters
   * @returns {Promise<Model[]>}
   */
  static async findManyBy(where, filters) {
    return this.getQuery(where, filters)
      .find({})
      .catch(error => this.catch(error))
  }

  /**
   * Check if all query keys match with a defined index
   * @param {Object} where
   * @returns {void}
   */
  static checkQueryIndexes(where) {
    const keys = Object.keys(where)
    const hasIndex = this.schema._indexes
      .map(([refs]) => Object.keys(refs))
      .concat(['_id'])
      .some(group =>
        keys.every(key => {
          switch (key) {
            case '$and':
            case '$or':
            case '$nor':
              return where[key].every(query => this.checkQueryIndexes(query))
            default:
              return group.includes(key)
          }
        })
      )

    if (!hasIndex) {
      Logger.error(`${this.modelName}'s schema should contains an index containing: [${keys}]`)
    }

    return hasIndex
  }

  /**
   * Create a query
   * @private
   * @param {Object} where
   * @param {Filters} filters
   * @returns {mongoose.Query}
   */
  static getQuery(where, filters) {
    const query = this.where(where)

    if (configuration.mongoose.debug) {
      this.checkQueryIndexes(where)
    }

    if (!filters) {
      return query
    }

    return _.reduce(filters, (q, value, name) => Service.filters[name](q, value), query)
  }

  /**
   * Save the document
   * @param {Object} document
   * @param {Obtions} filters - only used for update
   * @returns {Promise<Model>}
   */
  static async saveOne(document, filters) {
    return document._id ? this.updateOne(document, document, filters) : this.createOne(document)
  }

  /**
   * Update or save many documents independently according to the given paths
   * @protected
   * @param {String[]} paths
   * @param {Object[]} documents
   * @returns {Promise<Model[]>}
   */
  static async saveManyBy(paths, documents) {
    const getWhere = doc => _.reduce(paths, (acc, k) => ({ ...acc, [k]: _.get(doc, k) }), {})
    const deferred = documents.map(doc => this.updateOneBy(getWhere(doc), doc))

    return Promise.all(deferred)
  }

  /**
   * Update or save many documents
   * @protected
   * @param {Object[]} documents
   * @returns {Promise<Model[]>}
   */
  static async saveMany(documents) {
    return Promise.all(documents.map(doc => this.saveOne(doc)))
  }

  /**
   * Update all documents which match with the given condition
   * @param {Object} where
   * @param {Object} data
   * @param {Filters} filters
   * @returns {Promise<void>}
   */
  static async updateManyBy(where, data, filters) {
    return this.forEach(where, filters, async (doc, _context) => {
      await this.updateOneBy({ _id: doc._id }, data, _context)
    })
  }

  /**
   * Update the given document
   * @param {Object} document
   * @param {Object} data
   * @param {Filters} filters
   * @returns {Promise<Model>}
   */
  static async updateOne(document, data, filters) {
    return this.updateOneBy({ _id: document._id }, data, filters)
  }

  /**
   * Update the first document witch matches with the condition
   * and return a new Model containing the old data merged with the new
   * @protected
   * @param {Object} where
   * @param {Object} data
   * @param {Filters} filters
   * @returns {Promise<Model?>}
   */
  static async updateOneBy(where, data, filters) {
    const normalized = this.normalize(data)
    const options = {
      new: true,
      omitUndefined: true,
      upsert: true,
      setDefaultsOnInsert: true
    }

    return this.getDocumentModel(data)
      .getQuery(where, filters)
      .findOneAndUpdate({}, normalized, options)
      .then(doc => this.handleHook(this.hooks.postUpdate, doc))
      .catch(error => this.catch(error))
  }

  /**
   * Update the first document which matches with the condition
   * and return a new Model containing the old data merged with the new
   * @protected
   * @param {Object} where
   * @param {Object} data
   * @param {Filters} filters
   * @returns {Promise<Model?>}
   */
  static async fillOneBy(where, data, filters) {
    const original = (await this.findOneBy(where, filters)) || new this()
    const merged = original.set({ ...data, ...original.toObject() })

    return this.saveOne(merged)
  }
}
