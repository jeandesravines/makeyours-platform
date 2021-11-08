import Tutorial from '../../../lib/entities/Tutorial/model'
import TutorialStep from '../../../lib/entities/TutorialStep/model'
import TutorialPart from '../../../lib/entities/TutorialPart/model'
import * as Utils from '../../utils'

describe('findPartsByStep', () => {
  test('returns filtered parts', async () => {
    const context = Utils.createContext()
    const parts = [new TutorialPart(), new TutorialPart(), new TutorialPart()]
    const tutorial = new Tutorial()
    const step = new TutorialStep({
      tutorial: tutorial._id,
      parts: [parts[1]._id.toString(), parts[2]._id.toString()]
    })

    const spyPartFindManyBy = jest.spyOn(TutorialPart, 'findManyBy').mockResolvedValue(parts)
    const result = await TutorialStep.findPartsByStep({ step }, null, context)

    expect(result).toEqual([parts[1], parts[2]])
    expect(spyPartFindManyBy).toHaveBeenCalledWith({ tutorial: tutorial._id }, null, context)
  })
})
