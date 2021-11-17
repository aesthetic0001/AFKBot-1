import { Bot } from 'mineflayer'
import { BehaviorIdle, BehaviorMoveTo, NestedStateMachine, StateMachineTargets, StateTransition } from 'mineflayer-statemachine'
import TSConfig from '../../../classes/TSConfig.js'
import { BehaviorWait } from '../behaviors/BehaviorWait.js'
import { BehaviorRandomVec3 } from '../behaviors/BehaviorRandomVec3.js'
import { BehaviorEatFood } from '../behaviors/BehaviorEatFood.js'
import { BehaviorGetFood } from '../behaviors/BehaviorGetFood.js'

export default function createAFKState (bot: Bot, targets: StateMachineTargets, config: TSConfig): NestedStateMachine {
  const enter = new BehaviorIdle()
  const exit = enter
  const randomVec = new BehaviorRandomVec3(bot, targets, config)
  const goto = new BehaviorMoveTo(bot, targets)
  const wait = new BehaviorWait(bot, config)
  const food = new BehaviorGetFood(bot, targets, config)
  const eat = new BehaviorEatFood(bot, targets, config)

  enter.stateName = 'Main State'
  goto.stateName = 'Move To'

  const transitions = [
    new StateTransition({
      parent: enter,
      child: randomVec,
      shouldTransition: () => true
    }),

    new StateTransition({
      parent: randomVec,
      child: goto,
      shouldTransition: () => !(targets.position == null)
    }),

    new StateTransition({
      parent: goto,
      child: food,
      shouldTransition: () => ((bot.food <= parseInt(config.config.minecraft['auto-eat'].at)) && goto.isFinished())
    }),

    new StateTransition({
      parent: goto,
      child: wait,
      shouldTransition: () => goto.isFinished()
    }),

    new StateTransition({
      parent: wait,
      child: randomVec,
      shouldTransition: () => wait.isFinished
    }),

    new StateTransition({
      parent: randomVec,
      child: exit,
      shouldTransition: () => targets.position == null
    }),

    new StateTransition({
      parent: food,
      child: eat,
      shouldTransition: () => targets.item
    }),

    new StateTransition({
      parent: food,
      child: wait,
      shouldTransition: () => targets.item == null
    }),

    new StateTransition({
      parent: eat,
      child: wait,
      shouldTransition: () => eat.isFinished
    })
  ]

  const stateMachine = new NestedStateMachine(transitions, enter, exit)
  stateMachine.stateName = 'AFK State'
  return stateMachine
}
