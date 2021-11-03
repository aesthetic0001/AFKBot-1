import { Bot } from 'mineflayer'
import { BehaviorIdle, BotStateMachine, NestedStateMachine, StateMachineTargets, StateMachineWebserver, StateTransition } from 'mineflayer-statemachine'
import { getPortPromise } from 'portfinder'
import TSConfig from '../../classes/TSConfig.js'
import { BehaviorLoadData } from './behaviors/BehaviorLoadData.js'
import createAFKState from './states/AFKState.js'
import createFoodState from './states/FoodState.js'

export default async function initMachine (bot: Bot, config: TSConfig): Promise<void> {
  const targets: StateMachineTargets = {}
  const data = new BehaviorLoadData(bot, config)
  const idle = new BehaviorIdle()
  const eatState = createFoodState(bot, targets, config)
  const afkState = createAFKState(bot, targets, config)

  idle.stateName = 'Idle'

  const transitions: StateTransition[] = [
    new StateTransition({
      parent: data,
      child: idle,
      shouldTransition: () => true
    }),

    new StateTransition({
      parent: idle,
      child: eatState,
      shouldTransition: () => false
    }),

    new StateTransition({
      parent: eatState,
      child: idle,
      shouldTransition: () => eatState.isFinished()
    }),

    new StateTransition({
      parent: idle,
      child: afkState,
      shouldTransition: () => true
    }),

    new StateTransition({
      parent: afkState,
      child: idle,
      shouldTransition: () => false
    })
  ]

  bot.on('health', () => {
    if (bot.food <= parseInt(config.config.minecraft['auto-eat'].at)) {
      transitions[4].trigger()
      transitions[1].trigger()
    }
  })

  const rootStateMachine = new NestedStateMachine(transitions, data)
  rootStateMachine.stateName = 'Main State'

  const botStateMachine = new BotStateMachine(bot, rootStateMachine)
  const webserver = new StateMachineWebserver(bot, botStateMachine, await getPortPromise())
  webserver.startServer()
}
