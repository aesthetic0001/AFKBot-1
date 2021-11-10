import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import TSConfig from '../../../classes/TSConfig.js'
import { error } from '../../../utils/log.js'

export class BehaviorEatFood implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Eat Food'
  public isFinished: boolean = false
  public bot: Bot
  public targets: StateMachineTargets
  public config: TSConfig

  constructor (bot: Bot, targets: StateMachineTargets, config: TSConfig) {
    this.bot = bot
    this.targets = targets
    this.config = config
  }

  async onStateEntered (): Promise<void> {
    this.isFinished = false
    try {
      await this.bot.equip(this.targets.item, 'hand')
      while (this.bot.food <= parseInt(this.config.config.minecraft['auto-eat'].at)) {
        await this.bot.consume()
      }
    } catch (err) {
      error(err)
    }

    this.isFinished = true
  }
}
