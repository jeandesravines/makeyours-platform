# Environment Variables

## MY_APP_URL

Server's URL

- Required: true
- Type: `String`

## MY_AUTH0_DOMAIN

The Auth0 domain URL. Available on the Auth0 Dashboard.

- Type: `String`
- Required: true
- Example: `"https://abc-dfeg-hij.eu.auth0.com"`

## MY_AUTH0_CLIENT_ID

The Auth0 application's client ID. Available on the Auth0 Application.

- Type: `String`
- Required: true

## MY_GRAPHQL_DEBUG

Enable GraphQL server's Playground (GraphiQL) and Tracing

- Type: `Number` as `Boolean`
- Default: `0`

## MY_LOGGER_LEVEL

Standard Log level

- Default: `"info"`

## MY_MONGODB_DEBUG

Enable MongoDB's debug mode

- Type: `Number` as `Boolean`
- Default: `0`

## MY_MONGODB_URL

MongoDB's URL

- Required: true
- Type: `String`

