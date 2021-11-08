import _ from 'lodash'
import * as models from '../entities/entities'

/**
 * A middleware used to cache query result in a scoped cache
 */
export default class ContextCacheMiddleware {
  /**
   * Get the given resolver proxied with the cache feature
   * @returns {Object<Proxy<Service>>}
   */
  static middleware() {
    return _.mapValues(models, model =>
      typeof model === 'function' ? ContextCacheMiddleware.getCacheProxy(model) : null
    )
  }

  /**
   * Returns a stringified version of the object
   * @param {*} value
   * @returns {String}
   */
  static getHash(value) {
    if (Array.isArray(value) || _.isPlainObject(value)) {
      return JSON.stringify(
        _.transform(value, (acc, v, k) => {
          acc[k] = ContextCacheMiddleware.getHash(v)
        })
      )
    }

    return value?.toString()
  }

  /**
   * Get a Service cache proxy
   * @private
   * @param {mongoose.Model} model
   * @returns {Object<Proxy<Service>>}
   */
  static getCacheProxy(model) {
    const cache = []

    return new Proxy(model, {
      get(target, prop) {
        const value = model[prop]
        const getValue = (...params) =>
          ContextCacheMiddleware.handle({
            cache,
            params,
            method: value,
            service: model
          })

        return typeof value === 'function' ? getValue : value
      }
    })
  }

  /**
   * Get hashed key for an item
   * @private
   * @param {Array} cache
   * @param {function} method
   * @param {*[]} params
   * @returns {String}
   */
  static getItemKey(cache, method, params) {
    const locals = cache
    let index = cache.findIndex(entry => entry.method === method)

    if (index < 0) {
      index = cache.length
      locals[index] = { method, items: {} }
    }

    const hashKey = ContextCacheMiddleware.getHash(params)

    return `[${index}].items.${hashKey}`
  }

  /**
   * Get a value from the cache
   * @private
   * @param {Array} cache
   * @param {String} key
   * @returns {*}
   */
  static getItem(cache, key) {
    return _.get(cache, key)
  }

  /**
   * Set the value to the cache and returns the value
   * @private
   * @param {Array} cache
   * @param {String} key
   * @param {*} value
   * @returns {*}
   */
  static setItem(cache, key, value) {
    _.set(cache, key, typeof value === 'undefined' ? null : value)

    return value
  }

  /**
   * Return the resolver result using an in-memory cache layer
   * @private
   * @param {Object} service
   * @param {function} method
   * @param {*[]} params
   * @param {Arrat} cache
   * @returns {Promise<*>}
   */
  static async handle({ service, method, params, cache }) {
    const key = ContextCacheMiddleware.getItemKey(cache, method, params)
    const value = ContextCacheMiddleware.getItem(cache, key)
    const hasValue = typeof value !== 'undefined'

    return hasValue
      ? value
      : ContextCacheMiddleware.setItem(cache, key, method.apply(service, params))
  }
}
