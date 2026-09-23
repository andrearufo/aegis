import { effectScope, ref, watch } from 'vue'
import { useGameStore } from '../stores/game'

export const STEP_MS = 220

const displayPosition = ref(0)
const moving = ref(false)
let started = false

/** Token position shown on screen: walks one cell at a time towards the real position. */
export function useWalker() {
  if (!started) {
    started = true
    const game = useGameStore()
    let timer: ReturnType<typeof setTimeout> | undefined
    effectScope(true).run(() =>
      watch(
        () => [game.seed, game.player.position] as const,
        ([seed, target], old) => {
          clearTimeout(timer)
          const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
          if (reduced || seed !== old?.[0] || target < displayPosition.value) {
            displayPosition.value = target
            moving.value = false
            return
          }
          const step = () => {
            moving.value = displayPosition.value < target
            if (!moving.value) return
            displayPosition.value++
            timer = setTimeout(step, STEP_MS)
          }
          step()
        },
        { immediate: true },
      ),
    )
  }
  return { displayPosition, moving }
}
