import { Bot } from 'mineflayer'
import { Event, TSBot } from '../bot.js'
import { servUtils } from '../../page/server.js'
import { error } from '../../utils/log.js'

const event: Event = {
  name: 'updateSlot',
  inventory: true,
  once: false,
  execute: (tsbot: TSBot, bot: Bot) => {
    try {
      servUtils.emitEvent('inv', bot?.inventory.items())
    } catch (err) {
      error(err)
    }
  }
}

export default event
