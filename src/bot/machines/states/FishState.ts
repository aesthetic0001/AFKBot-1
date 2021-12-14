import { Bot } from 'mineflayer'
import { BehaviorEquipItem, BehaviorFindBlock, BehaviorIdle, NestedStateMachine, StateMachineTargets, StateTransition } from 'mineflayer-statemachine'
import data from 'minecraft-data'
import { BehaviorFish } from '../behaviors/BehaviorFish.js'

export default function createFishState (bot: Bot, targets: StateMachineTargets, mcData: data.IndexedData): NestedStateMachine {
  const enter = new BehaviorIdle()
  const exit = enter
  const findWater = new BehaviorFindBlock(bot, targets)
  const equipRod = new BehaviorEquipItem(bot, targets)
  const fish = new BehaviorFish(bot, targets)

  enter.stateName = 'Main State'
  findWater.stateName = 'Find Water'
  findWater.blocks = mcData.blocksArray.filter(block => block.name === 'water').map(block => block.id)
  findWater.maxDistance = 5
  equipRod.stateName = 'Equip Rod'

  const transitions = [
    new StateTransition({
      parent: enter,
      child: findWater,
      shouldTransition: () => true,
      onTransition: () => {
        targets.item = equipRod.findItem('fishing_rod')
      }
    }),

    new StateTransition({
      parent: findWater,
      child: exit,
      shouldTransition: () => targets.position == null || targets.item == null
    }),

    new StateTransition({
      parent: findWater,
      child: equipRod,
      shouldTransition: () => !(targets.position == null) && !(targets.item == null)
    }),

    new StateTransition({
      parent: equipRod,
      child: fish,
      shouldTransition: () => equipRod.wasEquipped || bot.heldItem?.name === 'fishing_rod'
    }),

    new StateTransition({
      parent: fish,
      child: fish,
      shouldTransition: () => fish.isFinished
    }),

    new StateTransition({
      parent: fish,
      child: exit,
      shouldTransition: () => bot.inventory.emptySlotCount() < 5
    })
  ]

  const stateMachine = new NestedStateMachine(transitions, enter, exit)
  stateMachine.stateName = 'Fish State'
  return stateMachine
}
