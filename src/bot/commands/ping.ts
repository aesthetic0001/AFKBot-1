import { Message } from 'discord.js'
import { TSDiscord } from '../../classes/TSDiscord.js'
import { error } from '../../utils/log.js'

const message = {
  name: 'ping',
  execute: async (dsbot: TSDiscord, message: Message) => {
    try {
      await message.channel.send(`My ping is ${dsbot.dsbot.ws.ping}`)
    } catch (err) {
      error(err)
    }
  }
}

export default message
