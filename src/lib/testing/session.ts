import type { AnswerMode, McqOption, Question } from './types'
import { isCorrect } from './validate'

export type ItemStatus = 'pending' | 'correct' | 'incorrect'

export interface ItemState {
  /** Current text in the input (fill mode). */
  input: string
  status: ItemStatus
  /** The learner's last graded answer, kept for comparison with the correct form. */
  answer?: string
  /** Wrong answer from a previous round, shown after "Retry incorrect". */
  previousAnswer?: string
  attempts: number
}

/** Each answer mode keeps independent state, so switching modes never mixes answers. */
export interface SessionState {
  questions: Question[]
  options: Record<string, McqOption[]>
  modes: Record<AnswerMode, Record<string, ItemState>>
  /** Whether a completed attempt has already been counted for each mode. */
  attemptRecorded: Record<AnswerMode, boolean>
}

export interface AnswerEvent {
  question: Question
  correct: boolean
}

export interface Transition {
  state: SessionState
  events: AnswerEvent[]
}

const emptyItem = (): ItemState => ({ input: '', status: 'pending', attempts: 0 })

function freshMode(questions: Question[]): Record<string, ItemState> {
  return Object.fromEntries(questions.map((q) => [q.id, emptyItem()]))
}

export function createSession(questions: Question[], options: Record<string, McqOption[]>): SessionState {
  return {
    questions,
    options,
    modes: { fill: freshMode(questions), mcq: freshMode(questions) },
    attemptRecorded: { fill: false, mcq: false },
  }
}

function updateItem(state: SessionState, mode: AnswerMode, id: string, patch: Partial<ItemState>): SessionState {
  return {
    ...state,
    modes: { ...state.modes, [mode]: { ...state.modes[mode], [id]: { ...state.modes[mode][id], ...patch } } },
  }
}

export function setInput(state: SessionState, id: string, value: string): SessionState {
  const item = state.modes.fill[id]
  // Graded answers are locked; use retryItem / retryIncorrect to try again.
  if (!item || item.status !== 'pending') return state
  return updateItem(state, 'fill', id, { input: value })
}

/** Re-open a single wrong answer. */
export function retryItem(state: SessionState, mode: AnswerMode, id: string): SessionState {
  const item = state.modes[mode][id]
  if (!item || item.status !== 'incorrect') return state
  return updateItem(state, mode, id, { status: 'pending', input: '', answer: undefined, previousAnswer: item.answer })
}

/** Grade fill-in answers: one item, or every pending item that has text. */
export function checkFill(state: SessionState, id?: string): Transition {
  const events: AnswerEvent[] = []
  let next = state
  for (const q of state.questions) {
    if (id && q.id !== id) continue
    const item = next.modes.fill[q.id]
    if (item.status !== 'pending' || !item.input.trim()) continue
    const correct = isCorrect(q, item.input)
    events.push({ question: q, correct })
    next = updateItem(next, 'fill', q.id, {
      status: correct ? 'correct' : 'incorrect',
      answer: item.input,
      attempts: item.attempts + 1,
    })
  }
  return { state: next, events }
}

/** MCQ answers are graded immediately on selection; an answered item is locked. */
export function selectOption(state: SessionState, id: string, optionText: string): Transition {
  const q = state.questions.find((x) => x.id === id)
  const item = state.modes.mcq[id]
  if (!q || !item || item.status !== 'pending') return { state, events: [] }
  const option = state.options[id]?.find((o) => o.text === optionText)
  if (!option) return { state, events: [] }
  const next = updateItem(state, 'mcq', id, {
    status: option.correct ? 'correct' : 'incorrect',
    answer: optionText,
    attempts: item.attempts + 1,
  })
  return { state: next, events: [{ question: q, correct: option.correct }] }
}

/** Clear wrong answers so they can be tried again; correct answers stay. */
export function retryIncorrect(state: SessionState, mode: AnswerMode): SessionState {
  return state.questions.reduce((next, q) => retryItem(next, mode, q.id), state)
}

export function resetMode(state: SessionState, mode: AnswerMode, options?: Record<string, McqOption[]>): SessionState {
  return {
    ...state,
    options: options ?? state.options,
    modes: { ...state.modes, [mode]: freshMode(state.questions) },
    attemptRecorded: { ...state.attemptRecorded, [mode]: false },
  }
}

export function markAttemptRecorded(state: SessionState, mode: AnswerMode): SessionState {
  return { ...state, attemptRecorded: { ...state.attemptRecorded, [mode]: true } }
}

export interface Score {
  correct: number
  incorrect: number
  answered: number
  total: number
  percent: number
}

export function score(state: SessionState, mode: AnswerMode): Score {
  const items = state.questions.map((q) => state.modes[mode][q.id])
  const correct = items.filter((i) => i.status === 'correct').length
  const incorrect = items.filter((i) => i.status === 'incorrect').length
  const total = items.length
  return {
    correct,
    incorrect,
    answered: correct + incorrect,
    total,
    percent: total ? Math.round((correct / total) * 100) : 0,
  }
}

/** True once every item in the mode has been graded at least once. */
export function isComplete(state: SessionState, mode: AnswerMode): boolean {
  return state.questions.every((q) => state.modes[mode][q.id].attempts > 0)
}
