import { Bot } from 'mineflayer'
import { Event, TSBot } from '../bot.js'
import TSConfig from '../../utils/config.js'
import { servUtils } from '../../page/server.js'
import { error } from '../../utils/log.js'

const config = new TSConfig()
config.init()

const event: Event = {
  name: `${config.config.page['commands-prefix']}clear`,
  inventory: false,
  once: false,
  execute: async (tsbot: TSBot, bot: Bot) => {
    try {
      servUtils.emitEvent('clear')
    } catch (err) {
      error(err)
    }
  }
}

export default event
