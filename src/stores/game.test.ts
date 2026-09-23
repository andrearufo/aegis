import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { parseSeed, useGameStore } from './game'

describe('game store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('same seed + same choices → same game', () => {
    const play = () => {
      const g = useGameStore()
      g.newGame(48213)
      for (let i = 0; i < 200 && !g.isGameOver && !g.isVictory; i++) {
        if (g.choices.length) g.resolveEvent(g.choices.find((c) => c.enabled)!.id)
        else g.rollDice()
      }
      return JSON.parse(JSON.stringify(g.player))
    }
    const first = play()
    setActivePinia(createPinia())
    expect(play()).toEqual(first)
    expect(['won', 'lost']).toContain(first.status)
  })

  it('exposes getters', () => {
    const g = useGameStore()
    g.newGame(7)
    expect(g.seed).toBe(7)
    expect(g.currentCell!.event.type).toBe('start')
    expect(g.progressPercentage).toBe(0)
    g.rollDice()
    expect(g.lastRoll).toBeGreaterThanOrEqual(1)
    expect(g.progressPercentage).toBeGreaterThan(0)
  })

  it('rejects invalid seeds', () => {
    const g = useGameStore()
    expect(() => g.newGame(-1)).toThrow()
    expect(() => g.newGame(1.5)).toThrow()
    expect(parseSeed('#48213')).toBe(48213)
    expect(parseSeed('abc')).toBeNull()
    expect(parseSeed('')).toBeNull()
  })
})
