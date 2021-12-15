import { Bot } from 'mineflayer'
import { Event, TSBot } from '../bot.js'
import TSConfig from '../../utils/config.js'
import { servUtils } from '../../page/server.js'
import { error } from '../../utils/log.js'

const config = new TSConfig()
config.init()

const event: Event = {
  name: `${config.config.page['commands-prefix']}find`,
  inventory: false,
  once: false,
  execute: (tsbot: TSBot, bot: Bot, ...args: [ { cmd: string, content: string } ]) => {
    try {
      const blocks = bot.findBlocks({
        matching: (block) => block.name === args[0].content,
        maxDistance: 256,
        count: 16
      })

      for (const block of blocks) {
        servUtils.emitEvent('post', `Found ${args[0].content} at ${block.toString()}`)
      }
    } catch (err) {
      error(err)
    }
  }
}

export default event
