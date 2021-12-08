import { Bot } from 'mineflayer'
import path from 'mineflayer-pathfinder'
import { Event, TSBot } from '../../classes/TSBot.js'
import { error } from '../../utils/log.js'

const event: Event = {
  name: '+goto',
  inventory: false,
  once: false,
  execute: async (tsbot: TSBot, bot: Bot, ...args) => {
    try {
      const [x, y, z]: number[] = args[0].content.split(' ')
      if (!x || !y || !z) return
      await bot.pathfinder.goto(new path.goals.GoalBlock(x, y, z))
    } catch (err) {
      error(err)
    }
  }
}

export default event
