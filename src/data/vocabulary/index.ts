import sample from './vocabulary.sample.json'

// The full vocabulary comes from a textbook and is kept out of the public repository
// for copyright reasons. Without it the app falls back to a small self-written sample.
const bookFiles = import.meta.glob('./italian_vocabulary.json', { eager: true, import: 'default' })
const book = bookFiles['./italian_vocabulary.json']
export const HAS_BOOK_VOCAB = book !== undefined
const raw = book ?? sample

/** "words" = Parole, "phrases" = Frasi. Tests never mix the two. */
export type VocabType = 'words' | 'phrases'

export const VOCAB_TYPES: VocabType[] = ['words', 'phrases']

export const VOCAB_TYPE_LABEL: Record<VocabType, { it: string; en: string }> = {
  words: { it: 'Parole', en: 'Words' },
  phrases: { it: 'Frasi', en: 'Phrases' },
}

export interface RawVocabItem {
  it: string
  en: string
  note?: string
  id: string
}

export interface VocabSubBatch {
  id: string
  title: string
  unit: string
  words: RawVocabItem[]
  phrases: RawVocabItem[]
}

export interface VocabBatch {
  id: string
  number: number
  title: string
  images?: string
  subBatches: VocabSubBatch[]
}

interface VocabFile {
  title: string
  batches: VocabBatch[]
  counts: { words: number; phrases: number }
}

/** A word or phrase together with where it lives in the book. */
export interface VocabItem extends RawVocabItem {
  type: VocabType
  batchId: string
  subBatchId: string
}

/** The JSON is loaded as-is; nothing in it is hard-coded here. */
export const VOCAB = raw as VocabFile
export const VOCAB_BATCHES: VocabBatch[] = VOCAB.batches

export const BATCH_BY_ID = new Map(VOCAB_BATCHES.map((b) => [b.id, b]))
export const SUB_BATCH_BY_ID = new Map(
  VOCAB_BATCHES.flatMap((b) => b.subBatches.map((s) => [s.id, { batch: b, sub: s }] as const)),
)

export function subBatchItems(batch: VocabBatch, sub: VocabSubBatch, type: VocabType): VocabItem[] {
  return sub[type].map((item) => ({ ...item, type, batchId: batch.id, subBatchId: sub.id }))
}

export function batchItems(batch: VocabBatch, type: VocabType): VocabItem[] {
  return batch.subBatches.flatMap((s) => subBatchItems(batch, s, type))
}

export function allItems(type: VocabType): VocabItem[] {
  return VOCAB_BATCHES.flatMap((b) => batchItems(b, type))
}

/** What a test covers: one sub-batch, one whole batch, or everything of one type. */
export type VocabScope = { kind: 'sub'; id: string } | { kind: 'batch'; id: string } | { kind: 'all' }

export function scopeItems(scope: VocabScope, type: VocabType): VocabItem[] {
  if (scope.kind === 'all') return allItems(type)
  if (scope.kind === 'batch') {
    const batch = BATCH_BY_ID.get(scope.id)
    return batch ? batchItems(batch, type) : []
  }
  const found = SUB_BATCH_BY_ID.get(scope.id)
  return found ? subBatchItems(found.batch, found.sub, type) : []
}

export function scopeTitle(scope: VocabScope): string {
  if (scope.kind === 'all') return 'Tutto il vocabolario'
  if (scope.kind === 'batch') return BATCH_BY_ID.get(scope.id)?.title ?? scope.id
  return SUB_BATCH_BY_ID.get(scope.id)?.sub.title ?? scope.id
}

export function isVocabType(value: unknown): value is VocabType {
  return value === 'words' || value === 'phrases'
}

/** Text without the *emphasis* markers used in the source (for comparisons and option buttons). */
export function plainText(text: string): string {
  return text.replace(/\*/g, '')
}
