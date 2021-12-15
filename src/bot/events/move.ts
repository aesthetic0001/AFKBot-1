import { Bot } from 'mineflayer'
import { Event, TSBot } from '../bot.js'
import { servUtils } from '../../page/server.js'
import { error } from '../../utils/log.js'

const event: Event = {
  name: 'move',
  inventory: false,
  once: false,
  execute: (tsbot: TSBot, bot: Bot) => {
    try {
      servUtils.emitEvent('pos', bot.entity.position)
    } catch (err) {
      error(err)
    }
  }
}

export default event
