import type { Priority, TenseId } from '@/types/verb'

export const testUrl = (verb: string, tense: TenseId) => `/test?verb=${encodeURIComponent(verb)}&tense=${tense}`

export const learnVerbUrl = (priority: Priority, verb: string, tense?: TenseId) =>
  `/learn/${priority}/${encodeURIComponent(verb)}${tense ? `?tense=${tense}` : ''}`
