import { createRng } from './prng'
import type { Cell } from './types'

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const

const BUDGET_PER_ATTEMPT = 20_000
const MAX_ATTEMPTS = 50

/**
 * Self-avoiding walk with backtracking. Starts on a random border cell and stops at exactly `length` cells;
 * the last cell is the finish. Restarts from a new start cell if the search budget runs out.
 */
export function generatePath(seed: number, width: number, height: number, length: number): Cell[] {
  if (length < 2 || length > width * height) throw new Error(`Invalid path length ${length} for ${width}x${height}`)
  const rng = createRng(seed)
  const border: Cell[] = []
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) if (x === 0 || y === 0 || x === width - 1 || y === height - 1) border.push({ x, y })

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const path = [rng.pick(border)]
    const visited = new Set([path[0].y * width + path[0].x])
    let budget = BUDGET_PER_ATTEMPT

    const extend = (): boolean => {
      if (path.length === length) return true
      if (--budget < 0) return false
      const { x, y } = path[path.length - 1]
      const options = DIRS.map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter(
        (c) => c.x >= 0 && c.y >= 0 && c.x < width && c.y < height && !visited.has(c.y * width + c.x),
      )
      for (const cell of rng.shuffle(options)) {
        path.push(cell)
        visited.add(cell.y * width + cell.x)
        if (extend()) return true
        path.pop()
        visited.delete(cell.y * width + cell.x)
      }
      return false
    }

    if (extend()) return path
  }
  throw new Error(`No path of length ${length} found for seed ${seed}`)
}
