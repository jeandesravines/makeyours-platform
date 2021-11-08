export default {
  auth0: {
    clientId: process.env.MY_AUTH0_CLIENT_ID,
    uri: `${process.env.MY_AUTH0_DOMAIN}/`,
    jwksUri: `${process.env.MY_AUTH0_DOMAIN}/.well-known/jwks.json`,
    grant: 'http://auth0.com/oauth/grant-type/password-realm',
    realm: 'Username-Password-Authentication'
  },
  jwt: {
    algorithms: ['RS256']
  }
}
