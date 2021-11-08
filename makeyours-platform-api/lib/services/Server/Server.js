import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import * as configuration from '../../configuration'
import typeDefs from '../../entities/graphql'
import schemaDirectives from '../../entities/directives'
import ContextMiddleware from '../../middlewares/ContextMiddleware'
import resolvers from '../../entities/resolvers'
import Logger from '../Logger/Logger'

/**
 * GraphQL Server
 */
export default class Server {
  /**
   * Create and initialize the GraphQL server.
   * @returns {Promise<ApolloServer>}
   */
  static async connect() {
    const schemaOptions = {
      typeDefs,
      resolvers,
      schemaDirectives
    }

    const schema = makeExecutableSchema(schemaOptions)
    const server = new ApolloServer({
      schema,
      context: ContextMiddleware.middleware,
      cors: configuration.graphql.cors,
      debug: configuration.graphql.debug,
      introspection: configuration.graphql.debug,
      playground: configuration.graphql.debug,
      tracing: configuration.graphql.debug
    })

    await server
      .listen(configuration.server.port, configuration.server.address)
      .then(({ url }) => Logger.info(`Server listening at ${url}`))

    return server
  }
}
