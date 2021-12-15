import { Bot, BotEvents } from 'mineflayer'
import { BehaviorIdle, BotStateMachine, NestedStateMachine, StateMachineTargets, StateMachineWebserver, StateTransition } from 'mineflayer-statemachine'
import { getPortPromise } from 'portfinder'
import data from 'minecraft-data'
import TSConfig from '../../utils/config.js'
import { BehaviorLoadData } from './behaviors/BehaviorLoadData.js'
import createAFKState from './states/AFKState.js'
import createFishState from './states/FishState.js'

export default async function initMachine (bot: Bot, config: TSConfig): Promise<void> {
  const mcData = data(bot.version)
  const targets: StateMachineTargets = {}
  const load = new BehaviorLoadData(bot, config)
  const idle = new BehaviorIdle()
  const afkState = createAFKState(bot, targets, config, mcData)
  const fishState = createFishState(bot, targets, mcData)

  idle.stateName = 'Idle'

  const transitions: StateTransition[] = [
    new StateTransition({
      parent: load,
      child: idle,
      shouldTransition: () => true
    }),

    new StateTransition({
      parent: idle,
      child: afkState,
      shouldTransition: () => false
    }),

    new StateTransition({
      parent: idle,
      child: fishState,
      shouldTransition: () => false
    }),

    new StateTransition({
      parent: afkState,
      child: idle,
      shouldTransition: () => false
    }),

    new StateTransition({
      parent: fishState,
      child: idle,
      shouldTransition: () => fishState.isFinished()
    })
  ]

  bot.on(`${config.config.page['commands-prefix']}afk` as unknown as keyof BotEvents, () => {
    // @ts-expect-error
    bot.startPos = bot.entity.position
    transitions[1].trigger()
  })

  bot.on(`${config.config.page['commands-prefix']}goto` as unknown as keyof BotEvents, () => transitions[3].trigger())
  bot.on(`${config.config.page['commands-prefix']}fish` as unknown as keyof BotEvents, () => transitions[2].trigger())
  bot.on(`${config.config.page['commands-prefix']}stop` as unknown as keyof BotEvents, () => {
    transitions[3].trigger()
    transitions[4].trigger()
  })

  const rootStateMachine = new NestedStateMachine(transitions, load)
  rootStateMachine.stateName = 'Main State'

  const botStateMachine = new BotStateMachine(bot, rootStateMachine)
  const webserver = new StateMachineWebserver(bot, botStateMachine, await getPortPromise())
  webserver.startServer()
}
