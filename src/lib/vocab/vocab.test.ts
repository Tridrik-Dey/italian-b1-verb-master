import {
  BATCH_BY_ID,
  VOCAB,
  VOCAB_BATCHES,
  allItems,
  batchItems,
  plainText,
  scopeItems,
  type VocabType,
} from '@/data/vocabulary'
import { createRng } from '@/lib/testing/generate'
import { buildVocabQuestion, buildVocabQuiz, normalizeVocab, retryQuestions, uniqueItems, vocabDistractors } from './quiz'
import {
  VOCAB_SCORES_KEY,
  getVocabScores,
  recordVocabScore,
  reloadVocabScoresFromStorage,
  resetVocabScores,
  scoreKey,
} from './scores'

const TYPES: VocabType[] = ['words', 'phrases']

describe('vocabulary data (loaded from the JSON as-is)', () => {
  it('has the five batches with the declared totals', () => {
    expect(VOCAB_BATCHES.map((b) => b.id)).toEqual(['b1', 'b2', 'b3', 'b4', 'b5'])
    expect(allItems('words')).toHaveLength(VOCAB.counts.words)
    expect(allItems('phrases')).toHaveLength(VOCAB.counts.phrases)
    expect(VOCAB.counts).toEqual({ words: 2182, phrases: 1191 })
  })

  it('counts items per batch', () => {
    const counts = VOCAB_BATCHES.map((b) => [batchItems(b, 'words').length, batchItems(b, 'phrases').length])
    expect(counts).toEqual([
      [233, 178],
      [472, 248],
      [524, 292],
      [531, 261],
      [422, 212],
    ])
  })

  it('every item has Italian, English and a unique id, with accents intact', () => {
    const ids = new Set<string>()
    for (const type of TYPES) {
      for (const item of allItems(type)) {
        expect(item.it.trim()).not.toBe('')
        expect(item.en.trim()).not.toBe('')
        expect(ids.has(item.id)).toBe(false)
        ids.add(item.id)
      }
    }
    expect(allItems('phrases').some((p) => p.it === 'Il pranzo è pronto!')).toBe(true)
  })

  it('scopes return sub-batch, batch and whole-type items', () => {
    expect(scopeItems({ kind: 'sub', id: 'b1-s4' }, 'words')).toHaveLength(15)
    expect(scopeItems({ kind: 'sub', id: 'b1-s4' }, 'phrases')).toHaveLength(0)
    expect(scopeItems({ kind: 'batch', id: 'b2' }, 'words')).toHaveLength(472)
    expect(scopeItems({ kind: 'all' }, 'phrases')).toHaveLength(1191)
    expect(scopeItems({ kind: 'sub', id: 'nope' }, 'words')).toEqual([])
  })
})

describe('vocabulary quiz', () => {
  it('every question in every direction has 4 distinct options, one correct, all of the same type', () => {
    const rng = createRng(7)
    for (const type of TYPES) {
      const sameType = new Set(allItems(type).flatMap((i) => [normalizeVocab(i.en), normalizeVocab(i.it)]))
      for (const item of allItems(type)) {
        for (const d of ['it-en', 'en-it'] as const) {
          const q = buildVocabQuestion(item, d, rng)
          expect(q.options).toHaveLength(4)
          const normalized = q.options.map(normalizeVocab)
          expect(new Set(normalized).size).toBe(4)
          expect(q.options.filter((o) => o === q.answer)).toHaveLength(1)
          // Distractors are never the correct text and always come from the same type.
          for (const o of q.options) {
            if (o !== q.answer) expect(normalizeVocab(o)).not.toBe(normalizeVocab(q.answer))
            expect(sameType.has(normalizeVocab(o))).toBe(true)
          }
        }
      }
    }
  })

  it('takes distractors from the same sub-batch first', () => {
    const batch = BATCH_BY_ID.get('b1')!
    const sub = batch.subBatches[0] // 24 words — plenty for 3 distractors
    const subTexts = new Set(sub.words.map((w) => plainText(w.en)))
    const item = batchItems(batch, 'words')[0]
    for (let seed = 0; seed < 20; seed++) {
      for (const d of vocabDistractors(item, 'it-en', createRng(seed))) expect(subTexts.has(d)).toBe(true)
    }
  })

  it('falls back to the batch when the sub-batch has too few items', () => {
    // b1-s4 (kitchen items) has no phrases, so a phrase placed there must get batch-1 phrases.
    const batch = BATCH_BY_ID.get('b1')!
    const phrase = { ...batchItems(batch, 'phrases')[0], subBatchId: 'b1-s4' }
    const batchPhrases = new Set(batchItems(batch, 'phrases').map((i) => i.it))
    for (let seed = 0; seed < 20; seed++) {
      const ds = vocabDistractors(phrase, 'en-it', createRng(seed))
      expect(ds).toHaveLength(3)
      for (const d of ds) expect(batchPhrases.has(d)).toBe(true)
    }
  })

  it('never offers an option whose prompt equals the question prompt (both would be right)', () => {
    // "sometimes" is the English of several Italian phrases (a volte, qualche volta, certe volte…).
    const items = allItems('phrases').filter((i) => normalizeVocab(i.en) === 'sometimes')
    expect(items.length).toBeGreaterThan(1)
    const italians = new Set(items.map((i) => normalizeVocab(i.it)))
    for (let seed = 0; seed < 30; seed++) {
      const q = buildVocabQuestion(items[0], 'en-it', createRng(seed))
      const wrongs = q.options.filter((o) => o !== q.answer)
      for (const w of wrongs) expect(italians.has(normalizeVocab(w))).toBe(false)
    }
  })

  it('honours the question count and direction', () => {
    const items = scopeItems({ kind: 'batch', id: 'b1' }, 'words')
    expect(buildVocabQuiz(items, { direction: 'it-en', count: 10 }, createRng(1))).toHaveLength(10)
    expect(buildVocabQuiz(items, { direction: 'it-en', count: 20 }, createRng(1))).toHaveLength(20)
    const all = buildVocabQuiz(items, { direction: 'en-it', count: 'all' }, createRng(1))
    expect(all).toHaveLength(uniqueItems(items).length)
    expect(all.every((q) => q.direction === 'en-it' && q.prompt === q.item.en)).toBe(true)
    const mixed = buildVocabQuiz(items, { direction: 'mixed', count: 'all' }, createRng(2))
    expect(new Set(mixed.map((q) => q.direction))).toEqual(new Set(['it-en', 'en-it']))
    // A sub-batch smaller than the requested count gives all of its items.
    expect(buildVocabQuiz(scopeItems({ kind: 'sub', id: 'b1-s4' }, 'words'), { direction: 'mixed', count: 20 })).toHaveLength(15)
  })

  it('does not repeat the same Italian–English pair in one test', () => {
    const quiz = buildVocabQuiz(allItems('phrases'), { direction: 'it-en', count: 'all' }, createRng(3))
    const pairs = quiz.map((q) => `${normalizeVocab(q.item.it)}|${normalizeVocab(q.item.en)}`)
    expect(new Set(pairs).size).toBe(pairs.length)
    // "a volte / sometimes" appears in several sub-batches.
    expect(pairs.filter((p) => p === 'a volte|sometimes')).toHaveLength(1)
  })

  it('retry keeps the same items and directions', () => {
    const quiz = buildVocabQuiz(scopeItems({ kind: 'sub', id: 'b1-s1' }, 'words'), { direction: 'mixed', count: 10 }, createRng(4))
    const wrong = quiz.slice(0, 3)
    const retry = retryQuestions(wrong, createRng(5))
    expect(retry.map((q) => q.id).sort()).toEqual(wrong.map((q) => q.id).sort())
  })
})

describe('vocabulary best scores', () => {
  beforeEach(() => {
    resetVocabScores()
    reloadVocabScoresFromStorage()
  })

  it('keeps the best score per scope, separately for words and phrases', () => {
    const sub = { kind: 'sub', id: 'b1-s1' } as const
    expect(recordVocabScore('words', sub, 6, 10)).toBe(true)
    expect(recordVocabScore('words', sub, 5, 10)).toBe(false)
    expect(recordVocabScore('words', sub, 17, 20)).toBe(true)
    expect(recordVocabScore('phrases', sub, 3, 10)).toBe(true)
    expect(recordVocabScore('words', { kind: 'batch', id: 'b1' }, 9, 10)).toBe(true)

    reloadVocabScoresFromStorage() // simulates a page refresh
    const best = getVocabScores().best
    expect(best[scoreKey('words', sub)]).toMatchObject({ correct: 17, total: 20 })
    expect(best[scoreKey('phrases', sub)]).toMatchObject({ correct: 3, total: 10 })
    expect(best['words|batch:b1']).toMatchObject({ correct: 9, total: 10 })
    expect(JSON.parse(localStorage.getItem(VOCAB_SCORES_KEY)!).version).toBe(1)
  })

  it('on an equal percentage, the longer test wins', () => {
    const all = { kind: 'all' } as const
    recordVocabScore('words', all, 8, 10)
    expect(recordVocabScore('words', all, 16, 20)).toBe(true)
    expect(recordVocabScore('words', all, 8, 10)).toBe(false)
  })

  it('ignores corrupted storage', () => {
    localStorage.setItem(VOCAB_SCORES_KEY, '{not json')
    reloadVocabScoresFromStorage()
    expect(getVocabScores().best).toEqual({})
  })
})
