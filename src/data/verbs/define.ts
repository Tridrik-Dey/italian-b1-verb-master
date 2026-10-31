import type { Auxiliary, Priority, TenseId, VerbBase, VerbEntry, VerbOverrides } from '@/types/verb'

/** [Italian, English, tense]. The tense defaults to presente (1st example) / passato prossimo (2nd). */
export type ExampleTuple = [string, string, TenseId?]

export interface VerbDef {
  aux?: Auxiliary
  alt?: Auxiliary
  modal?: boolean
  base?: VerbBase
  ov?: VerbOverrides
  notes?: string[]
  noProg?: boolean
  ex: ExampleTuple[]
}

const DEFAULT_EXAMPLE_TENSES: TenseId[] = ['ind-presente', 'ind-passato-prossimo']

/** Turns a compact `{ infinitive: [english, definition] }` map into typed entries. */
export function defineVerbs(priority: Priority, defs: Record<string, [string, VerbDef]>): VerbEntry[] {
  return Object.entries(defs).map(([infinitive, [english, d]]) => ({
    infinitive,
    english,
    priority,
    auxiliary: d.aux ?? (infinitive.endsWith('rsi') ? 'essere' : 'avere'),
    ...(d.alt ? { altAuxiliary: d.alt } : {}),
    ...(d.modal ? { modal: true } : {}),
    ...(d.base ? { base: d.base } : {}),
    ...(d.ov ? { overrides: d.ov } : {}),
    ...(d.notes ? { notes: d.notes } : {}),
    ...(d.noProg ? { noProgressive: true } : {}),
    examples: d.ex.map(([it, en, tense], i) => ({ it, en, tense: tense ?? DEFAULT_EXAMPLE_TENSES[i] })),
  }))
}
