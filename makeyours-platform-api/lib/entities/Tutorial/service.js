import _ from 'lodash'
import Service from '../Base/service'
import TutorialComment from '../TutorialComment/model'
import TutorialLike from '../TutorialLike/model'
import TutorialPart from '../TutorialPart/model'
import TutorialStep from '../TutorialStep/model'
import TutorialView from '../TutorialView/model'
import TutorialStepFactory from '../TutorialStep/factory'

/**
 * TutorialService
 * @extends {Service<Tutorial>}
 */
export default class TutorialService extends Service {
  /**
   * Post-Remove hook
   * @protected
   * @param {Tutorial} document
   * @returns {Promise<void>}
   */
  static async onPostDelete(document) {
    await Promise.all([
      TutorialComment.deleteManyBy({ tutorial: document._id }),
      TutorialLike.deleteManyBy({ tutorial: document._id }),
      TutorialPart.deleteManyBy({ tutorial: document._id }),
      TutorialStep.deleteManyBy({ tutorial: document._id }),
      TutorialView.deleteManyBy({ tutorial: document._id })
    ])
  }

  /**
   * Returns Tutorial's TutorialSteps
   * @param {Tutorial} tutorial
   * @param {Filters} filters
   * @param {Context} context
   * @returns {Promise<TutorialStep>}
   */
  static async findStepsByTutorial({ tutorial }, filters, { cache, context }) {
    const where = { tutorial: tutorial._id }
    const documents = await cache.TutorialStep.findManyBy(where, filters, context)

    return documents.map(doc => TutorialStepFactory.getDocument(doc))
  }

  /**
   * Find people count
   * @param {Tutorial} tutorial
   * @param {Filters} filters
   * @param {Context} context
   * @returns {Promise<Number>}
   */
  static async findPeopleCountByTutorial({ tutorial }, filters, context) {
    const steps = await this.findStepsByTutorial({ tutorial }, filters, context)
    const counts = steps.map(({ peopleCount }) => peopleCount)
    const max = Math.max(...counts)

    return max || 1
  }

  /**
   * Compute the Tutorial media duration by sum of the step's duration
   * @param {Tutorial} tutorial
   * @param {Filters} filters
   * @param {Context} context
   * @returns {Promise<Number>}
   */
  static async findMediaTimeByTutorial({ tutorial }, filters, context) {
    const steps = await this.findStepsByTutorial({ tutorial }, filters, context)
    const sum = _.sumBy(steps, 'duration')

    return sum || 0
  }
}
