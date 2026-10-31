# Italian B1 Verb Master

A web app for learning and practising **200 Italian verbs** in **every standard Italian tense**, with the CEFR B1 tenses at the centre and the more advanced ones marked **"Beyond B1"**. It works fully offline: there is no backend, and progress is saved in your browser.

- **Learn**: the verbs are grouped into four priority cards (Essenziali 50 · Alta 50 · Media 60 · Bassa 40). Pick a group, then a verb, then any tense. Each tense has an explanation, an example and highlighted irregular forms.
- **Test**: two sections.
  - *Conjugation table*: choose one verb and one tense, then conjugate every person. You can switch between *Fill in the Blanks* and *Multiple Choice* at any time.
  - *Sentence practice*: complete short sentences such as *Ieri io ___ (andare) al mare.* A time clue in the sentence (*ieri*, *di solito*, *tra dieci anni*, *spera che domani*, *con più tempo*…) tells you which tense to use. After each answer the app names the tense and explains the clue. You can choose the verbs, the tenses and fill-in or multiple choice. The clues are defined in `src/data/sentence-cues.ts`.
- **Mix Test**: random questions from the categories, verbs and tenses you select, with a results page that groups your mistakes by verb and by tense.
- **Vocabolario**: a second section, switched with **Verbi | Vocabolario** at the top. Locally it covers the vocabulary of my textbook (2182 words and 1191 phrases in 5 batches and 45 sub-batches); the public repository ships a small sample instead. See [Vocabolario](#vocabolario) below.

Stack: React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui-style components (Radix + cva) · Lucide icons · React Router · Vitest · Playwright.

---

## Getting started

Requires **Node.js 20+** (developed with Node 24).

```bash
npm install                        # install dependencies
npm run dev                        # start the dev server → http://localhost:5173
```

Production build:

```bash
npm run build                      # type-check + build into dist/
npm run preview                    # serve the production build → http://localhost:4173
```

## Tests

```bash
npm test                           # unit + component tests (Vitest)
npx playwright install chromium    # one-time: download the browser for E2E tests
npm run test:e2e                   # end-to-end tests (Playwright, desktop + mobile viewports)
npm run test:all                   # both
npm run typecheck                  # TypeScript only
```

`npm run test:e2e` builds the app and starts a preview server on port 4173 by itself.

---

## Features

### Learn
1. **Priority cards**: title, number of verbs, description, progress percentage, and a distinct colour for each category.
2. **Verb cards**: infinitive, English meaning, priority dot, regular/irregular badge and progress. The list has search (Italian or English, accents optional), sorting (most useful first, A→Z, Z→A, by progress) and filters (regular, irregular, reflexive).
3. **Verb page**: auxiliary, conjugation group, notes on irregularities, and every mood and tense. You can use the grouped tense dropdown, the mood tabs with tense pills, Previous/Next tense, or the *All tenses* grid. Irregular forms are highlighted with both colour and an icon. Every row has an **Example** column with a short Italian sentence and its English translation (*Io sono andato al mare — I went to the seaside*). Each example is built from the chart's own verified form plus a hand-written, time-neutral phrase for that verb (`src/data/example-phrases.ts`); the English is conjugated into the matching English tense by `src/lib/examples.ts`. Combinations that would be unnatural (e.g. an imperative of *nascere*) show "—". **Test This Tense** opens the Test tab with that verb and tense already selected.

### Test
- **Fill in the Blanks**: one input per person. Press Enter to check a single row, or **Check Answer** to check them all. A wrong answer is struck through, and the correct form appears directly beneath it. **Retry Incorrect** (or the ↺ button on a row) lets you try again.
- **Multiple Choice**: four options per person, graded the moment you click. The distractors are real forms of the same verb (other persons or tenses), and any form that would also be correct is never offered as a wrong option. After a wrong pick, a short line explains which form you chose.
- Fill and MCQ each keep **their own state**, so switching modes never mixes up answers.
- Imperatives only ask for the persons that exist (tu, Lei, noi, voi, Loro). Non-finite forms (infinito, participio, gerundio) ask for a single form.
- An accent bar (à è é ì ò ù ') helps on keyboards without Italian characters.
- The score is shown as **“4/6 correct — 67%”**.

### Mix Test
Choose one or more priorities, all verbs or specific ones, any tenses, 10/20/30/50/custom questions, and fill-in or MCQ mode. Questions never repeat within a test. The results page shows the score, accuracy, correct/incorrect counts, mistakes grouped by verb and by tense, **Retry Incorrect Questions** and **Start New Mix Test**.

### Progress & mastery
Progress is saved automatically in `localStorage` under the key `italian-b1-verb-master:progress:v1`. It records:

- verbs studied
- tenses practised
- test attempts
- correct and incorrect answers
- accuracy by verb and by tense
- the date you last practised

Click the 📊 button in the header to see your stats, or to **reset progress** (you'll be asked to confirm).

**Mastery rule** (`src/lib/progress/mastery.ts`):

| Concept | Rule |
|---|---|
| Window | For every verb + tense, only the **last 10 answers** count |
| Tense mastered | **≥ 6 answers** in the window **and ≥ 80 %** of them correct |
| Tense progress | 100 % if mastered; otherwise (correct answers in window ÷ 6), capped at 5/6 |
| Verb progress | Average over the verb's **core B1 tenses**: presente, imperfetto, passato prossimo, trapassato prossimo, futuro semplice, congiuntivo presente, condizionale presente, imperativo (if the verb has one) |
| Verb mastered | **All** core tenses mastered |
| Priority progress | Average verb progress in that category |

A single correct answer never marks anything as mastered.

---

## Vocabolario

The vocabulary is loaded as-is from `src/data/vocabulary/italian_vocabulary.json`. No vocabulary is hard-coded, so to change it you replace that file.

> **Not in this repository:** that file is built from a commercial textbook, so it is kept out of the public repo (see `.gitignore`) for copyright reasons. Without it the app uses `vocabulary.sample.json`, a small self-written sample, and the tests that check the textbook data (`vocab.test.ts`, `VocabTestPage.test.tsx`, `e2e/vocab.spec.ts`) are skipped automatically.

- **Verbi | Vocabolario** in the header switches section. The app reopens in the section you used last (`localStorage` key `italian-b1-verb-master:mode`).
- **Parole (Words) | Frasi (Phrases)** applies to every vocabulary page and is remembered (`…:vocab-type`).
- **Batches → sub-batches**: each batch shows its item count, and each sub-batch shows its title, unit and count. A sub-batch with nothing of the current type is greyed out.
- **Studia**: flashcards (Italian on the front, English and the note on the back; arrow keys move between cards) or a list, with **Shuffle**.
- **Test**: multiple choice on one sub-batch, a whole batch, or everything of one type.
  - Direction: Italiano → English, English → Italiano, or Mixed (the default).
  - Length: 10, 20 or all questions.
  - Wrong options come from the same sub-batch first, then the batch, then everything. They are always of the same type (words against words), never repeat, are never the correct text, and never have the same prompt as the question (that would make them a right answer too). The same Italian–English pair is asked only once per test.
  - After each answer the correct option is highlighted in green and a wrong pick in red, followed by **Next**. The results page shows the score, the wrong answers with the correct ones, and **Retry only the wrong ones**.
- **Try again**: after a wrong pick you can answer the same question again. The score always counts your **first** answer, and the results page marks a mistake you later corrected as *fixed on try again*.
- **Marks**: each sub-batch shows a **green ✓** once its best score is 100%, a **half-filled amber circle** if it has been tested but not yet at 100%, and a dashed ring if it hasn't been tested. Batch cards count the sub-batches at 100% and the partial ones. Marks are kept separately for Parole and Frasi.
- **Best scores** are kept per sub-batch, per batch and for everything, separately for words and phrases (`…:vocab-scores:v1`). They are stored apart from verb progress, so vocabulary tests never affect verb mastery. Retry runs and unfinished tests don't count as a best score.

Code: `src/data/vocabulary/` (loading and scopes), `src/lib/vocab/` (quiz generation, best scores, mode and type preferences), `src/pages/vocab/`, `src/components/vocab/`.

## Conjugation coverage

Every verb has all **21 standard tenses and forms**, each shown with its English name. **14 are B1**; the other **7 are marked "Beyond B1"** (B2+) in the charts, dropdowns, Test, Mix Test and Sentence practice:

| Mood | B1 | Beyond B1 |
|---|---|---|
| Indicativo | presente, imperfetto, passato prossimo, trapassato prossimo, futuro semplice, futuro anteriore | passato remoto, trapassato remoto |
| Congiuntivo | presente, passato | imperfetto, trapassato |
| Condizionale | presente, passato | — |
| Imperativo | presente (tu, Lei, noi, voi, Loro) | — |
| Infinito | presente | passato |
| Participio | passato | presente |
| Gerundio | presente | passato |

On top of these, the **progressive constructions** *stare + gerundio* (presente and imperfetto progressivo) are labelled separately, as constructions rather than tenses (B1).

Mastery is still measured on the 8 core B1 tenses only, so the advanced tenses are extra practice and never lower your progress. Sentence practice starts with the B1 tenses selected; use **All** in its tense chips (or **All (incl. beyond B1)** in the Mix Test) to include the rest.

### How it works

There are no runtime APIs and no naive string replacement. `src/lib/conjugation/` contains a rule engine with **explicit irregular overrides**:

- **Regular patterns** for -are / -ere / -ire / -ire (-isc-). Spelling rules are handled: *cerchi, pagherò*; *mangerò, lascerò*; *studi, studiamo*.
- **Overrides per verb**, declared in the data files:
  - full irregular presente, imperfetto, passato remoto, congiuntivo and imperativo tables
  - strong passato remoto stems (*fec- → feci, fece, fecero*)
  - future stems (*andr-, verr-, berr-*)
  - irregular participles
  - contracted stems (*fare → fac-, dire → dic-, porre → pon-, tradurre → traduc-, bere → bev-*)
- **Prefixed verbs** reuse the verified forms of their base verb: *ottenere ← tenere, proporre ← porre, produrre ← tradurre, riuscire ← uscire…*
- **Compound tenses** combine the correct auxiliary with the participle. With *essere*, the participle agrees with the subject: *sono andato/a, siamo andati/e*. Reflexive verbs always use *essere*: *mi sono alzato/a*.
- **Reflexive pronouns** go before finite forms and attach to imperatives and gerunds: *alzati, si alzi, alziamoci, alzatevi, si alzino; alzandosi*.
- Each row is flagged **irregular** by comparing it with what the regular pattern would produce.

### Alternative forms accepted in tests
- *fa'/fai, da'/dai, sta'/stai, va'/vai*
- *devo/debbo, debba/deva*
- *siedo/seggo* (sedersi)
- *visto/veduto, perso/perduto*
- *morirò/morrò*
- *diedi/detti*, *-ei/-etti* in the passato remoto of regular -ere verbs, *persi/perdei/perdetti*, *aprii/apersi*
- *avere/aver* + participle (infinito passato)
- masculine and feminine participles with *essere*
- the alternative auxiliary for verbs that take both (*ho finito / è finito*, *ho vissuto / sono vissuto*)
- *mi sto alzando / sto alzandomi*

Comparison ignores case and extra spaces, but **accents and spelling must be exact** (*è* ≠ *e*).

### Flagged decisions and uncertainties
These are deliberate choices, documented here instead of being silently guessed:

- **Participio presente** is generated by the regular pattern (*-ante/-ente*). Known lexical forms are overridden (*dormiente, veniente, sapiente, senziente*), and it is omitted where no form is in current use (*essere, dovere, salire*). Many rule-generated present participles are rare and survive mainly as adjectives or nouns.
- **No imperative** for *potere* and *dovere*. *Volere* has the rare imperative *vogli, voglia, vogliamo, vogliate, vogliano*.
- **Modals** (*potere, volere, dovere*) list *avere* compounds. *Essere* is also correct before an essere-verb (*sono potuto uscire*); the app explains this in a note but doesn't test it.
- **Progressive constructions** are omitted for *essere, stare, potere, volere, dovere, sapere*, where they are not idiomatic.
- **Verbs mostly used in the 3rd person** (*succedere, bastare, costare*) still show every person, because all of them exist grammatically. A note explains their typical use.
- Literary or regional variants (*fo, vo*) are excluded; *morrò* is accepted only as an alternative to *morirò*.

---

## Project structure

```
src/
  App.tsx, main.tsx, index.css
  types/verb.ts                 – strongly typed data model
  data/
    tenses.ts                   – 23 tense definitions (B1 flag), English names, explanations, examples
    priorities.ts               – the four priority categories
    verbs/                      – the 200-verb database (one file per priority)
  lib/
    conjugation/                – simple.ts (rules + overrides), engine.ts (compounds, reflexives, non-finite)
    testing/                    – validate.ts, generate.ts (questions, MCQ, mix), session.ts (Test state), mix.ts
    progress/                   – store.ts (localStorage), mastery.ts (documented rule)
    routes.ts, utils.ts
  hooks/                        – useProgress, useTheme
  components/
    ui/                         – shadcn-style primitives (button, card, badge, dialog, …)
    layout/, learn/, test/, mix-test/
  pages/                        – PrioritiesPage, VerbListPage, VerbDetailPage, TestPage, MixTestPage
e2e/                            – Playwright tests
```

### Adding a verb
Add an entry to the right file in `src/data/verbs/`. A regular verb needs only its meaning and examples:

```ts
camminare: ['to walk', { ex: [['Cammino ogni giorno.', 'I walk every day.']] }],
```

An irregular verb also declares its overrides:

```ts
cuocere: ['to cook', { ov: { presente: 'cuocio, cuoci, cuoce, cuociamo, cuocete, cuociono', pp: 'cotto' }, ex: [...] }],
```

A prefixed verb points at its base verb: `{ base: { verb: 'tenere', prefix: 'con' } }`.

The data tests check uniqueness, that each priority has its expected count, and that every tense is complete. If you add verbs, update the counts in `src/data/priorities.ts` and `src/data/verbs.test.ts`.
