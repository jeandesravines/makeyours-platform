import ContextAuthMiddleware from './ContextAuthMiddleware'
import ContextCacheMiddleware from './ContextCacheMiddleware'
import Context from '../helpers/Context/Context'

/**
 * A middleware used to create a new context at each request
 */
export default class ContextMiddleware {
  /**
   * Create an enhanced context
   * @private
   * @param {Request} req
   * @returns {Promise<Context>}
   */
  static async middleware({ req }) {
    return new Context({
      cache: ContextCacheMiddleware.middleware(),
      user: await ContextAuthMiddleware.middleware({ req })
    })
  }
}
