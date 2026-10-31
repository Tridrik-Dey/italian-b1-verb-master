import { EXAMPLE_PHRASES } from '@/data/example-phrases'
import { IMPERATIVE_CUES, SENTENCE_CUES, SENTENCE_TENSES } from '@/data/sentence-cues'
import { getTense } from '@/lib/conjugation'
import { clauseParts } from '@/lib/examples'
import type { PersonKey, TenseId } from '@/types/verb'
import { shuffle, type Rng } from './generate'
import type { McqOption } from './types'
import { normalizeAnswer } from './validate'

export interface SentenceQuestion {
  id: string
  verb: string
  tense: TenseId
  key: PersonKey
  /** Italian sentence split around the blank: before + ___ (verb) + after. */
  before: string
  after: string
  /** English translation of the whole sentence. */
  en: string
  /** All accepted answers (target tense first, then tenses the clue also allows). */
  accepted: string[]
  /** The target answer as shown in charts. */
  display: string
  /** Other correct answers, if the clue allows more than one tense. */
  alsoCorrect: { tense: TenseId; display: string }[]
  clue: string
  why: string
}

const PERSONS: PersonKey[] = ['io', 'tu', 'lui', 'noi', 'voi', 'loro']

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const join = (...parts: string[]) => parts.filter(Boolean).join(' ')

function rowFor(verb: string, tense: TenseId, key: PersonKey) {
  return getTense(verb, tense).rows.find((r) => r.key === key)
}

/** Build one sentence, or null when the verb/tense/person combination is not natural. */
export function buildSentence(verb: string, tense: TenseId, key: PersonKey): SentenceQuestion | null {
  const row = rowFor(verb, tense, key)
  if (!row) return null
  const opts = EXAMPLE_PHRASES[verb]?.[3] ?? {}
  // Frames whose time words clash with verbs used only in the 3rd person ("domani … spesso"),
  // and "after X has happened" frames with state verbs, read unnaturally: leave them out.
  if (
    opts.third &&
    !['ind-presente', 'ind-imperfetto', 'ind-passato-prossimo', 'ind-passato-remoto', 'ind-futuro-semplice'].includes(tense)
  ) {
    return null
  }
  if ((opts.stative || opts.invert) && (tense === 'ind-futuro-anteriore' || tense === 'ind-trapassato-remoto')) return null

  if (tense === 'imp-presente') {
    const cue = IMPERATIVE_CUES[key]
    const parts = cue && clauseParts(verb, tense, key)
    if (!cue || !parts) return null
    const [itBefore, itAfter] = cue.it.split('{verb}')
    return {
      id: `${verb}|${tense}|${key}`,
      verb,
      tense,
      key,
      before: itBefore,
      after: join(parts.itComp) ? ` ${parts.itComp}${itAfter}` : itAfter,
      en: cue.en.replace('{verb}', parts.enImperative),
      accepted: row.forms,
      display: row.display,
      alsoCorrect: [],
      clue: cue.clue,
      why: cue.why,
    }
  }

  const cue = SENTENCE_CUES[tense]
  const parts = cue && clauseParts(verb, tense, key, cue.enForm)
  if (!cue || !parts) return null

  const [frameBefore, frameAfter] = cue.it.split('{clause}')
  const before = cap(join(frameBefore.trimEnd(), parts.itSubject)) + ' '
  const after = (parts.itComp ? ` ${parts.itComp}` : '') + frameAfter

  const alsoCorrect = (cue.alsoAccept ?? [])
    .map((t) => ({ tense: t, row: rowFor(verb, t, key) }))
    .filter((x): x is { tense: TenseId; row: NonNullable<typeof x.row> } => !!x.row)

  return {
    id: `${verb}|${tense}|${key}`,
    verb,
    tense,
    key,
    before,
    after,
    en: cap(cue.en.replace('{clause}', parts.enClause)),
    accepted: [...row.forms, ...alsoCorrect.flatMap((x) => x.row.forms)],
    display: row.display,
    alsoCorrect: alsoCorrect.map((x) => ({ tense: x.tense, display: x.row.display })),
    clue: cue.clue,
    why: cue.why,
  }
}

export interface SentenceConfig {
  verbs: string[]
  tenses: TenseId[]
  count: number
}

/** Random sentences without repeats, spread across the selected tenses. */
export function buildSentenceRound(config: SentenceConfig, rng: Rng = Math.random): SentenceQuestion[] {
  const tenses = config.tenses.filter((t) => SENTENCE_TENSES.includes(t))
  const byTense = new Map<TenseId, SentenceQuestion[]>()
  for (const t of tenses) {
    const pool: SentenceQuestion[] = []
    for (const verb of config.verbs) {
      for (const key of PERSONS) {
        const q = buildSentence(verb, t, key)
        if (q) pool.push(q)
      }
    }
    if (pool.length) byTense.set(t, shuffle(pool, rng))
  }
  // Round-robin over the tenses so a round mixes tenses instead of repeating one.
  const out: SentenceQuestion[] = []
  const order = shuffle([...byTense.keys()], rng)
  while (out.length < config.count && order.some((t) => byTense.get(t)!.length)) {
    for (const t of order) {
      const next = byTense.get(t)!.pop()
      if (next && out.length < config.count) out.push(next)
    }
  }
  return shuffle(out, rng)
}

/**
 * MCQ options for a sentence: the same verb and person in other tenses, so the
 * learner has to recognise which tense the clue requires.
 */
export function sentenceOptions(q: SentenceQuestion, rng: Rng = Math.random): McqOption[] {
  const correct = new Set(q.accepted.map(normalizeAnswer))
  const seen = new Set<string>([normalizeAnswer(q.display)])
  const distractors: McqOption[] = []
  for (const t of shuffle(SENTENCE_TENSES, rng)) {
    const row = rowFor(q.verb, t, q.key)
    if (!row || row.forms.some((f) => correct.has(normalizeAnswer(f)))) continue
    const k = normalizeAnswer(row.display)
    if (seen.has(k)) continue
    seen.add(k)
    distractors.push({ text: row.display, correct: false, source: { tense: t, key: q.key } })
    if (distractors.length === 3) break
  }
  return shuffle([{ text: q.display, correct: true }, ...distractors], rng)
}
