import type { RowKey, TenseId } from '@/types/verb'

export type AnswerMode = 'fill' | 'mcq'

export interface Question {
  /** Stable id: verb|tense|row. */
  id: string
  verb: string
  english: string
  tense: TenseId
  key: RowKey
  /** Person label, e.g. "Lui/Lei" or "Lei (formale)". */
  personLabel: string
  /** All accepted answers (first = primary). */
  accepted: string[]
  /** Correct answer as shown to the learner. */
  display: string
}

export interface McqOption {
  text: string
  correct: boolean
  /** Where a distractor comes from, for a short explanation. */
  source?: { tense: TenseId; key: RowKey }
}
