import type { ConjClass, VerbEntry, VerbOverrides } from '@/types/verb'

/** Alternatives for one grammatical slot. The first entry is the primary form. */
export type Alts = string[]

/** All synthetic (one-word) forms of a verb, before pronouns and auxiliaries are added. */
export interface SimpleForms {
  infinito: string
  presente: Alts[]
  imperfetto: Alts[]
  passatoRemoto: Alts[]
  futuro: Alts[]
  condizionale: Alts[]
  congPresente: Alts[]
  congImperfetto: Alts[]
  /** Six slots (io is always null) or null when the verb has no imperative. */
  imperativo: (Alts | null)[] | null
  pp: Alts
  gerundio: Alts
  partPresente: Alts | null
}

export type VerbLookup = (infinitive: string) => VerbEntry

export function isReflexiveInfinitive(infinitive: string): boolean {
  return infinitive.endsWith('rsi')
}

/** alzarsi → alzare, accorgersi → accorgere. */
export function baseInfinitive(infinitive: string): string {
  return isReflexiveInfinitive(infinitive) ? infinitive.slice(0, -3) + 're' : infinitive
}

const PRESENT_ENDINGS: Record<ConjClass, string[]> = {
  are: ['o', 'i', 'a', 'iamo', 'ate', 'ano'],
  ere: ['o', 'i', 'e', 'iamo', 'ete', 'ono'],
  ire: ['o', 'i', 'e', 'iamo', 'ite', 'ono'],
  isc: ['isco', 'isci', 'isce', 'iamo', 'ite', 'iscono'],
}

const THEME_VOWEL: Record<ConjClass, string> = { are: 'a', ere: 'e', ire: 'i', isc: 'i' }

const IMPERFETTO_ENDINGS = ['vo', 'vi', 'va', 'vamo', 'vate', 'vano']
const CONG_IMPERFETTO_ENDINGS = ['ssi', 'ssi', 'sse', 'ssimo', 'ste', 'ssero']
const FUTURO_ENDINGS = ['ò', 'ai', 'à', 'emo', 'ete', 'anno']
const CONDIZIONALE_ENDINGS = ['ei', 'esti', 'ebbe', 'emmo', 'este', 'ebbero']

/**
 * Orthographic joining for -are verbs:
 *  - -care/-gare keep the hard sound before e/i: cerc+i → cerchi, pag+erò → pagherò
 *  - -ciare/-giare/-sciare drop the i before e/i: mangi+erò → mangerò, mangi+iamo → mangiamo
 *  - other -iare verbs with unstressed i do not double it: studi+i → studi
 */
export function joinAre(stem: string, ending: string): string {
  const first = ending[0]
  if (first === 'e' || first === 'i') {
    if (/[cg]$/.test(stem)) return stem + 'h' + ending
    if (/[cg]i$/.test(stem)) return stem.slice(0, -1) + ending
    if (stem.endsWith('i') && first === 'i') return stem.slice(0, -1) + ending
  }
  return stem + ending
}

export function parseSlots(value: string, expected: number, context: string): Alts[] {
  const slots = value.split(',').map((slot) =>
    slot
      .split('|')
      .map((form) => form.trim())
      .filter(Boolean),
  )
  if (slots.length !== expected || slots.some((s) => s.length === 0)) {
    throw new Error(`${context}: expected ${expected} forms, got "${value}"`)
  }
  return slots
}

function splitAlts(value: string): Alts {
  return value
    .split('|')
    .map((form) => form.trim())
    .filter(Boolean)
}

function resolveClassAndStem(entry: VerbEntry, ov: VerbOverrides): { cls: ConjClass; stem: string } {
  const base = baseInfinitive(entry.infinitive)
  let inferredCls: ConjClass | undefined
  let inferredStem: string | undefined
  if (base.endsWith('are')) inferredCls = 'are'
  else if (base.endsWith('ere')) inferredCls = 'ere'
  else if (base.endsWith('ire')) inferredCls = 'ire'
  if (inferredCls) inferredStem = base.slice(0, -3)
  const cls = ov.cls ?? inferredCls
  const stem = ov.stem ?? inferredStem
  if (!cls || !stem) throw new Error(`${entry.infinitive}: cannot infer conjugation class/stem; add overrides`)
  return { cls, stem }
}

export interface BuildOptions {
  /** When false only `stem`/`cls` overrides are used: this yields the "regular" reference forms. */
  irregular: boolean
}

function buildOwn(entry: VerbEntry, opts: BuildOptions): SimpleForms {
  const all = entry.overrides ?? {}
  const ov: VerbOverrides = opts.irregular ? all : { stem: all.stem, cls: all.cls }
  const { cls, stem } = resolveClassAndStem(entry, ov)
  const ctx = entry.infinitive
  const J = (ending: string) => (cls === 'are' ? joinAre(stem, ending) : stem + ending)

  const presente = ov.presente
    ? parseSlots(ov.presente, 6, `${ctx} presente`)
    : PRESENT_ENDINGS[cls].map((e) => [J(e)])

  const imperfStem = ov.imperfStem ?? J(THEME_VOWEL[cls])

  const imperfetto = ov.imperfetto
    ? parseSlots(ov.imperfetto, 6, `${ctx} imperfetto`)
    : IMPERFETTO_ENDINGS.map((e) => [imperfStem + e])

  const congImperfetto = ov.congImperfetto
    ? parseSlots(ov.congImperfetto, 6, `${ctx} congiuntivo imperfetto`)
    : CONG_IMPERFETTO_ENDINGS.map((e) => [imperfStem + e])

  // Passato remoto
  const weak: Alts[] = (() => {
    const tu = [imperfStem + 'sti']
    const noi = [imperfStem + 'mmo']
    const voi = [imperfStem + 'ste']
    if (cls === 'are') return [[J('ai')], tu, [J('ò')], noi, voi, [J('arono')]]
    if (cls === 'ere') {
      const etti = !ov.prNoEtti
      return [
        etti ? [stem + 'ei', stem + 'etti'] : [stem + 'ei'],
        tu,
        etti ? [stem + 'é', stem + 'ette'] : [stem + 'é'],
        noi,
        voi,
        etti ? [stem + 'erono', stem + 'ettero'] : [stem + 'erono'],
      ]
    }
    return [[stem + 'ii'], tu, [stem + 'ì'], noi, voi, [stem + 'irono']]
  })()

  let passatoRemoto: Alts[]
  if (ov.passatoRemoto) {
    passatoRemoto = parseSlots(ov.passatoRemoto, 6, `${ctx} passato remoto`)
  } else if (ov.prStrong) {
    // Strong verbs: irregular io/lui/loro (feci, fece, fecero), regular tu/noi/voi (facesti…).
    const s = ov.prStrong
    const strong = (i: number, ending: string): Alts => (ov.prAlsoWeak ? [s + ending, ...weak[i]] : [s + ending])
    passatoRemoto = [strong(0, 'i'), weak[1], strong(2, 'e'), weak[3], weak[4], strong(5, 'ero')]
  } else {
    passatoRemoto = weak.map((a) => [...a])
    if (ov.prStrongAlt) {
      const s = ov.prStrongAlt
      passatoRemoto[0].push(s + 'si')
      passatoRemoto[2].push(s + 'se')
      passatoRemoto[5].push(s + 'sero')
    }
  }

  // Futuro & condizionale
  const futStems = ov.futStem
    ? splitAlts(ov.futStem)
    : [cls === 'are' ? J('er') : stem + (cls === 'ere' ? 'er' : 'ir')]
  const futuro = FUTURO_ENDINGS.map((e) => futStems.map((fs) => fs + e))
  const condizionale = CONDIZIONALE_ENDINGS.map((e) => futStems.map((fs) => fs + e))

  // Congiuntivo presente
  let congPresente: Alts[]
  if (ov.congPresente) {
    congPresente = parseSlots(ov.congPresente, 6, `${ctx} congiuntivo presente`)
  } else if (cls === 'are' && !ov.presente) {
    congPresente = ['i', 'i', 'i', 'iamo', 'iate', 'ino'].map((e) => [J(e)])
  } else {
    // Built from the io form of the presente: vengo → venga, faccio → faccia, finisco → finisca
    const roots = presente[0].map((form) => {
      if (!form.endsWith('o')) throw new Error(`${ctx}: cannot derive congiuntivo from "${form}"`)
      return form.slice(0, -1)
    })
    const noi = presente[3]
    const voi = noi.map((form) => {
      if (!form.endsWith('iamo')) throw new Error(`${ctx}: cannot derive congiuntivo voi from "${form}"`)
      return form.slice(0, -4) + 'iate'
    })
    const sg = roots.map((r) => r + 'a')
    congPresente = [sg, [...sg], [...sg], [...noi], voi, roots.map((r) => r + 'ano')]
  }

  // Imperativo
  let imperativo: (Alts | null)[] | null
  if (ov.noImperative) {
    imperativo = null
  } else if (ov.imperativo) {
    imperativo = [null, ...parseSlots(ov.imperativo, 5, `${ctx} imperativo`)]
  } else {
    imperativo = [
      null,
      [...(cls === 'are' ? presente[2] : presente[1])],
      [...congPresente[2]],
      [...presente[3]],
      [...presente[4]],
      [...congPresente[5]],
    ]
  }

  const pp = ov.pp ? splitAlts(ov.pp) : [cls === 'are' ? J('ato') : stem + (cls === 'ere' ? 'uto' : 'ito')]

  // parla → parlando/parlante, vende → vendendo/vendente, dormi → dormendo/dormente, face → facendo/facente
  const derivedFromImperf = (aEnding: string, otherEnding: string) =>
    imperfStem.endsWith('a') ? imperfStem + aEnding : imperfStem.slice(0, -1) + otherEnding

  const gerundio = ov.gerundio ? splitAlts(ov.gerundio) : [derivedFromImperf('ndo', 'endo')]

  const partPresente =
    ov.partPresente === null
      ? null
      : ov.partPresente
        ? splitAlts(ov.partPresente)
        : [derivedFromImperf('nte', 'ente')]

  return {
    infinito: baseInfinitive(entry.infinitive),
    presente,
    imperfetto,
    passatoRemoto,
    futuro,
    condizionale,
    congPresente,
    congImperfetto,
    imperativo,
    pp,
    gerundio,
    partPresente,
  }
}

function mapForms(forms: SimpleForms, fn: (s: string) => string): SimpleForms {
  const m = (a: Alts) => a.map(fn)
  const m6 = (rows: Alts[]) => rows.map(m)
  return {
    infinito: fn(forms.infinito),
    presente: m6(forms.presente),
    imperfetto: m6(forms.imperfetto),
    passatoRemoto: m6(forms.passatoRemoto),
    futuro: m6(forms.futuro),
    condizionale: m6(forms.condizionale),
    congPresente: m6(forms.congPresente),
    congImperfetto: m6(forms.congImperfetto),
    imperativo: forms.imperativo ? forms.imperativo.map((a) => (a ? m(a) : null)) : null,
    pp: m(forms.pp),
    gerundio: m(forms.gerundio),
    partPresente: forms.partPresente ? m(forms.partPresente) : null,
  }
}

/**
 * Build the simple forms of a verb. Prefixed verbs (ottenere, proporre, produrre…)
 * reuse every verified form of their base verb (tenere, porre, tradurre…).
 */
export function buildSimpleForms(entry: VerbEntry, lookup: VerbLookup, opts: BuildOptions): SimpleForms {
  if (!entry.base) return buildOwn(entry, opts)
  const { verb, prefix, strip = '' } = entry.base
  const baseForms = buildSimpleForms(lookup(verb), lookup, opts)
  const derived = mapForms(baseForms, (form) => {
    if (!form.startsWith(strip)) throw new Error(`${entry.infinitive}: base form "${form}" does not start with "${strip}"`)
    return prefix + form.slice(strip.length)
  })
  if (derived.infinito !== baseInfinitive(entry.infinitive)) {
    throw new Error(`${entry.infinitive}: prefix derivation produced "${derived.infinito}"`)
  }
  return derived
}
