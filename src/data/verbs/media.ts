import { defineVerbs } from './define'

const LIKE = (verb: string) => `Conjugated like ${verb}.`

export const MEDIA = defineVerbs('media', {
  riuscire: [
    'to succeed; to manage',
    {
      aux: 'essere',
      base: { verb: 'uscire', prefix: 'ri' },
      notes: [LIKE('uscire') + ' riesco, riesci, riesce…'],
      ex: [
        ['Non riesco a dormire.', "I can't sleep."],
        ['Sei riuscito a trovare un parcheggio?', 'Did you manage to find a parking space?'],
      ],
    },
  ],
  ottenere: [
    'to obtain; to get',
    {
      base: { verb: 'tenere', prefix: 'ot' },
      notes: [LIKE('tenere')],
      ex: [
        ['Ottengo sempre quello che voglio.', 'I always get what I want.'],
        ['Ho ottenuto il visto.', 'I got the visa.'],
      ],
    },
  ],
  mantenere: [
    'to maintain; to keep',
    {
      base: { verb: 'tenere', prefix: 'man' },
      notes: [LIKE('tenere')],
      ex: [
        ['Mantengo sempre le promesse.', 'I always keep my promises.'],
        ['Ha mantenuto la calma.', 'He kept calm.'],
      ],
    },
  ],
  proporre: [
    'to propose; to suggest',
    {
      base: { verb: 'porre', prefix: 'pro' },
      notes: [LIKE('porre')],
      ex: [
        ['Ti propongo un affare.', "I'm offering you a deal."],
        ['Chi ha proposto questa idea?', 'Who proposed this idea?'],
      ],
    },
  ],
  produrre: [
    'to produce',
    {
      base: { verb: 'tradurre', prefix: 'pro', strip: 'tra' },
      notes: [LIKE('tradurre')],
      ex: [
        ['Questa regione produce un ottimo vino.', 'This region produces an excellent wine.'],
        ['La fabbrica ha prodotto mille auto.', 'The factory produced a thousand cars.'],
      ],
    },
  ],
  condurre: [
    'to lead; to conduct; to host',
    {
      base: { verb: 'tradurre', prefix: 'con', strip: 'tra' },
      notes: [LIKE('tradurre')],
      ex: [
        ['Chi conduce il programma?', 'Who presents the show?'],
        ['La polizia ha condotto un’indagine.', 'The police conducted an investigation.'],
      ],
    },
  ],
  promettere: [
    'to promise',
    {
      base: { verb: 'mettere', prefix: 'pro' },
      notes: [LIKE('mettere')],
      ex: [
        ['Ti prometto che tornerò.', 'I promise you I will come back.'],
        ['Mi aveva promesso di chiamare.', 'He had promised to call me.', 'ind-trapassato-prossimo'],
      ],
    },
  ],
  permettere: [
    'to allow; to permit',
    {
      base: { verb: 'mettere', prefix: 'per' },
      notes: [LIKE('mettere')],
      ex: [
        ['Mi permetti di dire una cosa?', 'Will you allow me to say something?'],
        ['I miei genitori non mi hanno permesso di uscire.', "My parents didn't let me go out."],
      ],
    },
  ],
  sorridere: [
    'to smile',
    {
      base: { verb: 'ridere', prefix: 'sor' },
      notes: [LIKE('ridere')],
      ex: [
        ['Sorridi! Ti faccio una foto.', "Smile! I'll take a photo of you.", 'imp-presente'],
        ['La bambina mi ha sorriso.', 'The little girl smiled at me.'],
      ],
    },
  ],
  ridere: [
    'to laugh',
    {
      ov: { prStrong: 'ris', pp: 'riso' },
      ex: [
        ['Perché ridi?', 'Why are you laughing?'],
        ['Abbiamo riso tutta la sera.', 'We laughed all evening.'],
      ],
    },
  ],
  piangere: [
    'to cry',
    {
      ov: { prStrong: 'pians', pp: 'pianto' },
      ex: [
        ['Il bambino piange perché ha fame.', 'The baby is crying because he is hungry.'],
        ['Ho pianto alla fine del film.', 'I cried at the end of the film.'],
      ],
    },
  ],
  raccontare: [
    'to tell (a story); to recount',
    {
      ex: [
        ['Racconto sempre la stessa barzelletta.', 'I always tell the same joke.'],
        ['Il nonno ci raccontava sempre delle storie.', 'Grandpa always used to tell us stories.', 'ind-imperfetto'],
      ],
    },
  ],
  dimostrare: [
    'to demonstrate; to prove; to show',
    {
      ex: [
        ['Questo dimostra che avevo ragione.', 'This proves I was right.'],
        ['Ha dimostrato molto coraggio.', 'She showed great courage.'],
      ],
    },
  ],
  discutere: [
    'to discuss; to argue',
    {
      ov: { prStrong: 'discuss', pp: 'discusso' },
      ex: [
        ['Discutiamo spesso di politica.', 'We often discuss politics.'],
        ['Ne abbiamo discusso ieri.', 'We discussed it yesterday.'],
      ],
    },
  ],
  descrivere: [
    'to describe',
    {
      base: { verb: 'scrivere', prefix: 'de' },
      notes: [LIKE('scrivere')],
      ex: [
        ['Descrivi la tua casa.', 'Describe your home.', 'imp-presente'],
        ['Ha descritto la situazione in dettaglio.', 'He described the situation in detail.'],
      ],
    },
  ],
  difendere: [
    'to defend',
    {
      ov: { prStrong: 'difes', pp: 'difeso' },
      ex: [
        ['Difendo sempre i miei amici.', 'I always defend my friends.'],
        ['L’avvocato ha difeso bene il suo cliente.', 'The lawyer defended his client well.'],
      ],
    },
  ],
  dipendere: [
    'to depend',
    {
      aux: 'essere',
      ov: { prStrong: 'dipes', pp: 'dipeso' },
      ex: [
        ['Dipende da te.', "It's up to you."],
        ['La decisione è dipesa dal direttore.', 'The decision depended on the director.'],
      ],
    },
  ],
  attendere: [
    'to wait (for) (formal)',
    {
      ov: { prStrong: 'attes', pp: 'atteso' },
      ex: [
        ['Attenda in linea, per favore.', 'Please hold the line.', 'imp-presente'],
        ['Abbiamo atteso a lungo una risposta.', 'We waited a long time for a reply.'],
      ],
    },
  ],
  accorgersi: [
    'to notice; to realise',
    {
      ov: { prStrong: 'accors', pp: 'accorto' },
      ex: [
        ['Non mi accorgo mai dell’ora.', 'I never notice the time.'],
        ['Ti sei accorto dell’errore?', 'Did you notice the mistake?'],
      ],
    },
  ],
  annoiarsi: [
    'to get bored',
    {
      ex: [
        ['Mi annoio a casa da solo.', 'I get bored at home on my own.'],
        ['Ci siamo annoiati alla conferenza.', 'We got bored at the conference.'],
      ],
    },
  ],
  arrabbiarsi: [
    'to get angry',
    {
      ex: [
        ['Mi arrabbio quando qualcuno mente.', 'I get angry when someone lies.'],
        ['Si è arrabbiata con me.', 'She got angry with me.'],
      ],
    },
  ],
  preoccuparsi: [
    'to worry',
    {
      ex: [
        ['Mia madre si preoccupa per tutto.', 'My mother worries about everything.'],
        ['Mi sono preoccupato quando non hai risposto.', "I got worried when you didn't answer."],
      ],
    },
  ],
  riposarsi: [
    'to rest',
    {
      ex: [
        ['La domenica mi riposo.', 'On Sundays I rest.'],
        ['Vi siete riposati in vacanza?', 'Did you get some rest on holiday?'],
      ],
    },
  ],
  sposarsi: [
    'to get married',
    {
      ex: [
        ['Ci sposiamo a giugno.', "We're getting married in June."],
        ['Si sono sposati in chiesa.', 'They got married in church.'],
      ],
    },
  ],
  trasferirsi: [
    'to move (house, city)',
    {
      ov: { cls: 'isc' },
      ex: [
        ['Mi trasferisco a Roma per lavoro.', "I'm moving to Rome for work."],
        ['Si sono trasferiti all’estero.', 'They moved abroad.'],
      ],
    },
  ],
  innamorarsi: [
    'to fall in love',
    {
      ex: [
        ['Si innamora facilmente.', 'He falls in love easily.'],
        ['Mi sono innamorato di Venezia.', 'I fell in love with Venice.'],
      ],
    },
  ],
  laurearsi: [
    'to graduate (from university)',
    {
      ex: [
        ['Mi laureo in giurisprudenza a luglio.', "I'm graduating in law in July."],
        ['Si è laureata con il massimo dei voti.', 'She graduated with top marks.'],
      ],
    },
  ],
  fermarsi: [
    'to stop (oneself)',
    {
      ex: [
        ['L’autobus si ferma qui?', 'Does the bus stop here?'],
        ['Ci siamo fermati a mangiare un panino.', 'We stopped to eat a sandwich.'],
      ],
    },
  ],
  lamentarsi: [
    'to complain',
    {
      ex: [
        ['Si lamenta sempre del tempo.', 'He always complains about the weather.'],
        ['I clienti si sono lamentati del servizio.', 'The customers complained about the service.'],
      ],
    },
  ],
  costruire: [
    'to build',
    {
      ov: { cls: 'isc' },
      ex: [
        ['Costruiscono un nuovo ponte.', "They're building a new bridge."],
        ['Hanno costruito una casa in montagna.', 'They built a house in the mountains.'],
      ],
    },
  ],
  diventare: [
    'to become',
    {
      aux: 'essere',
      ex: [
        ['Il cielo diventa scuro.', 'The sky is getting dark.'],
        ['È diventato medico.', 'He became a doctor.'],
      ],
    },
  ],
  restare: [
    'to stay; to remain',
    {
      aux: 'essere',
      ex: [
        ['Resto qui ancora un po’.', "I'm staying here a little longer."],
        ['Siamo restati senza benzina.', 'We ran out of petrol.'],
      ],
    },
  ],
  sembrare: [
    'to seem',
    {
      aux: 'essere',
      ex: [
        ['Sembri stanco.', 'You look tired.'],
        ['Mi è sembrata una brava persona.', 'She seemed a good person to me.'],
      ],
    },
  ],
  bastare: [
    'to be enough',
    {
      aux: 'essere',
      notes: ['Mostly used in the third person (basta, bastano), but all persons exist.'],
      ex: [
        ['Basta così, grazie.', "That's enough, thanks."],
        ['Non mi sono bastati i soldi.', "The money wasn't enough for me."],
      ],
    },
  ],
  costare: [
    'to cost',
    {
      aux: 'essere',
      notes: ['Mostly used in the third person (costa, costano).'],
      ex: [
        ['Quanto costa questo libro?', 'How much does this book cost?'],
        ['Il viaggio è costato meno del previsto.', 'The trip cost less than expected.'],
      ],
    },
  ],
  durare: [
    'to last',
    {
      aux: 'essere',
      ex: [
        ['Il film dura due ore.', 'The film lasts two hours.'],
        ['La festa è durata fino all’alba.', 'The party lasted until dawn.'],
      ],
    },
  ],
  crescere: [
    'to grow; to grow up',
    {
      aux: 'essere',
      alt: 'avere',
      ov: { prStrong: 'crebb', pp: 'cresciuto' },
      notes: ['Essere when intransitive (sono cresciuto a Bari); avere when transitive (ha cresciuto tre figli).'],
      ex: [
        ['I bambini crescono in fretta.', 'Children grow up fast.'],
        ['Sono cresciuto in un piccolo paese.', 'I grew up in a small village.'],
      ],
    },
  ],
  riconoscere: [
    'to recognise',
    {
      base: { verb: 'conoscere', prefix: 'ri' },
      notes: [LIKE('conoscere')],
      ex: [
        ['Non ti riconosco con gli occhiali!', "I don't recognise you with glasses!"],
        ['L’ho riconosciuto dalla voce.', 'I recognised him by his voice.'],
      ],
    },
  ],
  raggiungere: [
    'to reach; to join',
    {
      base: { verb: 'giungere', prefix: 'rag' },
      notes: [LIKE('giungere')],
      ex: [
        ['Ti raggiungo più tardi.', "I'll join you later."],
        ['Abbiamo raggiunto la cima della montagna.', 'We reached the top of the mountain.'],
      ],
    },
  ],
  aggiungere: [
    'to add',
    {
      base: { verb: 'giungere', prefix: 'ag' },
      notes: [LIKE('giungere')],
      ex: [
        ['Aggiungi un po’ di sale.', 'Add a little salt.', 'imp-presente'],
        ['Ho aggiunto il tuo nome alla lista.', 'I added your name to the list.'],
      ],
    },
  ],
  dipingere: [
    'to paint',
    {
      ov: { prStrong: 'dipins', pp: 'dipinto' },
      ex: [
        ['Mia madre dipinge paesaggi.', 'My mother paints landscapes.'],
        ['Leonardo ha dipinto la Gioconda.', 'Leonardo painted the Mona Lisa.', 'ind-passato-prossimo'],
        ['Leonardo dipinse la Gioconda.', 'Leonardo painted the Mona Lisa.', 'ind-passato-remoto'],
      ],
    },
  ],
  scoprire: [
    'to discover',
    {
      ov: { prStrongAlt: 'scoper', pp: 'scoperto' },
      notes: ['Passato remoto: scoprii is standard; scopersi is a literary alternative.'],
      ex: [
        ['Ogni giorno scopro qualcosa di nuovo.', 'Every day I discover something new.'],
        ['Colombo ha scoperto l’America nel 1492.', 'Columbus discovered America in 1492.', 'ind-passato-prossimo'],
        ['Colombo scoprì l\u2019America nel 1492.', 'Columbus discovered America in 1492.', 'ind-passato-remoto'],
      ],
    },
  ],
  soffrire: [
    'to suffer',
    {
      ov: { prStrongAlt: 'soffer', pp: 'sofferto' },
      notes: ['Passato remoto: soffrii is standard; soffersi is a literary alternative.'],
      ex: [
        ['Soffro di mal di testa.', 'I suffer from headaches.'],
        ['Ha sofferto molto dopo l’incidente.', 'He suffered a lot after the accident.'],
      ],
    },
  ],
  coprire: [
    'to cover',
    {
      ov: { prStrongAlt: 'coper', pp: 'coperto' },
      notes: ['Passato remoto: coprii is standard; copersi is a literary alternative.'],
      ex: [
        ['Copri la pentola con un coperchio.', 'Cover the pan with a lid.', 'imp-presente'],
        ['La neve ha coperto le strade.', 'The snow covered the roads.'],
      ],
    },
  ],
  ripetere: [
    'to repeat',
    {
      ov: { prNoEtti: true },
      ex: [
        ['Ripeto: non è possibile.', "I repeat: it's not possible."],
        ['Ho ripetuto la domanda due volte.', 'I repeated the question twice.'],
      ],
    },
  ],
  fuggire: [
    'to flee; to escape',
    {
      aux: 'essere',
      ex: [
        ['I ladri fuggono dalla polizia.', 'The thieves are fleeing from the police.'],
        ['Il gatto è fuggito dalla finestra.', 'The cat escaped through the window.'],
      ],
    },
  ],
  dimagrire: [
    'to lose weight',
    {
      aux: 'essere',
      ov: { cls: 'isc' },
      ex: [
        ['Se mangio meno dolci, dimagrisco.', 'If I eat fewer sweets, I lose weight.'],
        ['È dimagrito cinque chili.', 'He has lost five kilos.'],
      ],
    },
  ],
  spedire: [
    'to send; to post',
    {
      ov: { cls: 'isc' },
      ex: [
        ['Spedisco il pacco domani.', "I'll send the parcel tomorrow."],
        ['Hai spedito la lettera?', 'Did you post the letter?'],
      ],
    },
  ],
  sostituire: [
    'to replace; to substitute',
    {
      ov: { cls: 'isc' },
      ex: [
        ['Sostituisco la mia collega oggi.', "I'm standing in for my colleague today."],
        ['Abbiamo sostituito la vecchia caldaia.', 'We replaced the old boiler.'],
      ],
    },
  ],
  suggerire: [
    'to suggest',
    {
      ov: { cls: 'isc' },
      ex: [
        ['Che cosa mi suggerisci di fare?', 'What do you suggest I do?'],
        ['Mi ha suggerito un buon libro.', 'She suggested a good book to me.'],
      ],
    },
  ],
  consigliare: [
    'to advise; to recommend',
    {
      ex: [
        ['Ti consiglio di prenotare presto.', 'I advise you to book early.'],
        ['Il medico mi ha consigliato di riposare.', 'The doctor advised me to rest.'],
      ],
    },
  ],
  organizzare: [
    'to organise',
    {
      ex: [
        ['Organizziamo una festa per sabato.', "We're organising a party for Saturday."],
        ['Chi ha organizzato il viaggio?', 'Who organised the trip?'],
      ],
    },
  ],
  visitare: [
    'to visit; to examine (a patient)',
    {
      ex: [
        ['Visitiamo i Musei Vaticani domani.', "We're visiting the Vatican Museums tomorrow."],
        ['Il medico ha visitato il paziente.', 'The doctor examined the patient.'],
      ],
    },
  ],
  sperare: [
    'to hope',
    {
      ex: [
        ['Spero di vederti presto.', 'I hope to see you soon.'],
        ['Speravo che venissi anche tu.', 'I was hoping you would come too.', 'ind-imperfetto'],
      ],
    },
  ],
  sognare: [
    'to dream',
    {
      ex: [
        ['Sogno di vivere al mare.', 'I dream of living by the sea.'],
        ['Stanotte ho sognato mia nonna.', 'Last night I dreamt about my grandmother.'],
      ],
    },
  ],
  nuotare: [
    'to swim',
    {
      ex: [
        ['Nuoto in piscina due volte alla settimana.', 'I swim in the pool twice a week.'],
        ['Abbiamo nuotato fino alla boa.', 'We swam out to the buoy.'],
      ],
    },
  ],
  guidare: [
    'to drive; to guide',
    {
      ex: [
        ['Guidi tu o guido io?', 'Are you driving or am I?'],
        ['Ho guidato per sei ore.', 'I drove for six hours.'],
      ],
    },
  ],
  prenotare: [
    'to book; to reserve',
    {
      ex: [
        ['Prenoto io il ristorante.', "I'll book the restaurant."],
        ['Hai prenotato l’albergo?', 'Have you booked the hotel?'],
      ],
    },
  ],
  noleggiare: [
    'to rent; to hire',
    {
      ex: [
        ['Noleggiamo una macchina all’aeroporto.', "We're renting a car at the airport."],
        ['Abbiamo noleggiato le biciclette per un giorno.', 'We hired bikes for a day.'],
      ],
    },
  ],
  smettere: [
    'to stop (doing something); to quit',
    {
      base: { verb: 'mettere', prefix: 's' },
      notes: [LIKE('mettere')],
      ex: [
        ['Smetti di lamentarti!', 'Stop complaining!', 'imp-presente'],
        ['Ho smesso di fumare due anni fa.', 'I quit smoking two years ago.'],
      ],
    },
  ],
})
