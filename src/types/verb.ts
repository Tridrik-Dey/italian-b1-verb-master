export type Priority = 'essenziali' | 'alta' | 'media' | 'bassa'

/** Conjugation class used by the rule engine. `isc` = -ire verbs with the -isc- infix. */
export type ConjClass = 'are' | 'ere' | 'ire' | 'isc'

export type Auxiliary = 'avere' | 'essere'

export type PersonKey = 'io' | 'tu' | 'lui' | 'noi' | 'voi' | 'loro'

/** Row key: a grammatical person for finite tenses, or `form` for non-finite forms. */
export type RowKey = PersonKey | 'form'

export type MoodId =
  | 'indicativo'
  | 'congiuntivo'
  | 'condizionale'
  | 'imperativo'
  | 'infinito'
  | 'participio'
  | 'gerundio'
  | 'progressivo'

export type TenseId =
  | 'ind-presente'
  | 'ind-imperfetto'
  | 'ind-passato-prossimo'
  | 'ind-trapassato-prossimo'
  | 'ind-passato-remoto'
  | 'ind-trapassato-remoto'
  | 'ind-futuro-semplice'
  | 'ind-futuro-anteriore'
  | 'cong-presente'
  | 'cong-passato'
  | 'cong-imperfetto'
  | 'cong-trapassato'
  | 'cond-presente'
  | 'cond-passato'
  | 'imp-presente'
  | 'inf-presente'
  | 'inf-passato'
  | 'part-presente'
  | 'part-passato'
  | 'ger-presente'
  | 'ger-passato'
  | 'prog-presente'
  | 'prog-imperfetto'

export type TenseKind = 'simple' | 'compound' | 'imperative' | 'nonfinite' | 'progressive'

export interface TenseDefinition {
  id: TenseId
  mood: MoodId
  /** Italian tense label, e.g. "Presente". */
  label: string
  /** English name of the tense, e.g. "Present perfect / simple past". */
  english: string
  kind: TenseKind
  /** One of the 21 standard Italian tenses/forms (progressives are supplementary). */
  standard: boolean
  /** Part of the CEFR B1 syllabus. The others are marked "Beyond B1" in the app. */
  b1: boolean
  /** Counts toward verb mastery. */
  core: boolean
  explanation: string
  example: { it: string; en: string }
}

export interface Example {
  it: string
  en: string
  tense?: TenseId
}

/**
 * Explicit irregular overrides. Six-person strings are comma separated
 * ("io, tu, lui, noi, voi, loro"); alternatives within a person use `|`.
 * The first alternative is the primary (displayed) form.
 */
export interface VerbOverrides {
  /** Stem used by the rule engine (e.g. `fac` for fare, `traduc` for tradurre). */
  stem?: string
  cls?: ConjClass
  presente?: string
  imperfetto?: string
  /** Stem for imperfetto, congiuntivo imperfetto, gerundio and weak passato remoto forms (e.g. `face`). */
  imperfStem?: string
  passatoRemoto?: string
  /** Strong passato remoto stem for io/lui/loro (e.g. `fec` → feci, fece, fecero). */
  prStrong?: string
  /** Literary strong passato remoto accepted as an alternative (`aper` → apersi, aperse, apersero). */
  prStrongAlt?: string
  /** Strong passato remoto also accepts the weak forms (e.g. perdere: persi | perdei | perdetti). */
  prAlsoWeak?: boolean
  /** -ere verbs that do not take the -etti/-ette/-ettero alternative. */
  prNoEtti?: boolean
  /** Future/conditional stem, alternatives separated by `|` (e.g. `morir|morr`). */
  futStem?: string
  congPresente?: string
  congImperfetto?: string
  /** Five forms: "tu, Lei, noi, voi, Loro". */
  imperativo?: string
  noImperative?: boolean
  pp?: string
  gerundio?: string
  /** `null` = no participio presente in use. */
  partPresente?: string | null
}

export interface VerbBase {
  /** Base verb whose simple forms are prefixed, e.g. `tenere` for `ottenere`. */
  verb: string
  prefix: string
  /** Leading letters of the base removed before prefixing (tradurre → produrre strips `tra`). */
  strip?: string
}

export interface VerbEntry {
  infinitive: string
  english: string
  priority: Priority
  auxiliary: Auxiliary
  /** Auxiliary also correct in some uses (e.g. finire: ho finito / è finito). */
  altAuxiliary?: Auxiliary
  modal?: boolean
  base?: VerbBase
  overrides?: VerbOverrides
  notes?: string[]
  examples: Example[]
  /** Progressive constructions are not idiomatic for this verb. */
  noProgressive?: boolean
}

export interface ConjugationRow {
  key: RowKey
  /** Accepted answers; the first is the primary form. */
  forms: string[]
  /** Text shown in charts (e.g. "sono andato/a"). */
  display: string
  irregular: boolean
}

export interface TenseConjugation {
  tense: TenseId
  rows: ConjugationRow[]
  /** Explanatory note, e.g. why a form is not applicable. */
  note?: string
}

export interface VerbInfo {
  entry: VerbEntry
  reflexive: boolean
  irregular: boolean
  group: string
  types: string[]
  conjugations: Record<TenseId, TenseConjugation>
}
