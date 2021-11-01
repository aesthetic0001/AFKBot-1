import { Bot, BotEvents, createBot } from 'mineflayer'
import { readdirSync } from 'fs'
import { dirname, join } from 'path'
import { error, log } from '../utils/log.js'
import TSConfig from './TSConfig.js'
import initMachine from '../bot/machines/Main.js'
const directory = dirname(new URL(import.meta.url).pathname).slice(1, dirname(new URL(import.meta.url).pathname).length)

export default class TSBot {
  public bot: Bot | null
  public readonly config: TSConfig = new TSConfig()

  public init (): void {
    try {
      this.config.init()
      this.bot = createBot({
        username: this.config.config.minecraft.account.username ?? 'Bot',
        password: this.config.config.minecraft.account.password ?? '',
        host: this.config.config.minecraft.server.host ?? 'localhost',
        port: parseInt(this.config.config.minecraft.server.port) ?? 25565,
        auth: (this.config.config.minecraft.account.auth.includes('mojang') ? 'mojang' : 'microsoft')
      })

      this.bot.on('error', (Error) => this.errorOut(Error.message))
      this.bot.on('kicked', (Reason) => this.errorOut(Reason))
      this.bot.on('end', () => this.errorOut('Ended abruptly'))
      this.bot.once('spawn', async () => await this.onSpawn())
    } catch (err) {
      error(err)
    }
  }

  public stop (): void {
    try {
      this.bot?.quit()
      this.bot = null
    } catch (err) {
      error(err)
    }
  }

  private async onSpawn (): Promise<void> {
    try {
      await this.clearListeners()
      log(`Logged in as ${this.bot?.username ?? 'Error with username'}`)
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
      await this.bot?.waitForChunksToLoad()
      this.bot?.removeAllListeners('kicked')
      this.bot?.removeAllListeners('error')
      this.bot?.removeAllListeners('end')
      await this.loadListeners()
      await initMachine(this.bot as Bot, this.config)
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
        this.bot?.[event.once ? 'once' : 'on'](event.name as keyof BotEvents, (...args: any[]) => {
          event.execute(this, ...args)
        })
      }
    } catch (err) {
      error(err)
    }
  }
}

interface Event {
  name: string
  once: boolean
  execute: (tsbot: TSBot, ...args: any[]) => void | Promise<void>
}
