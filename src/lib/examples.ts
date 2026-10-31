import { EXAMPLE_PHRASES, type PhraseOptions } from '@/data/example-phrases'
import { TENSE_BY_ID } from '@/data/tenses'
import { getTense } from '@/lib/conjugation'
import type { RowKey, TenseId } from '@/types/verb'

export interface RowExample {
  it: string
  en: string
}

// ── English verb morphology ──────────────────────────────────────────────

interface EnVerb {
  isBe: boolean
  base: string
  s3: string
  past: string
  pp: string
  ing: string
  /** Words after the verb itself ("up" in "get up"). */
  particle: string
}

const VOWEL = /[aeiou]/

function regularPast(v: string) {
  if (v.endsWith('e')) return v + 'd'
  if (v.endsWith('y') && !VOWEL.test(v.at(-2) ?? '')) return v.slice(0, -1) + 'ied'
  return v + 'ed'
}

function thirdSingular(v: string) {
  if (v === 'have') return 'has'
  if (/(s|x|z|ch|sh|o)$/.test(v)) return v + 'es'
  if (v.endsWith('y') && !VOWEL.test(v.at(-2) ?? '')) return v.slice(0, -1) + 'ies'
  return v + 's'
}

function gerund(v: string) {
  if (v.endsWith('ie')) return v.slice(0, -2) + 'ying'
  if (v.endsWith('e') && !v.endsWith('ee')) return v.slice(0, -1) + 'ing'
  return v + 'ing'
}

export function parseEnglishVerb(spec: string): EnVerb {
  const [head, past, pp, ing] = spec.split('|')
  const [base, ...rest] = head.split(' ')
  return {
    isBe: base === 'be',
    base,
    s3: thirdSingular(base),
    past: past || regularPast(base),
    pp: pp || past || regularPast(base),
    ing: ing || gerund(base),
    particle: rest.join(' '),
  }
}

// English "you" is both tu and voi, so voi is marked "(pl.)".
const EN_SUBJECT: Record<string, string> = { io: 'I', tu: 'you', lui: 'he', noi: 'we', voi: 'you (pl.)', loro: 'they' }
const EN_OBJECT: Record<string, string> = { io: 'me', tu: 'you', lui: 'him', noi: 'us', voi: 'you (pl.)', loro: 'them' }
const PERSON_INDEX: Record<string, number> = { io: 0, tu: 1, lui: 2, noi: 3, voi: 4, loro: 5 }
const BE_PRESENT = ['am', 'are', 'is', 'are', 'are', 'are']
const BE_PAST = ['was', 'were', 'was', 'were', 'were', 'were']

export type EnForm =
  | 'present'
  | 'pastSimple'
  | 'usedTo'
  | 'pastCont'
  | 'presentCont'
  | 'presentPerfect'
  | 'pastPerfect'
  | 'future'
  | 'futurePerfect'
  | 'conditional'
  | 'conditionalPerfect'

/** The English verb phrase (without subject) for a person index 0–5. */
function englishVerbPhrase(v: EnVerb, form: EnForm, i: number): string {
  const third = i === 2
  const pp = v.isBe ? 'been' : v.pp
  const words = (() => {
    switch (form) {
      case 'present':
        return [v.isBe ? BE_PRESENT[i] : third ? v.s3 : v.base]
      case 'pastSimple':
        return [v.isBe ? BE_PAST[i] : v.past]
      case 'usedTo':
        return ['used to', v.base]
      case 'pastCont':
        return [BE_PAST[i], v.ing]
      case 'presentCont':
        return [BE_PRESENT[i], v.ing]
      case 'presentPerfect':
        return [third ? 'has' : 'have', pp]
      case 'pastPerfect':
        return ['had', pp]
      case 'future':
        return ['will', v.base]
      case 'futurePerfect':
        return ['will have', pp]
      case 'conditional':
        return ['would', v.base]
      case 'conditionalPerfect':
        return ['would have', pp]
    }
  })()
  return [...words, v.particle].filter(Boolean).join(' ')
}

const TENSE_TO_EN: Partial<Record<TenseId, EnForm>> = {
  'ind-presente': 'present',
  'ind-passato-prossimo': 'pastSimple',
  'ind-trapassato-prossimo': 'pastPerfect',
  // Framed as "Many years ago I went…" / "After I had gone…, Marco left", see rowExample.
  'ind-passato-remoto': 'pastSimple',
  'ind-trapassato-remoto': 'pastPerfect',
  'ind-futuro-semplice': 'future',
  'ind-futuro-anteriore': 'futurePerfect',
  // The congiuntivo gets a main clause ("Marco hopes/hoped that …"), see rowExample.
  'cong-presente': 'present',
  'cong-passato': 'pastSimple',
  'cong-imperfetto': 'conditional',
  'cong-trapassato': 'pastPerfect',
  'cond-presente': 'conditional',
  'cond-passato': 'conditionalPerfect',
  'prog-presente': 'presentCont',
  'prog-imperfetto': 'pastCont',
}

// ── Sentence assembly ───────────────────────────────────────────────────

const IT_SUBJECT: Record<string, string> = { io: 'io', tu: 'tu', lui: 'lui', noi: 'noi', voi: 'voi', loro: 'loro' }

function pickNumber(text: string, plural: boolean): string {
  const [sg, pl] = text.split('|')
  return plural && pl ? pl : sg
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const join = (...parts: string[]) => parts.filter(Boolean).join(' ')

export interface ClauseParts {
  /** Italian subject ("io", or "questo" for third-person-only verbs). */
  itSubject: string
  /** Italian complement after the verb, agreeing in number. */
  itComp: string
  /** Full English clause with subject, e.g. "I went to the seaside". */
  enClause: string
  /** English imperative phrase without subject, e.g. "go to the seaside". */
  enImperative: string
}

/**
 * The building blocks of an example for one verb, tense and person, or null when
 * the combination would be unnatural. `enFormOverride` lets a sentence frame pick
 * the English tense it needs (e.g. "After I have gone…").
 */
export function clauseParts(
  verb: string,
  tense: TenseId,
  key: RowKey,
  enFormOverride?: EnForm,
): ClauseParts | null {
  const spec = EXAMPLE_PHRASES[verb]
  if (!spec || key === 'form') return null
  const [itComp, enComp, enSpec, opts = {} as PhraseOptions] = spec
  const def = TENSE_BY_ID[tense]
  if (opts.skip?.includes(tense)) return null
  if (opts.stative && def.kind === 'progressive') return null
  if (!getTense(verb, tense).rows.some((r) => r.key === key)) return null

  const v = parseEnglishVerb(enSpec)
  const plural = key === 'noi' || key === 'voi' || key === 'loro'
  const i = PERSON_INDEX[key]
  const comp = pickNumber(itComp, plural)
  const compEn = pickNumber(enComp, plural)

  if (def.kind === 'imperative' && (opts.third || opts.invert)) return null

  // Each tense gets a distinct English rendering so learners can tell them apart:
  // imperfetto → "used to go" (habit/state), passato prossimo → "went",
  // imperfetto progressivo (stavo andando) → "was going".
  let enForm: EnForm = enFormOverride ?? (tense === 'ind-imperfetto' ? 'usedTo' : (TENSE_TO_EN[tense] ?? 'present'))
  // put/read/cost/broadcast: the simple past looks like the present, so use "have put".
  // (Not for the passato remoto, whose "Many years ago…" frame already tells them apart.)
  if (!enFormOverride && enForm === 'pastSimple' && tense !== 'ind-passato-remoto' && !v.isBe && v.past === v.base) {
    enForm = 'presentPerfect'
  }

  // Verbs only used in the third person (succedere): fixed subjects.
  let itSubject = IT_SUBJECT[key]
  let enSubject = EN_SUBJECT[key]
  if (opts.third) {
    if (key !== 'lui' && key !== 'loro') return null
    ;[itSubject, enSubject] = key === 'lui' ? opts.third.sg : opts.third.pl
  }

  // piacere: "io piaccio a Maria" → "Maria likes me"
  const enClause = opts.invert
    ? join(opts.invert, englishVerbPhrase(v, enForm, 2), EN_OBJECT[key], compEn)
    : join(enSubject, englishVerbPhrase(v, enForm, i), compEn)

  return { itSubject, itComp: comp, enClause, enImperative: join(v.base, v.particle, compEn) }
}

/**
 * A short Italian example (built from the verified conjugated form) with its
 * English translation, or null when no natural example exists.
 */
export function rowExample(verb: string, tense: TenseId, key: RowKey): RowExample | null {
  const spec = EXAMPLE_PHRASES[verb]
  if (!spec) return null
  const [itComp, enComp, enSpec, opts = {} as PhraseOptions] = spec
  const def = TENSE_BY_ID[tense]
  if (opts.skip?.includes(tense)) return null
  if (opts.stative && def.kind === 'progressive') return null

  const row = getTense(verb, tense).rows.find((r) => r.key === key)
  if (!row) return null
  const form = row.forms[0]
  const v = parseEnglishVerb(enSpec)

  // Non-finite forms
  if (key === 'form') {
    const comp = pickNumber(itComp, false)
    const ppEn = v.isBe ? 'been' : join(v.pp, v.particle)
    // piacere: "piacere a Maria" = "to please Maria", not "to like".
    if (opts.invert) {
      const en: Partial<Record<TenseId, string>> = {
        'inf-presente': `to please ${opts.invert}`,
        'inf-passato': `to have pleased ${opts.invert}`,
        'ger-presente': `pleasing ${opts.invert}`,
        'ger-passato': `having pleased ${opts.invert}`,
        'part-presente': 'pleasing',
      }
      if (en[tense]) return { it: tense === 'part-presente' ? form : join(form, itComp), en: en[tense]! }
    }
    switch (tense) {
      case 'inf-presente':
        return { it: join(form, comp), en: join('to', v.base, v.particle, enComp) }
      case 'inf-passato':
        return { it: join(form, comp), en: join('to have', ppEn, enComp) }
      case 'ger-presente':
        return { it: join(form, comp), en: join(v.isBe ? 'being' : v.ing, v.particle, enComp) }
      case 'ger-passato':
        return { it: join(form, comp), en: join('having', ppEn, enComp) }
      case 'part-presente':
        // For "be" phrases the participio presente is a separate adjective (potente = powerful,
        // nascente = rising), so a literal gloss would mislead: no example.
        if (v.isBe) return null
        return { it: form, en: join(v.ing, v.particle) }
      default:
        // Participio passato: the bare form and its English participle.
        return { it: form, en: opts.ppEn ?? join(v.pp, v.particle) }
    }
  }

  const parts = clauseParts(verb, tense, key)
  if (!parts) return null

  // Imperative: no subject, exclamation.
  if (def.kind === 'imperative') {
    // English uses one imperative for every person, so mark who is addressed.
    const who: Record<string, string> = { tu: '', lui: ' (formal)', voi: ' (plural)', loro: ' (formal, plural)' }
    const en = key === 'noi' ? `Let's ${parts.enImperative}!` : `${cap(parts.enImperative)}!${who[key]}`
    return { it: `${cap(join(form, parts.itComp))}!`, en }
  }

  let it = join(parts.itSubject, form, parts.itComp)
  let en = parts.enClause
  if (def.mood === 'congiuntivo') {
    // The congiuntivo needs a main clause; English has no subjunctive form to show the difference.
    // After a past main verb (sperava) the congiuntivo moves to the imperfetto/trapassato.
    const past = tense === 'cong-imperfetto' || tense === 'cong-trapassato'
    it = `Marco ${past ? 'sperava' : 'spera'} che ${it}`
    en = `Marco ${past ? 'hoped' : 'hopes'} that ${en}`
  } else if (tense === 'ind-passato-remoto') {
    // Distant, finished past: shown with a time phrase so it doesn't read like the passato prossimo.
    it = `Molti anni fa ${it}`
    en = `Many years ago ${en}`
  } else if (tense === 'ind-trapassato-remoto') {
    // Literary: completed just before another passato remoto action.
    it = `Dopo che ${it}, Marco partì`
    en = `After ${en}, Marco left`
  }
  return { it: `${cap(it)}.`, en: `${cap(en)}.` }
}
