import mongoose from 'mongoose'

/**
 * Model class
 */
export default class Model {
  /**
   * Create a Model
   * @param {String} name
   * @param {mongoose.Schema} schema
   * @returns {mongoose.Model}
   */
  static create(name, schema) {
    return mongoose.model(name, schema)
  }
}
