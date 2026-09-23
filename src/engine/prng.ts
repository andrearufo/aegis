/** Seedable deterministic PRNG (mulberry32). Uses only 32-bit integer ops, so output is identical on every JS engine. */
export interface Rng {
  /** Float in [0, 1). */
  next(): number
  /** Integer in [min, max], inclusive. */
  int(min: number, max: number): number
  pick<T>(items: readonly T[]): T
  /** Returns a shuffled copy (Fisher–Yates). */
  shuffle<T>(items: readonly T[]): T[]
  /** Picks a key with probability proportional to its weight; keys with weight <= 0 are never picked. */
  weighted<K extends string>(weights: Record<K, number>): K
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0

  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, max: number) => min + Math.floor(next() * (max - min + 1))

  return {
    next,
    int,
    pick: (items) => items[int(0, items.length - 1)],
    shuffle(items) {
      const out = [...items]
      for (let i = out.length - 1; i > 0; i--) {
        const j = int(0, i)
        ;[out[i], out[j]] = [out[j], out[i]]
      }
      return out
    },
    weighted(weights) {
      const entries = (Object.entries(weights) as [keyof typeof weights, number][]).filter(([, w]) => w > 0)
      if (!entries.length) throw new Error('weighted(): no positive weights')
      let roll = next() * entries.reduce((sum, [, w]) => sum + w, 0)
      for (const [key, w] of entries) {
        roll -= w
        if (roll < 0) return key
      }
      return entries[entries.length - 1][0]
    },
  }
}

/** Derives an independent sub-seed so each generator stage has its own stream. */
export const subSeed = (seed: number, salt: number) => (Math.imul(seed ^ salt, 0x9e3779b1) ^ salt) >>> 0
