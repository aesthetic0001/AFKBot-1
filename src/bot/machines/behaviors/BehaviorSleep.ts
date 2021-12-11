import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import { error } from '../../../utils/log.js'

export class BehaviorSleep implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Sleep'
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

      const bed = this.bot.findBlock({
        matching: (block) => block.name.includes('_bed')
      })

      if (bed == null) {
        this.isFinished = true
        return
      }

      await this.bot.sleep(bed)
      this.bot.once('wake', () => {
        this.isFinished = true
      })
    } catch (err) {
      error(err)
      if (this.bot.isSleeping) await this.bot.wake()
      this.isFinished = true
    }
  }
}
