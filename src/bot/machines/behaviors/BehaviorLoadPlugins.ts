import { Bot } from 'mineflayer'
import { pathfinder } from 'mineflayer-pathfinder'
import { StateBehavior } from 'mineflayer-statemachine'

export class BehaviorLoadPlugins implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'LoadPlugins'
  public isFinished: boolean = false
  public bot: Bot

  constructor (bot: Bot) {
    this.bot = bot
  }

  onStateEntered (): void {
    this.bot.loadPlugins([
      pathfinder
    ])
  }
}
