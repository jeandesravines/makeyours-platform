import GraphQLError from './GraphQLError'

/**
 * 401 Unauthorized
 */
export default class UnauthorizedError extends GraphQLError {
  /**
   * Create an Error
   * @param {String} message
   * @param {*} [details]
   */
  constructor(message, details) {
    super({
      details,
      message,
      statusCode: 401
    })
  }
}
