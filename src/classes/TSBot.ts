import { Bot, createBot } from 'mineflayer'
import { readdirSync } from 'fs'
import { join } from 'path'
import TSConfig from './TSConfig.js'
import TSServer from './TSServer.js'
import { error, log } from '../utils/log.js'

export default class TSBot {
  public bot: Bot
  public readonly config: TSConfig = new TSConfig()
  public readonly server: TSServer = new TSServer()

  init (): void {
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
    this.bot.once('login', () => log('Logged in'))
    this.bot.once('spawn', async () => await this.clearListeners())
  }

  stop (): void {
    this.bot.quit()
    // @ts-expect-error
    this.bot = null
  }

  private errorOut (...message: string[]): void {
    error(new Error(`${message[0]}`))
    process.exit(0)
  }

  private readonly clearListeners = async (): Promise<void> => {
    await this.bot?.waitForChunksToLoad()
    this.bot.removeAllListeners('kicked')
    this.bot.removeAllListeners('error')
    this.bot.removeAllListeners('end')
    this.loadListeners()
    log('Spawned')
  }

  private async loadListeners (): Promise<void> {
    const eventFiles = readdirSync(join(this.server.directory, '..', 'bot/events'))

    for (const eventFile of eventFiles) {
      const event = (await import(`file://${join(this.server.directory, '..', 'bot/events', eventFile)}`)).default
      this.bot[event.once ? 'once' : 'on'](event.name, (...args: any[]) => {
        event.execute(this, ...args)
      })
    }
  }
}
