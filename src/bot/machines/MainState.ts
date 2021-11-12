import { Bot } from 'mineflayer'
import { BehaviorIdle, BotStateMachine, NestedStateMachine, StateMachineTargets, StateMachineWebserver, StateTransition } from 'mineflayer-statemachine'
import { getPortPromise } from 'portfinder'
import TSConfig from '../../classes/TSConfig.js'
import { BehaviorLoadData } from './behaviors/BehaviorLoadData.js'
import createAFKState from './states/AFKState.js'

export default async function initMachine (bot: Bot, config: TSConfig): Promise<void> {
  const targets: StateMachineTargets = {}
  const data = new BehaviorLoadData(bot, config)
  const idle = new BehaviorIdle()
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
      child: afkState,
      shouldTransition: () => false
    }),

    new StateTransition({
      parent: afkState,
      child: idle,
      shouldTransition: () => false
    })
  ]

  bot.on('whisper', (user, msg) => {
    switch (msg) {
      case 'afk':
        // @ts-expect-error
        bot.startPos = bot.entity.position
        transitions[1].trigger()
        break
      case 'stop':
        transitions[2].trigger()
        break
    }
  })

  const rootStateMachine = new NestedStateMachine(transitions, data)
  rootStateMachine.stateName = 'Main State'

  const botStateMachine = new BotStateMachine(bot, rootStateMachine)
  const webserver = new StateMachineWebserver(bot, botStateMachine, await getPortPromise())
  webserver.startServer()
}
