import { Bot } from 'mineflayer'
import { BehaviorIdle, BotStateMachine, NestedStateMachine, StateMachineTargets, StateMachineWebserver, StateTransition } from 'mineflayer-statemachine'
import { getPortPromise } from 'portfinder'
import TSConfig from '../../classes/TSConfig.js'
import { BehaviorGetFood } from './behaviors/BehaviorGetFood.js'
import { BehaviorLoadData } from './behaviors/BehaviorLoadData.js'

export default async function initMachine (bot: Bot, config: TSConfig): Promise<void> {
  const targets: StateMachineTargets = {}
  const data = new BehaviorLoadData(bot, config)
  const idle = new BehaviorIdle()
  const food = new BehaviorGetFood(bot, targets)
  idle.stateName = 'Idle'

  const transitions: StateTransition[] = [
    new StateTransition({
      parent: data,
      child: idle,
      shouldTransition: () => true
    }),

    new StateTransition({
      parent: idle,
      child: food,
      shouldTransition: () => (bot.food <= parseInt(config.config.minecraft['auto-eat'].at))
    }),

    new StateTransition({
      parent: food,
      child: idle,
      shouldTransition: () => (bot.food === 20)
    })
  ]

  const rootStateMachine = new NestedStateMachine(transitions, data)
  rootStateMachine.stateName = 'Main Machine'

  const botStateMachine = new BotStateMachine(bot, rootStateMachine)
  const webserver = new StateMachineWebserver(bot, botStateMachine, await getPortPromise())
  webserver.startServer()
}
