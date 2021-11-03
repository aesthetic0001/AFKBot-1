import { Bot } from 'mineflayer'
import { BehaviorIdle, NestedStateMachine, StateMachineTargets, StateTransition } from 'mineflayer-statemachine'
import TSConfig from '../../../classes/TSConfig.js'
import { BehaviorEatFood } from '../behaviors/BehaviorEatFood.js'
import { BehaviorGetFood } from '../behaviors/BehaviorGetFood.js'

export default function createFoodState (bot: Bot, targets: StateMachineTargets, config: TSConfig)
{
  const enter = new BehaviorIdle()
  const exit = enter
  const food = new BehaviorGetFood(bot, targets, config)
  const eat = new BehaviorEatFood(bot, targets)

  enter.stateName = 'Main State'

  const transitions = [
    new StateTransition({
      parent: enter,
      child: food,
      shouldTransition: () => true,
    }),

    new StateTransition({
      parent: food,
      child: eat,
      shouldTransition: () => targets.item
    }),

    new StateTransition({
      parent: eat,
      child: food,
      shouldTransition: () => (eat.isFinished && targets.item && bot.food < parseInt(config.config.minecraft['auto-eat'].at))
    }),

    new StateTransition({
      parent: eat,
      child: exit,
      shouldTransition: () => eat.isFinished
    }),

    new StateTransition({
      parent: food,
      child: exit,
      shouldTransition: () => !targets.item
    })
  ]
  
  const stateMachine = new NestedStateMachine(transitions, enter, exit)
  stateMachine.stateName = 'Food State'
  return stateMachine
}