import { TENSE_BY_ID, TENSES, rowLabel } from '@/data/tenses'
import { getVerb } from '@/lib/conjugation'
import type { ConjugationRow, TenseId, TenseKind } from '@/types/verb'
import type { McqOption, Question } from './types'
import { acceptedSet, normalizeAnswer } from './validate'

export type Rng = () => number

/** Small deterministic PRNG so tests (and "retry") can be reproducible. */
export function createRng(seed: number = Date.now()): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function toQuestion(verb: string, english: string, tense: TenseId, row: ConjugationRow): Question {
  return {
    id: `${verb}|${tense}|${row.key}`,
    verb,
    english,
    tense,
    key: row.key,
    personLabel: rowLabel(tense, row.key),
    accepted: row.forms,
    display: row.display,
  }
}

/** One exercise for the Test tab: every applicable person of one verb in one tense. */
export function questionsForTense(verb: string, tense: TenseId): Question[] {
  const info = getVerb(verb)
  return info.conjugations[tense].rows.map((row) => toQuestion(verb, info.entry.english, tense, row))
}

export interface MixConfig {
  verbs: string[]
  tenses: TenseId[]
  count: number
}

export interface MixResult {
  questions: Question[]
  /** Number of distinct verb–tense–person combinations available. */
  poolSize: number
}

/** Random questions drawn only from the selected verbs and tenses, without repeats. */
export function buildMixQuestions(config: MixConfig, rng: Rng = Math.random): MixResult {
  const pool: Question[] = []
  for (const verb of config.verbs) {
    for (const tense of config.tenses) pool.push(...questionsForTense(verb, tense))
  }
  const count = Math.max(0, Math.min(config.count, pool.length))
  return { questions: shuffle(pool, rng).slice(0, count), poolSize: pool.length }
}

const KIND_FAMILY: Record<TenseKind, string> = {
  simple: 'finite',
  imperative: 'finite',
  compound: 'compound',
  progressive: 'compound',
  nonfinite: 'nonfinite',
}

/**
 * Four options: the correct answer plus three distractors that are real forms of
 * the same verb (other persons of the same tense first, then the same person in
 * other tenses). Any form that would also be a correct answer is excluded.
 */
export function mcqOptions(question: Question, rng: Rng = Math.random, total = 4): McqOption[] {
  const info = getVerb(question.verb)
  const correctSet = acceptedSet(question)
  const seen = new Set<string>([normalizeAnswer(question.display)])
  const family = KIND_FAMILY[TENSE_BY_ID[question.tense].kind]

  const tiers: McqOption[][] = [[], [], [], []]
  for (const t of TENSES) {
    for (const row of info.conjugations[t.id].rows) {
      if (t.id === question.tense && row.key === question.key) continue
      if (row.forms.some((f) => correctSet.has(normalizeAnswer(f)))) continue
      const option: McqOption = { text: row.display, correct: false, source: { tense: t.id, key: row.key } }
      if (t.id === question.tense) tiers[0].push(option)
      else if (row.key === question.key && KIND_FAMILY[t.kind] === family) tiers[1].push(option)
      else if (KIND_FAMILY[t.kind] === family) tiers[2].push(option)
      else tiers[3].push(option)
    }
  }

  const picked: McqOption[] = []
  const take = (candidates: McqOption[], max: number) => {
    for (const c of shuffle(candidates, rng)) {
      if (picked.length >= total - 1 || max <= 0) return
      const key = normalizeAnswer(c.text)
      if (seen.has(key)) continue
      seen.add(key)
      picked.push(c)
      max--
    }
  }
  take(tiers[0], 2)
  take(tiers[1], total)
  take(tiers[0], total)
  take(tiers[2], total)
  take(tiers[3], total)

  return shuffle([{ text: question.display, correct: true }, ...picked], rng)
}
