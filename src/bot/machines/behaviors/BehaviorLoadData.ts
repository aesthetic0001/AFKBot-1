import { Bot } from 'mineflayer'
import { StateBehavior } from 'mineflayer-statemachine'
import { pathfinder } from 'mineflayer-pathfinder'
import TSConfig from '../../../utils/config'
import { newUpdate } from '../../../utils/functions.js'

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
    if (this.config.config.random['check-updates'] === 'true') newUpdate()
    this.bot.loadPlugins([
      pathfinder
    ])
  }
}
