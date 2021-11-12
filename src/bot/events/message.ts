import { Bot } from 'mineflayer'
import { ChatMessage } from 'prismarine-chat'
import { TSBot } from '../../classes/TSBot.js'
import initServer from '../../page/server.js'
import colors from '../../utils/colors.js'
import { error, log } from '../../utils/log.js'

const event = {
  name: 'message',
  once: false,
  execute: (tsbot: TSBot, bot: Bot, message: ChatMessage) => {
    try {
      log(`${colors.fg_green}> CHAT <${colors.reset} ${message.toString()}`)
      // @ts-expect-error
      initServer.postChat(message.toString())
    } catch (err) {
      error(err)
    }
  }
}

export default event
