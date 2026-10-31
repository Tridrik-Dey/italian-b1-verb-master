import type { Question } from './types'

/**
 * Normalise an answer for comparison: Unicode NFC, lowercase, typographic
 * apostrophes → ', collapsed whitespace and no surrounding punctuation.
 * Accents and spelling are preserved, so "e" never matches "è".
 */
export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFC')
    .toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.!?,;:]+|[.!?,;:]+$/g, '')
    .trim()
}

/** Accepted answers, plus the display form itself (e.g. "sono andato/a"). */
export function acceptedSet(question: Pick<Question, 'accepted' | 'display'>): Set<string> {
  return new Set([...question.accepted, question.display].map(normalizeAnswer))
}

export function isCorrect(question: Pick<Question, 'accepted' | 'display'>, answer: string): boolean {
  const normalized = normalizeAnswer(answer)
  if (!normalized) return false
  return acceptedSet(question).has(normalized)
}
