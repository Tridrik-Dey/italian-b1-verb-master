import { CORE_TENSE_IDS, TENSES } from '@/data/tenses'
import { availableTenses } from '@/lib/conjugation'
import type { TenseId } from '@/types/verb'
import { statKey, type ProgressData, type TenseStat } from './store'

/**
 * MASTERY RULE (documented in the README and in the app's "How progress works" dialog)
 *
 * For every verb + tense we keep the last 10 answers.
 *  - A tense is MASTERED when it has at least 6 answers in that window and
 *    at least 80% of them are correct.
 *  - Tense progress = 100% when mastered, otherwise (correct answers in the window ÷ 6),
 *    capped at 5/6 (83%) until the mastery condition is met.
 *  - Verb progress = average tense progress over the verb's core B1 tenses
 *    (presente, imperfetto, passato prossimo, trapassato prossimo, futuro semplice,
 *    congiuntivo presente, condizionale presente, imperativo where it exists).
 *  - A verb is MASTERED when all of its core tenses are mastered.
 *  - Priority progress = average verb progress in that priority.
 */
export const MASTERY_MIN_ANSWERS = 6
export const MASTERY_MIN_ACCURACY = 0.8

export interface TenseMastery {
  answered: number
  correct: number
  accuracy: number
  mastered: boolean
  progress: number
}

export function tenseMastery(stat: TenseStat | undefined): TenseMastery {
  const recent = stat?.recent ?? ''
  const answered = recent.length
  const correct = [...recent].filter((c) => c === '1').length
  const accuracy = answered ? correct / answered : 0
  const mastered = answered >= MASTERY_MIN_ANSWERS && accuracy >= MASTERY_MIN_ACCURACY
  const progress = mastered ? 1 : Math.min(correct, MASTERY_MIN_ANSWERS - 1) / MASTERY_MIN_ANSWERS
  return { answered, correct, accuracy, mastered, progress }
}

export type VerbStatus = 'new' | 'studied' | 'learning' | 'mastered'

export interface VerbProgress {
  /** 0–1 */
  progress: number
  status: VerbStatus
  coreTenses: TenseId[]
  masteredCore: number
  totalCorrect: number
  totalIncorrect: number
  accuracy: number | null
  lastPracticed: number | null
}

const coreCache = new Map<string, TenseId[]>()
export function coreTensesFor(verb: string): TenseId[] {
  let core = coreCache.get(verb)
  if (!core) {
    core = availableTenses(verb, CORE_TENSE_IDS)
    coreCache.set(verb, core)
  }
  return core
}

export function verbProgress(data: ProgressData, verb: string): VerbProgress {
  const coreTenses = coreTensesFor(verb)
  let sum = 0
  let masteredCore = 0
  for (const t of coreTenses) {
    const m = tenseMastery(data.stats[statKey(verb, t)])
    sum += m.progress
    if (m.mastered) masteredCore++
  }
  let totalCorrect = 0
  let totalIncorrect = 0
  let lastPracticed: number | null = null
  for (const t of TENSES) {
    const s = data.stats[statKey(verb, t.id)]
    if (!s) continue
    totalCorrect += s.correct
    totalIncorrect += s.incorrect
    lastPracticed = Math.max(lastPracticed ?? 0, s.lastPracticed)
  }
  const answered = totalCorrect + totalIncorrect
  const progress = coreTenses.length ? sum / coreTenses.length : 0
  const status: VerbStatus =
    coreTenses.length > 0 && masteredCore === coreTenses.length
      ? 'mastered'
      : answered > 0
        ? 'learning'
        : data.studied[verb]
          ? 'studied'
          : 'new'
  return {
    progress,
    status,
    coreTenses,
    masteredCore,
    totalCorrect,
    totalIncorrect,
    accuracy: answered ? totalCorrect / answered : null,
    lastPracticed,
  }
}

export function groupProgress(data: ProgressData, verbs: string[]): { progress: number; mastered: number; started: number } {
  if (!verbs.length) return { progress: 0, mastered: 0, started: 0 }
  let sum = 0
  let mastered = 0
  let started = 0
  for (const v of verbs) {
    const p = verbProgress(data, v)
    sum += p.progress
    if (p.status === 'mastered') mastered++
    if (p.status !== 'new') started++
  }
  return { progress: sum / verbs.length, mastered, started }
}

export interface AccuracyRow {
  key: string
  correct: number
  incorrect: number
  accuracy: number
}

function aggregate(data: ProgressData, pick: (verb: string, tense: TenseId) => string): AccuracyRow[] {
  const map = new Map<string, { correct: number; incorrect: number }>()
  for (const [key, stat] of Object.entries(data.stats)) {
    const [verb, tense] = key.split('|') as [string, TenseId]
    const k = pick(verb, tense)
    const acc = map.get(k) ?? { correct: 0, incorrect: 0 }
    acc.correct += stat.correct
    acc.incorrect += stat.incorrect
    map.set(k, acc)
  }
  return [...map.entries()].map(([key, v]) => ({ key, ...v, accuracy: v.correct / Math.max(1, v.correct + v.incorrect) }))
}

export const accuracyByVerb = (data: ProgressData) => aggregate(data, (verb) => verb)
export const accuracyByTense = (data: ProgressData) => aggregate(data, (_verb, tense) => tense)

export function overallStats(data: ProgressData) {
  let correct = 0
  let incorrect = 0
  for (const s of Object.values(data.stats)) {
    correct += s.correct
    incorrect += s.incorrect
  }
  const practicedVerbs = new Set(Object.keys(data.stats).map((k) => k.split('|')[0]))
  const practicedTenses = new Set(Object.keys(data.stats).map((k) => k.split('|')[1]))
  return {
    correct,
    incorrect,
    accuracy: correct + incorrect ? correct / (correct + incorrect) : null,
    studiedVerbs: Object.keys(data.studied).length,
    practicedVerbs: practicedVerbs.size,
    practicedTenses: practicedTenses.size,
    attempts: data.attempts.test + data.attempts.mix,
    lastPracticed: data.lastPracticed,
  }
}
