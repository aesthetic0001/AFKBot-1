import { Bot, createBot } from 'mineflayer'
import { readdirSync } from 'fs'
import { dirname, join } from 'path'
import TSConfig from './TSConfig.js'
import { error, log } from '../utils/log.js'
const directory = dirname(new URL(import.meta.url).pathname).slice(1, dirname(new URL(import.meta.url).pathname).length)

export default class TSBot {
  public bot: Bot | null
  public readonly config: TSConfig = new TSConfig()

  init (): void {
    try {
      this.config.init()
      this.bot = createBot({
        username: this.config.config.minecraft.account.username ?? 'Bot',
        password: this.config.config.minecraft.account.password ?? '',
        host: this.config.config.minecraft.server.host ?? 'localhost',
        port: parseInt(this.config.config.minecraft.server.port) ?? 25565
      })

      this.bot.on('error', (Error) => this.errorOut(Error.message))
      this.bot.on('kicked', (Reason) => this.errorOut(Reason))
      this.bot.on('end', () => this.errorOut('Ended abruptly'))
      this.bot.once('spawn', async () => {
        await this.clearListeners()
        log(`Logged in as ${this.bot?.username ?? 'Error with username'}`)
      })
    } catch (err) {
      error(err)
    }
  }

  stop (): void {
    try {
      this.bot?.quit()
      this.bot = null
    } catch (err) {
      error(err)
    }
  }

  private errorOut (...message: string[]): void {
    error(new Error(`${message[0]}`))
    process.exit(0)
  }

  private readonly clearListeners = async (): Promise<void> => {
    try {
      await this.bot?.waitForChunksToLoad()
      this.bot?.removeAllListeners('kicked')
      this.bot?.removeAllListeners('error')
      this.bot?.removeAllListeners('end')
      await this.loadListeners()
    } catch (err) {
      error(err)
    }
  }

  private async loadListeners (): Promise<void> {
    try {
      const eventFiles = readdirSync(join(directory, '..', 'bot/events'))

      for (const eventFile of eventFiles) {
        const event = (await import(`file://${join(directory, '..', 'bot/events', eventFile)}`)).default
        this.bot?.[event.once ? 'once' : 'on'](event.name, (...args: any[]) => {
          event.execute(this, ...args)
        })
      }
    } catch (err) {
      error(err)
    }
  }
}
