import { defineVerbs } from './define'

const MODAL_NOTE =
  'As a modal verb it normally takes the auxiliary of the infinitive that follows: ho potuto mangiare, but sono potuto uscire. Only avere forms are listed in the charts.'

export const ESSENZIALI = defineVerbs('essenziali', {
  essere: [
    'to be',
    {
      aux: 'essere',
      noProg: true,
      ov: {
        passatoRemoto: 'fui, fosti, fu, fummo, foste, furono',
        congImperfetto: 'fossi, fossi, fosse, fossimo, foste, fossero',
        partPresente: null,
        presente: 'sono, sei, è, siamo, siete, sono',
        imperfetto: 'ero, eri, era, eravamo, eravate, erano',
        futStem: 'sar',
        congPresente: 'sia, sia, sia, siamo, siate, siano',
        imperativo: 'sii, sia, siamo, siate, siano',
        pp: 'stato',
        gerundio: 'essendo',
      },
      notes: [
        'Auxiliary for reflexive verbs and for many intransitive verbs of motion and change of state.',
        'Its past participle (stato) is shared with stare.',
        'The old participio presente "ente" survives only as a noun (an entity), so it is not listed.',
      ],
      ex: [
        ['Sono italiano, di Roma.', 'I am Italian, from Rome.'],
        ['Ieri sono stato a casa tutto il giorno.', 'Yesterday I was at home all day.'],
      ],
    },
  ],
  avere: [
    'to have',
    {
      ov: {
        prStrong: 'ebb',
        presente: 'ho, hai, ha, abbiamo, avete, hanno',
        futStem: 'avr',
        congPresente: 'abbia, abbia, abbia, abbiamo, abbiate, abbiano',
        imperativo: 'abbi, abbia, abbiamo, abbiate, abbiano',
      },
      notes: ['Auxiliary for all transitive verbs and many intransitive ones.', 'The h in ho, hai, ha, hanno is silent.'],
      ex: [
        ['Ho due fratelli e una sorella.', 'I have two brothers and a sister.'],
        ['Avevo fame, così ho mangiato un panino.', 'I was hungry, so I ate a sandwich.', 'ind-imperfetto'],
      ],
    },
  ],
  fare: [
    'to do; to make',
    {
      ov: {
        prStrong: 'fec',
        cls: 'ere',
        stem: 'fac',
        presente: 'faccio, fai, fa, facciamo, fate, fanno',
        futStem: 'far',
        imperativo: "fa'|fai, faccia, facciamo, fate, facciano",
        pp: 'fatto',
      },
      notes: ['Many forms come from the Latin stem fac- (facere): facevo, facendo, facessi.', "The tu imperative is fa' or fai."],
      ex: [
        ['Che cosa fai stasera?', 'What are you doing this evening?'],
        ['Abbiamo fatto una passeggiata al parco.', 'We took a walk in the park.'],
      ],
    },
  ],
  stare: [
    'to stay; to be',
    {
      aux: 'essere',
      noProg: true,
      ov: {
        passatoRemoto: 'stetti, stesti, stette, stemmo, steste, stettero',
        congImperfetto: 'stessi, stessi, stesse, stessimo, steste, stessero',
        presente: 'sto, stai, sta, stiamo, state, stanno',
        futStem: 'star',
        congPresente: 'stia, stia, stia, stiamo, stiate, stiano',
        imperativo: "sta'|stai, stia, stiamo, state, stiano",
      },
      notes: [
        'Used for health (come stai?), location and the progressive construction (sto mangiando).',
        "The tu imperative is sta' or stai.",
      ],
      ex: [
        ['Come stai? Sto bene, grazie.', 'How are you? I am well, thanks.'],
        ['Siamo stati a casa tutto il weekend.', 'We stayed at home all weekend.'],
      ],
    },
  ],
  andare: [
    'to go',
    {
      aux: 'essere',
      ov: {
        presente: 'vado, vai, va, andiamo, andate, vanno',
        futStem: 'andr',
        imperativo: "va'|vai, vada, andiamo, andate, vadano",
      },
      notes: ['Two stems: vad-/va- in the stressed forms and and- elsewhere.', "The tu imperative is va' or vai."],
      ex: [
        ['Domani vado a Milano in treno.', 'Tomorrow I am going to Milan by train.'],
        ['Siete andati alla festa di Marco?', "Did you go to Marco's party?"],
      ],
    },
  ],
  venire: [
    'to come',
    {
      aux: 'essere',
      ov: {
        prStrong: 'venn',
        partPresente: 'veniente',
        presente: 'vengo, vieni, viene, veniamo, venite, vengono',
        futStem: 'verr',
        pp: 'venuto',
      },
      ex: [
        ['Vieni al cinema con noi?', 'Are you coming to the cinema with us?'],
        ['I miei genitori sono venuti a trovarmi.', 'My parents came to visit me.'],
      ],
    },
  ],
  potere: [
    'can; to be able to',
    {
      modal: true,
      noProg: true,
      ov: { presente: 'posso, puoi, può, possiamo, potete, possono', futStem: 'potr', noImperative: true },
      notes: [MODAL_NOTE, 'Potere has no imperative.'],
      ex: [
        ['Posso aprire la finestra?', 'May I open the window?'],
        ['Non sono potuto venire perché ero malato.', "I couldn't come because I was ill."],
      ],
    },
  ],
  volere: [
    'to want',
    {
      modal: true,
      noProg: true,
      ov: {
        prStrong: 'voll',
        presente: 'voglio, vuoi, vuole, vogliamo, volete, vogliono',
        futStem: 'vorr',
        imperativo: 'vogli, voglia, vogliamo, vogliate, vogliano',
      },
      notes: [MODAL_NOTE, 'The imperative is rare, used mainly in formal requests (vogliate scusarmi).'],
      ex: [
        ['Voglio imparare bene l’italiano.', 'I want to learn Italian well.'],
        ['Vorrei un caffè, per favore.', 'I would like a coffee, please.', 'cond-presente'],
      ],
    },
  ],
  dovere: [
    'must; to have to',
    {
      modal: true,
      noProg: true,
      ov: {
        partPresente: null,
        presente: 'devo|debbo, devi, deve, dobbiamo, dovete, devono|debbono',
        futStem: 'dovr',
        congPresente: 'debba|deva, debba|deva, debba|deva, dobbiamo, dobbiate, debbano|devano',
        noImperative: true,
      },
      notes: [MODAL_NOTE, 'Debbo/debbono and deva/devano are accepted alternatives.', 'Dovere has no imperative.'],
      ex: [
        ['Devo finire questo lavoro entro stasera.', 'I must finish this work by this evening.'],
        ['Avresti dovuto dirmelo prima.', 'You should have told me earlier.', 'cond-passato'],
      ],
    },
  ],
  sapere: [
    'to know (facts); to know how to',
    {
      noProg: true,
      ov: {
        prStrong: 'sepp',
        partPresente: 'sapiente',
        presente: 'so, sai, sa, sappiamo, sapete, sanno',
        futStem: 'sapr',
        congPresente: 'sappia, sappia, sappia, sappiamo, sappiate, sappiano',
        imperativo: 'sappi, sappia, sappiamo, sappiate, sappiano',
      },
      notes: ['Sapere = to know facts or how to do something; conoscere = to know people and places.'],
      ex: [
        ['Sai dov’è la stazione?', 'Do you know where the station is?'],
        ['Non sapevo che fossi in Italia.', "I didn't know you were in Italy.", 'ind-imperfetto'],
      ],
    },
  ],
  dire: [
    'to say; to tell',
    {
      ov: {
        prStrong: 'diss',
        cls: 'ere',
        stem: 'dic',
        presente: 'dico, dici, dice, diciamo, dite, dicono',
        futStem: 'dir',
        imperativo: "di', dica, diciamo, dite, dicano",
        pp: 'detto',
      },
      notes: ['Many forms come from the Latin stem dic- (dicere): dicevo, dicendo.', "The tu imperative is di'."],
      ex: [
        ['Che cosa dici?', 'What are you saying?'],
        ['Mi ha detto la verità.', 'He told me the truth.'],
      ],
    },
  ],
  dare: [
    'to give',
    {
      ov: {
        passatoRemoto: 'diedi|detti, desti, diede|dette, demmo, deste, diedero|dettero',
        congImperfetto: 'dessi, dessi, desse, dessimo, deste, dessero',
        presente: 'do, dai, dà, diamo, date, danno',
        futStem: 'dar',
        congPresente: 'dia, dia, dia, diamo, diate, diano',
        imperativo: "da'|dai, dia, diamo, date, diano",
      },
      notes: ['Dà (he/she gives) takes an accent to distinguish it from the preposition da.'],
      ex: [
        ['Ti do il mio numero di telefono.', "I'll give you my phone number."],
        ['Gli abbiamo dato un regalo.', 'We gave him a present.'],
      ],
    },
  ],
  vedere: [
    'to see',
    {
      ov: { prStrong: 'vid', futStem: 'vedr', pp: 'visto|veduto' },
      notes: ['Visto is the everyday past participle; veduto is also correct.'],
      ex: [
        ['Vedo il mare dalla mia finestra.', 'I see the sea from my window.'],
        ['Hai visto l’ultimo film di Sorrentino?', "Have you seen Sorrentino's latest film?"],
      ],
    },
  ],
  parlare: [
    'to speak; to talk',
    {
      ex: [
        ['Parlo italiano e inglese.', 'I speak Italian and English.'],
        ['Ho parlato con il direttore.', 'I spoke with the manager.'],
      ],
    },
  ],
  mangiare: [
    'to eat',
    {
      notes: ['Verbs in -giare drop the i before e and i: mangi, mangiamo, mangerò.'],
      ex: [
        ['Mangiamo insieme stasera?', 'Shall we eat together tonight?'],
        ['Domani mangerò al ristorante.', 'Tomorrow I will eat at the restaurant.', 'ind-futuro-semplice'],
      ],
    },
  ],
  bere: [
    'to drink',
    {
      ov: {
        passatoRemoto: 'bevvi|bevetti, bevesti, bevve|bevette, bevemmo, beveste, bevvero|bevettero',
        stem: 'bev',
        futStem: 'berr',
      },
      notes: ['Most forms use the old stem bev- (from Latin bibere): bevo, bevevo, bevuto.'],
      ex: [
        ['Non bevo mai il caffè dopo cena.', 'I never drink coffee after dinner.'],
        ['Abbiamo bevuto un ottimo vino.', 'We drank an excellent wine.'],
      ],
    },
  ],
  uscire: [
    'to go out; to leave',
    {
      aux: 'essere',
      ov: { presente: 'esco, esci, esce, usciamo, uscite, escono' },
      notes: ['The stem becomes esc- in the stressed forms: esco, esci, esce, escono (and esca in the congiuntivo).'],
      ex: [
        ['Stasera esco con gli amici.', "Tonight I'm going out with friends."],
        ['A che ora sei uscita di casa?', 'What time did you leave home?'],
      ],
    },
  ],
  rimanere: [
    'to remain; to stay',
    {
      aux: 'essere',
      ov: {
        prStrong: 'rimas',
        presente: 'rimango, rimani, rimane, rimaniamo, rimanete, rimangono',
        futStem: 'rimarr',
        pp: 'rimasto',
      },
      ex: [
        ['Rimango a casa perché piove.', "I'm staying at home because it's raining."],
        ['Siamo rimasti in Sicilia per due settimane.', 'We stayed in Sicily for two weeks.'],
      ],
    },
  ],
  tenere: [
    'to hold; to keep',
    {
      ov: {
        prStrong: 'tenn',
        presente: 'tengo, tieni, tiene, teniamo, tenete, tengono',
        futStem: 'terr',
      },
      ex: [
        ['Tieni la porta aperta, per favore.', 'Keep the door open, please.', 'imp-presente'],
        ['Ho tenuto tutte le tue lettere.', 'I kept all your letters.'],
      ],
    },
  ],
  prendere: [
    'to take',
    {
      ov: { prStrong: 'pres', pp: 'preso' },
      ex: [
        ['Prendo un cappuccino, grazie.', "I'll have a cappuccino, thanks."],
        ['Abbiamo preso il treno delle otto.', "We took the eight o'clock train."],
      ],
    },
  ],
  mettere: [
    'to put',
    {
      ov: { prStrong: 'mis', pp: 'messo' },
      ex: [
        ['Dove metto le chiavi?', 'Where shall I put the keys?'],
        ['Ho messo il latte nel frigo.', 'I put the milk in the fridge.'],
      ],
    },
  ],
  conoscere: [
    'to know (people, places); to meet',
    {
      ov: { prStrong: 'conobb', pp: 'conosciuto' },
      notes: ['In the passato prossimo conoscere often means "to meet for the first time".'],
      ex: [
        ['Conosci un buon ristorante qui vicino?', 'Do you know a good restaurant near here?'],
        ['Ho conosciuto mia moglie a Bologna.', 'I met my wife in Bologna.'],
      ],
    },
  ],
  capire: [
    'to understand',
    {
      ov: { cls: 'isc' },
      ex: [
        ['Scusi, non capisco.', "Sorry, I don't understand."],
        ['Hai capito la domanda?', 'Did you understand the question?'],
      ],
    },
  ],
  sentire: [
    'to hear; to feel',
    {
      ov: { partPresente: 'senziente' },
      notes: ['The participio presente senziente ("sentient") is used only as an adjective.'],
      ex: [
        ['Senti questa musica?', 'Do you hear this music?'],
        ['Ho sentito un rumore strano.', 'I heard a strange noise.'],
      ],
    },
  ],
  pensare: [
    'to think',
    {
      ex: [
        ['Penso che sia una buona idea.', "I think it's a good idea."],
        ['Pensavo di partire domani.', 'I was thinking of leaving tomorrow.', 'ind-imperfetto'],
      ],
    },
  ],
  lavorare: [
    'to work',
    {
      ex: [
        ['Lavoro in un ufficio in centro.', 'I work in an office in the centre.'],
        ['Ho lavorato fino a tardi.', 'I worked until late.'],
      ],
    },
  ],
  abitare: [
    'to live (reside)',
    {
      ex: [
        ['Abito a Napoli da tre anni.', 'I have been living in Naples for three years.'],
        ['Da piccoli abitavamo in campagna.', 'When we were little we lived in the countryside.', 'ind-imperfetto'],
      ],
    },
  ],
  vivere: [
    'to live',
    {
      alt: 'essere',
      ov: { prStrong: 'viss', futStem: 'vivr', pp: 'vissuto' },
      notes: ['Used intransitively, both ho vissuto and sono vissuto/a are correct.'],
      ex: [
        ['Vivo con la mia famiglia.', 'I live with my family.'],
        ['Ha vissuto molti anni all’estero.', 'He lived abroad for many years.'],
      ],
    },
  ],
  chiamare: [
    'to call',
    {
      ex: [
        ['Ti chiamo stasera.', "I'll call you tonight."],
        ['Chi ha chiamato?', 'Who called?'],
      ],
    },
  ],
  alzarsi: [
    'to get up',
    {
      ex: [
        ['Mi alzo alle sette ogni giorno.', 'I get up at seven every day.'],
        ['Stamattina ci siamo alzati tardi.', 'This morning we got up late.'],
      ],
    },
  ],
  leggere: [
    'to read',
    {
      ov: { prStrong: 'less', pp: 'letto' },
      ex: [
        ['Leggo il giornale ogni mattina.', 'I read the newspaper every morning.'],
        ['Hai letto questo libro?', 'Have you read this book?'],
      ],
    },
  ],
  scrivere: [
    'to write',
    {
      ov: { prStrong: 'scriss', pp: 'scritto' },
      ex: [
        ['Scrivo un’email al professore.', 'I am writing an email to the professor.'],
        ['Ho scritto una lettera a mia nonna.', 'I wrote a letter to my grandmother.', 'ind-passato-prossimo'],
        ['Manzoni scrisse «I promessi sposi».', 'Manzoni wrote "The Betrothed".', 'ind-passato-remoto'],
      ],
    },
  ],
  aprire: [
    'to open',
    {
      ov: { prStrongAlt: 'aper', pp: 'aperto' },
      notes: ['Passato remoto: aprii is standard; apersi is a literary alternative.'],
      ex: [
        ['A che ora apre il museo?', 'What time does the museum open?'],
        ['Chi ha aperto la finestra?', 'Who opened the window?'],
      ],
    },
  ],
  chiudere: [
    'to close',
    {
      ov: { prStrong: 'chius', pp: 'chiuso' },
      ex: [
        ['Chiudi la porta, per favore.', 'Close the door, please.', 'imp-presente'],
        ['I negozi hanno chiuso alle otto.', 'The shops closed at eight.'],
      ],
    },
  ],
  cominciare: [
    'to begin; to start',
    {
      alt: 'essere',
      notes: [
        'Transitive use takes avere (ho cominciato il lavoro); intransitive use takes essere (il film è cominciato).',
        'Verbs in -ciare drop the i before e and i: cominci, comincerò.',
      ],
      ex: [
        ['La lezione comincia alle nove.', 'The lesson starts at nine.'],
        ['Il film è già cominciato.', 'The film has already started.'],
      ],
    },
  ],
  finire: [
    'to finish; to end',
    {
      alt: 'essere',
      ov: { cls: 'isc' },
      notes: ['Transitive use takes avere (ho finito i compiti); intransitive use takes essere (la festa è finita).'],
      ex: [
        ['Finisco di lavorare alle sei.', 'I finish work at six.'],
        ['Le vacanze sono finite troppo presto.', 'The holidays ended too soon.'],
      ],
    },
  ],
  trovare: [
    'to find',
    {
      ex: [
        ['Non trovo le mie chiavi.', "I can't find my keys."],
        ['Abbiamo trovato un appartamento in centro.', 'We found a flat in the centre.'],
      ],
    },
  ],
  cercare: [
    'to look for; to try',
    {
      notes: ['Verbs in -care add an h before e and i to keep the hard c: cerchi, cercherò.'],
      ex: [
        ['Cerco lavoro come cameriere.', "I'm looking for work as a waiter."],
        ['Ti ho cercato dappertutto!', 'I looked for you everywhere!'],
      ],
    },
  ],
  dormire: [
    'to sleep',
    {
      ov: { partPresente: 'dormiente' },
      ex: [
        ['Il bambino dorme già.', 'The child is already asleep.'],
        ['Stanotte ho dormito male.', 'Last night I slept badly.'],
      ],
    },
  ],
  partire: [
    'to leave; to depart',
    {
      aux: 'essere',
      ex: [
        ['Il treno parte alle dieci.', 'The train leaves at ten.'],
        ['Sono partiti ieri per la Spagna.', 'They left for Spain yesterday.'],
      ],
    },
  ],
  arrivare: [
    'to arrive',
    {
      aux: 'essere',
      ex: [
        ['A che ora arriva l’autobus?', 'What time does the bus arrive?'],
        ['Siamo arrivati in ritardo.', 'We arrived late.'],
      ],
    },
  ],
  tornare: [
    'to return; to come back',
    {
      aux: 'essere',
      ex: [
        ['Torno subito!', "I'll be right back!"],
        ['Quando sei tornato dalle vacanze?', 'When did you get back from holiday?'],
      ],
    },
  ],
  aspettare: [
    'to wait (for)',
    {
      ex: [
        ['Ti aspetto davanti al bar.', "I'll wait for you in front of the café."],
        ['Abbiamo aspettato un’ora.', 'We waited for an hour.'],
      ],
    },
  ],
  chiedere: [
    'to ask',
    {
      ov: { prStrong: 'chies', pp: 'chiesto' },
      ex: [
        ['Chiedo sempre il conto alla cassa.', 'I always ask for the bill at the till.'],
        ['Ho chiesto informazioni alla guida.', 'I asked the guide for information.'],
      ],
    },
  ],
  rispondere: [
    'to answer; to reply',
    {
      ov: { prStrong: 'rispos', pp: 'risposto' },
      ex: [
        ['Perché non rispondi al telefono?', "Why don't you answer the phone?"],
        ['Non mi ha ancora risposto.', "He hasn't answered me yet."],
      ],
    },
  ],
  piacere: [
    'to please; to be liked',
    {
      aux: 'essere',
      ov: {
        prStrong: 'piacqu',
        presente: 'piaccio, piaci, piace, piacciamo, piacete, piacciono',
        pp: 'piaciuto',
      },
      notes: ['Usually used in the third person with an indirect object: mi piace il gelato (I like ice cream), mi piacciono i libri.'],
      ex: [
        ['Mi piace molto la cucina italiana.', 'I really like Italian cooking.'],
        ['Ti è piaciuto il concerto?', 'Did you enjoy the concert?'],
      ],
    },
  ],
  comprare: [
    'to buy',
    {
      ex: [
        ['Compro il pane ogni mattina.', 'I buy bread every morning.'],
        ['Ho comprato una macchina nuova.', 'I bought a new car.'],
      ],
    },
  ],
  studiare: [
    'to study',
    {
      notes: ['Verbs in -iare with an unstressed i keep only one i: studi, studiamo.'],
      ex: [
        ['Studio italiano da un anno.', 'I have been studying Italian for a year.'],
        ['Ieri sera ho studiato fino a mezzanotte.', 'Last night I studied until midnight.'],
      ],
    },
  ],
  giocare: [
    'to play (games, sports)',
    {
      notes: ['Verbs in -care add an h before e and i: giochi, giocherò.'],
      ex: [
        ['I bambini giocano a calcio.', 'The children are playing football.'],
        ['Giocheremo a carte dopo cena.', 'We will play cards after dinner.', 'ind-futuro-semplice'],
      ],
    },
  ],
  vestirsi: [
    'to get dressed',
    {
      ex: [
        ['Mi vesto in fretta perché sono in ritardo.', "I get dressed quickly because I'm late."],
        ['Ti sei vestito elegante stasera!', "You've dressed up smartly tonight!"],
      ],
    },
  ],
})
