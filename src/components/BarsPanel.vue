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
    <label v-for="bar in bars" :key="bar.id" class="bar" :class="bar.id">
      <span>{{ bar.name }}</span>
      <progress :value="game.player[bar.id]" :max="BAR_MAX" />
      <span>{{ game.player[bar.id] }}/{{ BAR_MAX }}</span>
    </label>
  </section>
</template>

<style scoped>
.bar {
  display: grid;
  grid-template-columns: 4.5rem 1fr 3rem;
  align-items: center;
  gap: 0.5rem;
}
progress { width: 100%; }
.health progress { accent-color: var(--danger); }
.vigor progress { accent-color: #c77d1a; }
.mana progress { accent-color: #3a6fd8; }
</style>
