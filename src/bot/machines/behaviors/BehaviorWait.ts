import { Bot } from 'mineflayer'
import { StateBehavior } from 'mineflayer-statemachine'
import TSConfig from '../../../utils/config'
import { sleep } from '../../../utils/functions.js'
import { error } from '../../../utils/log.js'

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
    try {
      this.isFinished = false
      await sleep(parseInt(this.config.config.minecraft.afk.timeout))
      this.isFinished = true
    } catch (err) {
      error(err)
    }
  }
}
