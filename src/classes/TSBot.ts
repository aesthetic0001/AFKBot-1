import { Bot, createBot } from 'mineflayer'
import TSConfig from './TSConfig.js'
import { error, log } from '../utils/log.js'

export default class TSBot {
  public bot: Bot
  private readonly config: TSConfig = new TSConfig()

  init (): void {
    this.config.init()
    this.bot = createBot({
      username: this.config.config.minecraft.account.username ?? 'Bot',
      password: this.config.config.minecraft.account.password ?? '',
      host: this.config.config.minecraft.server.host ?? 'localhost',
      port: parseInt(this.config.config.minecraft.server.port) ?? 25565
    })

    this.bot.once('error', (Error) => this.errorOut(Error.message))
    this.bot.once('kicked', (Reason) => this.errorOut(Reason))
    this.bot.once('end', () => this.errorOut('Ended abruptly'))
    this.bot.once('login', () => log('Logged in'))
    this.bot.once('spawn', this.clearListeners)
  }

  private errorOut (...message: string[]): void {
    error(new Error(`${message[0]}`))
    process.exit(0)
  }

  private clearListeners = async (): Promise<void> => {
    await this.bot.waitForChunksToLoad()
    this.bot.removeAllListeners('kicked')
    this.bot.removeAllListeners('error')
    this.bot.removeAllListeners('end')
    log('Spawned')
  }
}
