<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { describeEvent } from './eventText'

const game = useGameStore()
// Messages from the latest turn are highlighted; older ones are shown muted.
const turnStart = computed(() => game.player.log.findLastIndex((l) => l.startsWith('Turno ')))
const recentLog = computed(() =>
  game.player.log
    .map((text, i) => ({ text, i, current: i >= turnStart.value, checkpoint: text.startsWith('Checkpoint') }))
    .slice(-8)
    .reverse(),
)
</script>

<template>
  <section class="panel">
    <p class="where">
      Casella {{ game.player.position }} / {{ game.path.length - 1 }} ({{ game.progressPercentage }}%) ·
      {{ describeEvent(game.currentCell!.event) }}
    </p>

    <div v-if="game.choices.length" class="choices">
      <button v-for="c in game.choices" :key="c.id" :disabled="!c.enabled" @click="game.resolveEvent(c.id)">
        {{ c.label }}
      </button>
    </div>
    <div v-else-if="game.player.status === 'playing'" class="roll">
      <button class="primary" @click="game.rollDice()">🎲 Tira il dado</button>
      <span v-if="game.lastRoll">Ultimo tiro: <strong>{{ game.lastRoll }}</strong></span>
    </div>
    <p v-else class="result">{{ game.isVictory ? '🏆 Vittoria!' : '💀 Game over' }}</p>

    <ol class="log" aria-label="Registro eventi">
      <li v-for="line in recentLog" :key="line.i" :class="{ current: line.current, checkpoint: line.checkpoint }">
        <span v-if="line.checkpoint">⛺ </span>{{ line.text }}
      </li>
    </ol>
  </section>
</template>

<style scoped>
.choices { display: grid; gap: 0.4rem; }
.choices button { text-align: left; }
.roll { display: flex; gap: 1rem; align-items: center; }
.result { font-size: 1.3rem; font-weight: bold; }
.log {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  font-size: 0.85rem;
  color: var(--muted);
}
.log .current { color: var(--fg); }
.log .checkpoint { color: var(--good); font-weight: bold; }
</style>
