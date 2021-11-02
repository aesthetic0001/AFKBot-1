import { TSBot } from '../../classes/TSBot.js'
import { sleep } from '../../utils/functions.js'
import { error } from '../../utils/log.js'

const event = {
  name: 'kicked',
  once: true,
  execute: async (tsbot: TSBot, reason: string) => {
    try {
      error(new Error(`Kicked: ${reason}`))
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
