import { defineVerbs } from './define'

const LIKE = (verb: string) => `Conjugated like ${verb}.`

export const BASSA = defineVerbs('bassa', {
  tacere: [
    'to be silent; to keep quiet',
    {
      ov: {
        prStrong: 'tacqu',
        presente: 'taccio, taci, tace, tacciamo|taciamo, tacete, tacciono',
        pp: 'taciuto',
      },
      notes: ['Tacciamo and taciamo are both accepted.'],
      ex: [
        ['Taci, per favore!', 'Be quiet, please!', 'imp-presente'],
        ['Ha taciuto la verità per anni.', 'He kept the truth hidden for years.'],
      ],
    },
  ],
  nascondere: [
    'to hide',
    {
      ov: { prStrong: 'nascos', pp: 'nascosto' },
      ex: [
        ['Dove nascondi i regali?', 'Where do you hide the presents?'],
        ['Ho nascosto le chiavi sotto il vaso.', 'I hid the keys under the flowerpot.'],
      ],
    },
  ],
  rompere: [
    'to break',
    {
      ov: { prStrong: 'rupp', pp: 'rotto' },
      ex: [
        ['Rompo sempre qualcosa quando lavo i piatti.', 'I always break something when I wash the dishes.'],
        ['Chi ha rotto il vaso?', 'Who broke the vase?'],
      ],
    },
  ],
  cadere: [
    'to fall',
    {
      aux: 'essere',
      ov: { prStrong: 'cadd', futStem: 'cadr' },
      ex: [
        ['In autunno cadono le foglie.', 'In autumn the leaves fall.'],
        ['Sono caduto dalla bicicletta.', 'I fell off my bike.'],
      ],
    },
  ],
  valere: [
    'to be worth',
    {
      aux: 'essere',
      ov: {
        prStrong: 'vals',
        presente: 'valgo, vali, vale, valiamo, valete, valgono',
        futStem: 'varr',
        pp: 'valso',
      },
      ex: [
        ['Questo quadro vale una fortuna.', 'This painting is worth a fortune.'],
        ['Ne è valsa la pena.', 'It was worth it.'],
      ],
    },
  ],
  sciogliere: [
    'to melt; to dissolve; to untie',
    {
      ov: {
        prStrong: 'sciols',
        presente: 'sciolgo, sciogli, scioglie, sciogliamo, sciogliete, sciolgono',
        pp: 'sciolto',
      },
      ex: [
        ['Il sole scioglie la neve.', 'The sun melts the snow.'],
        ['Ho sciolto lo zucchero nel latte.', 'I dissolved the sugar in the milk.'],
      ],
    },
  ],
  cogliere: [
    'to pick; to seize; to grasp',
    {
      ov: {
        prStrong: 'cols',
        presente: 'colgo, cogli, coglie, cogliamo, cogliete, colgono',
        pp: 'colto',
      },
      ex: [
        ['Colgo l’occasione per ringraziarvi.', 'I take this opportunity to thank you.'],
        ['Abbiamo colto le ciliegie dall’albero.', 'We picked the cherries from the tree.'],
      ],
    },
  ],
  distruggere: [
    'to destroy',
    {
      ov: { prStrong: 'distruss', pp: 'distrutto' },
      ex: [
        ['Il fumo distrugge i polmoni.', 'Smoking destroys the lungs.'],
        ['Il terremoto ha distrutto il paese.', 'The earthquake destroyed the town.'],
      ],
    },
  ],
  proteggere: [
    'to protect',
    {
      ov: { prStrong: 'protess', pp: 'protetto' },
      ex: [
        ['La crema protegge la pelle dal sole.', 'The cream protects the skin from the sun.'],
        ['Ha protetto la sua famiglia.', 'He protected his family.'],
      ],
    },
  ],
  correggere: [
    'to correct',
    {
      ov: { prStrong: 'corress', pp: 'corretto' },
      ex: [
        ['La professoressa corregge i compiti.', 'The teacher is marking the homework.'],
        ['Hai corretto i miei errori?', 'Did you correct my mistakes?'],
      ],
    },
  ],
  eleggere: [
    'to elect',
    {
      base: { verb: 'leggere', prefix: 'e' },
      notes: [LIKE('leggere')],
      ex: [
        ['I cittadini eleggono il sindaco.', 'Citizens elect the mayor.'],
        ['Hanno eletto un nuovo presidente.', 'They elected a new president.'],
      ],
    },
  ],
  convincere: [
    'to convince',
    {
      base: { verb: 'vincere', prefix: 'con' },
      notes: [LIKE('vincere')],
      ex: [
        ['Non mi convinci.', "You don't convince me."],
        ['Mi hai convinto a venire.', 'You convinced me to come.'],
      ],
    },
  ],
  esprimere: [
    'to express',
    {
      ov: { prStrong: 'espress', pp: 'espresso' },
      ex: [
        ['Esprimi un desiderio!', 'Make a wish!', 'imp-presente'],
        ['Ha espresso la sua opinione.', 'She expressed her opinion.'],
      ],
    },
  ],
  comporre: [
    'to compose; to dial',
    {
      base: { verb: 'porre', prefix: 'com' },
      notes: [LIKE('porre')],
      ex: [
        ['Componi il numero e aspetta.', 'Dial the number and wait.', 'imp-presente'],
        ['Verdi ha composto molte opere.', 'Verdi composed many operas.', 'ind-passato-prossimo'],
        ['Verdi compose molte opere.', 'Verdi composed many operas.', 'ind-passato-remoto'],
      ],
    },
  ],
  ridurre: [
    'to reduce',
    {
      base: { verb: 'tradurre', prefix: 'ri', strip: 'tra' },
      notes: [LIKE('tradurre')],
      ex: [
        ['Riduco gli zuccheri per la salute.', "I'm cutting down on sugar for my health."],
        ['Hanno ridotto i prezzi.', 'They reduced the prices.'],
      ],
    },
  ],
  trattenere: [
    'to hold back; to keep; to detain',
    {
      base: { verb: 'tenere', prefix: 'trat' },
      notes: [LIKE('tenere')],
      ex: [
        ['Trattengo il respiro sott’acqua.', 'I hold my breath underwater.'],
        ['Mi hanno trattenuto in ufficio fino a tardi.', 'They kept me at the office until late.'],
      ],
    },
  ],
  apparire: [
    'to appear',
    {
      aux: 'essere',
      ov: {
        prStrong: 'apparv',
        presente: 'appaio, appari, appare, appariamo, apparite, appaiono',
        pp: 'apparso',
      },
      notes: ['Appaio/appaiono are standard; the forms apparisco/apparisce also exist but are less common.'],
      ex: [
        ['Il sole appare tra le nuvole.', 'The sun appears between the clouds.'],
        ['All’improvviso è apparso un uomo.', 'Suddenly a man appeared.'],
      ],
    },
  ],
  svanire: [
    'to vanish; to fade',
    {
      aux: 'essere',
      ov: { cls: 'isc' },
      ex: [
        ['Il dolore svanisce lentamente.', 'The pain fades slowly.'],
        ['Il fantasma è svanito nel nulla.', 'The ghost vanished into thin air.'],
      ],
    },
  ],
  intervenire: [
    'to intervene; to take part',
    {
      aux: 'essere',
      base: { verb: 'venire', prefix: 'inter' },
      notes: [LIKE('venire')],
      ex: [
        ['Intervengo solo se necessario.', 'I only intervene if necessary.'],
        ['La polizia è intervenuta subito.', 'The police intervened immediately.'],
      ],
    },
  ],
  sorprendere: [
    'to surprise',
    {
      base: { verb: 'prendere', prefix: 'sor' },
      notes: [LIKE('prendere')],
      ex: [
        ['La tua risposta mi sorprende.', 'Your answer surprises me.'],
        ['Ci ha sorpreso con una festa.', 'She surprised us with a party.'],
      ],
    },
  ],
  comprendere: [
    'to understand; to include',
    {
      base: { verb: 'prendere', prefix: 'com' },
      notes: [LIKE('prendere')],
      ex: [
        ['Comprendo la tua preoccupazione.', 'I understand your concern.'],
        ['Non ho compreso bene la domanda.', "I didn't fully understand the question."],
      ],
    },
  ],
  ammettere: [
    'to admit',
    {
      base: { verb: 'mettere', prefix: 'am' },
      notes: [LIKE('mettere')],
      ex: [
        ['Ammetto di avere sbagliato.', 'I admit I was wrong.'],
        ['Ha ammesso la sua colpa.', 'He admitted his fault.'],
      ],
    },
  ],
  trasmettere: [
    'to broadcast; to transmit; to pass on',
    {
      base: { verb: 'mettere', prefix: 'tras' },
      notes: [LIKE('mettere')],
      ex: [
        ['La RAI trasmette la partita stasera.', 'RAI is broadcasting the match tonight.'],
        ['Mi ha trasmesso la sua passione.', 'He passed his passion on to me.'],
      ],
    },
  ],
  assumere: [
    'to hire; to take on; to assume',
    {
      ov: { prStrong: 'assuns', pp: 'assunto' },
      ex: [
        ['L’azienda assume nuovo personale.', 'The company is hiring new staff.'],
        ['Mi hanno assunto a tempo indeterminato.', 'They hired me on a permanent contract.'],
      ],
    },
  ],
  concludere: [
    'to conclude',
    {
      ov: { prStrong: 'conclus', pp: 'concluso' },
      ex: [
        ['Concludo con una domanda.', "I'll finish with a question."],
        ['Abbiamo concluso l’accordo.', 'We concluded the agreement.'],
      ],
    },
  ],
  escludere: [
    'to exclude; to rule out',
    {
      ov: { prStrong: 'esclus', pp: 'escluso' },
      ex: [
        ['Non escludo questa possibilità.', "I don't rule out this possibility."],
        ['Lo hanno escluso dalla squadra.', 'They left him out of the team.'],
      ],
    },
  ],
  includere: [
    'to include',
    {
      ov: { prStrong: 'inclus', pp: 'incluso' },
      ex: [
        ['Il prezzo include l’IVA?', 'Does the price include VAT?'],
        ['Hai incluso tutti nella lista?', 'Have you included everyone on the list?'],
      ],
    },
  ],
  deludere: [
    'to disappoint',
    {
      ov: { prStrong: 'delus', pp: 'deluso' },
      ex: [
        ['Non voglio deluderti.', "I don't want to let you down.", 'inf-presente'],
        ['Il film mi ha deluso.', 'The film disappointed me.'],
      ],
    },
  ],
  dividere: [
    'to divide; to share; to split',
    {
      ov: { prStrong: 'divis', pp: 'diviso' },
      ex: [
        ['Dividiamo il conto?', 'Shall we split the bill?'],
        ['Abbiamo diviso la torta in otto pezzi.', 'We divided the cake into eight pieces.'],
      ],
    },
  ],
  condividere: [
    'to share',
    {
      base: { verb: 'dividere', prefix: 'con' },
      notes: [LIKE('dividere')],
      ex: [
        ['Condivido la tua opinione.', 'I share your opinion.'],
        ['Ho condiviso l’appartamento con due studenti.', 'I shared the flat with two students.'],
      ],
    },
  ],
  risolvere: [
    'to solve; to resolve',
    {
      ov: { prStrong: 'risols', prAlsoWeak: true, pp: 'risolto' },
      notes: ['Passato remoto risolsi is most common; risolvei/risolvetti are also correct.'],
      ex: [
        ['Risolviamo il problema insieme.', "Let's solve the problem together."],
        ['Hai risolto l’esercizio?', 'Did you solve the exercise?'],
      ],
    },
  ],
  sopravvivere: [
    'to survive',
    {
      aux: 'essere',
      base: { verb: 'vivere', prefix: 'soprav' },
      notes: [LIKE('vivere') + ' Takes essere in compound tenses.'],
      ex: [
        ['Queste piante sopravvivono anche d’inverno.', 'These plants survive even in winter.'],
        ['Sono sopravvissuti all’incidente.', 'They survived the accident.'],
      ],
    },
  ],
  percorrere: [
    'to travel along; to cover (a distance)',
    {
      base: { verb: 'correre', prefix: 'per' },
      notes: [LIKE('correre') + ' Always takes avere.'],
      ex: [
        ['Percorro questa strada ogni giorno.', 'I travel along this road every day.'],
        ['Abbiamo percorso cinquanta chilometri.', 'We covered fifty kilometres.'],
      ],
    },
  ],
  giungere: [
    'to arrive; to reach',
    {
      aux: 'essere',
      ov: { prStrong: 'giuns', pp: 'giunto' },
      ex: [
        ['Il treno giunge in stazione alle nove.', 'The train arrives at the station at nine.'],
        ['Siamo giunti a destinazione.', 'We reached our destination.'],
      ],
    },
  ],
  fingere: [
    'to pretend',
    {
      ov: { prStrong: 'fins', pp: 'finto' },
      ex: [
        ['Fingo di non sentire.', 'I pretend not to hear.'],
        ['Ha finto di essere malato.', 'He pretended to be ill.'],
      ],
    },
  ],
  spingere: [
    'to push',
    {
      ov: { prStrong: 'spins', pp: 'spinto' },
      ex: [
        ['Spingi la porta, non tirare!', "Push the door, don't pull!", 'imp-presente'],
        ['Qualcuno mi ha spinto.', 'Someone pushed me.'],
      ],
    },
  ],
  stringere: [
    'to squeeze; to tighten; to grip',
    {
      ov: { prStrong: 'strins', pp: 'stretto' },
      ex: [
        ['Questa scarpa mi stringe.', 'This shoe pinches.'],
        ['Mi ha stretto la mano.', 'He shook my hand.'],
      ],
    },
  ],
  tendere: [
    'to tend; to stretch out',
    {
      ov: { prStrong: 'tes', pp: 'teso' },
      ex: [
        ['Tendo a dimenticare i nomi.', 'I tend to forget names.'],
        ['Mi ha teso la mano.', 'He held out his hand to me.'],
      ],
    },
  ],
  mordere: [
    'to bite',
    {
      ov: { prStrong: 'mors', pp: 'morso' },
      ex: [
        ['Il cane non morde.', "The dog doesn't bite."],
        ['Mi ha morso una zanzara.', 'A mosquito bit me.'],
      ],
    },
  ],
  pretendere: [
    'to demand; to expect',
    {
      ov: { prStrong: 'pretes', pp: 'preteso' },
      ex: [
        ['Pretendo una spiegazione.', 'I demand an explanation.'],
        ['Ha preteso le scuse.', 'He demanded an apology.'],
      ],
    },
  ],
})
