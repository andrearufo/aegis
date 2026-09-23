import { generateRun } from './index'
import { createRng, subSeed } from './prng'
import { availableChoices, createPlayer, resolveEvent, rollDice, useItem } from './rules'
import type { Bar, PlayerState, Run } from './types'

const cost = (c: { cost: Partial<Record<Bar, number>> }) => (c.cost.vigor ?? 0) + (c.cost.mana ?? 0)

/** Dice stream for a seed; k = 0 is the one real games use. */
export const diceFor = (seed: number, k = 0) => {
  const rng = createRng(subSeed(seed, 4 + k))
  return () => rng.int(1, 3)
}

/** Naive strategy: cheapest enabled option, recovery on the lowest bar, drink a potion when its bar is <= 3. */
export function playOnce(run: Run, dice: () => number): PlayerState {
  const s = createPlayer()
  for (let guard = 0; s.status === 'playing' && guard < 1000; guard++) {
    s.inventory.forEach((item, slot) => {
      const bar = item.replace('potion_', '') as Bar
      if (s[bar] <= 3) useItem(s, slot)
    })
    if (!s.awaitingChoice) {
      rollDice(s, run, dice)
      continue
    }
    const choices = availableChoices(s, run).filter((c) => c.enabled)
    const bars = choices.filter((c) => c.id in s)
    const pick = bars.length
      ? bars.reduce((a, b) => (s[b.id as Bar] < s[a.id as Bar] ? b : a))
      : choices.reduce((a, b) => (cost(b) < cost(a) ? b : a))
    resolveEvent(s, run, pick.id, dice)
  }
  return s
}

export interface PlayabilityReport {
  seed: number
  runs: number
  winRate: number
  avgTurns: number
  avgHealthOnWin: number
}

/** Debug/balancing tool: plays `runs` games of the seed with different dice streams. */
export function playabilityCheck(seed: number, runs = 200): PlayabilityReport {
  const run = generateRun(seed)
  const results = Array.from({ length: runs }, (_, k) => playOnce(run, diceFor(seed, k)))
  const wins = results.filter((r) => r.status === 'won')
  return {
    seed: run.seed,
    runs,
    winRate: wins.length / runs,
    avgTurns: results.reduce((n, r) => n + r.turn, 0) / runs,
    avgHealthOnWin: wins.length ? wins.reduce((n, r) => n + r.health, 0) / wins.length : 0,
  }
}
