import Mongoose from '../../services/Mongoose/Mongoose'

/**
 * Calle on process exit
 * @returns {Promise<void>}
 *
 */
async function onExit() {
  await Mongoose.disconnect()
}

process.on('exit', onExit)
