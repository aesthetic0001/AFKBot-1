import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import { dirname, join } from 'path'
import { error, log } from '../utils/log.js'
import TSBot from './TSBot.js'
import TSConfig from './TSConfig.js'
const directory = dirname(new URL(import.meta.url).pathname).slice(1, dirname(new URL(import.meta.url).pathname).length)

export default class TSDiscord {
  public dsbot: Client = new Client()
  public config: TSConfig = new TSConfig()
  public bot: TSBot = new TSBot()

  async init (): Promise<void> {
    try {
      this.config.init()
      this.dsbot.once('ready', () => {
        log(`Logged in as ${this.dsbot.user?.tag}`)
      })

      await this.loadCommands()

      this.dsbot.login(this.config.config.discord.token)
    } catch (err) {
      error(err)
    }
  }

  private async loadCommands (): Promise<void> {
    try {
      const commandFiles = readdirSync(join(directory, '..', 'bot/commands'))

      for (const commandFile of commandFiles) {
        const command = (await import(`file://${join(directory, '..', 'bot/commands', commandFile)}`)).default
        this.dsbot?.on('message', (message) => {
          if (message.author.bot) return
          const commandMsg = message.cleanContent.split(' ')[0]
          const [, ...args] = message.cleanContent.split(' ')
          command.execute(this, message, ...args)
        })
      }
    } catch (err) {
      error(err)
    }
  }
}