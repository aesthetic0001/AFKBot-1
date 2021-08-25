import TSBot from '../../classes/TSBot.js'
import { error } from '../../utils/log.js'

const event = {
  name: 'kicked',
  once: true,
  execute: async (tsbot: TSBot, reason: string) => {
    try {
      error(new Error(`Kicked: ${reason}`))
    } catch (err) {
      error(err)
    }
  }
}

export default event
