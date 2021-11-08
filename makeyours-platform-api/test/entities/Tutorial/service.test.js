import Tutorial from '../../../lib/entities/Tutorial/model'
import TutorialComment from '../../../lib/entities/TutorialComment/model'
import TutorialLike from '../../../lib/entities/TutorialLike/model'
import TutorialPart from '../../../lib/entities/TutorialPart/model'
import TutorialStep from '../../../lib/entities/TutorialStep/model'
import TutorialStepText from '../../../lib/entities/TutorialStepText/model'
import TutorialStepAudio from '../../../lib/entities/TutorialStepAudio/model'
import TutorialView from '../../../lib/entities/TutorialView/model'
import { Types as TutorialStepTypes } from '../../../lib/entities/TutorialStep/constants'
import * as Utils from '../../utils'

describe('onPostDelete', () => {
  test('delete dependents documents', async () => {
    const tutorial = new Tutorial()

    jest.spyOn(TutorialComment, 'deleteManyBy').mockResolvedValue(undefined)
    jest.spyOn(TutorialLike, 'deleteManyBy').mockResolvedValue(undefined)
    jest.spyOn(TutorialPart, 'deleteManyBy').mockResolvedValue(undefined)
    jest.spyOn(TutorialStep, 'deleteManyBy').mockResolvedValue(undefined)
    jest.spyOn(TutorialView, 'deleteManyBy').mockResolvedValue(undefined)

    const result = await Tutorial.onPostDelete(tutorial)

    expect(result).toBeUndefined()
    expect(TutorialComment.deleteManyBy).toHaveBeenCalledWith({ tutorial: tutorial._id })
    expect(TutorialLike.deleteManyBy).toHaveBeenCalledWith({ tutorial: tutorial._id })
    expect(TutorialPart.deleteManyBy).toHaveBeenCalledWith({ tutorial: tutorial._id })
    expect(TutorialStep.deleteManyBy).toHaveBeenCalledWith({ tutorial: tutorial._id })
    expect(TutorialView.deleteManyBy).toHaveBeenCalledWith({ tutorial: tutorial._id })
  })
})

describe('getSteps', () => {
  test("returns tutorial's fetched steps", async () => {
    const tutorial = new Tutorial()
    const context = Utils.createContext()
    const steps = [
      { type: TutorialStepTypes.TEXT, name: `Step 1`, pictures: [{ name: 'Picture 1' }] },
      { type: TutorialStepTypes.AUDIO, name: `Step 2`, url: 'http://localhost' }
    ]

    const spyFindMany = jest.spyOn(TutorialStep, 'findManyBy').mockResolvedValue(steps)
    const result = await Tutorial.findStepsByTutorial({ tutorial }, null, context)

    expect(result[0]).toBeInstanceOf(TutorialStepText)
    expect(result[0].toObject()).toEqual(
      expect.objectContaining({
        type: TutorialStepTypes.TEXT,
        name: 'Step 1',
        pictures: [expect.objectContaining({ name: 'Picture 1' })]
      })
    )

    expect(result[1]).toBeInstanceOf(TutorialStepAudio)
    expect(result[1].toObject()).toEqual(
      expect.objectContaining({
        type: TutorialStepTypes.AUDIO,
        name: 'Step 2',
        url: 'http://localhost'
      })
    )

    expect(spyFindMany).toHaveBeenCalledWith({ tutorial: tutorial._id }, null, context)
  })
})
