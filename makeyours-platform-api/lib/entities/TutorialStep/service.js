import Service from '../Base/service'

/**
 * TutorialStepService
 * @extends {Service<TutorialStep>}
 */
export default class TutorialStepService extends Service {
  /**
   * Returns the selected TutorialPart for a TutorialStep
   * @deprecated
   * @param {TutorialStep} step
   * @param {Filters} filters
   * @param {Context} context
   * @returns {Promise<TutorialPart[]>}
   */
  static async findPartsByStep({ step }, filters, { cache, context }) {
    const parts = await cache.TutorialPart.findManyBy(
      { tutorial: step.tutorial._id },
      filters,
      context
    )

    const isSelected = part => step.parts.some(id => id.toString() === part._id.toString())
    const filtered = parts.filter(isSelected)

    return filtered
  }
}
