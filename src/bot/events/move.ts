import { Bot } from 'mineflayer'
import { TSBot } from '../../classes/TSBot.js'
import initServer from '../../page/server.js'
import { error } from '../../utils/log.js'

const event = {
  name: 'move',
  once: false,
  execute: (tsbot: TSBot, bot: Bot) => {
    try {
      // @ts-expect-error
      initServer.updatePos(bot.entity.position)
    } catch (err) {
      error(err)
    }
  }
}

export default event
