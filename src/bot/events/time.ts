import { Bot } from 'mineflayer'
import { Event, TSBot } from '../bot.js'
import { servUtils } from '../../page/server.js'
import { error } from '../../utils/log.js'

const event: Event = {
  name: 'time',
  inventory: false,
  once: false,
  execute: (tsbot: TSBot, bot: Bot) => {
    try {
      servUtils.emitEvent('time', bot.time.timeOfDay)
      servUtils.emitEvent('players', bot.players)
      servUtils.emitEvent('health', bot?.health, bot?.food)
    } catch (err) {
      error(err)
    }
  }
}

export default event
