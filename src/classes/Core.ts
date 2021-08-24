import TSBot from './TSBot.js'
import TSConfig from './TSConfig.js'

export default class Core {
  public bot: TSBot = new TSBot()
  public config: TSConfig = new TSConfig()

  init (): void {
    this.bot.init()
  }
}
