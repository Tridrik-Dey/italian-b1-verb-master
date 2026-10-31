import { EXAMPLE_PHRASES } from '@/data/example-phrases'
import { TENSES } from '@/data/tenses'
import { VERBS } from '@/data/verbs'
import { getTense } from '@/lib/conjugation'
import { parseEnglishVerb, rowExample } from './examples'

describe('row examples', () => {
  it('every verb has example material, and nothing extra', () => {
    expect(Object.keys(EXAMPLE_PHRASES).sort()).toEqual(VERBS.map((v) => v.infinitive).sort())
  })

  it('every Italian example contains the exact conjugated form from the chart', () => {
    let count = 0
    for (const v of VERBS) {
      for (const t of TENSES) {
        for (const row of getTense(v.infinitive, t.id).rows) {
          const ex = rowExample(v.infinitive, t.id, row.key)
          if (!ex) continue
          count++
          expect(ex.it.toLowerCase(), `${v.infinitive} ${t.id} ${row.key}`).toContain(row.forms[0].toLowerCase())
          expect(ex.en.length).toBeGreaterThan(0)
          expect(ex.en).not.toMatch(/undefined|null|\s{2}/)
        }
      }
    }
    // Almost every row has an example; only unnatural combinations are skipped.
    expect(count).toBeGreaterThan(15000)
  })

  it('builds natural examples across tenses', () => {
    expect(rowExample('essere', 'ind-presente', 'io')).toEqual({ it: 'Io sono a casa.', en: 'I am at home.' })
    expect(rowExample('andare', 'ind-passato-prossimo', 'noi')).toEqual({
      it: 'Noi siamo andati al mare.',
      en: 'We went to the seaside.',
    })
    expect(rowExample('fare', 'ind-imperfetto', 'lui')).toEqual({ it: 'Lui faceva una passeggiata.', en: 'He used to take a walk.' })
    expect(rowExample('fare', 'prog-imperfetto', 'lui')).toEqual({ it: 'Lui stava facendo una passeggiata.', en: 'He was taking a walk.' })
    expect(rowExample('sapere', 'ind-imperfetto', 'io')).toEqual({ it: 'Io sapevo la verità.', en: 'I used to know the truth.' })
    expect(rowExample('essere', 'ind-imperfetto', 'io')).toEqual({ it: 'Io ero a casa.', en: 'I used to be at home.' })
    expect(rowExample('essere', 'ind-passato-prossimo', 'io')).toEqual({ it: 'Io sono stato a casa.', en: 'I was at home.' })
    expect(rowExample('piacere', 'ind-imperfetto', 'lui')).toEqual({ it: 'Lui piaceva a Maria.', en: 'Maria used to like him.' })
    expect(rowExample('mangiare', 'cond-passato', 'tu')).toEqual({ it: 'Tu avresti mangiato la pizza.', en: 'You would have eaten pizza.' })
    expect(rowExample('andare', 'cong-presente', 'lui')).toEqual({
      it: 'Marco spera che lui vada al mare.',
      en: 'Marco hopes that he goes to the seaside.',
    })
    expect(rowExample('andare', 'cong-passato', 'io')).toEqual({
      it: 'Marco spera che io sia andato al mare.',
      en: 'Marco hopes that I went to the seaside.',
    })
    expect(rowExample('mettere', 'ind-presente', 'io')?.en).toBe('I put the book on the table.')
    expect(rowExample('mettere', 'ind-passato-prossimo', 'io')?.en).toBe('I have put the book on the table.')
    expect(rowExample('essere', 'ind-presente', 'voi')).toEqual({ it: 'Voi siete a casa.', en: 'You (pl.) are at home.' })
    expect(rowExample('bere', 'ind-futuro-semplice', 'loro')).toEqual({ it: 'Loro berranno un caffè.', en: 'They will drink a coffee.' })
  })

  it('handles reflexive verbs, particles and the imperative', () => {
    expect(rowExample('alzarsi', 'ind-passato-prossimo', 'io')).toEqual({ it: 'Io mi sono alzato presto.', en: 'I got up early.' })
    expect(rowExample('alzarsi', 'imp-presente', 'noi')).toEqual({ it: 'Alziamoci presto!', en: "Let's get up early!" })
    expect(rowExample('andare', 'imp-presente', 'tu')).toEqual({ it: "Va' al mare!", en: 'Go to the seaside!' })
    expect(rowExample('andare', 'imp-presente', 'lui')?.en).toBe('Go to the seaside! (formal)')
  })

  it('handles non-finite forms', () => {
    expect(rowExample('andare', 'inf-presente', 'form')).toEqual({ it: 'andare al mare', en: 'to go to the seaside' })
    expect(rowExample('andare', 'ger-presente', 'form')).toEqual({ it: 'andando al mare', en: 'going to the seaside' })
    expect(rowExample('scrivere', 'part-passato', 'form')).toEqual({ it: 'scritto', en: 'written' })
    expect(rowExample('nascere', 'part-passato', 'form')).toEqual({ it: 'nato', en: 'born' })
  })

  it('handles special verbs (agreement, piacere, succedere, modals)', () => {
    expect(rowExample('diventare', 'ind-presente', 'loro')).toEqual({ it: 'Loro diventano famosi.', en: 'They become famous.' })
    expect(rowExample('piacere', 'ind-presente', 'io')).toEqual({ it: 'Io piaccio a Maria.', en: 'Maria likes me.' })
    expect(rowExample('piacere', 'inf-presente', 'form')).toEqual({ it: 'piacere a Maria', en: 'to please Maria' })
    expect(rowExample('succedere', 'ind-presente', 'lui')).toEqual({ it: 'Questo succede spesso.', en: 'This happens often.' })
    expect(rowExample('succedere', 'ind-presente', 'io')).toBeNull()
    expect(rowExample('potere', 'ind-presente', 'noi')).toEqual({ it: 'Noi possiamo parlare italiano.', en: 'We are able to speak Italian.' })
    expect(rowExample('dovere', 'ind-passato-prossimo', 'io')).toEqual({ it: 'Io ho dovuto studiare di più.', en: 'I had to study more.' })
  })

  // Ignore only punctuation and case, so "(formal)"/"(pl.)"/"Marco hopes that" still count as differences.
  const norm = (s: string) => s.replace(/[.!]$/, '').toLowerCase()

  it('never gives two tenses of the same person the same English translation', () => {
    for (const v of VERBS) {
      for (const key of ['io', 'tu', 'lui', 'noi', 'voi', 'loro', 'form'] as const) {
        const seen = new Map<string, string>()
        for (const t of TENSES) {
          const ex = rowExample(v.infinitive, t.id, key)
          if (!ex) continue
          const prev = seen.get(norm(ex.en))
          expect(prev, `${v.infinitive} ${key}: ${prev} and ${t.id} both "${ex.en}"`).toBeUndefined()
          seen.set(norm(ex.en), t.id)
        }
      }
    }
  })

  it('never gives two persons of the same tense the same English (or Italian) example', () => {
    for (const v of VERBS) {
      for (const t of TENSES) {
        const en = new Map<string, string>()
        const it = new Map<string, string>()
        for (const row of getTense(v.infinitive, t.id).rows) {
          const ex = rowExample(v.infinitive, t.id, row.key)
          if (!ex) continue
          expect(en.get(norm(ex.en)), `${v.infinitive} ${t.id}: "${ex.en}"`).toBeUndefined()
          expect(it.get(ex.it), `${v.infinitive} ${t.id}: "${ex.it}"`).toBeUndefined()
          en.set(norm(ex.en), row.key)
          it.set(ex.it, row.key)
        }
      }
    }
  })

  it('skips unnatural combinations', () => {
    expect(rowExample('nascere', 'imp-presente', 'tu')).toBeNull()
    expect(rowExample('conoscere', 'prog-presente', 'io')).toBeNull()
  })
})

describe('English verb morphology', () => {
  it('derives regular forms with spelling rules', () => {
    expect(parseEnglishVerb('study')).toMatchObject({ s3: 'studies', past: 'studied', ing: 'studying' })
    expect(parseEnglishVerb('play')).toMatchObject({ s3: 'plays', past: 'played' })
    expect(parseEnglishVerb('close')).toMatchObject({ past: 'closed', ing: 'closing' })
    expect(parseEnglishVerb('watch')).toMatchObject({ s3: 'watches' })
    expect(parseEnglishVerb('go|went|gone')).toMatchObject({ s3: 'goes', past: 'went', pp: 'gone' })
    expect(parseEnglishVerb('die|died|died|dying')).toMatchObject({ ing: 'dying' })
    expect(parseEnglishVerb('get up|got|got|getting')).toMatchObject({ base: 'get', particle: 'up', past: 'got' })
  })
})
