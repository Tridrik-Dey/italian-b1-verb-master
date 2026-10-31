import type { Priority } from '@/types/verb'

export interface PriorityInfo {
  id: Priority
  title: string
  expectedCount: number
  importance: string
  description: string
}

export const PRIORITIES: PriorityInfo[] = [
  {
    id: 'essenziali',
    title: 'Essenziali',
    expectedCount: 50,
    importance: 'Highest learning importance',
    description: 'The core verbs of everyday Italian: essere, avere, fare, andare, the modals and the most frequent irregulars.',
  },
  {
    id: 'alta',
    title: 'Alta priorità',
    expectedCount: 50,
    importance: 'High importance',
    description: 'Very common verbs for daily routines, travel, shopping and conversation, including key reflexives.',
  },
  {
    id: 'media',
    title: 'Media priorità',
    expectedCount: 60,
    importance: 'Medium importance',
    description: 'Verbs for feelings, plans, work and study that broaden your B1 expression.',
  },
  {
    id: 'bassa',
    title: 'Bassa priorità',
    expectedCount: 40,
    importance: 'Supplementary vocabulary',
    description: 'Less frequent but useful verbs, many with irregular past participles.',
  },
]

export const PRIORITY_BY_ID = Object.fromEntries(PRIORITIES.map((p) => [p.id, p])) as Record<Priority, PriorityInfo>

export function isPriority(value: string | undefined): value is Priority {
  return !!value && value in PRIORITY_BY_ID
}
