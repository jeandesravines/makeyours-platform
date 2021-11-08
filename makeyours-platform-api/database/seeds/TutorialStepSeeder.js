import Tutorial from '../../lib/entities/Tutorial/model'
import TutorialPart from '../../lib/entities/TutorialPart/model'
import TutorialStep from '../../lib/entities/TutorialStep/model'
import TutorialStepFactory from '../../lib/entities/TutorialStep/factory'
import { Types } from '../../lib/entities/TutorialStep/constants'
import Seeder from './Seeder'

/**
 * TutorialStepSeeder
 */
export default class TutorialStepSeeder extends Seeder {
  /**
   * Returns true if the seed can be run
   * @returns {Promise<Boolean>}
   */
  static async shouldRun() {
    return TutorialStep.countBy({}).then(count => count === 0)
  }

  /**
   * Make a new TutorialStepAudio
   * @private
   * @returns {{
   *   url: String
   * }}
   */
  static getDataAudio() {
    return {
      url: this.faker.url(),
      duration: this.faker.natural({ max: 300 })
    }
  }

  /**
   * Make a new TutorialStepText
   * @private
   * @returns {{
   * }}
   */
  static getDataText() {
    return {}
  }

  /**
   * Get TutorialStep according to the type
   * @private
   * @param {String} type
   * @returns {Object}
   */
  static getSpecificData({ type }) {
    switch (type) {
      case Types.AUDIO:
        return this.getDataAudio()

      case Types.TEXT:
      default:
        return this.getDataText()
    }
  }

  /**
   * Returns the TutorialStep's parts
   * @private
   * @param {Tutorial} tutorial
   * @returns {Mongoose.Types.ObjectId[]}
   */
  static async getParts({ tutorial }) {
    const parts = await TutorialPart.findManyBy({ tutorial: tutorial._id })

    return this.faker
      .pickset(parts, this.faker.natural({ max: parts.length }))
      .map(({ _id }) => _id)
  }

  /**
   * Returns a TutorialStep
   * @private
   * @param {Tutorial} tutorial
   * @param {Number} order
   * @returns {Promise<TutorialStep>}
   */
  static async getStep({ tutorial, order }) {
    const types = Object.values(Types)
    const type = this.faker.pickone(types)
    const specificData = this.getSpecificData({ type })
    const pictures = Array.from({ length: this.faker.natural({ max: 5 }) }, () => ({
      name: this.faker.sentence({ words: 3 }),
      url: this.faker.picture()
    }))

    const data = {
      type,
      pictures,
      order,
      parts: await this.getParts({ tutorial }),
      tutorial: tutorial._id,
      name: this.faker.sentence({ words: 3 }),
      description: this.faker.sentence(),
      time: this.faker.natural({ max: 3600 }),
      peopleCount: this.faker.natural({ min: 1, max: 4 })
    }

    return { ...data, ...specificData }
  }

  /**
   * Create many TutorialSteps
   * @returns {Promise<void>}
   */
  static async run() {
    const tutorials = await Tutorial.findManyBy({})
    const documents = await Promise.all(
      tutorials.map(async tutorial =>
        Promise.all(
          Array.from({ length: this.faker.natural({ min: 1, max: 8 }) }).map(async (v, i) =>
            this.getStep({ tutorial, order: i })
          )
        )
      )
    )

    await Promise.all(
      documents.flat().map(doc => {
        return TutorialStepFactory.getModel({ type: doc.type }).saveOne(doc)
      })
    )
  }
}
