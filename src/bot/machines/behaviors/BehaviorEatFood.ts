import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import { error } from '../../../utils/log.js'

export class BehaviorEatFood implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Eat Food'
  public isFinished: boolean = false
  public bot: Bot
  public targets: StateMachineTargets

  constructor (bot: Bot, targets: StateMachineTargets) {
    this.bot = bot
    this.targets = targets
  }

  async onStateEntered (): Promise<void> {
    this.isFinished = false
    if (this.targets.item) {
      try {
        await this.bot.equip(this.targets.item, 'hand')
        await this.bot.consume()
      } catch (err) {
        error(err)
      }
    }

    this.isFinished = true
  }
}
