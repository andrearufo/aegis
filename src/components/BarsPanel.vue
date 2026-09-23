<script setup lang="ts">
import { BAR_MAX, type Bar } from '../engine'
import { useGameStore } from '../stores/game'

const game = useGameStore()
const bars: { id: Bar; name: string }[] = [
  { id: 'health', name: 'Salute' },
  { id: 'vigor', name: 'Vigore' },
  { id: 'mana', name: 'Mana' },
]
</script>

<template>
  <section class="panel">
    <div v-for="bar in bars" :key="bar.id" class="bar" :class="bar.id">
      <span>{{ bar.name }}</span>
      <div
        class="track"
        role="progressbar"
        :aria-label="bar.name"
        aria-valuemin="0"
        :aria-valuemax="BAR_MAX"
        :aria-valuenow="game.player[bar.id]"
      >
        <div class="fill" :style="{ width: `${(game.player[bar.id] / BAR_MAX) * 100}%` }" />
      </div>
      <span :key="game.player[bar.id]" class="value">{{ game.player[bar.id] }}/{{ BAR_MAX }}</span>
    </div>
  </section>
</template>

<style scoped>
.bar {
  display: grid;
  grid-template-columns: 4.5rem 1fr 3rem;
  align-items: center;
  gap: 0.5rem;
}
.track {
  height: 0.6rem;
  border-radius: 1rem;
  background: var(--road);
  overflow: hidden;
}
.fill {
  height: 100%;
  border-radius: inherit;
  background: var(--c);
  transition: width 0.5s cubic-bezier(0.3, 1.4, 0.5, 1);
}
.health { --c: var(--danger); }
.vigor { --c: #c77d1a; }
.mana { --c: #3a6fd8; }
.value { animation: pop 0.35s; }
@keyframes pop {
  40% { transform: scale(1.3); }
}
</style>
