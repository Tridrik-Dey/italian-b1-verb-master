import { VERBS } from '@/data/verbs'
import { getVerb, joinAre } from '@/lib/conjugation'
import type { RowKey, TenseId } from '@/types/verb'

/** Primary forms of a tense, in person order. */
const p = (verb: string, tense: TenseId) => getVerb(verb).conjugations[tense].rows.map((r) => r.forms[0])
const forms = (verb: string, tense: TenseId, key: RowKey) =>
  getVerb(verb).conjugations[tense].rows.find((r) => r.key === key)?.forms ?? []
const split = (s: string) => s.split(',').map((x) => x.trim())

/**
 * Reference conjugations written independently of the engine (standard grammar
 * references), for the irregular verbs the syllabus requires.
 */
const VERIFIED: Record<string, Partial<Record<TenseId, string>>> = {
  essere: {
    'ind-presente': 'sono, sei, è, siamo, siete, sono',
    'ind-imperfetto': 'ero, eri, era, eravamo, eravate, erano',
    'ind-futuro-semplice': 'sarò, sarai, sarà, saremo, sarete, saranno',
    'cong-presente': 'sia, sia, sia, siamo, siate, siano',
    'cond-presente': 'sarei, saresti, sarebbe, saremmo, sareste, sarebbero',
    'imp-presente': 'sii, sia, siamo, siate, siano',
    'ind-passato-prossimo': 'sono stato, sei stato, è stato, siamo stati, siete stati, sono stati',
  },
  avere: {
    'ind-presente': 'ho, hai, ha, abbiamo, avete, hanno',
    'ind-futuro-semplice': 'avrò, avrai, avrà, avremo, avrete, avranno',
    'cong-presente': 'abbia, abbia, abbia, abbiamo, abbiate, abbiano',
    'imp-presente': 'abbi, abbia, abbiamo, abbiate, abbiano',
    'ind-passato-prossimo': 'ho avuto, hai avuto, ha avuto, abbiamo avuto, avete avuto, hanno avuto',
  },
  fare: {
    'ind-presente': 'faccio, fai, fa, facciamo, fate, fanno',
    'ind-imperfetto': 'facevo, facevi, faceva, facevamo, facevate, facevano',
    'ind-futuro-semplice': 'farò, farai, farà, faremo, farete, faranno',
    'cong-presente': 'faccia, faccia, faccia, facciamo, facciate, facciano',
    'imp-presente': "fa', faccia, facciamo, fate, facciano",
    'ger-presente': 'facendo',
    'part-passato': 'fatto',
  },
  stare: {
    'ind-presente': 'sto, stai, sta, stiamo, state, stanno',
    'ind-futuro-semplice': 'starò, starai, starà, staremo, starete, staranno',
    'cong-presente': 'stia, stia, stia, stiamo, stiate, stiano',
    'imp-presente': "sta', stia, stiamo, state, stiano",
    'ind-passato-prossimo': 'sono stato, sei stato, è stato, siamo stati, siete stati, sono stati',
  },
  andare: {
    'ind-presente': 'vado, vai, va, andiamo, andate, vanno',
    'ind-futuro-semplice': 'andrò, andrai, andrà, andremo, andrete, andranno',
    'cong-presente': 'vada, vada, vada, andiamo, andiate, vadano',
    'imp-presente': "va', vada, andiamo, andate, vadano",
    'cond-presente': 'andrei, andresti, andrebbe, andremmo, andreste, andrebbero',
  },
  venire: {
    'ind-presente': 'vengo, vieni, viene, veniamo, venite, vengono',
    'ind-futuro-semplice': 'verrò, verrai, verrà, verremo, verrete, verranno',
    'cong-presente': 'venga, venga, venga, veniamo, veniate, vengano',
    'imp-presente': 'vieni, venga, veniamo, venite, vengano',
    'part-passato': 'venuto',
  },
  sapere: {
    'ind-presente': 'so, sai, sa, sappiamo, sapete, sanno',
    'ind-futuro-semplice': 'saprò, saprai, saprà, sapremo, saprete, sapranno',
    'cong-presente': 'sappia, sappia, sappia, sappiamo, sappiate, sappiano',
    'imp-presente': 'sappi, sappia, sappiamo, sappiate, sappiano',
  },
  dire: {
    'ind-presente': 'dico, dici, dice, diciamo, dite, dicono',
    'ind-imperfetto': 'dicevo, dicevi, diceva, dicevamo, dicevate, dicevano',
    'ind-futuro-semplice': 'dirò, dirai, dirà, diremo, direte, diranno',
    'cong-presente': 'dica, dica, dica, diciamo, diciate, dicano',
    'imp-presente': "di', dica, diciamo, dite, dicano",
    'part-passato': 'detto',
    'ger-presente': 'dicendo',
  },
  dare: {
    'ind-presente': 'do, dai, dà, diamo, date, danno',
    'ind-futuro-semplice': 'darò, darai, darà, daremo, darete, daranno',
    'cong-presente': 'dia, dia, dia, diamo, diate, diano',
    'imp-presente': "da', dia, diamo, date, diano",
  },
  potere: {
    'ind-presente': 'posso, puoi, può, possiamo, potete, possono',
    'ind-futuro-semplice': 'potrò, potrai, potrà, potremo, potrete, potranno',
    'cong-presente': 'possa, possa, possa, possiamo, possiate, possano',
    'cond-presente': 'potrei, potresti, potrebbe, potremmo, potreste, potrebbero',
  },
  volere: {
    'ind-presente': 'voglio, vuoi, vuole, vogliamo, volete, vogliono',
    'ind-futuro-semplice': 'vorrò, vorrai, vorrà, vorremo, vorrete, vorranno',
    'cong-presente': 'voglia, voglia, voglia, vogliamo, vogliate, vogliano',
    'cond-presente': 'vorrei, vorresti, vorrebbe, vorremmo, vorreste, vorrebbero',
  },
  dovere: {
    'ind-presente': 'devo, devi, deve, dobbiamo, dovete, devono',
    'ind-futuro-semplice': 'dovrò, dovrai, dovrà, dovremo, dovrete, dovranno',
    'cond-presente': 'dovrei, dovresti, dovrebbe, dovremmo, dovreste, dovrebbero',
  },
  uscire: {
    'ind-presente': 'esco, esci, esce, usciamo, uscite, escono',
    'cong-presente': 'esca, esca, esca, usciamo, usciate, escano',
    'imp-presente': 'esci, esca, usciamo, uscite, escano',
    'ind-passato-prossimo': 'sono uscito, sei uscito, è uscito, siamo usciti, siete usciti, sono usciti',
  },
  rimanere: {
    'ind-presente': 'rimango, rimani, rimane, rimaniamo, rimanete, rimangono',
    'ind-futuro-semplice': 'rimarrò, rimarrai, rimarrà, rimarremo, rimarrete, rimarranno',
    'cong-presente': 'rimanga, rimanga, rimanga, rimaniamo, rimaniate, rimangano',
    'part-passato': 'rimasto',
  },
  tenere: {
    'ind-presente': 'tengo, tieni, tiene, teniamo, tenete, tengono',
    'ind-futuro-semplice': 'terrò, terrai, terrà, terremo, terrete, terranno',
    'imp-presente': 'tieni, tenga, teniamo, tenete, tengano',
  },
  prendere: {
    'part-passato': 'preso',
  },
  mettere: {
    'part-passato': 'messo',
  },
  bere: {
    'ind-presente': 'bevo, bevi, beve, beviamo, bevete, bevono',
    'ind-imperfetto': 'bevevo, bevevi, beveva, bevevamo, bevevate, bevevano',
    'ind-futuro-semplice': 'berrò, berrai, berrà, berremo, berrete, berranno',
    'cong-presente': 'beva, beva, beva, beviamo, beviate, bevano',
    'part-passato': 'bevuto',
    'ger-presente': 'bevendo',
  },
  scegliere: {
    'ind-presente': 'scelgo, scegli, sceglie, scegliamo, scegliete, scelgono',
    'cong-presente': 'scelga, scelga, scelga, scegliamo, scegliate, scelgano',
    'part-passato': 'scelto',
  },
  porre: {
    'ind-presente': 'pongo, poni, pone, poniamo, ponete, pongono',
    'ind-imperfetto': 'ponevo, ponevi, poneva, ponevamo, ponevate, ponevano',
    'ind-futuro-semplice': 'porrò, porrai, porrà, porremo, porrete, porranno',
    'cong-presente': 'ponga, ponga, ponga, poniamo, poniate, pongano',
    'part-passato': 'posto',
    'ger-presente': 'ponendo',
  },
  tradurre: {
    'ind-presente': 'traduco, traduci, traduce, traduciamo, traducete, traducono',
    'ind-imperfetto': 'traducevo, traducevi, traduceva, traducevamo, traducevate, traducevano',
    'ind-futuro-semplice': 'tradurrò, tradurrai, tradurrà, tradurremo, tradurrete, tradurranno',
    'part-passato': 'tradotto',
    'ger-presente': 'traducendo',
  },
  piacere: {
    'ind-presente': 'piaccio, piaci, piace, piacciamo, piacete, piacciono',
    'part-passato': 'piaciuto',
  },
  morire: {
    'ind-presente': 'muoio, muori, muore, moriamo, morite, muoiono',
    'cong-presente': 'muoia, muoia, muoia, moriamo, moriate, muoiano',
    'part-passato': 'morto',
  },
  vedere: { 'ind-futuro-semplice': 'vedrò, vedrai, vedrà, vedremo, vedrete, vedranno' },
  conoscere: { 'part-passato': 'conosciuto' },
  nascere: { 'part-passato': 'nato' },
  produrre: { 'part-passato': 'prodotto' },
  ottenere: { 'ind-presente': 'ottengo, ottieni, ottiene, otteniamo, ottenete, ottengono', 'ind-futuro-semplice': 'otterrò, otterrai, otterrà, otterremo, otterrete, otterranno' },
  proporre: { 'ind-presente': 'propongo, proponi, propone, proponiamo, proponete, propongono', 'part-passato': 'proposto' },
  riuscire: { 'ind-presente': 'riesco, riesci, riesce, riusciamo, riuscite, riescono' },
  valere: { 'ind-presente': 'valgo, vali, vale, valiamo, valete, valgono', 'ind-futuro-semplice': 'varrò, varrai, varrà, varremo, varrete, varranno' },
  apparire: { 'ind-presente': 'appaio, appari, appare, appariamo, apparite, appaiono',  },
  rompere: { 'part-passato': 'rotto' },
  spegnere: { 'ind-presente': 'spengo, spegni, spegne, spegniamo, spegnete, spengono', 'part-passato': 'spento' },
  sedersi: { 'ind-presente': 'mi siedo, ti siedi, si siede, ci sediamo, vi sedete, si siedono', 'imp-presente': 'siediti, si sieda, sediamoci, sedetevi, si siedano' },
}

describe('verified irregular conjugations', () => {
  for (const [verb, tenses] of Object.entries(VERIFIED)) {
    for (const [tense, expected] of Object.entries(tenses)) {
      it(`${verb} — ${tense}`, () => {
        expect(p(verb, tense as TenseId)).toEqual(split(expected!))
      })
    }
  }
})

describe('regular patterns and spelling rules', () => {
  it('-are, -ere, -ire and -isc- presente', () => {
    expect(p('parlare', 'ind-presente')).toEqual(split('parlo, parli, parla, parliamo, parlate, parlano'))
    expect(p('vendere', 'ind-presente')).toEqual(split('vendo, vendi, vende, vendiamo, vendete, vendono'))
    expect(p('dormire', 'ind-presente')).toEqual(split('dormo, dormi, dorme, dormiamo, dormite, dormono'))
    expect(p('capire', 'ind-presente')).toEqual(split('capisco, capisci, capisce, capiamo, capite, capiscono'))
    expect(p('capire', 'cong-presente')).toEqual(split('capisca, capisca, capisca, capiamo, capiate, capiscano'))
  })

  it('-care/-gare keep the hard sound', () => {
    expect(p('cercare', 'ind-presente')).toEqual(split('cerco, cerchi, cerca, cerchiamo, cercate, cercano'))
    expect(p('pagare', 'ind-futuro-semplice')).toEqual(split('pagherò, pagherai, pagherà, pagheremo, pagherete, pagheranno'))
    expect(p('giocare', 'cong-presente')).toEqual(split('giochi, giochi, giochi, giochiamo, giochiate, giochino'))
  })

  it('-ciare/-giare/-sciare and -iare do not double the i', () => {
    expect(p('mangiare', 'ind-futuro-semplice')[0]).toBe('mangerò')
    expect(p('cominciare', 'cond-presente')[0]).toBe('comincerei')
    expect(p('lasciare', 'ind-futuro-semplice')[0]).toBe('lascerò')
    expect(p('studiare', 'ind-presente')).toEqual(split('studio, studi, studia, studiamo, studiate, studiano'))
    expect(p('studiare', 'ind-futuro-semplice')[0]).toBe('studierò')
    expect(joinAre('mangi', 'iamo')).toBe('mangiamo')
    expect(joinAre('studi', 'ino')).toBe('studino')
  })

  it('full regular -are conjugation: parlare', () => {
    expect(p('parlare', 'ind-imperfetto')).toEqual(split('parlavo, parlavi, parlava, parlavamo, parlavate, parlavano'))
    expect(p('parlare', 'ind-futuro-semplice')).toEqual(split('parlerò, parlerai, parlerà, parleremo, parlerete, parleranno'))
    expect(p('parlare', 'cond-presente')).toEqual(split('parlerei, parleresti, parlerebbe, parleremmo, parlereste, parlerebbero'))
    expect(p('parlare', 'cong-presente')).toEqual(split('parli, parli, parli, parliamo, parliate, parlino'))
    expect(p('parlare', 'imp-presente')).toEqual(split('parla, parli, parliamo, parlate, parlino'))
    expect(p('parlare', 'ger-presente')).toEqual(['parlando'])
    expect(p('parlare', 'part-passato')).toEqual(['parlato'])
  })
})

describe('compound tenses and auxiliaries', () => {
  it('uses avere for transitive verbs without agreement', () => {
    expect(p('mangiare', 'ind-passato-prossimo')).toEqual(
      split('ho mangiato, hai mangiato, ha mangiato, abbiamo mangiato, avete mangiato, hanno mangiato'),
    )
    expect(p('fare', 'ind-trapassato-prossimo')[0]).toBe('avevo fatto')
    expect(p('fare', 'ind-futuro-anteriore')[0]).toBe('avrò fatto')
    expect(p('fare', 'cong-passato')[0]).toBe('abbia fatto')
    expect(p('fare', 'cond-passato')[0]).toBe('avrei fatto')
  })

  it('uses essere with participle agreement for verbs of motion/change', () => {
    expect(forms('andare', 'ind-passato-prossimo', 'io')).toEqual(['sono andato', 'sono andata'])
    expect(forms('andare', 'ind-passato-prossimo', 'loro')).toEqual(['sono andati', 'sono andate'])
    expect(getVerb('andare').conjugations['ind-passato-prossimo'].rows[0].display).toBe('sono andato/a')
    expect(p('venire', 'cond-passato')[2]).toBe('sarebbe venuto')
    expect(p('nascere', 'ind-trapassato-prossimo')[3]).toBe('eravamo nati')
  })

  it('every compound form starts with the right auxiliary', () => {
    const essereForms = /^(?:(?:mi|ti|si|ci|vi) )?(sono|sei|è|siamo|siete|ero|eri|era|eravamo|eravate|erano|sarò|sarai|sarà|saremo|sarete|saranno|sia|siate|siano|sarei|saresti|sarebbe|saremmo|sareste|sarebbero) /
    const avereForms = /^(ho|hai|ha|abbiamo|avete|hanno|avevo|avevi|aveva|avevamo|avevate|avevano|avrò|avrai|avrà|avremo|avrete|avranno|abbia|abbiate|abbiano|avrei|avresti|avrebbe|avremmo|avreste|avrebbero) /
    const compound: TenseId[] = [
      'ind-passato-prossimo', 'ind-trapassato-prossimo', 'ind-futuro-anteriore', 'cong-passato', 'cond-passato',
    ]
    for (const v of VERBS) {
      const info = getVerb(v.infinitive)
      for (const t of compound) {
        for (const row of info.conjugations[t].rows) {
          expect(row.forms[0], `${v.infinitive} ${t}`).toMatch(v.auxiliary === 'essere' ? essereForms : avereForms)
        }
      }
    }
  })

  it('accepts the alternative auxiliary where both are correct', () => {
    expect(forms('finire', 'ind-passato-prossimo', 'lui')).toEqual(['ha finito', 'è finito', 'è finita'])
    expect(forms('vivere', 'ind-passato-prossimo', 'io')).toContain('sono vissuto')
  })

  it('accepts both participles of verbs that have two', () => {
    expect(forms('vedere', 'ind-passato-prossimo', 'io')).toEqual(['ho visto', 'ho veduto'])
    expect(forms('perdere', 'part-passato', 'form')).toEqual(['perso', 'perduto'])
  })
})

describe('reflexive verbs', () => {
  it('adds reflexive pronouns in simple tenses', () => {
    expect(p('alzarsi', 'ind-presente')).toEqual(split('mi alzo, ti alzi, si alza, ci alziamo, vi alzate, si alzano'))
    expect(p('vestirsi', 'cong-presente')[0]).toBe('mi vesta')
  })

  it('uses essere and agreement in compound tenses', () => {
    expect(p('alzarsi', 'ind-passato-prossimo')).toEqual(
      split('mi sono alzato, ti sei alzato, si è alzato, ci siamo alzati, vi siete alzati, si sono alzati'),
    )
    expect(forms('divertirsi', 'ind-passato-prossimo', 'noi')).toEqual(['ci siamo divertiti', 'ci siamo divertite'])
    for (const v of VERBS.filter((x) => x.infinitive.endsWith('rsi'))) expect(v.auxiliary).toBe('essere')
  })

  it('attaches pronouns to the imperative correctly', () => {
    expect(p('alzarsi', 'imp-presente')).toEqual(split('alzati, si alzi, alziamoci, alzatevi, si alzino'))
    expect(p('divertirsi', 'imp-presente')[0]).toBe('divertiti')
    expect(p('trasferirsi', 'imp-presente')[0]).toBe('trasferisciti')
  })

  it('handles non-finite reflexive forms', () => {
    expect(p('alzarsi', 'inf-presente')).toEqual(['alzarsi'])
    expect(p('alzarsi', 'ger-presente')).toEqual(['alzandosi'])
    expect(p('alzarsi', 'part-passato')).toEqual(['alzato'])
  })

  it('accepts both pronoun positions in the progressive', () => {
    expect(forms('alzarsi', 'prog-presente', 'io')).toEqual(['mi sto alzando', 'sto alzandomi'])
  })
})

describe('progressive constructions', () => {
  it('stare + gerundio in the present and imperfect', () => {
    expect(p('fare', 'prog-presente')).toEqual(split('sto facendo, stai facendo, sta facendo, stiamo facendo, state facendo, stanno facendo'))
    expect(p('fare', 'prog-imperfetto')[0]).toBe('stavo facendo')
  })

  it('is omitted where it is not idiomatic', () => {
    expect(getVerb('essere').conjugations['prog-presente'].rows).toHaveLength(0)
    expect(getVerb('potere').conjugations['prog-presente'].rows).toHaveLength(0)
  })
})

describe('irregular highlighting', () => {
  it('marks irregular forms and leaves regular ones unmarked', () => {
    const rows = getVerb('andare').conjugations['ind-presente'].rows
    expect(rows.map((r) => r.irregular)).toEqual([true, true, true, false, false, true])
    expect(getVerb('parlare').conjugations['ind-presente'].rows.every((r) => !r.irregular)).toBe(true)
    expect(getVerb('parlare').irregular).toBe(false)
    expect(getVerb('cercare').irregular).toBe(false)
    expect(getVerb('essere').irregular).toBe(true)
  })
})
