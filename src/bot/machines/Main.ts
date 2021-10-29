import { Bot } from 'mineflayer'
import { BehaviorIdle, BotStateMachine, NestedStateMachine, StateMachineWebserver, StateTransition } from 'mineflayer-statemachine'
import { getPortPromise } from 'portfinder'
import { BehaviorLoadPlugins } from './behaviors/BehaviorLoadPlugins.js'

export default async function initMachine (bot: Bot): Promise<void> {
  const loadPlugins = new BehaviorLoadPlugins(bot)
  const idle = new BehaviorIdle()
  idle.stateName = 'Idle'

  const transitions: StateTransition[] = [
    new StateTransition({
      parent: loadPlugins,
      child: idle,
      shouldTransition: () => true
    })
  ]

  const rootStateMachine = new NestedStateMachine(transitions, loadPlugins)
  rootStateMachine.stateName = 'Main Machine'

  const botStateMachine = new BotStateMachine(bot, rootStateMachine)
  const webserver = new StateMachineWebserver(bot, botStateMachine, await getPortPromise())
  webserver.startServer()
}
