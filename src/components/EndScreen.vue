<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGameStore } from '../stores/game'

const emit = defineEmits<{ newGame: [] }>()
const game = useGameStore()
const dialog = ref<HTMLDialogElement>()
const copied = ref(false)
const seed = game.seed!

onMounted(() => dialog.value?.showModal())

async function copySeed() {
  try {
    await navigator.clipboard.writeText(String(seed))
    copied.value = true
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <dialog ref="dialog" class="panel end" @cancel.prevent>
    <h2>{{ game.isVictory ? '🏆 Vittoria!' : '💀 Game over' }}</h2>
    <p v-if="game.isVictory">Hai raggiunto il traguardo in {{ game.player.turn }} turni.</p>
    <p v-else>
      Sei caduto alla casella {{ game.player.position }} di {{ game.path.length - 1 }}, dopo {{ game.player.turn }} turni.
    </p>
    <p>
      Salute {{ game.player.health }} · Vigore {{ game.player.vigor }} · Mana {{ game.player.mana }}
    </p>
    <p class="seed">
      Seed <strong>#{{ seed }}</strong>
      <button @click="copySeed">{{ copied ? 'Copiato ✓' : 'Copia' }}</button>
    </p>
    <div class="actions">
      <button class="primary" @click="game.newGame(seed)">Rigioca #{{ seed }}</button>
      <button @click="emit('newGame')">Nuova partita</button>
    </div>
  </dialog>
</template>

<style scoped>
.end { border: none; color: var(--fg); max-width: 340px; text-align: center; }
.end::backdrop { background: rgb(0 0 0 / 0.5); }
h2 { margin: 0; }
p { margin: 0.25rem 0; }
.seed { display: flex; gap: 0.5rem; align-items: center; justify-content: center; }
.actions { display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.5rem; }
</style>
