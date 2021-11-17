import { Bot } from 'mineflayer'
import { Block } from 'prismarine-block'
import { BehaviorFindBlock, BehaviorIdle, BehaviorInteractBlock, NestedStateMachine, StateMachineTargets, StateTransition } from 'mineflayer-statemachine'

export default function createSleepState (bot: Bot, targets: StateMachineTargets): NestedStateMachine {
  const enter = new BehaviorIdle()
  const exit = enter
  const idle = new BehaviorIdle()
  const findBed = new BehaviorFindBlock(bot, targets)
  const interact = new BehaviorInteractBlock(bot, targets)

  enter.stateName = 'Main State'
  findBed.stateName = 'Find Bed'
  // @ts-expect-error
  findBed.blocks = bot.data.blocksArray.filter((block: Block) => block.name.includes('bed'))

  const transitions = [
    new StateTransition({
      parent: enter,
      child: findBed,
      shouldTransition: () => true
    }),

    new StateTransition({
      parent: findBed,
      child: interact,
      shouldTransition: () => !(targets.position == null)
    }),

    new StateTransition({
      parent: findBed,
      child: idle,
      shouldTransition: () => targets.position == null
    })
  ]

  const stateMachine = new NestedStateMachine(transitions, enter, exit)
  stateMachine.stateName = 'Sleep State'
  return stateMachine
}
