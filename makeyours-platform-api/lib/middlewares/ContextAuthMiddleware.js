import Auth from '../entities/Auth/service'

/**
 * A middleware used to retrieve the Session and User associated to an authorization token
 */
export default class ContextAuthMiddleware {
  /**
   * @private
   * @const
   * @type {RegExp}
   */
  static authorizationRegExp = /^bearer /i

  /**
   * Retrieve the Session and User associated to the token
   * if it was passed to req.headers.authorization and returns it
   * @param {Request} req
   * @returns {Promise<?User>}
   */
  static async middleware({ req }) {
    const regexp = ContextAuthMiddleware.authorizationRegExp
    const token = req.headers.authorization?.replace(regexp, '')
    const user = token ? await Auth.getUserByToken({ token }) : null

    return user
  }
}
