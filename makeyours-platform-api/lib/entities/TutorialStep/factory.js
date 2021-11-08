import TutorialStepAudio from '../TutorialStepAudio/model'
import TutorialStepText from '../TutorialStepText/model'
import { Types } from './constants'

/**
 * TutorialStepFactory
 */
export default class TutorialStepFactory {
  /**
   * Get the TutorialStep model for the given type
   * @param {String} type
   * @returns {Class<TutorialStep>}
   */
  static getModel({ type }) {
    switch (type) {
      case Types.AUDIO:
        return TutorialStepAudio

      case Types.TEXT:
      default:
        return TutorialStepText
    }
  }

  /**
   * Returns a document corresponding to the data type
   * @param {Object} data
   * @returns {TutorialStep}
   */
  static getDocument(data) {
    const Model = TutorialStepFactory.getModel({ type: data.type })
    const document = new Model(data)

    return document
  }
}
