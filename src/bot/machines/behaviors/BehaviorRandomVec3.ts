import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import Vec3 from 'vec3'
import TSConfig from '../../../classes/TSConfig'

export class BehaviorRandomVec3 implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Random Vec3'
  public isFinished: boolean = false
  public bot: Bot
  public config: TSConfig
  public targets: StateMachineTargets
  public startPos: { x: number, y: number, z: number }

  constructor (bot: Bot, targets: StateMachineTargets, config: TSConfig) {
    this.bot = bot
    this.config = config
    this.targets = targets
    this.startPos = bot.entity.position
  }

  onStateEntered (): void {
    this.isFinished = false
    const rd = parseInt(this.config.config.minecraft.afk.radius)
    const rx =  Math.floor(Math.random() * ((this.startPos.x - rd) - (this.startPos.x + rd) + 1) + (this.startPos.x + rd))
    const rz =  Math.floor(Math.random() * ((this.startPos.z - rd) - (this.startPos.z + rd) + 1) + (this.startPos.z + rd))
    this.targets.position = Vec3({
      x: rx,
      y: this.bot.entity.position.y,
      z: rz
    })

    this.isFinished = true
  }
}
