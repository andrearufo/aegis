<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { EVENT_ICONS, describeEvent } from './eventText'
import { STEP_MS, useWalker } from './useWalker'

const game = useGameStore()
const { displayPosition } = useWalker()
const w = computed(() => game.run!.config.width)
const h = computed(() => game.run!.config.height)
const points = computed(() => game.path.map((c) => `${c.x + 0.5},${c.y + 0.5}`).join(' '))
const length = computed(() => game.path.length - 1)
const token = computed(() => game.path[displayPosition.value])
const at = (x: number, y: number) => ({ left: `${((x + 0.5) / w.value) * 100}%`, top: `${((y + 0.5) / h.value) * 100}%` })
</script>

<template>
  <div class="board" :style="{ aspectRatio: `${w} / ${h}`, '--w': w, '--step': `${STEP_MS}ms` }">
    <svg :viewBox="`0 0 ${w} ${h}`" aria-hidden="true">
      <polyline :points="points" class="road-edge" />
      <polyline :points="points" class="road" />
      <polyline
        :points="points"
        class="trail"
        :style="{ strokeDasharray: `${length} ${length}`, strokeDashoffset: length - displayPosition }"
      />
    </svg>

    <template v-for="step in game.path" :key="step.index">
      <div
        v-if="step.event.type !== 'empty'"
        class="stop"
        :class="[step.event.type, { visited: step.index < displayPosition }]"
        :style="at(step.x, step.y)"
        :title="`#${step.index} · ${describeEvent(step.event)}`"
      >
        {{ step.event.type === 'checkpoint' && step.index < displayPosition ? '✅' : EVENT_ICONS[step.event.type] }}
        <span v-if="'difficulty' in step.event" class="diff">{{ step.event.difficulty }}</span>
      </div>
    </template>

    <div class="token" :style="at(token.x, token.y)" :title="`Sei alla casella ${displayPosition}`">🧙</div>
  </div>
</template>

<style scoped>
.board {
  --cell: calc(100cqw / var(--w));
  position: relative;
  width: min(100%, 520px);
  container-type: inline-size;
  border-radius: 10px;
  background: var(--panel);
  background-image: radial-gradient(var(--dot) 1px, transparent 1.5px);
  background-size: var(--cell) var(--cell);
  background-position: calc(var(--cell) / 2 - 1px) calc(var(--cell) / 2 - 1px);
}
svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
polyline {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.road-edge { stroke: var(--road-edge); stroke-width: 0.66; }
.road { stroke: var(--road); stroke-width: 0.54; }
.trail {
  stroke: var(--accent);
  stroke-opacity: 0.45;
  stroke-width: 0.22;
  transition: stroke-dashoffset var(--step) linear;
}
.stop, .token {
  position: absolute;
  translate: -50% -50%;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: calc(var(--cell) * 0.42);
  line-height: 1;
}
.stop {
  width: calc(var(--cell) * 0.7);
  aspect-ratio: 1;
  background: var(--panel);
  border: 2px solid var(--road-edge);
  box-sizing: border-box;
  transition: opacity 0.4s;
}
.stop.visited { opacity: 0.35; }
.stop.combat, .stop.trap { border-color: var(--danger); }
.stop.recovery, .stop.loot, .stop.checkpoint { border-color: var(--good); }
.stop.end { border-color: var(--accent); }
.diff {
  position: absolute;
  right: -18%;
  bottom: -18%;
  min-width: 1.3em;
  padding: 0.1em;
  border-radius: 1em;
  background: var(--danger);
  color: #fff;
  font-size: 0.5em;
  font-weight: bold;
  text-align: center;
}
.token {
  z-index: 1;
  width: calc(var(--cell) * 0.86);
  aspect-ratio: 1;
  background: var(--panel);
  border: 3px solid var(--accent);
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.35);
  font-size: calc(var(--cell) * 0.5);
  transition: left var(--step) ease-in-out, top var(--step) ease-in-out;
}
</style>
