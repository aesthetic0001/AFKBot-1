import TSBot from '../../classes/TSBot.js'
import colors from '../../utils/colors.js'
import { error } from '../../utils/log.js'

const event = {
  name: 'kicked',
  once: true,
  execute: async (tsbot: TSBot, reason: string) => {
    error(new Error(reason))
  }
}

export default event
