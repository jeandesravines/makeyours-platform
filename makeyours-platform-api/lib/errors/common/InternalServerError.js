import GraphQLError from './GraphQLError'

/**
 * 500 Internal Server Error
 */
export default class InternalServerError extends GraphQLError {
  /**
   * Create an Error
   * @param {String} message
   * @param {*} [details]
   */
  constructor(message, details) {
    super({
      details,
      message,
      statusCode: 500
    })
  }
}
