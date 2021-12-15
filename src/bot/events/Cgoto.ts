import { Bot } from 'mineflayer'
import path from 'mineflayer-pathfinder'
import { Event, TSBot } from '../bot.js'
import TSConfig from '../../utils/config.js'
import { error } from '../../utils/log.js'

const config = new TSConfig()
config.init()

const event: Event = {
  name: `${config.config.page['commands-prefix']}goto`,
  inventory: false,
  once: false,
  execute: async (tsbot: TSBot, bot: Bot, ...args) => {
    try {
      const [x, y, z]: number[] = args[0].content.split(' ')
      if (x == null || y == null || z == null) return
      await bot.pathfinder.goto(new path.goals.GoalBlock(x, y, z))
    } catch (err) {
      error(err)
    }
  }
}

export default event
