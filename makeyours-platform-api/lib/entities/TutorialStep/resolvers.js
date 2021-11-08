import _ from 'lodash'

export default {
  TutorialStep: {
    __resolveType(root) {
      return `TutorialStep${_.capitalize(root.type)}`
    },
    parts(root, args, { cache, context }) {
      return cache.TutorialStep.findPartsByStep({ step: root }, args, context)
    }
  },
  TutorialStepMedia: {
    __resolveType() {
      return `TutorialStepMedia`
    }
  },
  get TutorialStepText() {
    return this.TutorialStep
  },
  get TutorialStepAudio() {
    return this.TutorialStep
  }
}
