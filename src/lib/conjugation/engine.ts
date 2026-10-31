import { PERSONS, TENSES } from '@/data/tenses'
import type {
  Auxiliary,
  ConjugationRow,
  PersonKey,
  TenseConjugation,
  TenseId,
  VerbEntry,
  VerbInfo,
} from '@/types/verb'
import {
  baseInfinitive,
  buildSimpleForms,
  isReflexiveInfinitive,
  type Alts,
  type SimpleForms,
  type VerbLookup,
} from './simple'

const REFLEXIVE_PRONOUN: Record<PersonKey, string> = {
  io: 'mi',
  tu: 'ti',
  lui: 'si',
  noi: 'ci',
  voi: 'vi',
  loro: 'si',
}

const PLURAL: Record<PersonKey, boolean> = {
  io: false,
  tu: false,
  lui: false,
  noi: true,
  voi: true,
  loro: true,
}

/** Participle agreement with essere: andato → andato/andata, andati/andate. */
function agree(pp: Alts, plural: boolean): { forms: string[]; display: string } {
  const forms: string[] = []
  for (const p of pp) {
    if (!p.endsWith('o')) throw new Error(`Cannot inflect participle "${p}"`)
    const root = p.slice(0, -1)
    forms.push(...(plural ? [root + 'i', root + 'e'] : [root + 'o', root + 'a']))
  }
  const root = pp[0].slice(0, -1)
  return { forms, display: plural ? `${root}i/e` : `${root}o/a` }
}

function uniq(values: string[]): string[] {
  return [...new Set(values)]
}

interface Ctx {
  entry: VerbEntry
  forms: SimpleForms
  reflexive: boolean
  aux: Auxiliary
  altAux?: Auxiliary
  auxForms: Record<Auxiliary, SimpleForms>
  stare: SimpleForms
}

type AuxTense = 'presente' | 'imperfetto' | 'passatoRemoto' | 'futuro' | 'congPresente' | 'congImperfetto' | 'condizionale'

function simpleRows(ctx: Ctx, slots: Alts[]): ConjugationRow[] {
  return PERSONS.map((p, i) => {
    const forms = slots[i].map((f) => (ctx.reflexive ? `${REFLEXIVE_PRONOUN[p]} ${f}` : f))
    return { key: p, forms, display: forms.join(' / '), irregular: false }
  })
}

function compoundPhrase(aux: Auxiliary, auxForm: string, pp: Alts, plural: boolean, pron: string) {
  const prefix = pron ? `${pron} ${auxForm}` : auxForm
  if (aux === 'essere') {
    const a = agree(pp, plural)
    return { forms: a.forms.map((f) => `${prefix} ${f}`), display: `${prefix} ${a.display}` }
  }
  // Alternative participles (ho visto / ho veduto) are accepted but only the primary one is displayed.
  const forms = pp.map((f) => `${prefix} ${f}`)
  return { forms, display: forms[0] }
}

function compoundRows(ctx: Ctx, auxTense: AuxTense): ConjugationRow[] {
  return PERSONS.map((p, i) => {
    const pron = ctx.reflexive ? REFLEXIVE_PRONOUN[p] : ''
    const main = compoundPhrase(ctx.aux, ctx.auxForms[ctx.aux][auxTense][i][0], ctx.forms.pp, PLURAL[p], pron)
    const forms = [...main.forms]
    if (ctx.altAux) {
      forms.push(...compoundPhrase(ctx.altAux, ctx.auxForms[ctx.altAux][auxTense][i][0], ctx.forms.pp, PLURAL[p], pron).forms)
    }
    return { key: p, forms: uniq(forms), display: main.display, irregular: false }
  })
}

const IMPERATIVE_CLITIC: Partial<Record<PersonKey, { attach: string } | { before: string }>> = {
  tu: { attach: 'ti' },
  lui: { before: 'si' },
  noi: { attach: 'ci' },
  voi: { attach: 'vi' },
  loro: { before: 'si' },
}

function imperativeRows(ctx: Ctx): ConjugationRow[] {
  const imp = ctx.forms.imperativo
  if (!imp) return []
  const rows: ConjugationRow[] = []
  PERSONS.forEach((p, i) => {
    const slot = imp[i]
    if (!slot) return
    let forms = slot
    if (ctx.reflexive) {
      const clitic = IMPERATIVE_CLITIC[p]!
      forms = slot.map((f) => {
        if ('before' in clitic) return `${clitic.before} ${f}`
        if (f.endsWith("'")) throw new Error(`${ctx.entry.infinitive}: clitic on truncated imperative "${f}"`)
        return f + clitic.attach
      })
    }
    rows.push({ key: p, forms, display: forms.join(' / '), irregular: false })
  })
  return rows
}

function formRow(forms: string[], display?: string): ConjugationRow[] {
  return [{ key: 'form', forms: uniq(forms), display: display ?? forms.join(' / '), irregular: false }]
}

/** essere andato/a, avere parlato (aver parlato), essersi alzato/a … */
function perfectNonFinite(ctx: Ctx, kind: 'inf' | 'ger'): ConjugationRow[] {
  const build = (aux: Auxiliary) => {
    if (aux === 'avere') {
      const heads = kind === 'inf' ? ['avere', 'aver'] : ['avendo']
      const forms = heads.flatMap((h) => ctx.forms.pp.map((pp) => `${h} ${pp}`))
      return { forms, display: `${heads[0]} ${ctx.forms.pp[0]}` }
    }
    const head = ctx.reflexive ? (kind === 'inf' ? 'essersi' : 'essendosi') : kind === 'inf' ? 'essere' : 'essendo'
    const sg = agree(ctx.forms.pp, false)
    const pl = agree(ctx.forms.pp, true)
    return { forms: [...sg.forms, ...pl.forms].map((f) => `${head} ${f}`), display: `${head} ${sg.display}` }
  }
  const main = build(ctx.aux)
  const forms = [...main.forms, ...(ctx.altAux ? build(ctx.altAux).forms : [])]
  return formRow(forms, main.display)
}

function progressiveRows(ctx: Ctx, stareTense: 'presente' | 'imperfetto'): ConjugationRow[] {
  if (ctx.entry.noProgressive) return []
  const ger = ctx.forms.gerundio[0]
  return PERSONS.map((p, i) => {
    const sta = ctx.stare[stareTense][i][0]
    if (!ctx.reflexive) {
      const f = `${sta} ${ger}`
      return { key: p, forms: [f], display: f, irregular: false }
    }
    const pron = REFLEXIVE_PRONOUN[p]
    const primary = `${pron} ${sta} ${ger}`
    return { key: p, forms: [primary, `${sta} ${ger}${pron}`], display: primary, irregular: false }
  })
}

function buildTense(ctx: Ctx, tense: TenseId): TenseConjugation {
  const f = ctx.forms
  switch (tense) {
    case 'ind-presente':
      return { tense, rows: simpleRows(ctx, f.presente) }
    case 'ind-imperfetto':
      return { tense, rows: simpleRows(ctx, f.imperfetto) }
    case 'ind-passato-remoto':
      return { tense, rows: simpleRows(ctx, f.passatoRemoto) }
    case 'ind-futuro-semplice':
      return { tense, rows: simpleRows(ctx, f.futuro) }
    case 'cong-presente':
      return { tense, rows: simpleRows(ctx, f.congPresente) }
    case 'cong-imperfetto':
      return { tense, rows: simpleRows(ctx, f.congImperfetto) }
    case 'cond-presente':
      return { tense, rows: simpleRows(ctx, f.condizionale) }
    case 'ind-passato-prossimo':
      return { tense, rows: compoundRows(ctx, 'presente') }
    case 'ind-trapassato-prossimo':
      return { tense, rows: compoundRows(ctx, 'imperfetto') }
    case 'ind-trapassato-remoto':
      return { tense, rows: compoundRows(ctx, 'passatoRemoto') }
    case 'ind-futuro-anteriore':
      return { tense, rows: compoundRows(ctx, 'futuro') }
    case 'cong-passato':
      return { tense, rows: compoundRows(ctx, 'congPresente') }
    case 'cong-trapassato':
      return { tense, rows: compoundRows(ctx, 'congImperfetto') }
    case 'cond-passato':
      return { tense, rows: compoundRows(ctx, 'condizionale') }
    case 'imp-presente': {
      const rows = imperativeRows(ctx)
      return rows.length
        ? { tense, rows, note: 'No "io" form exists. Lei and Loro are the formal commands.' }
        : { tense, rows, note: `${ctx.entry.infinitive} has no imperative in standard Italian.` }
    }
    case 'inf-presente':
      return { tense, rows: formRow([ctx.entry.infinitive]) }
    case 'inf-passato':
      return { tense, rows: perfectNonFinite(ctx, 'inf') }
    case 'part-presente':
      return f.partPresente
        ? { tense, rows: formRow(f.partPresente) }
        : { tense, rows: [], note: 'This verb has no participio presente in current use.' }
    case 'part-passato':
      return { tense, rows: formRow(f.pp) }
    case 'ger-presente':
      return { tense, rows: formRow(f.gerundio.map((g) => (ctx.reflexive ? `${g}si` : g))) }
    case 'ger-passato':
      return { tense, rows: perfectNonFinite(ctx, 'ger') }
    case 'prog-presente': {
      const rows = progressiveRows(ctx, 'presente')
      return rows.length ? { tense, rows } : { tense, rows, note: 'The progressive construction is not idiomatic with this verb.' }
    }
    case 'prog-imperfetto': {
      const rows = progressiveRows(ctx, 'imperfetto')
      return rows.length ? { tense, rows } : { tense, rows, note: 'The progressive construction is not idiomatic with this verb.' }
    }
  }
}

function groupLabel(entry: VerbEntry, lookup: VerbLookup): string {
  const base = baseInfinitive(entry.infinitive)
  if (base.endsWith('rre')) return '2ª coniugazione (-rre, forma contratta)'
  if (base.endsWith('are')) return '1ª coniugazione (-are)'
  if (base.endsWith('ere')) return '2ª coniugazione (-ere)'
  let source: VerbEntry | undefined = entry
  while (source?.base) source = lookup(source.base.verb)
  if (source?.overrides?.cls === 'isc') return '3ª coniugazione (-ire, tipo -isc-)'
  return '3ª coniugazione (-ire)'
}

export function createEngine(lookup: VerbLookup) {
  const simpleCache = new Map<string, { actual: SimpleForms; regular: SimpleForms }>()
  const infoCache = new Map<string, VerbInfo>()

  function simple(infinitive: string) {
    let hit = simpleCache.get(infinitive)
    if (!hit) {
      const entry = lookup(infinitive)
      hit = {
        actual: buildSimpleForms(entry, lookup, { irregular: true }),
        regular: buildSimpleForms(entry, lookup, { irregular: false }),
      }
      simpleCache.set(infinitive, hit)
    }
    return hit
  }

  function conjugateWith(entry: VerbEntry, forms: SimpleForms, auxForms: Record<Auxiliary, SimpleForms>, stare: SimpleForms) {
    const ctx: Ctx = {
      entry,
      forms,
      reflexive: isReflexiveInfinitive(entry.infinitive),
      aux: entry.auxiliary,
      altAux: entry.altAuxiliary,
      auxForms,
      stare,
    }
    return Object.fromEntries(TENSES.map((t) => [t.id, buildTense(ctx, t.id)])) as Record<TenseId, TenseConjugation>
  }

  function getVerbInfo(infinitive: string): VerbInfo {
    const cached = infoCache.get(infinitive)
    if (cached) return cached
    const entry = lookup(infinitive)
    const { actual, regular } = simple(infinitive)
    const auxForms = { avere: simple('avere').actual, essere: simple('essere').actual }
    const stare = simple('stare').actual
    const conjugations = conjugateWith(entry, actual, auxForms, stare)
    const reference = conjugateWith(entry, regular, auxForms, stare)

    let irregular = false
    for (const t of TENSES) {
      const refRows = reference[t.id].rows
      for (const row of conjugations[t.id].rows) {
        const ref = refRows.find((r) => r.key === row.key)
        row.irregular = !ref || ref.forms[0] !== row.forms[0]
        // Participio presente is excluded: forms like dormiente are lexical, not a sign of an irregular verb.
        if (row.irregular && t.standard && t.id !== 'part-presente') irregular = true
      }
    }

    const reflexive = isReflexiveInfinitive(entry.infinitive)
    const types: string[] = []
    if (entry.infinitive === 'essere' || entry.infinitive === 'avere') types.push('ausiliare')
    if (entry.modal) types.push('modale')
    if (reflexive) types.push('riflessivo')
    types.push(irregular ? 'irregolare' : 'regolare')

    const info: VerbInfo = {
      entry,
      reflexive,
      irregular,
      group: groupLabel(entry, lookup),
      types,
      conjugations,
    }
    infoCache.set(infinitive, info)
    return info
  }

  return { getVerbInfo, simpleForms: (inf: string) => simple(inf).actual }
}
