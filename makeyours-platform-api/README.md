# makeyours-platform-api

## Getting started

- Create a [`.env`](.env.example) file containing all the required [environment variables](docs/ENVIRONMENT_VARIABLES.md)
- Run [the project](https://gitlab.com/makeyours/makeyours-platform/makeyours-platform/blob/develop/README.md)
- Seed the database using the [npm command](#commands)

## Commands

You can execute a command directly to the launched container from the docker-compose project using the included npm command: `yarn docker` which is an alias for `../scripts/docker-compose exec api`.

Because the application requires the MongoDB Database defined in the docker-compose project, it is more convenient to execute the commands directly to the container instead of re-map the whole environment.

- Database seed: `yarn docker yarn script database:seed`
- Stress Test: `yarn docker yarn script server:autocannon`
- Lint: `yarn docker yarn lint`
- Test: `yarn docker yarn test`

## Authentication using Auth0

To request the API you will need to pass an access token to the `Authorization` header as `Bearer`: `Authorization: Bearer <YOUR_ACCESS_TOKEN>`

### Using the GraphQL API

This feature is only available when `NODE_ENV` is not equal to `"production"`

```graphql
query {
  authGetToken(username: "USER_USERNAME", password: "USER_PASSWORD") {
    token
  }
}
```

### Using cURL

To access the API you will need an access token given by Auth0.
You can get an access token you can use the following cURL query:

```sh
curl \
  --url https://MY_AUTH0_DOMAIN/oauth/token \
  --data-urlencode "username=USER_USERNAME" \
  --data-urlencode "password=USER_PASSSWORD" \
  --data-urlencode "client_id=MY_AUTH0_CLIENT_ID" \
  --data-urlencode "grant_type=http://auth0.com/oauth/grant-type/password-realm" \
  --data-urlencode "realm=Username-Password-Authentication"

```

You can use the given `id_token` to pass it to the API's `authorization` header like `{ "Authorization": "Bearer <id_token>" }`.

N.B.: The variables prefixed by "MY_AUTH0_" are from your .env file.

## GraphQL Playground

Using the docker-compose project, the GraphQL playground will be available at `http://localhost:4000`

## Build and Run (Production)

```shell
docker build --tag makeyours_platform_api .
docker run --rm -it -p 8080:8080 makeyours_platform_api
```

## Build and Test (Development)

```shell
docker build --target workspace --tag makeyours_platform_api .
docker run --rm -it makeyours_platform_api yarn lint
docker run --rm -it makeyours_platform_api yarn test
```

## Documentation

- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md)
