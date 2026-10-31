import { useSyncExternalStore } from 'react'
import type { VocabScope, VocabType } from '@/data/vocabulary'

/** Kept apart from the verb progress so vocabulary tests never touch verb mastery. */
export const VOCAB_SCORES_KEY = 'italian-b1-verb-master:vocab-scores:v1'

export interface BestScore {
  correct: number
  total: number
  date: number
}

export interface VocabScores {
  version: 1
  /** Key: `${type}|${scope}` — e.g. "words|sub:b1-s1", "phrases|batch:b2", "words|all". */
  best: Record<string, BestScore>
}

const empty = (): VocabScores => ({ version: 1, best: {} })

export function scoreKey(type: VocabType, scope: VocabScope): string {
  return `${type}|${scope.kind === 'all' ? 'all' : `${scope.kind}:${scope.id}`}`
}

function load(): VocabScores {
  try {
    const raw = localStorage.getItem(VOCAB_SCORES_KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as Partial<VocabScores>
    if (parsed.version !== 1 || typeof parsed.best !== 'object' || !parsed.best) return empty()
    return { version: 1, best: parsed.best }
  } catch {
    return empty()
  }
}

let current: VocabScores | null = null
const listeners = new Set<() => void>()

function persist(next: VocabScores) {
  current = next
  try {
    localStorage.setItem(VOCAB_SCORES_KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable: scores still work for this session.
  }
  listeners.forEach((l) => l())
}

export function getVocabScores(): VocabScores {
  if (!current) current = load()
  return current
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== VOCAB_SCORES_KEY) return
    current = load()
    listeners.forEach((l) => l())
  })
}

/** A score beats another with a higher percentage; on a tie, the longer test wins. */
export function isBetter(a: BestScore, b: BestScore | undefined): boolean {
  if (!b) return true
  const ra = a.correct / a.total
  const rb = b.correct / b.total
  return ra > rb || (ra === rb && a.total > b.total)
}

/** Saves the result if it is the best so far; returns true when it is a new best. */
export function recordVocabScore(type: VocabType, scope: VocabScope, correct: number, total: number, now = Date.now()) {
  if (total <= 0) return false
  const data = getVocabScores()
  const key = scoreKey(type, scope)
  const score = { correct, total, date: now }
  if (!isBetter(score, data.best[key])) return false
  persist({ ...data, best: { ...data.best, [key]: score } })
  return true
}

export function resetVocabScores() {
  persist(empty())
}

/** For tests: forget the in-memory copy so the next read comes from localStorage. */
export function reloadVocabScoresFromStorage() {
  current = null
}

export function useVocabScores(): VocabScores {
  return useSyncExternalStore(subscribe, getVocabScores, getVocabScores)
}
