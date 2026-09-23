import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import {
  availableChoices,
  createPlayer,
  diceFor,
  generateRun,
  resolveEvent as resolve,
  rollDice as roll,
  useItem as consume,
  type ChoiceId,
  type PlayerState,
  type Run,
} from '../engine'

export const MAX_SEED = 0xffffffff

export function parseSeed(input: string): number | null {
  const n = Number(input.trim().replace(/^#/, ''))
  return Number.isInteger(n) && n >= 0 && n <= MAX_SEED && input.trim() !== '' ? n : null
}

export const useGameStore = defineStore('game', () => {
  const run = shallowRef<Run | null>(null)
  const player = ref<PlayerState>(createPlayer())
  const lastRoll = ref<number | null>(null)
  // Dice are seeded too: same seed + same choices → same game.
  let dice = () => 1

  const seed = computed(() => run.value?.seed ?? null)
  const path = computed(() => run.value?.path ?? [])
  const currentCell = computed(() => path.value[player.value.position] ?? null)
  const isGameOver = computed(() => player.value.status === 'lost')
  const isVictory = computed(() => player.value.status === 'won')
  const progressPercentage = computed(() =>
    path.value.length > 1 ? Math.round((player.value.position / (path.value.length - 1)) * 100) : 0,
  )
  const choices = computed(() => (run.value ? availableChoices(player.value, run.value) : []))

  function newGame(newSeed = Math.floor(Math.random() * 1_000_000)) {
    if (!Number.isInteger(newSeed) || newSeed < 0 || newSeed > MAX_SEED) throw new Error(`Invalid seed: ${newSeed}`)
    run.value = generateRun(newSeed)
    player.value = createPlayer()
    lastRoll.value = null
    dice = diceFor(newSeed)
  }

  function rollDice() {
    if (!run.value) return null
    lastRoll.value = roll(player.value, run.value, dice)
    return lastRoll.value
  }

  const resolveEvent = (choice: ChoiceId) => !!run.value && resolve(player.value, run.value, choice, dice)
  const useItem = (slot: number) => consume(player.value, slot)

  return {
    run, player, lastRoll,
    seed, path, currentCell, isGameOver, isVictory, progressPercentage, choices,
    newGame, rollDice, resolveEvent, useItem,
  }
})
