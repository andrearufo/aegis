/** Difficulty by path position: the path is split into equal parts, one per tier (default 2 / 4 / 6 by thirds). */
export function difficultyAt(index: number, length: number, tiers: readonly number[]): number {
  return tiers[Math.min(tiers.length - 1, Math.floor((index * tiers.length) / length))]
}
