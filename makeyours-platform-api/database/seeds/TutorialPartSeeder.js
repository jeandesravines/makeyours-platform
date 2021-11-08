import { Types } from '../../lib/entities/TutorialPart/constants'
import Tutorial from '../../lib/entities/Tutorial/model'
import TutorialPart from '../../lib/entities/TutorialPart/model'
import Seeder from './Seeder'

/**
 * TutorialSeeder
 */
export default class TutorialPartSeeder extends Seeder {
  /**
   * Returns true if the seed can be run
   * @override
   * @returns {Promise<Boolean>}
   */
  static async shouldRun() {
    return TutorialPart.countBy({}).then(count => count === 0)
  }

  /**
   * Get TutorialParts
   * @private
   * @returns {Promise<void>}
   */
  static async run() {
    const types = Object.values(Types)
    const tutorials = await Tutorial.findManyBy({})

    const documents = tutorials.flatMap(tutorial => {
      return Array.from({ length: this.faker.natural({ max: 4 }) }, (v, i) => ({
        tutorial: tutorial._id,
        order: i,
        type: this.faker.pickone(types),
        name: this.faker.word(),
        quantity: this.faker.natural({ min: 1, max: 3 }),
        url: this.faker.url()
      }))
    })

    await TutorialPart.saveMany(documents)
  }
}
