import { SENTENCE_CUES, SENTENCE_TENSES } from '@/data/sentence-cues'
import { VERBS } from '@/data/verbs'
import { getTense } from '@/lib/conjugation'
import { createRng } from './generate'
import { buildSentence, buildSentenceRound, sentenceOptions } from './sentences'
import { isCorrect, normalizeAnswer } from './validate'

const PERSONS = ['io', 'tu', 'lui', 'noi', 'voi', 'loro'] as const

describe('sentence practice', () => {
  it('builds sentences with the verb in brackets and the tense clue in the sentence', () => {
    const q = buildSentence('andare', 'ind-passato-prossimo', 'io')!
    expect(`${q.before}___${q.after}`).toBe('Ieri io ___ al mare.')
    expect(q.en).toBe('Yesterday I went to the seaside.')
    expect(isCorrect(q, 'sono andato')).toBe(true)
    expect(isCorrect(q, 'sono andata')).toBe(true)
    expect(isCorrect(q, 'vado')).toBe(false)
    expect(isCorrect(q, 'andavo')).toBe(false)
    expect(q.clue).toBe('Ieri')
  })

  it('places the blank correctly for reflexive verbs and imperatives', () => {
    const r = buildSentence('alzarsi', 'cong-presente', 'lui')!
    expect(`${r.before}___${r.after}`).toBe('Marco spera che domani lui ___ presto.')
    expect(r.accepted[0]).toBe('si alzi')
    const imp = buildSentence('andare', 'imp-presente', 'voi')!
    expect(`${imp.before}___${imp.after}`).toBe('Ragazzi, ___ al mare, per favore!')
    expect(imp.accepted).toEqual(['andate'])
    expect(buildSentence('andare', 'imp-presente', 'lui')!.accepted).toEqual(['vada'])
  })

  it('accepts both answers where the clue allows two tenses', () => {
    const q = buildSentence('andare', 'prog-presente', 'io')!
    expect(isCorrect(q, 'sto andando')).toBe(true)
    expect(isCorrect(q, 'vado')).toBe(true)
    expect(q.alsoCorrect).toEqual([{ tense: 'ind-presente', display: 'vado' }])
  })

  it('every generated sentence contains its clue and accepts exactly the chart forms', () => {
    let count = 0
    for (const v of VERBS) {
      for (const t of SENTENCE_TENSES) {
        for (const key of PERSONS) {
          const q = buildSentence(v.infinitive, t, key)
          if (!q) continue
          count++
          const row = getTense(v.infinitive, t).rows.find((r) => r.key === key)!
          expect(q.accepted.slice(0, row.forms.length)).toEqual(row.forms)
          expect(q.before.length + q.after.length).toBeGreaterThan(0)
          expect(q.en).not.toMatch(/\{|undefined|\s{2}/)
          if (t !== 'imp-presente') {
            const firstClueWord = SENTENCE_CUES[t]!.it.split(/[ ,{]/)[0]
            expect(q.before, `${q.id}`).toContain(firstClueWord)
          }
        }
      }
    }
    expect(count).toBeGreaterThan(12000)
  })

  it('a round uses only the chosen verbs and tenses, without repeats, mixing tenses', () => {
    const round = buildSentenceRound(
      { verbs: ['fare', 'andare'], tenses: ['ind-presente', 'ind-futuro-semplice', 'cond-presente'], count: 10 },
      createRng(4),
    )
    expect(round).toHaveLength(10)
    expect(new Set(round.map((q) => q.id)).size).toBe(10)
    for (const q of round) {
      expect(['fare', 'andare']).toContain(q.verb)
      expect(['ind-presente', 'ind-futuro-semplice', 'cond-presente']).toContain(q.tense)
    }
    expect(new Set(round.map((q) => q.tense)).size).toBe(3)
  })

  it('MCQ options are the same verb and person in other tenses, with exactly one correct answer', () => {
    const rng = createRng(9)
    for (const v of ['essere', 'andare', 'alzarsi', 'fare', 'capire']) {
      for (const t of SENTENCE_TENSES) {
        for (const key of PERSONS) {
          const q = buildSentence(v, t, key)
          if (!q) continue
          const opts = sentenceOptions(q, rng)
          expect(opts).toHaveLength(4)
          expect(new Set(opts.map((o) => normalizeAnswer(o.text))).size).toBe(4)
          expect(opts.filter((o) => o.correct)).toHaveLength(1)
          for (const o of opts.filter((x) => !x.correct)) {
            expect(isCorrect(q, o.text), `${q.id}: ${o.text}`).toBe(false)
            expect(o.source?.key).toBe(key)
          }
        }
      }
    }
  })
})
