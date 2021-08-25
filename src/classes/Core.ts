import TSBot from './TSBot';

export default class Core {
  public bot: TSBot = new TSBot()

  public init (): void {
    this.bot.init()
  }
}
