import { Bot } from 'mineflayer'
import { StateBehavior } from 'mineflayer-statemachine'
import autoeat from 'mineflayer-auto-eat'
import data from 'minecraft-data'
import TSConfig from '../../../classes/TSConfig'

export class BehaviorLoadData implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'LoadData'
  public isFinished: boolean = false
  public bot: Bot
  public config: TSConfig

  constructor (bot: Bot, config: TSConfig) {
    this.bot = bot
    this.config = config
  }

  onStateEntered (): void {
    this.bot.loadPlugins([
      autoeat
    ])

    // @ts-expect-error
    this.bot.autoEat.options.startAt = parseInt(this.config.config.minecraft['auto-eat'].at)
    // @ts-expect-error
    this.bot.data = data(this.bot.version)
  }
}
