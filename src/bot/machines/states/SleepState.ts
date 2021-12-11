import { Bot } from 'mineflayer'
import { BehaviorFindBlock, BehaviorIdle, BehaviorMoveTo, NestedStateMachine, StateMachineTargets, StateTransition } from 'mineflayer-statemachine'
import data from 'minecraft-data'
import { BehaviorSleep } from '../behaviors/BehaviorSleep.js'

export default function createSleepState (bot: Bot, targets: StateMachineTargets): NestedStateMachine {
  const mcData = data(bot.version)
  const enter = new BehaviorIdle()
  const exit = enter
  const findBed = new BehaviorFindBlock(bot, targets)
  const goto = new BehaviorMoveTo(bot, targets)
  const interact = new BehaviorSleep(bot, targets)

  enter.stateName = 'Main State'
  findBed.stateName = 'Find Bed'
  findBed.blocks = mcData.blocksArray.filter(block => block.name.includes('_bed')).map(block => block.id)
  goto.stateName = 'Move To'
  goto.distance = 1.5

  const transitions = [
    new StateTransition({
      parent: enter,
      child: findBed,
      shouldTransition: () => true
    }),

    new StateTransition({
      parent: findBed,
      child: goto,
      shouldTransition: () => !(targets.position == null)
    }),

    new StateTransition({
      parent: findBed,
      child: exit,
      shouldTransition: () => targets.position == null
    }),

    new StateTransition({
      parent: goto,
      child: interact,
      shouldTransition: () => goto.isFinished()
    }),

    new StateTransition({
      parent: interact,
      child: exit,
      shouldTransition: () => interact.isFinished
    })
  ]

  const stateMachine = new NestedStateMachine(transitions, enter, exit)
  stateMachine.stateName = 'Sleep State'
  return stateMachine
}
