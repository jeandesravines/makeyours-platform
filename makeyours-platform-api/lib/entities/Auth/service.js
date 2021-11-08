import got from 'got'
import jwt from 'jsonwebtoken'
import jwksRsa from 'jwks-rsa'
import { ForbiddenError } from 'apollo-server'
import * as configuration from '../../configuration'
import User from '../User/model'
import UnauthorizedError from '../../errors/common/UnauthorizedError'
import { ErrorCodes } from './constants'

/**
 * AuthService
 */
export default class AuthService {
  /**
   * @private
   * @const
   * @type {JwksRsa.JwksClient}
   */
  static jwksClient = jwksRsa({
    jwksUri: configuration.auth.auth0.jwksUri,
    cache: true
  })

  /**
   * Get the signing key
   * @private
   * @param {{ kid: String }} header
   * @param {function(e: Error?, { publicKey: String?, rsaPublicKey: String? })} callback
   * @returns {void}
   */
  static getSigningKey(header, callback) {
    AuthService.jwksClient.getSigningKey(header.kid, (error, key) => {
      return error ? callback(error) : callback(null, key.publicKey || key.rsaPublicKey)
    })
  }

  /**
   * Decode a JWT
   * @private
   * @param {String} token
   * @param {Object?} options
   * @returns {Promise<Object>}
   * @throws {UnauthorizedError}
   */
  static async getDecodedToken({ token }) {
    const { getSigningKey } = AuthService
    const options = {
      audience: configuration.auth.auth0.clientId,
      issuer: configuration.auth.auth0.uri,
      algorithms: configuration.auth.jwt.algorithms
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, getSigningKey, options, (error, decoded) => {
        return error ? reject(error) : resolve(decoded)
      })
    })
  }

  /**
   * Get a User targeted by its UID stored in the token
   * @param {String} token
   * @returns {Promise<User>}
   */
  static async getUserByToken({ token }) {
    const decoded = await AuthService.getDecodedToken({ token }).catch(() => {
      throw new UnauthorizedError(ErrorCodes.UNAUTHORIZED_JWT)
    })

    const uid = decoded.sub
    const email = decoded.email
    const where = { $or: [{ uid }, { email }] }
    const data = {
      uid,
      username: decoded.nickname,
      name: decoded.name,
      email: decoded.email,
      pictureUrl: decoded.picture
    }

    return User.fillOneBy(where, data)
  }

  /**
   * Get an Auth0 ID Token
   * @param {String} username
   * @param {String} password
   * @returns {Promise<String>}
   */
  static async getAccessToken({ username, password }) {
    if (configuration.app.isProduction) {
      throw new ForbiddenError(ErrorCodes.FORBIDDEN_ENVIRONMENT)
    }

    const url = `${configuration.auth.auth0.uri}oauth/token`
    const body = {
      username,
      password,
      client_id: configuration.auth.auth0.clientId,
      grant_type: configuration.auth.auth0.grant,
      realm: configuration.auth.auth0.realm
    }

    let response

    try {
      response = await got.post(url, {
        body,
        json: true,
        form: true
      })
    } catch (error) {
      throw new UnauthorizedError(ErrorCodes.ERROR, error.boy)
    }

    return {
      token: response.body.id_token, // eslint-disable-line camelcase
      expiresIn: response.body.expires_in // eslint-disable-line camelcase
    }
  }
}
