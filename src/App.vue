<script setup lang="ts">
import { ref } from 'vue'
import BarsPanel from './components/BarsPanel.vue'
import EndScreen from './components/EndScreen.vue'
import EventPanel from './components/EventPanel.vue'
import InventoryPanel from './components/InventoryPanel.vue'
import PathGrid from './components/PathGrid.vue'
import SeedSetup from './components/SeedSetup.vue'
import { useGameStore } from './stores/game'
import { useWalker } from './components/useWalker'

const game = useGameStore()
const { moving } = useWalker()
const setup = ref(true)

function start(seed?: number) {
  game.newGame(seed)
  setup.value = false
}
</script>

<template>
  <header>
    <h1>Aegis</h1>
    <template v-if="!setup">
      <span class="seed">Seed <strong>#{{ game.seed }}</strong></span>
      <button @click="setup = true">Nuova partita</button>
    </template>
  </header>

  <SeedSetup v-if="setup" @start="start" />
  <main v-else class="game">
    <PathGrid />
    <div class="side">
      <BarsPanel />
      <EventPanel />
      <InventoryPanel />
    </div>
    <EndScreen v-if="(game.isVictory || game.isGameOver) && !moving" @new-game="setup = true" />
  </main>
</template>

<style>
:root {
  --bg: #f6f3ec;
  --fg: #222;
  --muted: #6b6b6b;
  --panel: #fff;
  --road: #e6dcc3;
  --road-edge: #cbbb92;
  --dot: #d9d2c2;
  --accent: #7a4fd6;
  --danger: #c43d3d;
  --good: #2f8f4e;
  color-scheme: light dark;
  font-family: system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1b1a18;
    --fg: #eee;
    --muted: #9a9a9a;
    --panel: #262522;
    --road: #3f3829;
    --road-edge: #5a4f37;
    --dot: #34322d;
    --good: #5cc27f;
  }
}
body { margin: 0; background: var(--bg); color: var(--fg); }
#app { max-width: 1000px; margin: 0 auto; padding: 1rem; }
header { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
header h1 { margin: 0; margin-right: auto; }
.panel { background: var(--panel); border-radius: 8px; padding: 1rem; display: grid; gap: 0.5rem; }
.game { display: grid; grid-template-columns: minmax(0, 520px) 1fr; gap: 1rem; margin-top: 1rem; align-items: start; }
.side { display: grid; gap: 1rem; }
@media (max-width: 760px) { .game { grid-template-columns: 1fr; } }
button { font: inherit; padding: 0.45rem 0.8rem; border-radius: 6px; border: 1px solid var(--muted); background: var(--panel); color: var(--fg); cursor: pointer; }
button:disabled { opacity: 0.4; cursor: not-allowed; }
button.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.setup { max-width: 360px; margin: 2rem auto; text-align: center; }
.setup form { display: grid; gap: 0.5rem; }
.setup input { font: inherit; padding: 0.4rem; width: 100%; box-sizing: border-box; }
.error { color: var(--danger); font-size: 0.85rem; }
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
</style>
