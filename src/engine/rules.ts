import { FORKS, ITEMS } from './data'
import type { Bar, Choice, ChoiceId, Effects, PlayerState, Run } from './types'

export const BAR_MAX = 10
export const INVENTORY_SIZE = 3
export const START_BARS: Record<Bar, number> = { health: 10, vigor: 6, mana: 6 }
export const CHECKPOINT_BONUS = 1
const LOG_SIZE = 50
const BAR_NAMES: Record<Bar, string> = { health: 'Salute', vigor: 'Vigore', mana: 'Mana' }
const BARS = Object.keys(BAR_NAMES) as Bar[]

/** Returns 1..3. Injected so rules stay deterministic and testable. */
export type Dice = () => number

export function createPlayer(): PlayerState {
  return { ...START_BARS, position: 0, inventory: [], awaitingChoice: false, status: 'playing', turn: 0, log: [] }
}

function log(s: PlayerState, msg: string) {
  s.log.push(msg)
  if (s.log.length > LOG_SIZE) s.log.shift()
}

function apply(s: PlayerState, effects: Effects) {
  for (const bar of BARS) if (effects[bar]) s[bar] = Math.max(0, Math.min(BAR_MAX, s[bar] + effects[bar]!))
  if (s.health <= 0 && s.status === 'playing') {
    s.status = 'lost'
    s.awaitingChoice = false
    log(s, 'La tua Salute è a 0. Game over.')
  }
}

function pay(s: PlayerState, cost: Choice['cost']) {
  apply(s, Object.fromEntries(Object.entries(cost).map(([bar, n]) => [bar, -n!])))
}

/** d3 + floor(Vigore/2) vs difficulty; on failure lose Salute equal to the full difficulty. */
function test(s: PlayerState, difficulty: number, dice: Dice, what: string) {
  const roll = dice()
  const bonus = Math.floor(s.vigor / 2)
  const total = roll + bonus
  if (total >= difficulty) return log(s, `${what}: ${roll}+${bonus}=${total} contro ${difficulty}, successo.`)
  log(s, `${what}: ${roll}+${bonus}=${total} contro ${difficulty}, perdi ${difficulty} Salute.`)
  apply(s, { health: -difficulty })
}

/** Steps forward; checkpoints trigger even when passed over, other events only on the landing cell. */
function move(s: PlayerState, run: Run, steps: number, dice: Dice) {
  const last = run.path.length - 1
  for (let i = 0; i < steps && s.position < last; i++) {
    s.position++
    if (run.path[s.position].event.type === 'checkpoint') {
      apply(s, { health: CHECKPOINT_BONUS, vigor: CHECKPOINT_BONUS, mana: CHECKPOINT_BONUS })
      log(s, `Checkpoint! +${CHECKPOINT_BONUS} a tutte le barre.`)
    }
  }
  enterCell(s, run)
}

function enterCell(s: PlayerState, run: Run) {
  const event = run.path[s.position].event
  switch (event.type) {
    case 'end':
      s.status = 'won'
      log(s, 'Hai raggiunto il traguardo. Vittoria!')
      break
    case 'combat':
      log(s, `Un nemico ti sbarra la strada (Difficoltà ${event.difficulty}).`)
      s.awaitingChoice = true
      break
    case 'trap':
      log(s, `Una trappola! (Difficoltà ${event.difficulty})`)
      s.awaitingChoice = true
      break
    case 'recovery':
      log(s, `Una radura tranquilla: recupera ${event.amount} punti in una barra.`)
      s.awaitingChoice = true
      break
    case 'fork':
      log(s, FORKS.find((f) => f.id === event.forkId)!.text)
      s.awaitingChoice = true
      break
    case 'loot': {
      const item = ITEMS[event.item]
      if (s.inventory.length < INVENTORY_SIZE) {
        s.inventory.push(item.id)
        log(s, `Trovi: ${item.name}.`)
      } else log(s, `Trovi ${item.name}, ma l'inventario è pieno: la lasci a terra.`)
      break
    }
  }
}

export function rollDice(s: PlayerState, run: Run, dice: Dice): number | null {
  if (s.status !== 'playing' || s.awaitingChoice) return null
  const roll = dice()
  s.turn++
  log(s, `Turno ${s.turn}: tiri ${roll}.`)
  move(s, run, roll, dice)
  // Active status effects would be applied here (none defined yet).
  return roll
}

/**
 * Options for the event on the current cell. An option is enabled if its Vigore/Mana cost is affordable;
 * if none is, all are enabled and costs are paid as far as possible (prevents soft-locks).
 */
export function availableChoices(s: PlayerState, run: Run): Choice[] {
  if (!s.awaitingChoice) return []
  const event = run.path[s.position].event
  let choices: Omit<Choice, 'enabled'>[] = []
  switch (event.type) {
    case 'combat':
      choices = [
        { id: 'fight', label: `Combatti (1 Vigore, 1d3 + ${Math.floor(Math.max(0, s.vigor - 1) / 2)} vs ${event.difficulty})`, cost: { vigor: 1 } },
        { id: 'flee', label: 'Fuga arcana (2 Mana)', cost: { mana: 2 } },
      ]
      break
    case 'trap':
      choices = [
        { id: 'disarm', label: 'Disinnesca (1 Mana)', cost: { mana: 1 } },
        { id: 'force', label: `Attraversa a forza (1 Vigore, 1d3 + ${Math.floor(Math.max(0, s.vigor - 1) / 2)} vs ${event.difficulty})`, cost: { vigor: 1 } },
      ]
      break
    case 'recovery':
      choices = BARS.map((bar) => ({ id: bar, label: `+${event.amount} ${BAR_NAMES[bar]}`, cost: {} }))
      break
    case 'fork':
      choices = FORKS.find((f) => f.id === event.forkId)!.options.map((o, i) => ({
        id: `option${i}` as ChoiceId,
        label: o.label,
        cost: Object.fromEntries((['vigor', 'mana'] as const).filter((b) => (o.effects[b] ?? 0) < 0).map((b) => [b, -o.effects[b]!])),
      }))
      break
  }
  const affordable = (c: Omit<Choice, 'enabled'>) => BARS.every((b) => s[b] >= (c.cost[b] ?? 0))
  const anyAffordable = choices.some(affordable)
  return choices.map((c) => ({ ...c, enabled: !anyAffordable || affordable(c) }))
}

export function resolveEvent(s: PlayerState, run: Run, choiceId: ChoiceId, dice: Dice): boolean {
  const choice = availableChoices(s, run).find((c) => c.id === choiceId)
  if (!choice?.enabled) return false
  const event = run.path[s.position].event
  s.awaitingChoice = false

  if (event.type === 'fork') {
    const option = FORKS.find((f) => f.id === event.forkId)!.options[choiceId === 'option0' ? 0 : 1]
    log(s, `Scegli: ${option.label}.`)
    apply(s, option.effects)
    if (option.effects.advance && s.status === 'playing') move(s, run, option.effects.advance, dice)
    return true
  }

  pay(s, choice.cost)
  if (event.type === 'recovery') {
    apply(s, { [choiceId]: event.amount })
    log(s, `Recuperi ${event.amount} ${BAR_NAMES[choiceId as Bar]}.`)
  } else if (choiceId === 'flee') log(s, 'Svanisci in un lampo arcano: scontro evitato.')
  else if (choiceId === 'disarm') log(s, 'Trappola disinnescata.')
  else if ((event.type === 'combat' || event.type === 'trap') && s.status === 'playing')
    test(s, event.difficulty, dice, choiceId === 'fight' ? 'Combattimento' : 'Attraversamento')
  return true
}

export function useItem(s: PlayerState, slot: number): boolean {
  if (s.status !== 'playing' || !s.inventory[slot]) return false
  const item = ITEMS[s.inventory.splice(slot, 1)[0]]
  apply(s, item.effects)
  log(s, `Usi ${item.name}.`)
  return true
}
