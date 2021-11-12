import { Bot, BotEvents, createBot } from 'mineflayer'
import { readdirSync } from 'fs'
import { dirname, join } from 'path'
import { error, log } from '../utils/log.js'
import TSConfig from './TSConfig.js'
import initMachine from '../bot/machines/MainState.js'
import initServer from '../page/server.js'
import { rndName } from '../utils/functions.js'
const directory = dirname(new URL(import.meta.url).pathname).slice(1, dirname(new URL(import.meta.url).pathname).length)

let bot: Bot | null
class TSBot {
  public readonly config: TSConfig = new TSConfig()

  public async init (): Promise<void> {
    try {
      this.config.init()
      bot = createBot({
        username: ((this.config.config.random['random-bot-name'] === 'true') ? await rndName() : this.config.config.minecraft.account.username) ?? 'Bot',
        password: this.config.config.minecraft.account.password ?? '',
        host: this.config.config.minecraft.server.host ?? 'localhost',
        port: parseInt(this.config.config.minecraft.server.port) ?? 25565,
        auth: (this.config.config.minecraft.account.auth.includes('mojang') ? 'mojang' : 'microsoft')
      })

      bot.on('error', (Error) => this.errorOut(Error.message))
      bot.on('kicked', (Reason) => this.errorOut(Reason))
      bot.on('end', () => this.errorOut('Ended abruptly'))
      bot.once('spawn', async () => await this.onSpawn())
    } catch (err) {
      error(err)
    }
  }

  public stop (): void {
    try {
      bot?.quit()
      bot = null
    } catch (err) {
      error(err)
    }
  }

  private async onSpawn (): Promise<void> {
    try {
      await this.clearListeners()
      log(`Logged in as ${bot?.username ?? 'Error with username'}`)
    } catch (err) {
      error(err)
    }
  }

  private errorOut (...message: string[]): void {
    error(new Error(`Error connecting: ${message[0]}`))
    process.exit(0)
  }

  private readonly clearListeners = async (): Promise<void> => {
    try {
      if (this.config.config.log.clear === 'true') console.clear()
      await bot?.waitForChunksToLoad()
      bot?.removeAllListeners('kicked')
      bot?.removeAllListeners('error')
      bot?.removeAllListeners('end')
      await this.loadListeners()
      await initServer()
      await initMachine(bot as Bot, this.config)
    } catch (err) {
      error(err)
    }
  }

  private async loadListeners (): Promise<void> {
    try {
      const eventFiles = readdirSync(join(directory, '..', 'bot/events'))

      for (const eventFile of eventFiles) {
        const event = (await import(`file://${join(directory, '..', 'bot/events', eventFile)}`)).default as Event
        log(`Event ${event.name} loaded`)
        bot?.[event.once ? 'once' : 'on'](event.name as keyof BotEvents, (...args: any[]) => {
          event.execute(this, bot, ...args)
        })
      }
    } catch (err) {
      error(err)
    }
  }
}

const utils = {
  sendChat: (content: string): void => {
    bot?.chat(content)
  },
  sendInv: () => {
    return bot?.inventory.items()
  },
  dropItem: async (name: string) => {
    const item = bot?.inventory.items().find(item => item.name === name)
    if (!item) return
    await bot?.tossStack(item)
  }
}

export {
  TSBot,
  utils
}

interface Event {
  name: string
  once: boolean
  execute: (tsbot: TSBot, ...args: any[]) => void | Promise<void>
}
