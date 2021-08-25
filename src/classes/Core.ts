import TSBot from './TSBot.js'

export default class Core {
  public bot: TSBot = new TSBot()

  public init (): void {
    this.bot.init()
  }
}
