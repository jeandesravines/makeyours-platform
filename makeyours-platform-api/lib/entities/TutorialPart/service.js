import Service from '../Base/service'
import TutorialStep from '../TutorialStep/model'

/**
 * TutorialPartService
 * @extends {Service<TutorialPart>}
 */
export default class TutorialPartService extends Service {
  /**
   * Post-Remove hook
   * @protected
   * @param {Tutorial} document
   * @returns {Promise<void>}
   */
  static async onPostDelete(document) {
    await TutorialStep.pullManyBy({}, { parts: document._id })
  }
}
