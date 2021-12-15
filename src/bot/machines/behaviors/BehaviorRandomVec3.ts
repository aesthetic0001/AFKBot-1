import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import vec3, { Vec3 } from 'vec3'
import TSConfig from '../../../utils/config'

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
    // @ts-expect-error
    const startPos: Vec3 = this.bot.startPos

    this.isFinished = false
    const rd = parseInt(this.config.config.minecraft.afk.radius)
    const rx = Math.floor(Math.random() * ((startPos.x - rd) - (startPos.x + rd) + 1) + (startPos.x + rd))
    const rz = Math.floor(Math.random() * ((startPos.z - rd) - (startPos.z + rd) + 1) + (startPos.z + rd))
    this.targets.position = vec3({
      x: rx,
      y: this.bot.entity.position.y,
      z: rz
    })

    this.isFinished = true
  }
}
