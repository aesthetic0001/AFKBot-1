import TSDiscord from './TSDiscord.js'

export default class Core {
  public dsbot: TSDiscord = new TSDiscord()

  init (): void {
    this.dsbot.init()
  }
}
