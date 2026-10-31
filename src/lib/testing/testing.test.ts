import { TENSES } from '@/data/tenses'
import { VERBS } from '@/data/verbs'
import { buildMixQuestions, createRng, mcqOptions, questionsForTense } from './generate'
import { summarizeMix } from './mix'
import {
  checkFill,
  createSession,
  isComplete,
  resetMode,
  retryIncorrect,
  score,
  selectOption,
  setInput,
} from './session'
import { isCorrect, normalizeAnswer } from './validate'

const q = (verb: string, tense: Parameters<typeof questionsForTense>[1], key: string) =>
  questionsForTense(verb, tense).find((x) => x.key === key)!

describe('answer validation', () => {
  it('normalises case, whitespace and typographic apostrophes', () => {
    expect(normalizeAnswer('  Sono   ANDATO ')).toBe('sono andato')
    expect(normalizeAnswer('fa’')).toBe("fa'")
    expect(isCorrect(q('stare', 'ind-presente', 'io'), ' Sto ')).toBe(true)
  })

  it('does not accept missing or wrong accents', () => {
    const lui = q('essere', 'ind-presente', 'lui')
    expect(isCorrect(lui, 'è')).toBe(true)
    expect(isCorrect(lui, 'e')).toBe(false)
    expect(isCorrect(lui, 'é')).toBe(false)
    expect(isCorrect(q('fare', 'ind-futuro-semplice', 'noi'), 'faremo')).toBe(true)
    expect(isCorrect(q('fare', 'ind-futuro-semplice', 'io'), 'faro')).toBe(false)
    expect(isCorrect(q('dare', 'ind-presente', 'lui'), 'da')).toBe(false)
  })

  it('rejects misspellings and empty answers', () => {
    expect(isCorrect(q('andare', 'ind-presente', 'io'), 'ando')).toBe(false)
    expect(isCorrect(q('andare', 'ind-presente', 'io'), '')).toBe(false)
  })

  it('accepts explicitly supported alternatives', () => {
    expect(isCorrect(q('fare', 'imp-presente', 'tu'), "fa'")).toBe(true)
    expect(isCorrect(q('fare', 'imp-presente', 'tu'), 'fai')).toBe(true)
    expect(isCorrect(q('dovere', 'ind-presente', 'io'), 'debbo')).toBe(true)
    expect(isCorrect(q('dovere', 'cong-presente', 'io'), 'deva')).toBe(true)
    expect(isCorrect(q('vedere', 'ind-passato-prossimo', 'tu'), 'hai veduto')).toBe(true)
    expect(isCorrect(q('finire', 'ind-passato-prossimo', 'lui'), 'è finito')).toBe(true)
    expect(isCorrect(q('sedersi', 'ind-presente', 'io'), 'mi seggo')).toBe(true)
    expect(isCorrect(q('alzarsi', 'prog-presente', 'io'), 'sto alzandomi')).toBe(true)
  })

  it('accepts masculine, feminine and the "/a" display for essere compounds', () => {
    const io = q('andare', 'ind-passato-prossimo', 'io')
    expect(isCorrect(io, 'sono andato')).toBe(true)
    expect(isCorrect(io, 'sono andata')).toBe(true)
    expect(isCorrect(io, 'sono andato/a')).toBe(true)
    expect(isCorrect(io, 'sono andati')).toBe(false)
    expect(isCorrect(io, 'ho andato')).toBe(false)
  })
})

describe('exercise generation', () => {
  it('creates one question per person for finite tenses', () => {
    expect(questionsForTense('stare', 'ind-presente').map((x) => x.key)).toEqual(['io', 'tu', 'lui', 'noi', 'voi', 'loro'])
  })

  it('creates only applicable persons for the imperative', () => {
    const imp = questionsForTense('stare', 'imp-presente')
    expect(imp.map((x) => x.key)).toEqual(['tu', 'lui', 'noi', 'voi', 'loro'])
    expect(imp.map((x) => x.personLabel)).toEqual(['Tu', 'Lei (formale)', 'Noi', 'Voi', 'Loro (formale)'])
    expect(questionsForTense('potere', 'imp-presente')).toHaveLength(0)
  })

  it('creates a single question for non-finite forms', () => {
    const pp = questionsForTense('fare', 'part-passato')
    expect(pp).toHaveLength(1)
    expect(pp[0].personLabel).toBe('Participio passato')
    expect(pp[0].accepted).toEqual(['fatto'])
  })
})

describe('MCQ options', () => {
  it('always gives 4 unique options with exactly one correct answer, for every verb and tense', () => {
    const rng = createRng(42)
    for (const v of VERBS) {
      for (const t of TENSES) {
        for (const question of questionsForTense(v.infinitive, t.id)) {
          const opts = mcqOptions(question, rng)
          const texts = opts.map((o) => normalizeAnswer(o.text))
          expect(opts, question.id).toHaveLength(4)
          expect(new Set(texts).size, `${question.id}: ${texts.join(', ')}`).toBe(4)
          expect(opts.filter((o) => o.correct)).toHaveLength(1)
          // No distractor may be another valid answer (avoids ambiguous questions).
          for (const o of opts.filter((x) => !x.correct)) expect(isCorrect(question, o.text), `${question.id}: ${o.text}`).toBe(false)
        }
      }
    }
  })

  it('uses real conjugations of the same verb as distractors', () => {
    const question = q('fare', 'ind-presente', 'noi')
    const opts = mcqOptions(question, createRng(1))
    const allForms = new Set(TENSES.flatMap((t) => questionsForTense('fare', t.id).map((x) => x.display)))
    for (const o of opts) expect(allForms.has(o.text)).toBe(true)
    // The congiuntivo form "facciamo" is identical to the indicative and must never be offered as wrong.
    expect(opts.filter((o) => o.text === 'facciamo')).toHaveLength(1)
  })
})

describe('mix test generation', () => {
  it('uses only the selected verbs and tenses', () => {
    const verbs = ['fare', 'andare', 'alzarsi']
    const tenses = ['ind-futuro-semplice', 'cong-presente'] as const
    const { questions, poolSize } = buildMixQuestions({ verbs, tenses: [...tenses], count: 30 }, createRng(7))
    expect(poolSize).toBe(36)
    expect(questions).toHaveLength(30)
    for (const x of questions) {
      expect(verbs).toContain(x.verb)
      expect(tenses).toContain(x.tense)
    }
    expect(new Set(questions.map((x) => x.id)).size).toBe(30)
  })

  it('caps the question count at the available pool', () => {
    const { questions } = buildMixQuestions({ verbs: ['stare'], tenses: ['ind-presente'], count: 50 }, createRng(3))
    expect(questions).toHaveLength(6)
  })

  it('summarises mistakes by verb and tense', () => {
    const qs = [q('fare', 'ind-presente', 'io'), q('fare', 'cong-presente', 'tu'), q('andare', 'ind-presente', 'noi')]
    const s = summarizeMix(qs, [
      { answer: 'faccio', correct: true },
      { answer: 'facci', correct: false },
      { answer: 'andamo', correct: false },
    ])
    expect(s.correct).toBe(1)
    expect(s.incorrect).toBe(2)
    expect(s.accuracy).toBeCloseTo(1 / 3)
    expect(s.byVerb.map((g) => [g.verb, g.mistakes.length])).toEqual([
      ['fare', 1],
      ['andare', 1],
    ])
    expect(s.byTense.map((g) => g.tense).sort()).toEqual(['cong-presente', 'ind-presente'])
  })

  it('counts a question fixed with "Try again" as a mistake, but not as first-time right', () => {
    const qs = [q('fare', 'ind-presente', 'io'), q('fare', 'ind-presente', 'tu')]
    const s = summarizeMix(qs, [{ answer: 'faccio', correct: true }, { answer: 'fai', correct: true }], [[], ['fa']])
    expect(s.correct).toBe(2)
    expect(s.firstTry).toBe(1)
    expect(s.mistakes).toHaveLength(1)
    expect(s.mistakes[0]).toMatchObject({ answer: 'fa', fixed: true })
  })
})

describe('test session state', () => {
  const questions = questionsForTense('stare', 'ind-presente')
  const options = Object.fromEntries(questions.map((x) => [x.id, mcqOptions(x, createRng(5))]))

  it('grades fill answers and reveals the correct form for wrong ones', () => {
    let s = createSession(questions, options)
    s = setInput(s, questions[0].id, 'sto')
    s = setInput(s, questions[1].id, 'stai')
    s = setInput(s, questions[2].id, 'stà')
    const { state, events } = checkFill(s)
    expect(events.map((e) => e.correct)).toEqual([true, true, false])
    expect(state.modes.fill[questions[2].id]).toMatchObject({ status: 'incorrect', answer: 'stà' })
    expect(questions[2].display).toBe('sta')
    expect(score(state, 'fill')).toMatchObject({ correct: 2, incorrect: 1, total: 6, percent: 33 })
  })

  it('locks graded answers and lets incorrect ones be retried', () => {
    let s = createSession(questions, options)
    s = setInput(s, questions[0].id, 'stao')
    s = checkFill(s).state
    expect(setInput(s, questions[0].id, 'sto')).toBe(s) // locked until retry
    s = retryIncorrect(s, 'fill')
    expect(s.modes.fill[questions[0].id]).toMatchObject({ status: 'pending', input: '', previousAnswer: 'stao' })
    s = setInput(s, questions[0].id, 'sto')
    s = checkFill(s).state
    expect(s.modes.fill[questions[0].id].status).toBe('correct')
  })

  it('grades MCQ selections immediately and ignores a second click', () => {
    let s = createSession(questions, options)
    const wrong = options[questions[0].id].find((o) => !o.correct)!
    const t = selectOption(s, questions[0].id, wrong.text)
    expect(t.events).toEqual([{ question: questions[0], correct: false }])
    s = t.state
    const right = options[questions[0].id].find((o) => o.correct)!
    expect(selectOption(s, questions[0].id, right.text).events).toHaveLength(0)
  })

  it('keeps fill and MCQ state independent when switching modes', () => {
    let s = createSession(questions, options)
    s = setInput(s, questions[0].id, 'sto')
    s = checkFill(s).state
    const right = options[questions[1].id].find((o) => o.correct)!
    s = selectOption(s, questions[1].id, right.text).state
    expect(score(s, 'fill')).toMatchObject({ correct: 1, answered: 1 })
    expect(score(s, 'mcq')).toMatchObject({ correct: 1, answered: 1 })
    expect(s.modes.fill[questions[1].id].status).toBe('pending')
    expect(s.modes.mcq[questions[0].id].status).toBe('pending')
    // Resetting one mode leaves the other untouched.
    s = resetMode(s, 'mcq')
    expect(score(s, 'mcq').answered).toBe(0)
    expect(score(s, 'fill').correct).toBe(1)
  })

  it('reports completion once every item is graded', () => {
    let s = createSession(questions, options)
    for (const x of questions) s = setInput(s, x.id, x.accepted[0])
    s = checkFill(s).state
    expect(isComplete(s, 'fill')).toBe(true)
    expect(score(s, 'fill').percent).toBe(100)
  })
})
