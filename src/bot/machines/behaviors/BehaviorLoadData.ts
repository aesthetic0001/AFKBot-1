import { Bot } from 'mineflayer'
import { StateBehavior } from 'mineflayer-statemachine'
import { pathfinder } from 'mineflayer-pathfinder'
import TSConfig from '../../../classes/TSConfig'

export class BehaviorLoadData implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Load Data'
  public isFinished: boolean = false
  public bot: Bot
  public config: TSConfig

  constructor (bot: Bot, config: TSConfig) {
    this.bot = bot
    this.config = config
  }

  onStateEntered (): void {
    this.bot.loadPlugins([
      pathfinder
    ])
  }
}
