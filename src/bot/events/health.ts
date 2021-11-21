import { Bot } from 'mineflayer'
import { Event, TSBot } from '../../classes/TSBot.js'
import { servUtils } from '../../page/server.js'
import { error } from '../../utils/log.js'

const event: Event = {
  name: 'health',
  inventory: false,
  once: false,
  execute: (tsbot: TSBot, bot: Bot) => {
    try {
      servUtils.emitEvent('health', bot?.health, bot?.food)
    } catch (err) {
      error(err)
    }
  }
}

export default event
