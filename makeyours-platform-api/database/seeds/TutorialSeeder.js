import Brand from '../../lib/entities/Brand/model'
import Tutorial from '../../lib/entities/Tutorial/model'
import User from '../../lib/entities/User/model'
import { Types } from '../../lib/entities/Tutorial/constants'
import Seeder from './Seeder'

/**
 * TutorialSeeder
 */
export default class TutorialSeeder extends Seeder {
  /**
   * Returns true if the seed can be run
   * @returns {Promise<Boolean>}
   */
  static async shouldRun() {
    return Tutorial.countBy({}).then(count => count === 0)
  }

  /**
   * Returns a duration or null
   * @returns {Number|null}
   */
  static getOptionalTime() {
    return this.faker.bool() ? this.faker.natural({ max: 3600 }) : null
  }

  /**
   * Returns the data for a Tutorial
   * @param {User} user
   * @param {Brand[]} brands
   * @returns {Object}
   */
  static getTutorialData({ user, brands }) {
    const types = Object.values(Types)

    return {
      user: user._id,
      published: this.faker.bool(),
      brand: brands.length ? this.faker.pickone(brands)._id : null,
      type: this.faker.pickone(types),
      name: this.faker.sentence({ words: 3 }),
      description: this.faker.sentence(),
      pictureUrl: this.faker.picture(),
      preparationTime: this.getOptionalTime(),
      makingTime: this.getOptionalTime(),
      totalTime: this.getOptionalTime()
    }
  }

  /**
   * Create 2 Tutorials by User
   * @returns {Promise<void>}
   */
  static async run() {
    const brands = await Brand.findManyBy({})
    const users = await User.findManyBy({})

    const documents = users.flatMap(user => {
      return [this.getTutorialData({ user, brands: [] }), this.getTutorialData({ user, brands })]
    })

    await Tutorial.saveMany(documents)
  }
}
