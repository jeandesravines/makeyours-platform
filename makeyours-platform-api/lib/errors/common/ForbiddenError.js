import GraphQLError from './GraphQLError'

/**
 * 403 Forbidden
 */
export default class ForbiddenError extends GraphQLError {
  /**
   * Create an Error
   * @param {String} message
   * @param {*} [details]
   */
  constructor(message, details) {
    super({
      details,
      message,
      statusCode: 403
    })
  }
}
