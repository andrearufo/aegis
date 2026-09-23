<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { describeEvent } from './eventText'
import { useWalker } from './useWalker'

const game = useGameStore()
const { displayPosition, moving } = useWalker()

// Messages from the latest turn are highlighted; while the token walks, its outcome stays hidden.
const turnStart = computed(() => game.player.log.findLastIndex((l) => l.startsWith('Turno ')))
const recentLog = computed(() =>
  game.player.log
    .slice(0, moving.value ? turnStart.value + 1 : undefined)
    .map((text, i) => ({ text, i, current: i >= turnStart.value, checkpoint: text.startsWith('Checkpoint') }))
    .slice(-8)
    .reverse(),
)
const state = computed(() =>
  moving.value ? 'moving' : game.choices.length ? 'choice' : game.player.status === 'playing' ? 'roll' : 'over',
)
</script>

<template>
  <section class="panel">
    <p class="where">
      Casella {{ displayPosition }} / {{ game.path.length - 1 }} ·
      {{ describeEvent(game.path[displayPosition].event) }}
    </p>

    <div class="action">
      <Transition name="fade" mode="out-in">
        <div v-if="state === 'choice'" key="choice" class="choices">
          <button v-for="c in game.choices" :key="c.id" :disabled="!c.enabled" @click="game.resolveEvent(c.id)">
            {{ c.label }}
          </button>
        </div>
        <div v-else-if="state === 'roll' || state === 'moving'" key="roll" class="roll">
          <button class="primary" :disabled="moving" @click="game.rollDice()">🎲 Tira il dado</button>
          <span v-if="game.lastRoll">
            Ultimo tiro: <strong :key="game.player.turn" class="die">{{ game.lastRoll }}</strong>
          </span>
        </div>
        <p v-else key="over" class="result">{{ game.isVictory ? '🏆 Vittoria!' : '💀 Game over' }}</p>
      </Transition>
    </div>

    <TransitionGroup name="log" tag="ol" class="log" aria-label="Registro eventi">
      <li v-for="line in recentLog" :key="line.i" :class="{ current: line.current, checkpoint: line.checkpoint }">
        <span v-if="line.checkpoint">⛺ </span>{{ line.text }}
      </li>
    </TransitionGroup>
  </section>
</template>

<style scoped>
.where { margin: 0; }
.action { min-height: 2.5rem; }
.choices { display: grid; gap: 0.4rem; }
.choices button { text-align: left; }
.roll { display: flex; gap: 1rem; align-items: center; }
.die {
  display: inline-block;
  min-width: 1.6em;
  padding: 0.1em 0.3em;
  border: 2px solid var(--accent);
  border-radius: 6px;
  text-align: center;
  animation: roll 0.45s ease-out;
}
@keyframes roll {
  0% { transform: rotate(-200deg) scale(0.3); opacity: 0; }
  70% { transform: rotate(15deg) scale(1.15); opacity: 1; }
}
.result { font-size: 1.3rem; font-weight: bold; margin: 0; }
.log {
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: var(--muted);
}
.log .current { color: var(--fg); }
.log .checkpoint { color: var(--good); font-weight: bold; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.18s, transform 0.18s; }
.fade-enter-from { opacity: 0; transform: translateY(4px); }
.fade-leave-to { opacity: 0; }
.log-enter-active { transition: opacity 0.3s, transform 0.3s; }
.log-enter-from { opacity: 0; transform: translateX(-8px); }
.log-move { transition: transform 0.3s; }
.log-leave-active { display: none; }
</style>
