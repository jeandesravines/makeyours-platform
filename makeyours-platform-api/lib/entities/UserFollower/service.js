import Service from '../Base/service'

/**
 * UserFollowerService
 * @extends {Service<UserFollower>}
 */
export default class UserFollowerService extends Service {
  /**
   * Returns multiple Users depending on the "attribute" params which corresponding to
   * the "source" or "target" UserFollower's attribute
   * @private
   * @param {Object} where
   * @param {('source'|'target')} attribute
   * @param {Filters} filters
   * @param {Context} context
   * @returns {Promise<User[]>}
   */
  static async findManyUsersBy(where, attribute, filters, { cache }) {
    const args = { populate: [attribute], select: attribute, ...filters }
    const documents = await cache.UserFollower.findManyBy(where, args)
    const users = documents.map(({ [attribute]: user }) => user)

    return users
  }

  /**
   * Returns all User which are the source of a Follow relation targeted by the query.
   * @param {Object} where
   * @param {Filters} filters
   * @param {Context} context
   * @returns {Promise<User[]>}
   */
  static async findManySourceUsersBy(where, filters, context) {
    return this.findManyUsersBy(where, 'source', context)
  }

  /**
   * Returns all User which are the target of a Follow relation targeted by the query.
   * @param {Object} where
   * @param {Filters} filters
   * @param {Context} context
   * @returns {Promise<User[]>}
   */
  static async findManyTargetUsersBy(where, filters, context) {
    return this.findManyUsersBy(where, 'target', context)
  }
}
