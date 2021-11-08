// eslint-disable-next-line import/no-extraneous-dependencies
import autocannon from 'autocannon'
import * as configuration from '../../lib/configuration'
import AuthService from '../../lib/entities/Auth/service'
import Logger from '../../lib/services/Logger/Logger'

/**
 * Send a GraphQL query
 * @private
 * @param {String} query
 * @returns {Promise<Object>}
 */
async function sendGraphQLRequest({ query }) {
  const { token } = await AuthService.getAccessToken({
    username: '000000',
    password: 'MakeYours1234!'
  })

  const headers = {
    authorization: token,
    'content-type': 'application/json'
  }

  return autocannon({
    headers,
    title: query.match(/{\s+(\w+)/)[1],
    body: JSON.stringify({ query }),
    method: 'POST',
    url: configuration.app.url
  })
}

/**
 * Perform the stress test
 * @private
 * @returns {Promise<void>}
 */
async function main() {
  Logger.info(`autocannon started on ${configuration.app.url}`)

  const result = await sendGraphQLRequest({
    query: `
      query {
        tutorialGetAll(limit: 10) {
          total
          data {
            parts {
              id
            }
            steps {
              ... on TutorialStep {
                parts {
                  id
                }
              }
            }
          }
        }
      }
    `
  })

  Logger.info(result)
}

main()
