import TSBot from '../../classes/TSBot.js'
import colors from '../../utils/colors.js'
import { log } from '../../utils/log.js'

const event = {
  name: 'message',
  once: false,
  execute: (tsbot: TSBot, message: string) => {
    log(`${colors.fg_green}> CHAT <${colors.reset} ${message}`)
  }
}

export default event
