import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'

export class BehaviorGetFood implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'GetFood'
  public isFinished: boolean = false
  public bot: Bot
  public targets: StateMachineTargets

  constructor (bot: Bot, targets: StateMachineTargets) {
    this.bot = bot
    this.targets = targets
  }

  onStateEntered (): void {
    // @ts-expect-error
    this.bot.autoEat.enable()
  }

  onStateExited (): void {
    // @ts-expect-error
    this.bot.autoEat.disable()
  }
}
