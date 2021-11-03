import { Bot } from 'mineflayer'
import { BehaviorIdle, BehaviorMoveTo, NestedStateMachine, StateMachineTargets, StateTransition } from 'mineflayer-statemachine'
import TSConfig from '../../../classes/TSConfig.js'
import { BehaviorWait } from '../behaviors/BehaviorWait.js'
import { BehaviorRandomVec3 } from '../behaviors/BehaviorRandomVec3.js'

export default function createAFKState (bot: Bot, targets: StateMachineTargets, config: TSConfig) {
  const enter = new BehaviorIdle()
  const exit = enter
  const randomVec = new BehaviorRandomVec3(bot, targets, config)
  const goto = new BehaviorMoveTo(bot, targets)
  const wait = new BehaviorWait(bot, config)

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
      shouldTransition: () => !!targets.position
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
      shouldTransition: () => !targets.position
    })
  ]
  
  const stateMachine = new NestedStateMachine(transitions, enter, exit)
  stateMachine.stateName = 'AFK State'
  return stateMachine
}