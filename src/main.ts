import TSBot from './bot/main.js';
import TSServer from './server/express.js';
import TSConfig from './utils/config.js';

export default class Core {
  public bot: TSBot = new TSBot()
  public server: TSServer = new TSServer()
  public config: TSConfig = new TSConfig()

  init (): void {
    this.config.init()
    this.server.init()
    this.bot.init()
  }
}