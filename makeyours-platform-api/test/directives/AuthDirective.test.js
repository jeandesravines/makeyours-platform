import { GraphQLNonNull, GraphQLObjectType } from 'graphql'
import AuthDirective from '../../lib/directives/AuthDirective'
import { Roles } from '../../lib/entities/User/constants'
import User from '../../lib/entities/User/model'
import ForbiddenError from '../../lib/errors/common/ForbiddenError'
import UnauthorizedError from '../../lib/errors/common/UnauthorizedError'

describe('visitFieldDefinition', () => {
  test('throws an error - the field is required', () => {
    const directive = new AuthDirective({
      required: false,
      args: { role: Roles.USER }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const field = {
      name: 'foo',
      resolve: spyResolve,
      type: new GraphQLNonNull(new GraphQLObjectType({ name: 'Bar' }))
    }

    const t = () => directive.visitFieldDefinition(field)

    expect(t).toThrow(
      new Error(`@auth(required: false) cannot be applied on the non-nullable field: "foo: Bar!"`)
    )
  })

  test('do nothing - user = null, required = false', () => {
    const directive = new AuthDirective({
      args: { role: Roles.USER }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const field = { resolve: spyResolve }
    const args = [{}, null, {}, {}]

    directive.visitFieldDefinition(field)

    const result = field.resolve(...args)

    expect(result).toBeNull()
  })

  test('throws an error - user = null, required = true', () => {
    const directive = new AuthDirective({
      args: { required: true, role: Roles.USER }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const field = { resolve: spyResolve }
    const args = [{}, null, {}, {}]

    directive.visitFieldDefinition(field)

    const t = () => field.resolve(...args)

    expect(t).toThrow(new UnauthorizedError('auth/unauthorized'))
  })

  test('throws an error - user.roles is too low, required = true', () => {
    const directive = new AuthDirective({
      args: { required: true, role: Roles.ADMIN }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const field = { resolve: spyResolve }
    const user = new User({ roles: [Roles.USER] })
    const args = [{}, null, { user }, {}]

    directive.visitFieldDefinition(field)

    const t = () => field.resolve(...args)

    expect(t).toThrow(new ForbiddenError('auth/forbidden', { role: Roles.ADMIN }))
  })

  test('returns the result', () => {
    const directive = new AuthDirective({
      args: { required: true, role: Roles.USER }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const field = {
      name: 'foo',
      resolve: spyResolve,
      type: new GraphQLNonNull(new GraphQLObjectType({ name: 'Bar' }))
    }

    const user = new User({ roles: [Roles.ADMIN] })
    const args = [{}, null, { user }, {}]

    directive.visitFieldDefinition(field)

    const result = field.resolve(...args)

    expect(result).toBe('hello')
  })

  test('returns the result - role = null, required = true', () => {
    const directive = new AuthDirective({
      args: { required: true }
    })

    const spyResolve = jest.fn().mockReturnValue('hello')
    const field = { resolve: spyResolve }
    const user = new User({ roles: [Roles.USER] })
    const args = [{}, null, { user }, {}]

    directive.visitFieldDefinition(field)

    const result = field.resolve(...args)

    expect(result).toBe('hello')
  })

  test('returns the default resolver result', () => {
    const directive = new AuthDirective({
      args: { required: true, role: Roles.ADMIN }
    })

    const field = {}
    const user = new User({ roles: [Roles.ADMIN] })
    const args = [{}, null, { user }, {}]

    directive.visitFieldDefinition(field)

    const result = field.resolve(...args)

    expect(result).toBeUndefined()
  })
})
