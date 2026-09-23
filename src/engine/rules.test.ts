import { describe, expect, it } from 'vitest'
import { DEFAULT_CONFIG } from './index'
import { availableChoices, createPlayer, resolveEvent, rollDice, useItem } from './rules'
import { playabilityCheck } from './simulate'
import type { EventDefinition, Run } from './types'

const makeRun = (...events: EventDefinition[]): Run => ({
  seed: 0,
  config: DEFAULT_CONFIG,
  path: [{ type: 'start' } as EventDefinition, ...events, { type: 'end' } as EventDefinition].map((event, index) => ({ x: index, y: 0, index, event })),
})
const fixed = (...rolls: number[]) => () => rolls.shift() ?? 1
const E: EventDefinition = { type: 'empty' }

describe('movement', () => {
  it('overshooting the finish wins', () => {
    const s = createPlayer()
    rollDice(s, makeRun(E), fixed(3))
    expect(s.status).toBe('won')
    expect(s.position).toBe(2)
  })

  it('checkpoint triggers when passed over, capped at 10', () => {
    const s = createPlayer()
    s.vigor = 3
    rollDice(s, makeRun({ type: 'checkpoint' }, E, E), fixed(2))
    expect([s.health, s.vigor, s.mana]).toEqual([10, 4, 7])
  })

  it('cannot roll while an event waits for a choice', () => {
    const s = createPlayer()
    const run = makeRun({ type: 'trap', difficulty: 1 }, E)
    rollDice(s, run, fixed(1))
    expect(s.awaitingChoice).toBe(true)
    expect(rollDice(s, run, fixed(1))).toBeNull()
  })
})

describe('combat', () => {
  const run = makeRun({ type: 'combat', difficulty: 3 }, E)
  const enter = () => {
    const s = createPlayer()
    rollDice(s, run, fixed(1))
    return s
  }

  it('fight pays 1 Vigore before rolling; failure costs the full difficulty', () => {
    const s = enter()
    s.vigor = 1 // after paying: 0 → bonus 0
    resolveEvent(s, run, 'fight', fixed(1))
    expect(s.vigor).toBe(0)
    expect(s.health).toBe(7)
    expect(s.awaitingChoice).toBe(false)
  })

  it('tie is a success', () => {
    const s = enter()
    s.vigor = 3 // pays 1 → 2 → bonus 1; roll 2 + 1 = 3
    resolveEvent(s, run, 'fight', fixed(2))
    expect(s.health).toBe(10)
  })

  it('flee costs 2 Mana and is disabled without it', () => {
    const s = enter()
    resolveEvent(s, run, 'flee', fixed())
    expect(s.mana).toBe(4)
    const t = enter()
    t.mana = 1
    expect(availableChoices(t, run).find((c) => c.id === 'flee')!.enabled).toBe(false)
    expect(resolveEvent(t, run, 'flee', fixed())).toBe(false)
  })

  it('with no affordable option, all are enabled (no soft-lock)', () => {
    const s = enter()
    s.vigor = 0
    s.mana = 0
    expect(availableChoices(s, run).every((c) => c.enabled)).toBe(true)
    resolveEvent(s, run, 'fight', fixed(1))
    expect(s.health).toBe(7)
  })

  it('health 0 is game over', () => {
    const s = enter()
    s.health = 1
    s.vigor = 0
    s.mana = 0
    resolveEvent(s, run, 'fight', fixed(1))
    expect(s.status).toBe('lost')
    expect(rollDice(s, run, fixed(1))).toBeNull()
  })
})

describe('other events', () => {
  it('trap: disarm costs 1 Mana, force works like combat', () => {
    const run = makeRun({ type: 'trap', difficulty: 3 }, E)
    const s = createPlayer()
    rollDice(s, run, fixed(1))
    resolveEvent(s, run, 'disarm', fixed())
    expect(s.mana).toBe(5)
    const t = createPlayer()
    t.vigor = 1
    rollDice(t, run, fixed(1))
    resolveEvent(t, run, 'force', fixed(1))
    expect(t.health).toBe(7)
  })

  it('recovery adds to the chosen bar', () => {
    const run = makeRun({ type: 'recovery', amount: 3 }, E)
    const s = createPlayer()
    rollDice(s, run, fixed(1))
    resolveEvent(s, run, 'mana', fixed())
    expect(s.mana).toBe(9)
  })

  it('fork applies effects and advance moves further (landing event resolves)', () => {
    const run = makeRun({ type: 'fork', forkId: 'bridge' }, E, { type: 'recovery', amount: 2 }, E)
    const s = createPlayer()
    rollDice(s, run, fixed(1))
    resolveEvent(s, run, 'option0', fixed())
    expect(s.vigor).toBe(4)
    expect(s.position).toBe(3)
    expect(s.awaitingChoice).toBe(true)
  })

  it('loot fills inventory up to 3, then items are lost; items usable any time', () => {
    const run = makeRun(...Array(4).fill({ type: 'loot', item: 'potion_health' }), E)
    const s = createPlayer()
    for (let i = 0; i < 4; i++) rollDice(s, run, fixed(1))
    expect(s.inventory).toHaveLength(3)
    s.health = 5
    expect(useItem(s, 0)).toBe(true)
    expect(s.health).toBe(8)
    expect(s.inventory).toHaveLength(2)
    expect(useItem(s, 5)).toBe(false)
  })
})

describe('playabilityCheck', () => {
  it('is deterministic and returns a sane report', () => {
    const a = playabilityCheck(48213, 50)
    expect(a).toEqual(playabilityCheck(48213, 50))
    expect(a.winRate).toBeGreaterThanOrEqual(0)
    expect(a.winRate).toBeLessThanOrEqual(1)
  })
})
