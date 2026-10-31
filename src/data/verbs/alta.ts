import { defineVerbs } from './define'

export const ALTA = defineVerbs('alta', {
  scegliere: [
    'to choose',
    {
      ov: {
        prStrong: 'scels',
        presente: 'scelgo, scegli, sceglie, scegliamo, scegliete, scelgono',
        pp: 'scelto',
      },
      notes: ['-gli- becomes -lg- before o and a: scelgo, scelga, scelgono.'],
      ex: [
        ['Scegli tu il ristorante.', 'You choose the restaurant.'],
        ['Abbiamo scelto un hotel vicino al mare.', 'We chose a hotel near the sea.'],
      ],
    },
  ],
  porre: [
    'to put; to place; to pose',
    {
      ov: {
        prStrong: 'pos',
        cls: 'ere',
        stem: 'pon',
        presente: 'pongo, poni, pone, poniamo, ponete, pongono',
        futStem: 'porr',
        pp: 'posto',
      },
      notes: ['Contracted from Latin ponere: most forms use the stem pon- (ponevo, ponendo).'],
      ex: [
        ['Vorrei porre una domanda.', 'I would like to ask a question.', 'inf-presente'],
        ['Il professore ha posto un problema difficile.', 'The professor posed a difficult problem.'],
      ],
    },
  ],
  tradurre: [
    'to translate',
    {
      ov: { prStrong: 'traduss', cls: 'ere', stem: 'traduc', futStem: 'tradurr', pp: 'tradotto' },
      notes: ['Contracted from Latin traducere: most forms use the stem traduc- (traduco, traducevo, traducendo).'],
      ex: [
        ['Traduco libri dall’inglese.', 'I translate books from English.'],
        ['Ho tradotto il documento in inglese.', 'I translated the document into English.'],
      ],
    },
  ],
  aiutare: [
    'to help',
    {
      ex: [
        ['Mi aiuti a portare le valigie?', 'Will you help me carry the suitcases?'],
        ['Mi hai aiutato molto.', 'You helped me a lot.'],
      ],
    },
  ],
  ascoltare: [
    'to listen (to)',
    {
      ex: [
        ['Ascolto la radio in macchina.', 'I listen to the radio in the car.'],
        ['Avete ascoltato il nuovo album?', 'Have you listened to the new album?'],
      ],
    },
  ],
  guardare: [
    'to watch; to look at',
    {
      ex: [
        ['Stasera guardiamo un film.', "Tonight we're watching a film."],
        ['Guardavo la TV quando è suonato il telefono.', 'I was watching TV when the phone rang.', 'ind-imperfetto'],
      ],
    },
  ],
  imparare: [
    'to learn',
    {
      ex: [
        ['Imparo cinque parole nuove ogni giorno.', 'I learn five new words every day.'],
        ['Dove hai imparato a cucinare così bene?', 'Where did you learn to cook so well?'],
      ],
    },
  ],
  insegnare: [
    'to teach',
    {
      ex: [
        ['Mia sorella insegna matematica.', 'My sister teaches maths.'],
        ['Mi ha insegnato a nuotare.', 'He taught me to swim.'],
      ],
    },
  ],
  portare: [
    'to bring; to carry; to wear',
    {
      ex: [
        ['Porto io il vino stasera.', "I'll bring the wine tonight."],
        ['Abbiamo portato i bambini al mare.', 'We took the children to the seaside.'],
      ],
    },
  ],
  pagare: [
    'to pay',
    {
      notes: ['Verbs in -gare add an h before e and i to keep the hard g: paghi, pagherò.'],
      ex: [
        ['Pago con la carta di credito.', 'I pay by credit card.'],
        ['Quanto hai pagato queste scarpe?', 'How much did you pay for these shoes?'],
      ],
    },
  ],
  entrare: [
    'to enter; to go in',
    {
      aux: 'essere',
      ex: [
        ['Entra pure, la porta è aperta!', 'Come in, the door is open!', 'imp-presente'],
        ['Siamo entrati nel museo alle dieci.', 'We went into the museum at ten.'],
      ],
    },
  ],
  passare: [
    'to pass; to spend (time); to drop by',
    {
      alt: 'essere',
      notes: ['Transitive use takes avere (ho passato le vacanze al mare); intransitive use takes essere (sono passato da te).'],
      ex: [
        ['Passo da te dopo il lavoro.', "I'll drop by your place after work."],
        ['Abbiamo passato una bella serata.', 'We spent a lovely evening.'],
      ],
    },
  ],
  perdere: [
    'to lose; to miss',
    {
      ov: { prStrong: 'pers', prAlsoWeak: true, pp: 'perso|perduto' },
      notes: ['Passato remoto persi is most common; perdei/perdetti are also correct. Past participle perso or perduto.'],
      ex: [
        ['Perdo sempre gli occhiali.', 'I always lose my glasses.'],
        ['Ho perso il treno!', 'I missed the train!'],
      ],
    },
  ],
  credere: [
    'to believe',
    {
      ex: [
        ['Non ci credo!', "I don't believe it!"],
        ['Credevo che fossi in vacanza.', 'I thought you were on holiday.', 'ind-imperfetto'],
      ],
    },
  ],
  ricevere: [
    'to receive',
    {
      ex: [
        ['Ricevo molte email ogni giorno.', 'I receive many emails every day.'],
        ['Hai ricevuto il mio messaggio?', 'Did you get my message?'],
      ],
    },
  ],
  vendere: [
    'to sell',
    {
      ex: [
        ['Vendono frutta fresca al mercato.', 'They sell fresh fruit at the market.'],
        ['Abbiamo venduto la vecchia casa.', 'We sold the old house.'],
      ],
    },
  ],
  correre: [
    'to run',
    {
      alt: 'essere',
      ov: { prStrong: 'cors', pp: 'corso' },
      notes: ['Avere when the focus is the activity (ho corso per un’ora); essere with a destination (sono corso a casa).'],
      ex: [
        ['Corro nel parco ogni mattina.', 'I run in the park every morning.'],
        ['Ho corso per un’ora.', 'I ran for an hour.'],
      ],
    },
  ],
  decidere: [
    'to decide',
    {
      ov: { prStrong: 'decis', pp: 'deciso' },
      ex: [
        ['Decido io dove andiamo.', "I'll decide where we go."],
        ['Abbiamo deciso di trasferirci a Torino.', 'We decided to move to Turin.'],
      ],
    },
  ],
  succedere: [
    'to happen',
    {
      aux: 'essere',
      ov: { prStrong: 'success', pp: 'successo' },
      notes: [
        'Meaning "to happen" it is used almost only in the third person (che cosa è successo?).',
        'In the sense of "to succeed (to the throne)" the forms succedette/succeduto are also used.',
      ],
      ex: [
        ['Che cosa succede?', "What's happening?"],
        ['È successo un incidente in autostrada.', 'There was an accident on the motorway.'],
      ],
    },
  ],
  morire: [
    'to die',
    {
      aux: 'essere',
      ov: { presente: 'muoio, muori, muore, moriamo, morite, muoiono', futStem: 'morir|morr', pp: 'morto' },
      notes: ['The stem becomes muoi-/muor- when stressed.', 'The future morrò is literary; morirò is standard.'],
      ex: [
        ['Muoio di fame!', "I'm starving!"],
        ['Mio nonno è morto nel 2010.', 'My grandfather died in 2010.'],
      ],
    },
  ],
  nascere: [
    'to be born',
    {
      aux: 'essere',
      ov: { prStrong: 'nacqu', pp: 'nato' },
      ex: [
        ['In Italia nascono pochi bambini.', 'Few children are born in Italy.'],
        ['Sono nata a Palermo.', 'I was born in Palermo.'],
      ],
    },
  ],
  sedersi: [
    'to sit down',
    {
      ov: { presente: 'siedo|seggo, siedi, siede, sediamo, sedete, siedono|seggono' },
      notes: ['The stem becomes sied- when stressed. Seggo, segga, seggono are less common alternatives.'],
      ex: [
        ['Si sieda, prego.', 'Please sit down.', 'imp-presente'],
        ['Ci siamo seduti in prima fila.', 'We sat in the front row.'],
      ],
    },
  ],
  svegliarsi: [
    'to wake up',
    {
      ex: [
        ['Mi sveglio presto anche la domenica.', 'I wake up early even on Sundays.'],
        ['Stamattina mi sono svegliato alle sei.', 'This morning I woke up at six.'],
      ],
    },
  ],
  divertirsi: [
    'to have fun; to enjoy oneself',
    {
      ex: [
        ['Ci divertiamo sempre insieme.', 'We always have fun together.'],
        ['Vi siete divertiti alla festa?', 'Did you have fun at the party?'],
      ],
    },
  ],
  lavarsi: [
    'to wash (oneself)',
    {
      ex: [
        ['Mi lavo le mani prima di mangiare.', 'I wash my hands before eating.'],
        ['Si è lavato e si è vestito.', 'He washed and got dressed.'],
      ],
    },
  ],
  sentirsi: [
    'to feel (well, ill, tired…)',
    {
      ov: { partPresente: 'senziente' },
      ex: [
        ['Come ti senti oggi?', 'How do you feel today?'],
        ['Ieri non mi sentivo bene.', "Yesterday I wasn't feeling well.", 'ind-imperfetto'],
      ],
    },
  ],
  preparare: [
    'to prepare',
    {
      ex: [
        ['Preparo la cena per tutti.', "I'm making dinner for everyone."],
        ['Hai preparato la valigia?', 'Have you packed your suitcase?'],
      ],
    },
  ],
  ricordare: [
    'to remember; to remind',
    {
      ex: [
        ['Non ricordo il suo nome.', "I don't remember his name."],
        ['Mi ha ricordato l’appuntamento.', 'He reminded me about the appointment.'],
      ],
    },
  ],
  dimenticare: [
    'to forget',
    {
      ex: [
        ['Dimentico sempre il compleanno di mio fratello.', "I always forget my brother's birthday."],
        ['Ho dimenticato l’ombrello in treno.', 'I left my umbrella on the train.'],
      ],
    },
  ],
  incontrare: [
    'to meet',
    {
      ex: [
        ['Incontro Giulia al bar alle cinque.', "I'm meeting Giulia at the café at five."],
        ['Ho incontrato un vecchio amico in centro.', 'I ran into an old friend in town.'],
      ],
    },
  ],
  viaggiare: [
    'to travel',
    {
      ex: [
        ['Viaggio spesso per lavoro.', 'I often travel for work.'],
        ['L’anno scorso abbiamo viaggiato in Giappone.', 'Last year we travelled around Japan.'],
      ],
    },
  ],
  pulire: [
    'to clean',
    {
      ov: { cls: 'isc' },
      ex: [
        ['Puliamo la casa il sabato.', 'We clean the house on Saturdays.'],
        ['Hai pulito la cucina?', 'Have you cleaned the kitchen?'],
      ],
    },
  ],
  preferire: [
    'to prefer',
    {
      ov: { cls: 'isc' },
      ex: [
        ['Preferisco il tè al caffè.', 'I prefer tea to coffee.'],
        ['Preferirei restare a casa stasera.', "I'd rather stay at home tonight.", 'cond-presente'],
      ],
    },
  ],
  offrire: [
    'to offer',
    {
      ov: { prStrongAlt: 'offer', pp: 'offerto' },
      notes: ['Passato remoto: offrii is standard; offersi is a literary alternative.'],
      ex: [
        ['Offro io!', "It's on me!"],
        ['Ci hanno offerto un lavoro.', 'They offered us a job.'],
      ],
    },
  ],
  seguire: [
    'to follow',
    {
      ex: [
        ['Seguo un corso di italiano.', "I'm taking an Italian course."],
        ['Ho seguito i tuoi consigli.', 'I followed your advice.'],
      ],
    },
  ],
  servire: [
    'to serve; to be needed',
    {
      alt: 'essere',
      notes: ['Meaning "to be needed" it takes essere (mi è servito un aiuto); meaning "to serve" it takes avere.'],
      ex: [
        ['Ti serve qualcosa?', 'Do you need anything?'],
        ['Il cameriere ha servito il primo.', 'The waiter served the first course.'],
      ],
    },
  ],
  salire: [
    'to go up; to get on',
    {
      aux: 'essere',
      alt: 'avere',
      ov: { partPresente: null, presente: 'salgo, sali, sale, saliamo, salite, salgono' },
      notes: ['Essere when intransitive (sono salito sul treno); avere when transitive (ho salito le scale).'],
      ex: [
        ['Sali in macchina, ti accompagno.', "Get in the car, I'll give you a lift.", 'imp-presente'],
        ['Siamo saliti sulla torre.', 'We climbed up the tower.'],
      ],
    },
  ],
  scendere: [
    'to go down; to get off',
    {
      aux: 'essere',
      alt: 'avere',
      ov: { prStrong: 'sces', pp: 'sceso' },
      notes: ['Essere when intransitive (sono sceso dal treno); avere when transitive (ho sceso le scale).'],
      ex: [
        ['Scendo alla prossima fermata.', "I'm getting off at the next stop."],
        ['Sono sceso dal treno a Firenze.', 'I got off the train in Florence.'],
      ],
    },
  ],
  cambiare: [
    'to change',
    {
      alt: 'essere',
      notes: ['Avere when transitive (ho cambiato casa); essere when intransitive (la città è cambiata).'],
      ex: [
        ['Cambio spesso idea.', 'I often change my mind.'],
        ['La città è cambiata molto.', 'The city has changed a lot.'],
      ],
    },
  ],
  spendere: [
    'to spend (money)',
    {
      ov: { prStrong: 'spes', pp: 'speso' },
      ex: [
        ['Spendo troppo per i vestiti.', 'I spend too much on clothes.'],
        ['Quanto avete speso in vacanza?', 'How much did you spend on holiday?'],
      ],
    },
  ],
  usare: [
    'to use',
    {
      ex: [
        ['Uso il computer per lavoro.', 'I use the computer for work.'],
        ['Hai usato tutto lo zucchero?', 'Did you use up all the sugar?'],
      ],
    },
  ],
  provare: [
    'to try; to try on; to feel',
    {
      ex: [
        ['Provo a chiamarlo di nuovo.', "I'll try calling him again."],
        ['Ho provato a chiamarti.', 'I tried to call you.'],
      ],
    },
  ],
  mandare: [
    'to send',
    {
      ex: [
        ['Ti mando le foto domani.', "I'll send you the photos tomorrow."],
        ['Mi hanno mandato un pacco.', 'They sent me a parcel.'],
      ],
    },
  ],
  spiegare: [
    'to explain',
    {
      ex: [
        ['Ti spiego come funziona.', "I'll explain to you how it works."],
        ['L’insegnante ha spiegato il congiuntivo.', 'The teacher explained the subjunctive.'],
      ],
    },
  ],
  lasciare: [
    'to leave; to let',
    {
      notes: ['Verbs in -sciare drop the i before e and i: lasci, lascerò.'],
      ex: [
        ['Lascia stare, faccio io.', "Leave it, I'll do it.", 'imp-presente'],
        ['Ho lasciato la borsa in macchina.', 'I left my bag in the car.'],
      ],
    },
  ],
  cucinare: [
    'to cook',
    {
      ex: [
        ['Mio padre cucina benissimo.', 'My father cooks extremely well.'],
        ['Chi ha cucinato stasera?', 'Who cooked tonight?'],
      ],
    },
  ],
  vincere: [
    'to win',
    {
      ov: { prStrong: 'vins', pp: 'vinto' },
      ex: [
        ['Chi vince la partita?', 'Who is winning the match?'],
        ['L’Italia ha vinto i Mondiali nel 2006.', 'Italy won the World Cup in 2006.'],
      ],
    },
  ],
  accendere: [
    'to turn on; to light',
    {
      ov: { prStrong: 'acces', pp: 'acceso' },
      ex: [
        ['Accendi la luce, per favore.', 'Turn on the light, please.', 'imp-presente'],
        ['Hai acceso il riscaldamento?', 'Have you turned on the heating?'],
      ],
    },
  ],
  spegnere: [
    'to turn off; to put out',
    {
      ov: {
        prStrong: 'spens',
        presente: 'spengo, spegni, spegne, spegniamo, spegnete, spengono',
        pp: 'spento',
      },
      notes: ['-gn- becomes -ng- before o and a: spengo, spenga, spengono.'],
      ex: [
        ['Spegni il telefono durante il film.', 'Turn off your phone during the film.', 'imp-presente'],
        ['Ho spento il computer.', 'I turned off the computer.'],
      ],
    },
  ],
  togliere: [
    'to remove; to take off',
    {
      ov: {
        prStrong: 'tols',
        presente: 'tolgo, togli, toglie, togliamo, togliete, tolgono',
        pp: 'tolto',
      },
      notes: ['-gli- becomes -lg- before o and a: tolgo, tolga, tolgono.'],
      ex: [
        ['Tolgo le scarpe quando entro in casa.', 'I take off my shoes when I come into the house.'],
        ['Ho tolto la giacca perché faceva caldo.', 'I took off my jacket because it was hot.'],
      ],
    },
  ],
})
