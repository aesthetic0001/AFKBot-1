import { Bot } from 'mineflayer'
import { ChatMessage } from 'prismarine-chat'
import { Event, TSBot } from '../../classes/TSBot.js'
import { servUtils } from '../../page/server.js'
import colors from '../../utils/colors.js'
import { error, log } from '../../utils/log.js'

const event: Event = {
  name: 'message',
  inventory: false,
  once: false,
  execute: (tsbot: TSBot, bot: Bot, message: ChatMessage) => {
    try {
      log(`${colors.fg_green}> CHAT <${colors.reset} ${message.toString()}`)
      servUtils.emitEvent('post', message.toString())
    } catch (err) {
      error(err)
    }
  }
}

export default event
