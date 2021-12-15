import { Bot, Chest } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import { sleep } from '../../../utils/functions.js'
import { error } from '../../../utils/log.js'

export class BehaviorChest implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Chest'
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

      const block = this.bot.blockAt(this.targets.position)
      if (block == null) {
        this.isFinished = true
        return
      }

      const chest = await this.bot.openChest(block)
      for (const item of this.bot.inventory.items()) {
        if (this.bot.heldItem === item) continue
        await chest.deposit(item.type, null, item.count)
        await sleep(500)
      }

      chest.close()
      await sleep(1000)
    } catch (err) {
      error(err)
      this.isFinished = true
    }

    this.isFinished = true
  }
}
