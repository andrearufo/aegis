import { assignEvents } from './eventAssigner'
import { generatePath } from './pathGenerator'
import { createRng, subSeed } from './prng'
import type { GenConfig, Run } from './types'

export * from './types'
export { ITEMS, FORKS } from './data'

export const DEFAULT_CONFIG: GenConfig = {
  width: 10,
  height: 10,
  minCoverage: 0.35,
  maxCoverage: 0.4,
  weights: { empty: 38, combat: 22, trap: 10, recovery: 6, loot: 3, fork: 13 },
  checkpointInterval: 10,
  recoveryAmount: [2, 3],
  difficultyTiers: [2, 4, 6],
}

/** Whole run from a seed: same seed + same config → identical output. */
export function generateRun(seed: number, config: GenConfig = DEFAULT_CONFIG): Run {
  seed = seed >>> 0
  const cells = config.width * config.height
  const length = createRng(subSeed(seed, 1)).int(
    Math.round(cells * config.minCoverage),
    Math.round(cells * config.maxCoverage),
  )
  const cellsOnPath = generatePath(subSeed(seed, 2), config.width, config.height, length)
  const events = assignEvents(subSeed(seed, 3), length, config)
  return { seed, config, path: cellsOnPath.map((c, index) => ({ ...c, index, event: events[index] })) }
}

export * from './rules'
export { playabilityCheck, playOnce, diceFor } from './simulate'
