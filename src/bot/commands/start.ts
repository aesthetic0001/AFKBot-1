import { Message } from 'discord.js'
import TSDiscord from '../../classes/TSDiscord.js'
import { error } from '../../utils/log.js'

const message = {
  name: 'start',
  execute: async (dsbot: TSDiscord, message: Message) => {
    try {
      await message.reply(`Starting`)
      dsbot.bot.init()
    } catch (err) {
      error(err)
    }
  }
}

export default message
