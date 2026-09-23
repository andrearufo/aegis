<script setup lang="ts">
import { computed } from 'vue'
import type { PathStep } from '../engine'
import { useGameStore } from '../stores/game'
import { EVENT_ICONS, describeEvent } from './eventText'

const game = useGameStore()
const width = computed(() => game.run!.config.width)
const cells = computed(() => {
  const grid: (PathStep | null)[] = Array(width.value * game.run!.config.height).fill(null)
  for (const step of game.path) grid[step.y * width.value + step.x] = step
  return grid
})
</script>

<template>
  <div class="grid" :style="{ gridTemplateColumns: `repeat(${width}, 1fr)` }">
    <div
      v-for="(step, i) in cells"
      :key="i"
      class="cell"
      :class="step && { path: true, visited: step.index < game.player.position, current: step.index === game.player.position }"
      :title="step ? `#${step.index} · ${describeEvent(step.event)}` : undefined"
    >
      <template v-if="step">
        <span class="icon">{{
          step.index === game.player.position ? '🧙' : step.event.type === 'checkpoint' && step.index < game.player.position ? '✅' : EVENT_ICONS[step.event.type]
        }}</span>
        <span v-if="'difficulty' in step.event" class="diff">{{ step.event.difficulty }}</span>
        <span class="idx">{{ step.index }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  gap: 2px;
  width: min(100%, 520px);
  aspect-ratio: 1;
  box-sizing: border-box;
  padding: 4px;
  border-radius: 8px;
  background: var(--panel);
}
.cell {
  position: relative;
  display: grid;
  place-items: center;
  border-radius: 4px;
  font-size: clamp(0.8rem, 3vw, 1.3rem);
}
.path { background: var(--path); }
.visited { opacity: 0.4; }
.current { outline: 3px solid var(--accent); z-index: 1; }
.idx, .diff {
  position: absolute;
  font-size: 0.55rem;
  line-height: 1;
  color: var(--muted);
}
.idx { left: 2px; top: 2px; }
.diff { right: 2px; bottom: 2px; font-weight: bold; color: var(--danger); }
</style>
