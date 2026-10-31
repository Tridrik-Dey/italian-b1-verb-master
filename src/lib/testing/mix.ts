import type { TenseId } from '@/types/verb'
import type { Question } from './types'

export interface MixAnswer {
  answer: string
  correct: boolean
}

export interface Mistake {
  question: Question
  /** The first wrong answer. */
  answer: string
  /** Answered correctly after "Try again". */
  fixed?: boolean
}

export interface MixSummary {
  total: number
  answered: number
  correct: number
  incorrect: number
  /** Correct ÷ answered (0–1). */
  accuracy: number
  /** Correct without any wrong attempt. */
  firstTry: number
  mistakes: Mistake[]
  byVerb: { verb: string; mistakes: Mistake[] }[]
  byTense: { tense: TenseId; mistakes: Mistake[] }[]
}

function groupBy<K>(mistakes: Mistake[], key: (m: Mistake) => K): Map<K, Mistake[]> {
  const map = new Map<K, Mistake[]>()
  for (const m of mistakes) {
    const k = key(m)
    map.set(k, [...(map.get(k) ?? []), m])
  }
  return map
}

/**
 * `wrongTries` holds wrong answers given before "Try again": a question answered wrongly
 * at any point counts as a mistake, even if it was fixed afterwards.
 */
export function summarizeMix(
  questions: Question[],
  answers: (MixAnswer | undefined)[],
  wrongTries: string[][] = [],
): MixSummary {
  const mistakes: Mistake[] = []
  let correct = 0
  let answered = 0
  let firstTry = 0
  questions.forEach((q, i) => {
    const a = answers[i]
    const wrong = wrongTries[i] ?? []
    if (!a && !wrong.length) return
    if (a) answered++
    if (a?.correct) correct++
    if (a?.correct && !wrong.length) firstTry++
    if (wrong.length) mistakes.push({ question: q, answer: wrong[0], fixed: !!a?.correct })
    else if (a && !a.correct) mistakes.push({ question: q, answer: a.answer })
  })
  const sortByCount = <T extends { mistakes: Mistake[] }>(rows: T[]) => rows.sort((a, b) => b.mistakes.length - a.mistakes.length)
  return {
    total: questions.length,
    answered,
    correct,
    incorrect: answered - correct,
    accuracy: answered ? correct / answered : 0,
    firstTry,
    mistakes,
    byVerb: sortByCount([...groupBy(mistakes, (m) => m.question.verb)].map(([verb, ms]) => ({ verb, mistakes: ms }))),
    byTense: sortByCount([...groupBy(mistakes, (m) => m.question.tense)].map(([tense, ms]) => ({ tense, mistakes: ms }))),
  }
}
