<script setup lang="ts">
import { INVENTORY_SIZE, ITEMS } from '../engine'
import { useGameStore } from '../stores/game'

const game = useGameStore()
const effectText = (id: keyof typeof ITEMS) =>
  Object.entries(ITEMS[id].effects)
    .map(([bar, n]) => `+${n} ${{ health: 'Salute', vigor: 'Vigore', mana: 'Mana' }[bar]}`)
    .join(', ')
</script>

<template>
  <section class="panel">
    <h2>Inventario</h2>
    <ul class="slots">
      <li v-for="slot in INVENTORY_SIZE" :key="slot">
        <button
          v-if="game.player.inventory[slot - 1]"
          :disabled="game.player.status !== 'playing'"
          @click="game.useItem(slot - 1)"
        >
          🧪 {{ ITEMS[game.player.inventory[slot - 1]].name }}
          <small>{{ effectText(game.player.inventory[slot - 1]) }}</small>
        </button>
        <span v-else class="empty">vuoto</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
h2 { font-size: 1rem; margin: 0; }
.slots { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; }
.slots button, .empty {
  width: 100%;
  min-height: 3.5rem;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
}
.empty { border: 1px dashed var(--muted); border-radius: 6px; color: var(--muted); }
small { color: var(--muted); }
</style>
