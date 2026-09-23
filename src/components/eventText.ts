import { FORKS, ITEMS, type EventDefinition, type EventType } from '../engine'

export const EVENT_ICONS: Record<EventType, string> = {
  start: '🚩',
  end: '🏁',
  empty: '',
  checkpoint: '⛺',
  combat: '⚔️',
  trap: '🪤',
  recovery: '✚',
  loot: '🧪',
  fork: '⑂',
}

export function describeEvent(event: EventDefinition): string {
  switch (event.type) {
    case 'start': return 'Punto di partenza.'
    case 'end': return 'Il traguardo!'
    case 'empty': return 'Sentiero tranquillo, nulla da segnalare.'
    case 'checkpoint': return 'Checkpoint: un accampamento sicuro.'
    case 'combat': return `Scontro, Difficoltà ${event.difficulty}.`
    case 'trap': return `Trappola, Difficoltà ${event.difficulty}.`
    case 'recovery': return `Radura: recupera ${event.amount} punti in una barra.`
    case 'loot': return `Oggetto: ${ITEMS[event.item].name}.`
    case 'fork': return FORKS.find((f) => f.id === event.forkId)!.text
  }
}
