import { getVerbEntry } from '@/data/verbs'
import type { TenseConjugation, TenseId, VerbInfo } from '@/types/verb'
import { createEngine } from './engine'

const engine = createEngine(getVerbEntry)

/** Full, cached conjugation data for a verb in the database. */
export function getVerb(infinitive: string): VerbInfo {
  return engine.getVerbInfo(infinitive)
}

export function getTense(infinitive: string, tense: TenseId): TenseConjugation {
  return engine.getVerbInfo(infinitive).conjugations[tense]
}

/** Tenses that have at least one form for this verb (e.g. potere has no imperative). */
export function availableTenses(infinitive: string, tenses: readonly TenseId[]): TenseId[] {
  return tenses.filter((t) => getTense(infinitive, t).rows.length > 0)
}

export { createEngine } from './engine'
export { joinAre, baseInfinitive, isReflexiveInfinitive } from './simple'
