import Chance from 'chance'

/**
 * Seeder
 * @abstract
 */
export default class Seeder {
  /**
   * @const
   * @protected
   * @type {Chance}
   */
  static faker = Seeder.createFaker()

  /**
   * Returns true if the seed can be run
   * @returns {Promise<Boolean>}
   */
  static async shouldRun() {
    return true
  }

  /**
   * Create a Faker with declred mixins
   * @private
   * @returns {Chance}
   */
  static createFaker() {
    const faker = new Chance(42)

    faker.mixin({
      picture(params) {
        const defaults = { width: 640, height: 480 }
        const { width, height } = Object.assign(defaults, params)

        return `https://picsum.photos/${width}/${height}`
      }
    })

    return faker
  }

  /**
   * Create 2 Tutorials by User
   * @protected
   * @returns {Promise<void>}
   */
  static async run() {
    return undefined
  }
}
