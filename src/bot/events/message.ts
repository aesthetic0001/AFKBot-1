import TSBot from '../../classes/TSBot.js'
import colors from '../../utils/colors.js'
import { error, log } from '../../utils/log.js'

const event = {
  name: 'message',
  once: false,
  execute: (tsbot: TSBot, message: string) => {
    try {
      log(`${colors.fg_green}> CHAT <${colors.reset} ${message}`)
    } catch (err) {
      error(err)
    }
  }
}

export default event
