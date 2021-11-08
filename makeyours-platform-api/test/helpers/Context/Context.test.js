import Context from '../../../lib/helpers/Context/Context'

describe('constructor', () => {
  test('assign values', () => {
    const context = new Context({ foor: 'bar', baz: 'yaz' })

    expect(context).toEqual(
      expect.objectContaining({
        foor: 'bar',
        baz: 'yaz'
      })
    )
  })
})

describe('context', () => {
  test('return itself', () => {
    const context = new Context({ foor: 'bar', baz: 'yaz' })
    const result = context.context

    expect(result).toBe(context)
  })
})
