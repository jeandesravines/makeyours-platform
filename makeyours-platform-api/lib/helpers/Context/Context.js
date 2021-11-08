/**
 * Context class
 */
export default class Context {
  /**
   * Create a context
   * @param {Object} values
   */
  constructor(values) {
    Object.assign(this, values)
  }

  /**
   * Returns this
   * @const {this}
   */
  get context() {
    return this
  }
}
