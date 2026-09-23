<script setup lang="ts">
import { computed, ref } from 'vue'
import { MAX_SEED, parseSeed } from '../stores/game'

const emit = defineEmits<{ start: [seed?: number] }>()
const input = ref('')
const seed = computed(() => parseSeed(input.value))
</script>

<template>
  <section class="panel setup">
    <h2>Nuova partita</h2>
    <form @submit.prevent="seed !== null && emit('start', seed)">
      <label>
        Seed
        <input v-model="input" inputmode="numeric" placeholder="es. 48213" autofocus />
      </label>
      <button :disabled="seed === null">Gioca questo seed</button>
    </form>
    <p v-if="input && seed === null" class="error">Il seed deve essere un intero tra 0 e {{ MAX_SEED }}.</p>
    <p>oppure</p>
    <button @click="emit('start')">Seed casuale</button>
  </section>
</template>
