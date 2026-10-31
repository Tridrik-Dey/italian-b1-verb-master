import type { PersonKey, TenseId } from '@/types/verb'

/**
 * Context clues for "Sentence practice": each clue makes one tense the natural answer.
 * `{clause}` is replaced by "subject ___ (verb) complement" in Italian and by the
 * English clause in the translation.
 */
export interface SentenceCue {
  it: string
  en: string
  /** The clue words shown after answering, with why they point to this tense. */
  clue: string
  why: string
  /** Other tenses that are also correct with this clue (e.g. "in questo momento vado"). */
  alsoAccept?: TenseId[]
  /** English tense form used inside this frame (e.g. "after I have gone" for futuro anteriore). */
  enForm?: 'presentPerfect' | 'pastSimple' | 'pastPerfect' | 'conditional'
  /** Persons this cue works with (imperatives have their own frames). */
  persons?: PersonKey[]
}

export const SENTENCE_CUES: Partial<Record<TenseId, SentenceCue>> = {
  'ind-presente': {
    it: 'Di solito {clause}.',
    en: 'Usually {clause}.',
    clue: 'Di solito',
    why: '“Di solito” (usually) describes a present habit → presente.',
  },
  'ind-imperfetto': {
    it: 'Anni fa, di solito {clause}.',
    en: 'Years ago, {clause}.',
    clue: 'Anni fa, di solito',
    why: 'A habit in the past (“years ago, usually”) → imperfetto.',
  },
  'ind-passato-prossimo': {
    it: 'Ieri {clause}.',
    en: 'Yesterday {clause}.',
    clue: 'Ieri',
    why: '“Ieri” (yesterday) marks a single, completed action in the past → passato prossimo.',
    enForm: 'pastSimple',
  },
  'ind-trapassato-prossimo': {
    it: 'Marco ha detto che il giorno prima {clause}.',
    en: 'Marco said that the day before {clause}.',
    clue: 'Marco ha detto che il giorno prima',
    why: 'An action that happened before another past action (“il giorno prima”) → trapassato prossimo.',
  },
  'ind-passato-remoto': {
    it: 'Nel 1950 {clause}.',
    en: 'In 1950 {clause}.',
    clue: 'Nel 1950',
    why: 'A finished action in the distant past with no link to today → passato remoto (typical of stories, history and southern Italy). In everyday northern speech the passato prossimo is also used.',
    enForm: 'pastSimple',
    alsoAccept: ['ind-passato-prossimo'],
  },
  'ind-trapassato-remoto': {
    it: 'Appena {clause}, Marco partì.',
    en: 'As soon as {clause}, Marco left.',
    clue: 'Appena … Marco partì',
    why: 'Literary: an action completed just before another passato remoto (“appena …, partì”) → trapassato remoto.',
    enForm: 'pastPerfect',
  },
  'ind-futuro-semplice': {
    it: 'Tra dieci anni {clause}.',
    en: 'In ten years {clause}.',
    clue: 'Tra dieci anni',
    why: '“Tra dieci anni” (in ten years) points to the future → futuro semplice.',
  },
  'ind-futuro-anteriore': {
    it: 'Dopo che {clause}, Marco partirà.',
    en: 'After {clause}, Marco will leave.',
    clue: 'Dopo che … Marco partirà',
    why: 'An action completed before another future action (“dopo che …, partirà”) → futuro anteriore.',
    enForm: 'presentPerfect',
  },
  'cong-presente': {
    it: 'Marco spera che domani {clause}.',
    en: 'Marco hopes that tomorrow {clause}.',
    clue: 'spera che … domani',
    why: '“Sperare che” needs the congiuntivo; “domani” makes it present/future → congiuntivo presente.',
  },
  'cong-passato': {
    it: 'Marco spera che ieri {clause}.',
    en: 'Marco hopes that yesterday {clause}.',
    clue: 'spera che … ieri',
    why: '“Sperare che” needs the congiuntivo; “ieri” makes it past → congiuntivo passato.',
  },
  'cong-imperfetto': {
    it: 'Marco sperava che il giorno dopo {clause}.',
    en: 'Marco hoped that the next day {clause}.',
    clue: 'sperava che … il giorno dopo',
    why: '“Sperava” is in the past, so the congiuntivo moves back to the imperfetto (for something later than the hoping).',
    enForm: 'conditional',
  },
  'cong-trapassato': {
    it: 'Marco sperava che il giorno prima {clause}.',
    en: 'Marco hoped that the day before {clause}.',
    clue: 'sperava che … il giorno prima',
    why: '“Sperava” is in the past and the action came before it (“il giorno prima”) → congiuntivo trapassato.',
    enForm: 'pastPerfect',
  },
  'cond-presente': {
    it: 'Con più tempo, {clause}.',
    en: 'With more time, {clause}.',
    clue: 'Con più tempo',
    why: 'A hypothetical result (“with more time, I would…”) → condizionale presente.',
  },
  'cond-passato': {
    it: 'Con più tempo, ieri {clause}.',
    en: 'With more time, yesterday {clause}.',
    clue: 'Con più tempo, ieri',
    why: 'A hypothetical result in the past that did not happen (“yesterday I would have…”) → condizionale passato.',
  },
  'prog-presente': {
    it: 'In questo momento {clause}.',
    en: 'Right now {clause}.',
    clue: 'In questo momento',
    why: '“In questo momento” (right now) stresses an action in progress → stare + gerundio (the simple presente is also correct).',
    alsoAccept: ['ind-presente'],
  },
  'prog-imperfetto': {
    it: 'Quando Marco ha telefonato, {clause}.',
    en: 'When Marco phoned, {clause}.',
    clue: 'Quando Marco ha telefonato',
    why: 'An action in progress when something else happened → stavo + gerundio (the imperfetto is also correct).',
    alsoAccept: ['ind-imperfetto'],
  },
}

/** Imperative frames: the person is shown by who is being addressed. */
export const IMPERATIVE_CUES: Partial<Record<PersonKey, { it: string; en: string; clue: string; why: string }>> = {
  tu: {
    it: 'Marco, {verb}, per favore!',
    en: 'Marco, {verb}, please!',
    clue: 'Marco, … per favore!',
    why: 'A request to one friend (Marco) → imperativo, tu form.',
  },
  lui: {
    it: 'Signora, {verb}, per favore!',
    en: 'Madam, {verb}, please!',
    clue: 'Signora, … per favore!',
    why: 'A polite request to one person (“Signora”) → imperativo, formal Lei form.',
  },
  noi: {
    it: 'Dai, {verb} insieme!',
    en: "Come on, let's {verb} together!",
    clue: 'Dai, … insieme!',
    why: '“Let’s … together” → imperativo, noi form.',
  },
  voi: {
    it: 'Ragazzi, {verb}, per favore!',
    en: 'Guys, {verb}, please!',
    clue: 'Ragazzi, … per favore!',
    why: 'A request to several friends (“Ragazzi”) → imperativo, voi form.',
  },
}

export const SENTENCE_TENSES: TenseId[] = [
  'ind-presente',
  'ind-imperfetto',
  'ind-passato-prossimo',
  'ind-trapassato-prossimo',
  'ind-passato-remoto',
  'ind-trapassato-remoto',
  'ind-futuro-semplice',
  'ind-futuro-anteriore',
  'cong-presente',
  'cong-passato',
  'cong-imperfetto',
  'cong-trapassato',
  'cond-presente',
  'cond-passato',
  'imp-presente',
  'prog-presente',
  'prog-imperfetto',
]
