import { ApolloError } from 'apollo-server'

/**
 * An HTTP error with a status code
 * @abstract
 */
export default class GraphQLError extends ApolloError {
  /**
   * Create an Error
   * @param {Object} data - the error's data
   * @param {String} data.message - the user message
   * @param {Number} data.statusCode - the HTTP status code
   * @param {*} [data.details] - some details
   */
  constructor(data) {
    super(data.message, data.statusCode, data.details)
  }
}
