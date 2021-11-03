import { Bot } from 'mineflayer'
import { BehaviorIdle, BehaviorMoveTo, NestedStateMachine, StateMachineTargets, StateTransition } from 'mineflayer-statemachine'
import TSConfig from '../../../classes/TSConfig'
import { BehaviorRandomVec3 } from '../behaviors/BehaviorRandomVec3'

export default function createAFKState (bot: Bot, targets: StateMachineTargets, config: TSConfig) {
  const enter = new BehaviorIdle()
  const randomVec = new BehaviorRandomVec3(bot, targets, config)
  const goto = new BehaviorMoveTo(bot, targets)
  const exit = enter

  enter.stateName = 'Main State'

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
      child: exit,
      shouldTransition: () => goto.isFinished()
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