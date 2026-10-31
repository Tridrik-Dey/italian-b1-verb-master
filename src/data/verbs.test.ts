import { PRIORITIES } from '@/data/priorities'
import { B1_TENSE_IDS, CORE_TENSE_IDS, PERSONS, STANDARD_TENSE_IDS, TENSES } from '@/data/tenses'
import { VERBS, verbsByPriority } from '@/data/verbs'
import { getVerb } from '@/lib/conjugation'

describe('verb database', () => {
  it('contains exactly 200 verbs', () => {
    expect(VERBS).toHaveLength(200)
  })

  it('has no duplicate infinitives', () => {
    const infinitives = VERBS.map((v) => v.infinitive)
    expect(new Set(infinitives).size).toBe(infinitives.length)
  })

  it('has 50 / 50 / 60 / 40 verbs per priority', () => {
    expect(verbsByPriority('essenziali')).toHaveLength(50)
    expect(verbsByPriority('alta')).toHaveLength(50)
    expect(verbsByPriority('media')).toHaveLength(60)
    expect(verbsByPriority('bassa')).toHaveLength(40)
    for (const p of PRIORITIES) expect(verbsByPriority(p.id)).toHaveLength(p.expectedCount)
  })

  it('includes all the irregular verbs required by the syllabus', () => {
    const required = [
      'essere', 'avere', 'fare', 'stare', 'andare', 'venire', 'sapere', 'dire', 'dare', 'potere', 'volere',
      'dovere', 'uscire', 'rimanere', 'tenere', 'prendere', 'mettere', 'bere', 'scegliere', 'porre', 'tradurre',
    ]
    const all = new Set(VERBS.map((v) => v.infinitive))
    for (const v of required) expect(all.has(v), v).toBe(true)
  })

  it('every verb has metadata, examples and a valid auxiliary', () => {
    for (const v of VERBS) {
      expect(v.english.length, v.infinitive).toBeGreaterThan(0)
      expect(['avere', 'essere']).toContain(v.auxiliary)
      expect(v.examples.length, v.infinitive).toBeGreaterThanOrEqual(1)
      for (const ex of v.examples) {
        expect(ex.it.length).toBeGreaterThan(0)
        expect(ex.en.length).toBeGreaterThan(0)
      }
      const info = getVerb(v.infinitive)
      expect(info.group).toMatch(/coniugazione/)
      expect(info.types).toContain(info.irregular ? 'irregolare' : 'regolare')
    }
  })

  it('includes regular, irregular, reflexive and modal verbs', () => {
    const infos = VERBS.map((v) => getVerb(v.infinitive))
    expect(infos.some((i) => i.irregular)).toBe(true)
    expect(infos.some((i) => !i.irregular)).toBe(true)
    expect(infos.filter((i) => i.reflexive).length).toBeGreaterThanOrEqual(15)
    expect(infos.filter((i) => i.entry.modal).map((i) => i.entry.infinitive).sort()).toEqual(['dovere', 'potere', 'volere'])
  })
})

describe('conjugation coverage', () => {
  it('every tense has a unique English name', () => {
    const names = TENSES.map((t) => t.english)
    for (const n of names) expect(n.length).toBeGreaterThan(0)
    expect(new Set(names).size).toBe(names.length)
    expect(TENSES.find((t) => t.id === 'ind-presente')!.english).toBe('Present')
  })

  it('has all 21 standard tenses plus 2 progressive constructions, 16 of them marked B1', () => {
    expect(STANDARD_TENSE_IDS).toHaveLength(21)
    expect(TENSES).toHaveLength(23)
    expect(TENSES.filter((t) => t.kind === 'progressive')).toHaveLength(2)
    expect(Object.keys(getVerb('fare').conjugations)).toHaveLength(23)
    expect(B1_TENSE_IDS).toHaveLength(16)
    expect(TENSES.filter((t) => !t.b1).map((t) => t.id)).toEqual([
      'ind-passato-remoto',
      'ind-trapassato-remoto',
      'cong-imperfetto',
      'cong-trapassato',
      'inf-passato',
      'part-presente',
      'ger-passato',
    ])
    // Mastery stays based on core B1 tenses only.
    for (const t of CORE_TENSE_IDS) expect(B1_TENSE_IDS).toContain(t)
  })

  it('every verb has every applicable conjugation, with no empty or placeholder forms', () => {
    for (const v of VERBS) {
      const info = getVerb(v.infinitive)
      for (const t of TENSES) {
        const conj = info.conjugations[t.id]
        expect(conj, `${v.infinitive} ${t.id}`).toBeDefined()
        for (const row of conj.rows) {
          expect(row.forms.length).toBeGreaterThan(0)
          for (const f of row.forms) {
            expect(f, `${v.infinitive} ${t.id} ${row.key}`).toMatch(/^[a-zàèéìòù' ]+$/)
            expect(f).not.toMatch(/undefined|null|TODO|\?\?/)
          }
        }
        // Rows may only be missing where Italian genuinely lacks the form.
        if (!conj.rows.length) {
          expect(['imp-presente', 'part-presente', 'prog-presente', 'prog-imperfetto']).toContain(t.id)
          expect(conj.note).toBeTruthy()
        }
      }
    }
  })

  it('all finite tenses have exactly the six persons', () => {
    const finite = TENSES.filter((t) => t.kind === 'simple' || t.kind === 'compound' || t.kind === 'progressive')
    for (const v of VERBS) {
      const info = getVerb(v.infinitive)
      for (const t of finite) {
        const rows = info.conjugations[t.id].rows
        if (t.kind === 'progressive' && rows.length === 0) continue
        expect(rows.map((r) => r.key), `${v.infinitive} ${t.id}`).toEqual(PERSONS)
      }
    }
  })

  it('the imperative never has an io form and has 5 persons when it exists', () => {
    for (const v of VERBS) {
      const rows = getVerb(v.infinitive).conjugations['imp-presente'].rows
      if (!rows.length) continue
      expect(rows.map((r) => r.key)).toEqual(['tu', 'lui', 'noi', 'voi', 'loro'])
    }
  })

  it('only potere and dovere lack an imperative', () => {
    const without = VERBS.filter((v) => getVerb(v.infinitive).conjugations['imp-presente'].rows.length === 0).map((v) => v.infinitive)
    expect(without.sort()).toEqual(['dovere', 'potere'])
  })

  it('non-finite forms have a single "form" row', () => {
    for (const v of VERBS) {
      const info = getVerb(v.infinitive)
      for (const t of TENSES.filter((x) => x.kind === 'nonfinite')) {
        const rows = info.conjugations[t.id].rows
        if (!rows.length) continue
        expect(rows.map((r) => r.key)).toEqual(['form'])
      }
    }
  })

  it('core tenses exist for all verbs (except the imperative of potere/dovere)', () => {
    for (const v of VERBS) {
      for (const t of CORE_TENSE_IDS) {
        if (t === 'imp-presente' && ['potere', 'dovere'].includes(v.infinitive)) continue
        expect(getVerb(v.infinitive).conjugations[t].rows.length, `${v.infinitive} ${t}`).toBeGreaterThan(0)
      }
    }
  })
})
