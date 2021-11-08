import got from 'got'
import jsonwebtoken from 'jsonwebtoken'
import * as configuration from '../../../lib/configuration'
import Auth from '../../../lib/entities/Auth/service'
import User from '../../../lib/entities/User/model'
import UnauthorizedError from '../../../lib/errors/common/UnauthorizedError'
import { ErrorCodes } from '../../../lib/entities/Auth/constants'

describe('getSigningKey', () => {
  test('fails', () => {
    const spyCallback = jest.fn()
    const spyGetSignin = jest
      .spyOn(Auth.jwksClient, 'getSigningKey')
      .mockImplementation((header, callback) => {
        callback(new Error('Hello'))
      })

    const result = Auth.getSigningKey({ kid: 'kid' }, spyCallback)

    expect(result).toBeUndefined()
    expect(spyCallback).toHaveBeenCalledWith(new Error('Hello'))
    expect(spyGetSignin).toHaveBeenCalledWith('kid', expect.any(Function))
  })

  test('succeed with public key', () => {
    const spyCallback = jest.fn()
    const spyGetSignin = jest
      .spyOn(Auth.jwksClient, 'getSigningKey')
      .mockImplementation((header, callback) => {
        callback(null, { publicKey: 'public' })
      })

    const result = Auth.getSigningKey({ kid: 'kid' }, spyCallback)

    expect(result).toBeUndefined()
    expect(spyCallback).toHaveBeenCalledWith(null, 'public')
    expect(spyGetSignin).toHaveBeenCalledWith('kid', expect.any(Function))
  })

  test('succeed with rsa public key', () => {
    const spyCallback = jest.fn()
    const spyGetSignin = jest
      .spyOn(Auth.jwksClient, 'getSigningKey')
      .mockImplementation((header, callback) => {
        callback(null, { rsaPublicKey: 'public' })
      })

    const result = Auth.getSigningKey({ kid: 'kid' }, spyCallback)

    expect(result).toBeUndefined()
    expect(spyCallback).toHaveBeenCalledWith(null, 'public')
    expect(spyGetSignin).toHaveBeenCalledWith('kid', expect.any(Function))
  })
})

describe('getDecodedToken', () => {
  test('rejects in the signingKey getter', async () => {
    const spyGetSignin = jest.spyOn(Auth, 'getSigningKey').mockReturnValue()
    const spyVerify = jest
      .spyOn(jsonwebtoken, 'verify')
      .mockImplementation((token, secret, options, callback) => {
        callback(new Error('Hello'))
      })

    const options = {
      audience: configuration.auth.auth0.clientId,
      issuer: configuration.auth.auth0.uri,
      algorithms: configuration.auth.jwt.algorithms
    }

    const deferred = Auth.getDecodedToken({ token: 'jwt_token' })

    await expect(deferred).rejects.toEqual(new Error('Hello'))
    expect(spyVerify).toHaveBeenCalledWith('jwt_token', spyGetSignin, options, expect.any(Function))
  })

  test('return the decoded token', async () => {
    const spyGetSignin = jest.spyOn(Auth, 'getSigningKey').mockReturnValue()
    const spyVerify = jest
      .spyOn(jsonwebtoken, 'verify')
      .mockImplementation((token, secret, options, callback) => {
        callback(null, { sub: 'uid' })
      })

    const options = {
      audience: configuration.auth.auth0.clientId,
      issuer: configuration.auth.auth0.uri,
      algorithms: configuration.auth.jwt.algorithms
    }

    const result = await Auth.getDecodedToken({ token: 'jwt_token' })

    expect(result).toEqual({ sub: 'uid' })
    expect(spyVerify).toHaveBeenCalledWith('jwt_token', spyGetSignin, options, expect.any(Function))
  })
})

describe('getUserByToken', () => {
  test('throws an Error', async () => {
    const spyGetDecodedToken = jest
      .spyOn(Auth, 'getDecodedToken')
      .mockRejectedValue(new Error('Hello'))

    const deferred = Auth.getUserByToken({ token: '1234' })

    await expect(deferred).rejects.toEqual(new UnauthorizedError('auth/unauthorized-jwt'))
    expect(spyGetDecodedToken).toHaveBeenCalledWith({ token: '1234' })
  })

  test('returns the User', async () => {
    const user = new User()
    const decodedData = {
      sub: 'uid',
      email: 'foo@bar.com',
      name: 'Foo Bar',
      nickname: 'foo',
      picture: 'https://picture.com'
    }

    const userWhere = { $or: [{ uid: 'uid' }, { email: 'foo@bar.com' }] }
    const userData = {
      uid: 'uid',
      email: 'foo@bar.com',
      name: 'Foo Bar',
      username: 'foo',
      pictureUrl: 'https://picture.com'
    }

    const spyFill = jest.spyOn(User, 'fillOneBy').mockResolvedValue(user)
    const spyGetDecodedToken = jest.spyOn(Auth, 'getDecodedToken').mockResolvedValue(decodedData)
    const result = await Auth.getUserByToken({ token: '1234' })

    expect(result).toBe(user)
    expect(spyGetDecodedToken).toHaveBeenCalledWith({ token: '1234' })
    expect(spyFill).toHaveBeenCalledWith(userWhere, userData)
  })
})

describe('getAccessToken', () => {
  test('returns undefined - Error happened', async () => {
    const username = 'my-username'
    const password = '1234'
    const spyRequest = jest.spyOn(got, 'post').mockRejectedValue({
      body: {
        status: 'auth0_unauthorized'
      }
    })

    const deferred = Auth.getAccessToken({ username, password })
    const url = `${configuration.auth.auth0.uri}oauth/token`
    const body = {
      username: 'my-username',
      password: '1234',
      client_id: configuration.auth.auth0.clientId,
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      realm: 'Username-Password-Authentication'
    }

    await expect(deferred).rejects.toEqual(new UnauthorizedError(ErrorCodes.ERROR))
    expect(spyRequest).toHaveBeenCalledWith(url, { body, json: true, form: true })
  })

  test('returns the ID Token', async () => {
    const username = '000000'
    const password = '1234'
    const spyRequest = jest.spyOn(got, 'post').mockResolvedValue({
      body: {
        id_token: 'FooBar',
        expires_in: 3600
      }
    })

    const accessToken = await Auth.getAccessToken({ username, password })
    const url = `${configuration.auth.auth0.uri}oauth/token`
    const body = {
      username: '000000',
      password: '1234',
      client_id: configuration.auth.auth0.clientId,
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      realm: 'Username-Password-Authentication'
    }

    expect(accessToken).toEqual({ token: 'FooBar', expiresIn: 3600 })
    expect(spyRequest).toHaveBeenCalledWith(url, { body, json: true, form: true })
  })
})
