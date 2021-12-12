import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import { sleep } from '../../../utils/functions.js'
import { error } from '../../../utils/log.js'

export class BehaviorFish implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Fish'
  public isFinished: boolean = false
  public bot: Bot
  public targets: StateMachineTargets

  constructor (bot: Bot, targets: StateMachineTargets) {
    this.bot = bot
    this.targets = targets
  }

  async onStateEntered (): Promise<void> {
    this.isFinished = false
    try {
      if (this.targets.position == null) {
        this.isFinished = true
        return
      }

      await this.bot.lookAt(this.targets.position.offset(0, 1.5, 0), false)
      await this.bot.fish()
      await sleep(500)
      this.isFinished = true
    } catch (err) {
      error(err)
    }
  }
}
