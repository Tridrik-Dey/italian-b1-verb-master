import { VERBS } from '@/data/verbs'
import { getVerb } from '@/lib/conjugation'
import type { RowKey, TenseId } from '@/types/verb'

const p = (verb: string, tense: TenseId) => getVerb(verb).conjugations[tense].rows.map((r) => r.forms[0])
const forms = (verb: string, tense: TenseId, key: RowKey) =>
  getVerb(verb).conjugations[tense].rows.find((r) => r.key === key)?.forms ?? []
const split = (s: string) => s.split(',').map((x) => x.trim())

/** Reference forms for the tenses beyond B1, written independently of the engine. */
const VERIFIED: Record<string, Partial<Record<TenseId, string>>> = {
  essere: {
    'ind-passato-remoto': 'fui, fosti, fu, fummo, foste, furono',
    'cong-imperfetto': 'fossi, fossi, fosse, fossimo, foste, fossero',
  },
  avere: { 'ind-passato-remoto': 'ebbi, avesti, ebbe, avemmo, aveste, ebbero' },
  fare: {
    'ind-passato-remoto': 'feci, facesti, fece, facemmo, faceste, fecero',
    'cong-imperfetto': 'facessi, facessi, facesse, facessimo, faceste, facessero',
  },
  stare: {
    'ind-passato-remoto': 'stetti, stesti, stette, stemmo, steste, stettero',
    'cong-imperfetto': 'stessi, stessi, stesse, stessimo, steste, stessero',
  },
  dare: {
    'ind-passato-remoto': 'diedi, desti, diede, demmo, deste, diedero',
    'cong-imperfetto': 'dessi, dessi, desse, dessimo, deste, dessero',
  },
  andare: { 'ind-passato-remoto': 'andai, andasti, andò, andammo, andaste, andarono' },
  venire: { 'ind-passato-remoto': 'venni, venisti, venne, venimmo, veniste, vennero' },
  sapere: { 'ind-passato-remoto': 'seppi, sapesti, seppe, sapemmo, sapeste, seppero' },
  dire: {
    'ind-passato-remoto': 'dissi, dicesti, disse, dicemmo, diceste, dissero',
    'cong-imperfetto': 'dicessi, dicessi, dicesse, dicessimo, diceste, dicessero',
  },
  volere: { 'ind-passato-remoto': 'volli, volesti, volle, volemmo, voleste, vollero' },
  rimanere: { 'ind-passato-remoto': 'rimasi, rimanesti, rimase, rimanemmo, rimaneste, rimasero' },
  tenere: { 'ind-passato-remoto': 'tenni, tenesti, tenne, tenemmo, teneste, tennero' },
  prendere: { 'ind-passato-remoto': 'presi, prendesti, prese, prendemmo, prendeste, presero' },
  mettere: { 'ind-passato-remoto': 'misi, mettesti, mise, mettemmo, metteste, misero' },
  bere: {
    'ind-passato-remoto': 'bevvi, bevesti, bevve, bevemmo, beveste, bevvero',
    'cong-imperfetto': 'bevessi, bevessi, bevesse, bevessimo, beveste, bevessero',
  },
  scegliere: { 'ind-passato-remoto': 'scelsi, scegliesti, scelse, scegliemmo, sceglieste, scelsero' },
  porre: { 'ind-passato-remoto': 'posi, ponesti, pose, ponemmo, poneste, posero' },
  tradurre: {
    'ind-passato-remoto': 'tradussi, traducesti, tradusse, traducemmo, traduceste, tradussero',
    'cong-imperfetto': 'traducessi, traducessi, traducesse, traducessimo, traduceste, traducessero',
  },
  vedere: { 'ind-passato-remoto': 'vidi, vedesti, vide, vedemmo, vedeste, videro' },
  conoscere: { 'ind-passato-remoto': 'conobbi, conoscesti, conobbe, conoscemmo, conosceste, conobbero' },
  nascere: { 'ind-passato-remoto': 'nacqui, nascesti, nacque, nascemmo, nasceste, nacquero' },
  piacere: { 'ind-passato-remoto': 'piacqui, piacesti, piacque, piacemmo, piaceste, piacquero' },
  produrre: { 'ind-passato-remoto': 'produssi, producesti, produsse, producemmo, produceste, produssero' },
  apparire: { 'ind-passato-remoto': 'apparvi, apparisti, apparve, apparimmo, appariste, apparvero' },
  rompere: { 'ind-passato-remoto': 'ruppi, rompesti, ruppe, rompemmo, rompeste, ruppero' },
  parlare: {
    'ind-passato-remoto': 'parlai, parlasti, parlò, parlammo, parlaste, parlarono',
    'cong-imperfetto': 'parlassi, parlassi, parlasse, parlassimo, parlaste, parlassero',
  },
  dormire: { 'ind-passato-remoto': 'dormii, dormisti, dormì, dormimmo, dormiste, dormirono' },
  capire: { 'cong-imperfetto': 'capissi, capissi, capisse, capissimo, capiste, capissero' },
}

describe('verified forms beyond B1', () => {
  for (const [verb, tenses] of Object.entries(VERIFIED)) {
    for (const [tense, expected] of Object.entries(tenses)) {
      it(`${verb} — ${tense}`, () => {
        expect(p(verb, tense as TenseId)).toEqual(split(expected!))
      })
    }
  }

  it('regular -ere passato remoto accepts the -etti forms; ripetere does not', () => {
    expect(forms('credere', 'ind-passato-remoto', 'io')).toEqual(['credei', 'credetti'])
    expect(forms('credere', 'ind-passato-remoto', 'lui')).toEqual(['credé', 'credette'])
    expect(forms('ripetere', 'ind-passato-remoto', 'io')).toEqual(['ripetei'])
  })

  it('accepts the documented passato remoto alternatives', () => {
    expect(forms('dare', 'ind-passato-remoto', 'io')).toEqual(['diedi', 'detti'])
    expect(forms('perdere', 'ind-passato-remoto', 'io')).toEqual(['persi', 'perdei', 'perdetti'])
    expect(forms('aprire', 'ind-passato-remoto', 'io')).toEqual(['aprii', 'apersi'])
  })

  it('builds the trapassato remoto and congiuntivo trapassato with the right auxiliary', () => {
    expect(p('fare', 'ind-trapassato-remoto')[0]).toBe('ebbi fatto')
    expect(p('andare', 'ind-trapassato-remoto')[2]).toBe('fu andato')
    expect(p('fare', 'cong-trapassato')[0]).toBe('avessi fatto')
    expect(forms('andare', 'cong-trapassato', 'noi')).toEqual(['fossimo andati', 'fossimo andate'])
    expect(p('alzarsi', 'cong-trapassato')[0]).toBe('mi fossi alzato')
  })

  it('builds the infinito and gerundio passato, including reflexives and agreement', () => {
    expect(forms('parlare', 'inf-passato', 'form')).toEqual(['avere parlato', 'aver parlato'])
    expect(forms('andare', 'inf-passato', 'form')[0]).toBe('essere andato')
    expect(forms('parlare', 'ger-passato', 'form')).toEqual(['avendo parlato'])
    expect(forms('uscire', 'ger-passato', 'form')).toContain('essendo uscita')
    expect(p('alzarsi', 'inf-passato')).toEqual(['essersi alzato'])
    expect(p('alzarsi', 'ger-passato')).toEqual(['essendosi alzato'])
  })

  it('gives the participio presente, with lexical overrides and gaps', () => {
    expect(p('parlare', 'part-presente')).toEqual(['parlante'])
    expect(p('dormire', 'part-presente')).toEqual(['dormiente'])
    expect(p('venire', 'part-presente')).toEqual(['veniente'])
    expect(getVerb('essere').conjugations['part-presente'].rows).toHaveLength(0)
    expect(getVerb('dovere').conjugations['part-presente'].rows).toHaveLength(0)
  })

  it('compound forms beyond B1 start with the right auxiliary', () => {
    const essere = /^(?:(?:mi|ti|si|ci|vi) )?(fui|fosti|fu|fummo|foste|furono|fossi|fosse|fossimo|fossero) /
    const avere = /^(ebbi|avesti|ebbe|avemmo|aveste|ebbero|avessi|avesse|avessimo|aveste|avessero) /
    for (const v of VERBS) {
      for (const t of ['ind-trapassato-remoto', 'cong-trapassato'] as const) {
        for (const row of getVerb(v.infinitive).conjugations[t].rows) {
          expect(row.forms[0], `${v.infinitive} ${t}`).toMatch(v.auxiliary === 'essere' ? essere : avere)
        }
      }
    }
  })
})
