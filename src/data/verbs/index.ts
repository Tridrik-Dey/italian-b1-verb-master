import type { Priority, VerbEntry } from '@/types/verb'
import { ALTA } from './alta'
import { BASSA } from './bassa'
import { ESSENZIALI } from './essenziali'
import { MEDIA } from './media'

/** The full database, in priority order (and frequency order within each priority). */
export const VERBS: VerbEntry[] = [...ESSENZIALI, ...ALTA, ...MEDIA, ...BASSA]

export const VERB_BY_INFINITIVE: ReadonlyMap<string, VerbEntry> = new Map(VERBS.map((v) => [v.infinitive, v]))

export function getVerbEntry(infinitive: string): VerbEntry {
  const entry = VERB_BY_INFINITIVE.get(infinitive)
  if (!entry) throw new Error(`Unknown verb: ${infinitive}`)
  return entry
}

export function verbsByPriority(priority: Priority): VerbEntry[] {
  return VERBS.filter((v) => v.priority === priority)
}

/** Position of a verb in the database: used for the default "frequency" sort. */
export const VERB_ORDER: ReadonlyMap<string, number> = new Map(VERBS.map((v, i) => [v.infinitive, i]))
