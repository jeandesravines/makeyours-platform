import Logger from '../../../lib/services/Logger/Logger'

describe('methods', () => {
  const methods = ['debug', 'info', 'warn', 'error', 'fatal']

  test.each(methods)('should have a %s method', method => {
    expect(Logger[method]).toEqual(expect.any(Function))
  })
})
