export type Bar = 'health' | 'vigor' | 'mana'

export interface Cell {
  x: number
  y: number
}

/** Bar deltas plus optional extra movement along the path. */
export type Effects = Partial<Record<Bar, number>> & { advance?: number }

export type ItemId = 'potion_health' | 'potion_vigor' | 'potion_mana'

export interface Item {
  id: ItemId
  name: string
  effects: Effects
}

export interface ForkOption {
  label: string
  effects: Effects
}

export interface ForkDefinition {
  id: string
  text: string
  options: [ForkOption, ForkOption]
}

export type EventDefinition =
  | { type: 'start' }
  | { type: 'end' }
  | { type: 'empty' }
  | { type: 'checkpoint' }
  | { type: 'combat'; difficulty: number }
  | { type: 'trap'; difficulty: number }
  | { type: 'recovery'; amount: number }
  | { type: 'loot'; item: ItemId }
  | { type: 'fork'; forkId: string }

export type EventType = EventDefinition['type']
export type RandomEventType = 'empty' | 'combat' | 'trap' | 'recovery' | 'loot' | 'fork'

export interface PathStep extends Cell {
  index: number
  event: EventDefinition
}

export interface GenConfig {
  width: number
  height: number
  /** Fraction of grid cells covered by the path, e.g. 0.35–0.40. */
  minCoverage: number
  maxCoverage: number
  weights: Record<RandomEventType, number>
  checkpointInterval: number
  recoveryAmount: [min: number, max: number]
  /** Difficulty per equal section of the path, in order. */
  difficultyTiers: number[]
}

export interface Run {
  seed: number
  config: GenConfig
  path: PathStep[]
}

export type GameStatus = 'playing' | 'won' | 'lost'

export interface PlayerState extends Record<Bar, number> {
  position: number
  inventory: ItemId[]
  /** True while the event on the current cell waits for a choice; rolling is blocked. */
  awaitingChoice: boolean
  status: GameStatus
  turn: number
  log: string[]
}

export type ChoiceId = 'fight' | 'flee' | 'disarm' | 'force' | Bar | 'option0' | 'option1'

export interface Choice {
  id: ChoiceId
  label: string
  cost: Partial<Record<Bar, number>>
  enabled: boolean
}
