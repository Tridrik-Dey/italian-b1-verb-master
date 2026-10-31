import {
  BATCH_BY_ID,
  SUB_BATCH_BY_ID,
  allItems,
  batchItems,
  plainText,
  subBatchItems,
  type VocabItem,
} from '@/data/vocabulary'
import { shuffle, type Rng } from '@/lib/testing/generate'

/** It→En shows Italian and asks for English; En→It the other way round; Mixed picks per question. */
export type VocabDirection = 'it-en' | 'en-it' | 'mixed'
export type QuestionDirection = Exclude<VocabDirection, 'mixed'>

export const OPTION_COUNT = 4

export interface VocabQuestion {
  id: string
  item: VocabItem
  direction: QuestionDirection
  prompt: string
  answer: string
  /** Shuffled; exactly one equals `answer`. */
  options: string[]
}

/** Lower-case, no emphasis markers, single spaces, no trailing punctuation — for "is this the same text?". */
export function normalizeVocab(text: string): string {
  return plainText(text)
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[\s.!?…,;:]+$/u, '')
    .trim()
}

const promptOf = (item: VocabItem, d: QuestionDirection) => (d === 'it-en' ? item.it : item.en)
const answerOf = (item: VocabItem, d: QuestionDirection) => (d === 'it-en' ? item.en : item.it)

/** Candidate pools from nearest to widest: same sub-batch, then same batch, then the whole type. */
function distractorPools(item: VocabItem): VocabItem[][] {
  const found = SUB_BATCH_BY_ID.get(item.subBatchId)
  const batch = BATCH_BY_ID.get(item.batchId)
  return [
    found ? subBatchItems(found.batch, found.sub, item.type) : [],
    batch ? batchItems(batch, item.type) : [],
    allItems(item.type),
  ]
}

/**
 * Three wrong options of the same type (words vs words, phrases vs phrases), taken from the same
 * sub-batch first, then the batch, then everything. Never a duplicate, never the correct text, and
 * never an item whose prompt is the same as the question's (it would also be a right answer).
 */
export function vocabDistractors(item: VocabItem, direction: QuestionDirection, rng: Rng = Math.random): string[] {
  const correct = normalizeVocab(answerOf(item, direction))
  const prompt = normalizeVocab(promptOf(item, direction))
  const seen = new Set([correct])
  const out: string[] = []
  for (const pool of distractorPools(item)) {
    for (const candidate of shuffle(pool, rng)) {
      if (out.length === OPTION_COUNT - 1) return out
      const text = plainText(answerOf(candidate, direction))
      const key = normalizeVocab(text)
      if (seen.has(key) || normalizeVocab(promptOf(candidate, direction)) === prompt) continue
      seen.add(key)
      out.push(text)
    }
  }
  return out
}

export function buildVocabQuestion(item: VocabItem, direction: QuestionDirection, rng: Rng = Math.random): VocabQuestion {
  const answer = plainText(answerOf(item, direction))
  return {
    id: `${item.id}|${direction}`,
    item,
    direction,
    prompt: promptOf(item, direction),
    answer,
    options: shuffle([answer, ...vocabDistractors(item, direction, rng)], rng),
  }
}

/** The same Italian–English pair can appear in several sub-batches; ask it only once per test. */
export function uniqueItems(items: VocabItem[]): VocabItem[] {
  const seen = new Set<string>()
  return items.filter((i) => {
    const key = `${normalizeVocab(i.it)}|${normalizeVocab(i.en)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export type QuestionCount = 10 | 20 | 'all'

export interface QuizConfig {
  direction: VocabDirection
  count: QuestionCount
}

export function buildVocabQuiz(items: VocabItem[], config: QuizConfig, rng: Rng = Math.random): VocabQuestion[] {
  const pool = shuffle(uniqueItems(items), rng)
  const chosen = config.count === 'all' ? pool : pool.slice(0, config.count)
  return chosen.map((item) => {
    const d: QuestionDirection = config.direction === 'mixed' ? (rng() < 0.5 ? 'it-en' : 'en-it') : config.direction
    return buildVocabQuestion(item, d, rng)
  })
}

/** "Retry only the wrong ones": same items and directions, fresh order and options. */
export function retryQuestions(wrong: VocabQuestion[], rng: Rng = Math.random): VocabQuestion[] {
  return shuffle(wrong, rng).map((q) => buildVocabQuestion(q.item, q.direction, rng))
}
