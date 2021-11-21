import { Bot } from 'mineflayer'
import { Event, TSBot } from '../../classes/TSBot.js'
import { servUtils } from '../../page/server.js'
import { sleep } from '../../utils/functions.js'
import { error } from '../../utils/log.js'

const event: Event = {
  name: 'kicked',
  inventory: false,
  once: true,
  execute: async (tsbot: TSBot, bot: Bot, reason: string) => {
    try {
      error(new Error(`Kicked: ${reason}`))
      servUtils.emitEvent('post', `ERROR | Kicked: ${reason}`)
      if (tsbot.config.config.minecraft.reconnect['on-kick'] === 'false') return process.exit(0)
      tsbot.stop()
      await sleep(parseInt(tsbot.config.config.minecraft.reconnect.timeout))
      tsbot.init()
    } catch (err) {
      error(err)
    }
  }
}

export default event
