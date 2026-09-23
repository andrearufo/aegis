import { describe, expect, it } from 'vitest'
import { canPlaceCombat } from './eventAssigner'
import { difficultyAt } from './difficultyScaler'
import { DEFAULT_CONFIG, generateRun } from './index'
import { createRng } from './prng'

const SEEDS = Array.from({ length: 500 }, (_, i) => i * 7919 + 1)
const RESTORING = ['recovery', 'loot', 'checkpoint']

describe('prng', () => {
  it('produces a fixed sequence for a given seed (cross-machine golden values)', () => {
    const rng = createRng(48213)
    expect(Array.from({ length: 5 }, () => rng.int(0, 1_000_000))).toMatchSnapshot()
  })

  it('same seed → same sequence, different seed → different sequence', () => {
    const seq = (s: number) => {
      const r = createRng(s)
      return Array.from({ length: 100 }, r.next)
    }
    expect(seq(42)).toEqual(seq(42))
    expect(seq(42)).not.toEqual(seq(43))
  })

  it('int() stays in range and hits every value', () => {
    const rng = createRng(1)
    const seen = new Set<number>()
    for (let i = 0; i < 1000; i++) seen.add(rng.int(1, 3))
    expect([...seen].sort()).toEqual([1, 2, 3])
  })
})

describe('generateRun determinism', () => {
  it('seed 48213 always generates the same run (golden snapshot)', () => {
    const run = generateRun(48213)
    const compact = run.path.map((s) => `${s.x},${s.y}:${s.event.type}${'difficulty' in s.event ? s.event.difficulty : ''}`)
    expect(compact).toMatchSnapshot()
  })

  it('is identical across repeated runs', () => {
    for (const seed of SEEDS.slice(0, 50)) expect(generateRun(seed)).toEqual(generateRun(seed))
  })

  it('different seeds produce different paths', () => {
    const paths = new Set(SEEDS.map((s) => JSON.stringify(generateRun(s).path.map((c) => [c.x, c.y]))))
    expect(paths.size).toBe(SEEDS.length)
  })
})

describe('path', () => {
  it.each(SEEDS.slice(0, 100))('seed %i: valid self-avoiding walk of 35–40 cells from a border', (seed) => {
    const { path } = generateRun(seed)
    expect(path.length).toBeGreaterThanOrEqual(35)
    expect(path.length).toBeLessThanOrEqual(40)
    const { x, y } = path[0]
    expect(x === 0 || y === 0 || x === 9 || y === 9).toBe(true)
    expect(new Set(path.map((c) => `${c.x},${c.y}`)).size).toBe(path.length)
    for (let i = 1; i < path.length; i++) {
      expect(Math.abs(path[i].x - path[i - 1].x) + Math.abs(path[i].y - path[i - 1].y)).toBe(1)
      expect(path[i].x).toBeGreaterThanOrEqual(0)
      expect(path[i].x).toBeLessThan(10)
      expect(path[i].y).toBeGreaterThanOrEqual(0)
      expect(path[i].y).toBeLessThan(10)
    }
  })

  it('respects custom grid sizes', () => {
    const run = generateRun(5, { ...DEFAULT_CONFIG, width: 6, height: 5 })
    expect(run.path.length).toBeGreaterThanOrEqual(Math.round(30 * 0.35))
    expect(run.path.every((c) => c.x < 6 && c.y < 5)).toBe(true)
  })
})

describe('event constraints', () => {
  it.each(SEEDS)('seed %i', (seed) => {
    const events = generateRun(seed).path.map((s) => s.event)
    const last = events.length - 1
    expect(events[0].type).toBe('start')
    expect(events[last].type).toBe('end')

    events.forEach((e, i) => {
      if (i > 0 && i < last) expect(e.type === 'checkpoint').toBe(i % 10 === 0)
      if (e.type === 'combat') expect(canPlaceCombat(events, i)).toBe(true)
    })

    const first = events.find((e, i) => i > 0 && e.type !== 'empty')!
    expect(first.type === 'combat' && first.difficulty === 6).toBe(false)
  })

  it('canPlaceCombat: C _ C is blocked, R C _ C is allowed', () => {
    expect(canPlaceCombat([{ type: 'start' }, { type: 'combat', difficulty: 1 }, { type: 'empty' }], 3)).toBe(false)
    expect(
      canPlaceCombat([{ type: 'recovery', amount: 2 }, { type: 'combat', difficulty: 1 }, { type: 'empty' }], 3),
    ).toBe(true)
    expect(canPlaceCombat([{ type: 'start' }, { type: 'trap', difficulty: 1 }], 2)).toBe(true)
  })

  it('event mix roughly follows the weights', () => {
    const counts: Record<string, number> = {}
    let total = 0
    for (const seed of SEEDS)
      for (const { event } of generateRun(seed).path)
        if (!['start', 'end', 'checkpoint'].includes(event.type)) {
          counts[event.type] = (counts[event.type] ?? 0) + 1
          total++
        }
    // combat is slightly below 22% because of the constraints
    expect(counts.empty / total).toBeGreaterThan(0.33)
    expect(counts.combat / total).toBeGreaterThan(0.15)
    expect(counts.combat / total).toBeLessThan(0.25)
  })
})

describe('difficultyAt', () => {
  it('scales by thirds', () => {
    expect([0, 13, 14, 26, 27, 39].map((i) => difficultyAt(i, 40, [2, 4, 6]))).toEqual([2, 2, 4, 4, 6, 6])
  })
})
