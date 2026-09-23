import type { ForkDefinition, Item, ItemId } from './types'

export const ITEMS: Record<ItemId, Item> = {
  potion_health: { id: 'potion_health', name: 'Pozione di Salute', effects: { health: 3 } },
  potion_vigor: { id: 'potion_vigor', name: 'Pozione di Vigore', effects: { vigor: 3 } },
  potion_mana: { id: 'potion_mana', name: 'Pozione di Mana', effects: { mana: 3 } },
}

export const FORKS: ForkDefinition[] = [
  {
    id: 'bridge',
    text: 'Un ponte di corda è crollato sul crepaccio.',
    options: [
      { label: 'Salta il crepaccio (−2 Vigore, avanzi di 2)', effects: { vigor: -2, advance: 2 } },
      { label: 'Aggira la gola (nessun effetto)', effects: {} },
    ],
  },
  {
    id: 'spring',
    text: 'Una fonte gorgoglia acqua nera e scintillante.',
    options: [
      { label: 'Bevi dalla fonte (−2 Salute, +3 Mana)', effects: { health: -2, mana: 3 } },
      { label: 'Riempi solo la borraccia (+1 Salute)', effects: { health: 1 } },
    ],
  },
  {
    id: 'merchant',
    text: 'Un mercante incappucciato offre un tonico "corroborante".',
    options: [
      { label: 'Accetta il tonico (−1 Salute, +3 Vigore)', effects: { health: -1, vigor: 3 } },
      { label: 'Rifiuta e prosegui (nessun effetto)', effects: {} },
    ],
  },
  {
    id: 'fog',
    text: 'Una nebbia fitta copre il sentiero.',
    options: [
      { label: 'Taglia per la palude (−1 Salute, avanzi di 3)', effects: { health: -1, advance: 3 } },
      { label: 'Segui la strada lunga (−1 Vigore)', effects: { vigor: -1 } },
    ],
  },
  {
    id: 'shrine',
    text: 'Un piccolo santuario dimenticato sorge tra le rocce.',
    options: [
      { label: 'Prega (+2 Mana, −1 Vigore)', effects: { mana: 2, vigor: -1 } },
      { label: 'Riposa all\'ombra (+2 Vigore, −1 Mana)', effects: { vigor: 2, mana: -1 } },
    ],
  },
  {
    id: 'caravan',
    text: 'Una carovana è bloccata nel fango.',
    options: [
      { label: 'Aiuta a spingere (−2 Vigore, +2 Salute dal ristoro)', effects: { vigor: -2, health: 2 } },
      { label: 'Tira dritto (nessun effetto)', effects: {} },
    ],
  },
]
