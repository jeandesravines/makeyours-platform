import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import IsMeDirective from '../../lib/directives/IsMeDirective'
import { Roles } from '../../lib/entities/User/constants'
import User from '../../lib/entities/User/model'

describe('visitFieldDefinition', () => {
  test('throws an error - the field is required', () => {
    const directive = new IsMeDirective({
      args: { key: 'id' }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const field = {
      name: 'foo',
      resolve: spyResolve,
      type: new GraphQLNonNull(new GraphQLObjectType({ name: 'Bar' }))
    }

    const t = () => directive.visitFieldDefinition(field)

    expect(t).toThrow(new Error(`@isMe cannot be applied on the non-nullable field: "foo: Bar!"`))
  })

  test('returns null - user is null', () => {
    const directive = new IsMeDirective({
      args: { key: 'id' }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const args = [{}, null, {}, {}]
    const field = { resolve: spyResolve }

    directive.visitFieldDefinition(field)

    const result = field.resolve(...args)

    expect(result).toBeNull()
  })

  test('returns null - user.id !== root[key]', () => {
    const directive = new IsMeDirective({
      args: { key: 'user' }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const user = new User({ roles: [Roles.ADMIN] })
    const args = [{ user: '1234' }, null, { user }, {}]
    const field = { resolve: spyResolve }

    directive.visitFieldDefinition(field)

    const result = field.resolve(...args)

    expect(result).toBeNull()
  })

  test('returns the value - user.id === root[key]', () => {
    const directive = new IsMeDirective({
      args: { key: 'user' }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const user = new User({ roles: [Roles.ADMIN] })
    const args = [{ user: user.id }, null, { user }, {}]
    const field = { resolve: spyResolve }

    directive.visitFieldDefinition(field)

    const result = field.resolve(...args)

    expect(result).toBe('hello')
  })

  test('returns the default resolver value', () => {
    const directive = new IsMeDirective({
      args: { key: 'user' }
    })

    const user = new User({ roles: [Roles.ADMIN] })
    const args = [{ user: user.id }, null, { user }, {}]
    const field = {}

    directive.visitFieldDefinition(field)

    const result = field.resolve(...args)

    expect(result).toBeUndefined()
  })
})
