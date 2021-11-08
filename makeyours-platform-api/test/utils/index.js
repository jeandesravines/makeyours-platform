import Context from '../../lib/helpers/Context/Context'
import ContextCacheMiddleware from '../../lib/middlewares/ContextCacheMiddleware'

/**
 * Create a fake Context
 * @returns {Context}
 */
export function createContext() {
  return new Context({
    user: null,
    cache: ContextCacheMiddleware.middleware()
  })
}
