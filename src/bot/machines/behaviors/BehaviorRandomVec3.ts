import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import { Vec3 } from 'vec3'
import TSConfig from '../../../classes/TSConfig'

export class BehaviorRandomVec3 implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Random Vec3'
  public isFinished: boolean = false
  public bot: Bot
  public config: TSConfig
  public targets: StateMachineTargets

  constructor (bot: Bot, targets: StateMachineTargets, config: TSConfig) {
    this.bot = bot
    this.config = config
    this.targets = targets
  }

  onStateEntered (): void {
    this.isFinished = false
    const rd = parseInt(this.config.config.minecraft.afk.radius)
    const rx =  Math.floor(Math.random() * (rd - this.bot.entity.position.x + 1) + rd)
    const rz =  Math.floor(Math.random() * (rd - this.bot.entity.position.z + 1) + rd)
    this.targets.position = new Vec3(rx, this.bot.entity.position.y, rz)
    this.isFinished = true
  }
}
