import type { MoodId, PersonKey, RowKey, TenseDefinition, TenseId } from '@/types/verb'

export const TENSES: TenseDefinition[] = [
  // ── Indicativo ──
  {
    id: 'ind-presente',
    mood: 'indicativo',
    label: 'Presente',
    english: 'Present',
    kind: 'simple',
    standard: true,
    b1: true,
    core: true,
    explanation:
      'Actions happening now, habits, general truths and scheduled near-future events. Italian uses one form for "I eat", "I am eating" and "I do eat".',
    example: { it: 'Ogni mattina bevo un caffè.', en: 'Every morning I drink a coffee.' },
  },
  {
    id: 'ind-imperfetto',
    mood: 'indicativo',
    label: 'Imperfetto',
    english: 'Imperfect (was …-ing / used to)',
    kind: 'simple',
    standard: true,
    b1: true,
    core: true,
    explanation:
      'Ongoing or habitual past actions, descriptions, age, time and feelings in the past ("I used to…", "I was …-ing").',
    example: { it: 'Da bambino giocavo sempre in giardino.', en: 'As a child I always used to play in the garden.' },
  },
  {
    id: 'ind-passato-prossimo',
    mood: 'indicativo',
    label: 'Passato prossimo',
    english: 'Present perfect / simple past',
    kind: 'compound',
    standard: true,
    b1: true,
    core: true,
    explanation:
      'Completed past actions, especially recent ones or those connected to the present. Formed with avere/essere in the present + past participle. With essere the participle agrees with the subject.',
    example: { it: 'Ieri siamo andati al cinema.', en: 'Yesterday we went to the cinema.' },
  },
  {
    id: 'ind-trapassato-prossimo',
    mood: 'indicativo',
    label: 'Trapassato prossimo',
    english: 'Past perfect (had done)',
    kind: 'compound',
    standard: true,
    b1: true,
    core: true,
    explanation:
      'An action completed before another past action ("I had done"). Formed with the imperfetto of avere/essere + past participle.',
    example: { it: 'Quando sono arrivato, il film era già cominciato.', en: 'When I arrived, the film had already started.' },
  },
  {
    id: 'ind-passato-remoto',
    mood: 'indicativo',
    label: 'Passato remoto',
    english: 'Simple past (historic)',
    kind: 'simple',
    standard: true,
    b1: false,
    core: false,
    explanation:
      "Completed actions in the distant past with no link to the present. Common in literature, history and in southern Italian speech.",
    example: { it: "Dante nacque a Firenze nel 1265.", en: "Dante was born in Florence in 1265." },
  },
  {
    id: 'ind-trapassato-remoto',
    mood: 'indicativo',
    label: 'Trapassato remoto',
    english: 'Past anterior (had done)',
    kind: 'compound',
    standard: true,
    b1: false,
    core: false,
    explanation:
      "A literary tense for an action completed immediately before another passato remoto action, usually after dopo che, quando, appena. Formed with the passato remoto of avere/essere + past participle.",
    example: { it: "Dopo che ebbe finito, uscì.", en: "After he had finished, he went out." },
  },
  {
    id: 'ind-futuro-semplice',
    mood: 'indicativo',
    label: 'Futuro semplice',
    english: 'Simple future (will do)',
    kind: 'simple',
    standard: true,
    b1: true,
    core: true,
    explanation: 'Future actions ("I will…") and suppositions about the present ("Sarà a casa" = "He is probably at home").',
    example: { it: "L'anno prossimo studierò in Italia.", en: 'Next year I will study in Italy.' },
  },
  {
    id: 'ind-futuro-anteriore',
    mood: 'indicativo',
    label: 'Futuro anteriore',
    english: 'Future perfect (will have done)',
    kind: 'compound',
    standard: true,
    b1: true,
    core: false,
    explanation:
      'An action that will be completed before another future action ("I will have done"), or a supposition about the past. Formed with the futuro of avere/essere + past participle.',
    example: { it: 'Quando arriverai, avrò già cenato.', en: 'When you arrive, I will have already had dinner.' },
  },
  // ── Congiuntivo ──
  {
    id: 'cong-presente',
    mood: 'congiuntivo',
    label: 'Presente',
    english: 'Present subjunctive',
    kind: 'simple',
    standard: true,
    b1: true,
    core: true,
    explanation:
      'Used after expressions of opinion, doubt, desire, emotion and necessity (penso che, voglio che, è importante che…) referring to the present or future.',
    example: { it: 'Penso che lui abbia ragione.', en: 'I think he is right.' },
  },
  {
    id: 'cong-passato',
    mood: 'congiuntivo',
    label: 'Passato',
    english: 'Perfect subjunctive',
    kind: 'compound',
    standard: true,
    b1: true,
    core: false,
    explanation:
      'The subjunctive for a past action when the main verb is in the present. Formed with the congiuntivo presente of avere/essere + past participle.',
    example: { it: 'Credo che siano già partiti.', en: 'I believe they have already left.' },
  },
  // ── Condizionale ──
  {
    id: 'cong-imperfetto',
    mood: 'congiuntivo',
    label: 'Imperfetto',
    english: 'Imperfect subjunctive',
    kind: 'simple',
    standard: true,
    b1: false,
    core: false,
    explanation:
      "The subjunctive after a main verb in a past or conditional tense, and in hypothetical \"if\" clauses (se avessi tempo…).",
    example: { it: "Se avessi più tempo, viaggerei di più.", en: "If I had more time, I would travel more." },
  },
  {
    id: 'cong-trapassato',
    mood: 'congiuntivo',
    label: 'Trapassato',
    english: 'Pluperfect subjunctive',
    kind: 'compound',
    standard: true,
    b1: false,
    core: false,
    explanation:
      "Past hypotheses and subjunctive actions prior to a past main verb (\"if I had done…\"). Formed with the congiuntivo imperfetto of avere/essere + past participle.",
    example: { it: "Se avessi saputo, sarei venuto.", en: "If I had known, I would have come." },
  },
  {
    id: 'cond-presente',
    mood: 'condizionale',
    label: 'Presente',
    english: 'Present conditional (would do)',
    kind: 'simple',
    standard: true,
    b1: true,
    core: true,
    explanation: 'Polite requests, wishes, advice and hypothetical consequences ("I would…").',
    example: { it: 'Vorrei un bicchiere d’acqua, per favore.', en: 'I would like a glass of water, please.' },
  },
  {
    id: 'cond-passato',
    mood: 'condizionale',
    label: 'Passato',
    english: 'Perfect conditional (would have done)',
    kind: 'compound',
    standard: true,
    b1: true,
    core: false,
    explanation:
      'Unrealised past actions ("I would have…") and the future seen from the past. Formed with the condizionale presente of avere/essere + past participle.',
    example: { it: 'Mi ha detto che sarebbe venuto.', en: 'He told me he would come.' },
  },
  // ── Imperativo ──
  {
    id: 'imp-presente',
    mood: 'imperativo',
    label: 'Presente',
    english: 'Imperative (commands)',
    kind: 'imperative',
    standard: true,
    b1: true,
    core: true,
    explanation:
      'Commands, instructions and invitations. There is no "io" form. Lei and Loro are the formal commands and use the congiuntivo presente. The negative tu command is non + infinitive (non parlare!).',
    example: { it: 'Apri la finestra, per favore!', en: 'Open the window, please!' },
  },
  // ── Infinito ──
  {
    id: 'inf-presente',
    mood: 'infinito',
    label: 'Presente',
    english: 'Present infinitive (to do)',
    kind: 'nonfinite',
    standard: true,
    b1: true,
    core: false,
    explanation: 'The basic, dictionary form of the verb, used after modals, prepositions and as a noun.',
    example: { it: 'Mi piace leggere.', en: 'I like reading.' },
  },
  // ── Participio ──
  {
    id: 'inf-passato',
    mood: 'infinito',
    label: 'Passato',
    english: 'Perfect infinitive (to have done)',
    kind: 'nonfinite',
    standard: true,
    b1: false,
    core: false,
    explanation:
      "An action completed before another one, often after dopo (dopo aver mangiato). Formed with avere/essere + past participle; avere is often shortened to aver.",
    example: { it: "Dopo aver mangiato, sono uscito.", en: "After having eaten, I went out." },
  },
  {
    id: 'part-presente',
    mood: 'participio',
    label: 'Presente',
    english: 'Present participle',
    kind: 'nonfinite',
    standard: true,
    b1: false,
    core: false,
    explanation:
      "Mostly used today as an adjective or noun (cantante = singer, interessante = interesting). Many verbs have no participio presente in use.",
    example: { it: "L'acqua corrente è fredda.", en: "The running water is cold." },
  },
  {
    id: 'part-passato',
    mood: 'participio',
    label: 'Passato',
    english: 'Past participle',
    kind: 'nonfinite',
    standard: true,
    b1: true,
    core: false,
    explanation:
      'Used to build all compound tenses and the passive voice, and as an adjective. Many common verbs have an irregular past participle.',
    example: { it: 'La lettera è scritta a mano.', en: 'The letter is handwritten.' },
  },
  // ── Gerundio ──
  {
    id: 'ger-presente',
    mood: 'gerundio',
    label: 'Presente',
    english: 'Present gerund (doing)',
    kind: 'nonfinite',
    standard: true,
    b1: true,
    core: false,
    explanation: 'Expresses manner, means, cause or simultaneity ("while/by …-ing"), and builds the progressive with stare.',
    example: { it: 'Studio ascoltando la musica.', en: 'I study while listening to music.' },
  },
  // ── Progressive constructions (supplementary) ──
  {
    id: 'ger-passato',
    mood: 'gerundio',
    label: 'Passato',
    english: 'Perfect gerund (having done)',
    kind: 'nonfinite',
    standard: true,
    b1: false,
    core: false,
    explanation:
      "An action completed before the main action (\"having done\"). Formed with avendo/essendo + past participle.",
    example: { it: "Avendo finito il lavoro, sono andato a casa.", en: "Having finished work, I went home." },
  },
  {
    id: 'prog-presente',
    mood: 'progressivo',
    label: 'Presente progressivo',
    english: 'Present continuous (am doing)',
    kind: 'progressive',
    standard: false,
    b1: true,
    core: false,
    explanation:
      'Not a separate tense but a construction: stare (presente) + gerundio. Stresses that an action is in progress right now ("I am …-ing").',
    example: { it: 'Sto preparando la cena.', en: 'I am making dinner.' },
  },
  {
    id: 'prog-imperfetto',
    mood: 'progressivo',
    label: 'Imperfetto progressivo',
    english: 'Past continuous (was doing)',
    kind: 'progressive',
    standard: false,
    b1: true,
    core: false,
    explanation:
      'Construction: stare (imperfetto) + gerundio. Stresses that an action was in progress at a moment in the past ("I was …-ing").',
    example: { it: 'Stavo dormendo quando hai chiamato.', en: 'I was sleeping when you called.' },
  },
]

export const TENSE_IDS = TENSES.map((t) => t.id)

export const TENSE_BY_ID = Object.fromEntries(TENSES.map((t) => [t.id, t])) as Record<TenseId, TenseDefinition>

export const STANDARD_TENSE_IDS = TENSES.filter((t) => t.standard).map((t) => t.id)
export const CORE_TENSE_IDS = TENSES.filter((t) => t.core).map((t) => t.id)
/** Tenses in the B1 syllabus; the rest are shown as "Beyond B1". */
export const B1_TENSE_IDS = TENSES.filter((t) => t.b1).map((t) => t.id)

export const MOODS: { id: MoodId; label: string }[] = [
  { id: 'indicativo', label: 'Indicativo' },
  { id: 'congiuntivo', label: 'Congiuntivo' },
  { id: 'condizionale', label: 'Condizionale' },
  { id: 'imperativo', label: 'Imperativo' },
  { id: 'infinito', label: 'Infinito' },
  { id: 'participio', label: 'Participio' },
  { id: 'gerundio', label: 'Gerundio' },
  { id: 'progressivo', label: 'Costruzioni progressive' },
]

export const MOOD_LABEL = Object.fromEntries(MOODS.map((m) => [m.id, m.label])) as Record<MoodId, string>

export function tenseFullLabel(id: TenseId): string {
  const t = TENSE_BY_ID[id]
  if (t.mood === 'progressivo') return t.label
  return `${MOOD_LABEL[t.mood]} — ${t.label}`
}

/** English name of a tense, e.g. "Present" for Indicativo — Presente. */
export function tenseEnglish(id: TenseId): string {
  return TENSE_BY_ID[id].english
}

export function isTenseId(value: string | null | undefined): value is TenseId {
  return !!value && value in TENSE_BY_ID
}

export const PERSONS: PersonKey[] = ['io', 'tu', 'lui', 'noi', 'voi', 'loro']

export const PERSON_LABEL: Record<RowKey, string> = {
  io: 'Io',
  tu: 'Tu',
  lui: 'Lui/Lei',
  noi: 'Noi',
  voi: 'Voi',
  loro: 'Loro',
  form: 'Forma',
}

export const IMPERATIVE_PERSON_LABEL: Partial<Record<RowKey, string>> = {
  tu: 'Tu',
  lui: 'Lei (formale)',
  noi: 'Noi',
  voi: 'Voi',
  loro: 'Loro (formale)',
}

export function rowLabel(tense: TenseId, key: RowKey): string {
  if (tense === 'imp-presente') return IMPERATIVE_PERSON_LABEL[key] ?? PERSON_LABEL[key]
  if (key === 'form') return `${MOOD_LABEL[TENSE_BY_ID[tense].mood]} ${TENSE_BY_ID[tense].label.toLowerCase()}`
  return PERSON_LABEL[key]
}
