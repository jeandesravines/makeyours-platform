import Mongoose from './services/Mongoose/Mongoose'
import Server from './services/Server/Server'
import './helpers/Script/entry'

/**
 * Main function
 * @returns {Promise<void>}
 */
async function main() {
  await Mongoose.connect()
  await Server.connect()
}

main()
