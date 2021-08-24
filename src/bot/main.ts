import { Bot, createBot } from 'mineflayer'
import TSConfig from '../utils/config.js'
import { error } from '../utils/log.js'

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

    this.bot.once('error', (Error) => error(Error))
    this.bot.once('kicked', (Reason) => error(new Error(Reason)))
    this.bot.once('spawn', this.clearListeners)
  }

  private clearListeners (): void {
    this.bot.removeAllListeners('kicked')
    this.bot.removeAllListeners('error')
  }
}
