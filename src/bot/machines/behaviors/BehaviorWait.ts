import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import TSConfig from '../../../classes/TSConfig'

export class BehaviorWait implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Wait'
  public isFinished: boolean = false
  public bot: Bot
  public config: TSConfig

  constructor (bot: Bot, config: TSConfig) {
    this.bot = bot
    this.config = config
  }

  async onStateEntered (): Promise<void> {
    this.isFinished = false
    await new Promise(resolve => setTimeout(resolve, parseInt(this.config.config.minecraft.afk.timeout)))
    this.isFinished = true
  }
}
