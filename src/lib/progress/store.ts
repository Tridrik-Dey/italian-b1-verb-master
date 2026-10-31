import { isTenseId } from '@/data/tenses'
import type { TenseId } from '@/types/verb'

export const STORAGE_KEY = 'italian-b1-verb-master:progress:v1'

/** How many recent answers per verb+tense are kept for the mastery rule. */
export const RECENT_WINDOW = 10

export interface TenseStat {
  correct: number
  incorrect: number
  /** Most recent answers, oldest first: "1" = correct, "0" = incorrect. */
  recent: string
  lastPracticed: number
}

export interface ProgressData {
  version: 1
  /** Verbs opened in the Learn tab → last viewed timestamp. */
  studied: Record<string, number>
  /** Key: `${verb}|${tense}`. */
  stats: Record<string, TenseStat>
  attempts: { test: number; mix: number }
  lastPracticed: number | null
}

export function emptyProgress(): ProgressData {
  return { version: 1, studied: {}, stats: {}, attempts: { test: 0, mix: 0 }, lastPracticed: null }
}

export const statKey = (verb: string, tense: TenseId) => `${verb}|${tense}`

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as Partial<ProgressData>
    if (parsed.version !== 1) return emptyProgress()
    // Drop answers for tenses no longer in the app (e.g. saved before the B1-only change).
    const stats = Object.fromEntries(Object.entries(parsed.stats ?? {}).filter(([key]) => isTenseId(key.split('|')[1])))
    return { ...emptyProgress(), ...parsed, stats, attempts: { ...emptyProgress().attempts, ...parsed.attempts } }
  } catch {
    return emptyProgress()
  }
}

let current: ProgressData | null = null
const listeners = new Set<() => void>()

function persist(next: ProgressData) {
  current = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable (private mode / quota): progress still works for this session.
  }
  listeners.forEach((l) => l())
}

export function getProgress(): ProgressData {
  if (!current) current = load()
  return current
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== 'undefined') {
  // Keep several open tabs in sync.
  window.addEventListener('storage', (e) => {
    if (e.key !== STORAGE_KEY) return
    current = load()
    listeners.forEach((l) => l())
  })
}

export function recordAnswer(verb: string, tense: TenseId, correct: boolean, now = Date.now()) {
  const data = getProgress()
  const key = statKey(verb, tense)
  const prev = data.stats[key] ?? { correct: 0, incorrect: 0, recent: '', lastPracticed: 0 }
  const stat: TenseStat = {
    correct: prev.correct + (correct ? 1 : 0),
    incorrect: prev.incorrect + (correct ? 0 : 1),
    recent: (prev.recent + (correct ? '1' : '0')).slice(-RECENT_WINDOW),
    lastPracticed: now,
  }
  persist({ ...data, stats: { ...data.stats, [key]: stat }, lastPracticed: now })
}

export function recordAttempt(kind: 'test' | 'mix') {
  const data = getProgress()
  persist({ ...data, attempts: { ...data.attempts, [kind]: data.attempts[kind] + 1 } })
}

export function markStudied(verb: string, now = Date.now()) {
  const data = getProgress()
  persist({ ...data, studied: { ...data.studied, [verb]: now } })
}

export function resetProgress() {
  persist(emptyProgress())
}

/** For tests: forget the in-memory copy so the next read comes from localStorage. */
export function reloadProgressFromStorage() {
  current = null
}
