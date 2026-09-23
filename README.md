# Aegis

Gioco solitario a griglia in Vue 3: percorri un cammino generato proceduralmente da un seed, tirando un d3 e gestendo Salute, Vigore e Mana.

**Gioca:** https://andrearufo.github.io/aegis/

## Sviluppo

```bash
npm install
npm run dev      # server di sviluppo
npm test         # test Vitest
npm run build    # build di produzione in dist/
```

## Struttura

- `src/engine/` — motore puro, senza Vue: PRNG seedabile (mulberry32), generatore del percorso, assegnazione eventi, difficoltà, regole del turno, simulatore (`playabilityCheck`).
- `src/stores/game.ts` — store Pinia della partita.
- `src/components/` — UI.

Stesso seed → stesso percorso, stessi eventi e stessi tiri di dado.

## Licenza

GPL-3.0, vedi [LICENSE](LICENSE).
