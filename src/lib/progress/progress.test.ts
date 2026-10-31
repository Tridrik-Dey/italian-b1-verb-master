import { tenseMastery, verbProgress } from './mastery'
import {
  STORAGE_KEY,
  getProgress,
  markStudied,
  recordAnswer,
  recordAttempt,
  reloadProgressFromStorage,
  resetProgress,
} from './store'

beforeEach(() => {
  resetProgress()
  reloadProgressFromStorage()
})

describe('progress store', () => {
  it('persists answers to localStorage and reloads them', () => {
    recordAnswer('fare', 'ind-presente', true)
    recordAnswer('fare', 'ind-presente', false)
    recordAttempt('test')
    markStudied('fare')
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(raw.stats['fare|ind-presente']).toMatchObject({ correct: 1, incorrect: 1, recent: '10' })

    reloadProgressFromStorage() // simulates a page refresh
    const data = getProgress()
    expect(data.stats['fare|ind-presente'].correct).toBe(1)
    expect(data.attempts.test).toBe(1)
    expect(data.studied.fare).toBeGreaterThan(0)
    expect(data.lastPracticed).toBeGreaterThan(0)
  })

  it('keeps only the last 10 answers for mastery', () => {
    for (let i = 0; i < 15; i++) recordAnswer('fare', 'ind-presente', i >= 5)
    expect(getProgress().stats['fare|ind-presente'].recent).toBe('1111111111')
    expect(getProgress().stats['fare|ind-presente'].correct).toBe(10)
  })

  it('resets everything', () => {
    recordAnswer('fare', 'ind-presente', true)
    resetProgress()
    reloadProgressFromStorage()
    expect(getProgress().stats).toEqual({})
  })

  it('drops saved answers for tenses that are no longer in the app', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        studied: {},
        stats: {
          'fare|ind-not-a-tense': { correct: 3, incorrect: 0, recent: '111', lastPracticed: 1 },
          'fare|ind-presente': { correct: 1, incorrect: 0, recent: '1', lastPracticed: 1 },
        },
        attempts: { test: 1, mix: 0 },
        lastPracticed: 1,
      }),
    )
    reloadProgressFromStorage()
    expect(Object.keys(getProgress().stats)).toEqual(['fare|ind-presente'])
  })

  it('ignores corrupted storage', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    reloadProgressFromStorage()
    expect(getProgress().stats).toEqual({})
  })
})

describe('mastery rule', () => {
  it('is not reached by a single correct answer', () => {
    expect(tenseMastery({ correct: 1, incorrect: 0, recent: '1', lastPracticed: 0 })).toMatchObject({ mastered: false })
  })

  it('needs at least 6 recent answers with ≥80% accuracy', () => {
    expect(tenseMastery({ correct: 5, incorrect: 0, recent: '11111', lastPracticed: 0 }).mastered).toBe(false)
    expect(tenseMastery({ correct: 6, incorrect: 0, recent: '111111', lastPracticed: 0 }).mastered).toBe(true)
    expect(tenseMastery({ correct: 5, incorrect: 1, recent: '011111', lastPracticed: 0 }).mastered).toBe(true)
    expect(tenseMastery({ correct: 7, incorrect: 3, recent: '0101011111', lastPracticed: 0 }).mastered).toBe(false)
  })

  it('caps progress at 5/6 until mastered', () => {
    expect(tenseMastery({ correct: 7, incorrect: 3, recent: '0101011111', lastPracticed: 0 }).progress).toBeCloseTo(5 / 6)
    expect(tenseMastery({ correct: 6, incorrect: 0, recent: '111111', lastPracticed: 0 }).progress).toBe(1)
  })

  it('computes verb progress over core tenses and marks mastery only when all are mastered', () => {
    const core = verbProgress(getProgress(), 'parlare').coreTenses
    expect(core).toHaveLength(8)
    for (let i = 0; i < 6; i++) recordAnswer('parlare', 'ind-presente', true)
    let p = verbProgress(getProgress(), 'parlare')
    expect(p.progress).toBeCloseTo(1 / 8)
    expect(p.status).toBe('learning')
    for (const t of core) for (let i = 0; i < 6; i++) recordAnswer('parlare', t, true)
    p = verbProgress(getProgress(), 'parlare')
    expect(p.status).toBe('mastered')
    expect(p.progress).toBe(1)
  })

  it('potere has 7 core tenses (no imperative)', () => {
    expect(verbProgress(getProgress(), 'potere').coreTenses).toHaveLength(7)
  })
})
