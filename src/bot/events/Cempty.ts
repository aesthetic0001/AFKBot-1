import { Bot } from 'mineflayer'
import { Event, TSBot } from '../../classes/TSBot.js'
import TSConfig from '../../classes/TSConfig.js'
import { sleep } from '../../utils/functions.js'
import { error } from '../../utils/log.js'

const config = new TSConfig()
config.init()

const event: Event = {
  name: `${config.config.page['commands-prefix']}empty`,
  inventory: false,
  once: false,
  execute: async (tsbot: TSBot, bot: Bot) => {
    try {
      for (const item of bot.inventory.items()) {
        bot.tossStack(item)
        await sleep(250)
      }
    } catch (err) {
      error(err)
    }
  }
}

export default event
