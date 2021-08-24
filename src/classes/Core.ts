import TSBot from './TSBot.js'
import TSServer from './TSServer.js'
import TSConfig from './TSConfig.js'

export default class Core {
  public bot: TSBot = new TSBot()
  public server: TSServer = new TSServer()
  public config: TSConfig = new TSConfig()

  init (): void {
    this.config.init()
    this.bot.init()
    this.server.init()
  }
}
