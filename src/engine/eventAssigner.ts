import { ITEMS, FORKS } from './data'
import { difficultyAt } from './difficultyScaler'
import { createRng } from './prng'
import type { EventDefinition, GenConfig, ItemId, RandomEventType } from './types'

const RESTORING: EventDefinition['type'][] = ['recovery', 'loot', 'checkpoint']

/**
 * Combat rule: two combats with only empty cells between them are allowed only if
 * a recovery/loot/checkpoint appears in the 3 path steps before the new combat.
 */
export function canPlaceCombat(events: EventDefinition[], index: number): boolean {
  let prev = index - 1
  while (prev >= 0 && events[prev].type === 'empty') prev--
  if (prev < 0 || events[prev].type !== 'combat') return true
  return events.slice(Math.max(0, index - 3), index).some((e) => RESTORING.includes(e.type))
}

export function assignEvents(seed: number, length: number, config: GenConfig): EventDefinition[] {
  const rng = createRng(seed)
  const events: EventDefinition[] = []
  let seenEvent = false

  for (let i = 0; i < length; i++) {
    if (i === 0) events.push({ type: 'start' })
    else if (i === length - 1) events.push({ type: 'end' })
    else if (i % config.checkpointInterval === 0) events.push({ type: 'checkpoint' })
    else {
      const difficulty = difficultyAt(i, length, config.difficultyTiers)
      const weights: Record<RandomEventType, number> = { ...config.weights }
      if (!canPlaceCombat(events, i) || (!seenEvent && difficulty === Math.max(...config.difficultyTiers))) weights.combat = 0

      const type = rng.weighted(weights)
      events.push(
        type === 'combat' || type === 'trap'
          ? { type, difficulty }
          : type === 'recovery'
            ? { type, amount: rng.int(...config.recoveryAmount) }
            : type === 'loot'
              ? { type, item: rng.pick(Object.keys(ITEMS) as ItemId[]) }
              : type === 'fork'
                ? { type, forkId: rng.pick(FORKS).id }
                : { type },
      )
    }
    const t = events[i].type
    if (t !== 'start' && t !== 'empty') seenEvent = true
  }
  return events
}
