import { Bot } from 'mineflayer'
import { BehaviorIdle, BotStateMachine, NestedStateMachine, StateMachineTargets, StateMachineWebserver, StateTransition } from 'mineflayer-statemachine'
import { BehaviorLoadPlugins } from './behaviors/BehaviorLoadPlugins'

export default function createMainState (bot: Bot) {
  const targets: StateMachineTargets = {}

  const enter = new BehaviorLoadPlugins(bot)
  const idle = new BehaviorIdle()

  const transitions: StateTransition[] = [
    new StateTransition({
      parent: enter,
      child: idle
    })
  ]

  const rootStateMachine = new NestedStateMachine(transitions, enter)
  const botStateMachine = new BotStateMachine(bot, rootStateMachine)
  const webserver = new StateMachineWebserver(bot, botStateMachine)
  webserver.startServer()
}
