import { Bot } from 'mineflayer'
import { StateBehavior, StateMachineTargets } from 'mineflayer-statemachine'
import TSConfig from '../../../classes/TSConfig'

export class BehaviorGetFood implements StateBehavior {
  public active: boolean = false
  public stateName: string = 'Get Food'
  public isFinished: boolean = false
  public bot: Bot
  public targets: StateMachineTargets
  public config: TSConfig

  constructor (bot: Bot, targets: StateMachineTargets, config: TSConfig) {
    this.bot = bot
    this.targets = targets
    this.config = config
  }

  onStateEntered (): void {
    this.isFinished = false
    // @ts-expect-error
    const availableFood = this.bot.inventory.items().filter(item => this.bot.data.foodsArray.map(food => food.name).includes(item.name))
    // @ts-expect-error
    const sortedFood = availableFood?.sort((a, b) => this.bot.data.foodsArray.find(food => food.name === b.name).foodPoints - this.bot.data.foodsArray.find(food => food.name === a.name).foodPoints).filter(food => !this.config.config.minecraft['auto-eat']['banned-food'].includes(food.name))[0]
    this.targets.item = sortedFood
    this.isFinished = true
  }
}
