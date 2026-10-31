import { ArrowRight, Eye, Lightbulb, ListChecks, PencilLine, RotateCcw, Send, Shuffle, Trophy, Undo2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { TenseSelectChips } from '@/components/test/TenseSelectChips'
import { VerbChecklist } from '@/components/test/VerbChecklist'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { Progress } from '@/components/ui/progress'
import { Segmented } from '@/components/ui/segmented'
import { PRIORITIES, isPriority } from '@/data/priorities'
import { SENTENCE_TENSES } from '@/data/sentence-cues'
import { TENSE_BY_ID, tenseEnglish, tenseFullLabel } from '@/data/tenses'
import { VERBS, getVerbEntry } from '@/data/verbs'
import { recordAnswer, recordAttempt } from '@/lib/progress/store'
import { buildSentenceRound, sentenceOptions, type SentenceQuestion } from '@/lib/testing/sentences'
import type { AnswerMode, McqOption } from '@/lib/testing/types'
import { isCorrect } from '@/lib/testing/validate'
import { cn, percent } from '@/lib/utils'
import type { TenseId } from '@/types/verb'
import { AccentBar, insertAtCaret } from './AccentBar'
import { CorrectFeedback, IncorrectFeedback, McqOptionButtons } from './Feedback'

const ROUND_SIZE = 10

interface Answer {
  text: string
  correct: boolean
}

interface Round {
  id: number
  questions: SentenceQuestion[]
  options: Record<string, McqOption[]>
  answers: (Answer | undefined)[]
  /** Wrong answers given before "Try again", per sentence. */
  wrongTries: string[][]
}

function roundFrom(questions: SentenceQuestion[]): Round {
  return {
    id: Date.now(),
    questions,
    options: Object.fromEntries(questions.map((q) => [q.id, sentenceOptions(q)])),
    answers: questions.map(() => undefined),
    wrongTries: questions.map(() => []),
  }
}

function newRound(verbs: string[], tenses: TenseId[]): Round {
  return roundFrom(buildSentenceRound({ verbs, tenses, count: ROUND_SIZE }))
}

/** Shown after answering: which tense it was and which words in the sentence point to it. */
function TenseExplanation({ q }: { q: SentenceQuestion }) {
  return (
    <div className="animate-fade-in rounded-lg border bg-muted/50 p-3 text-sm" data-testid="sentence-explanation">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-medium">Tense:</span>
        <Badge variant="secondary" data-testid="sentence-tense">
          {tenseFullLabel(q.tense)}
        </Badge>
        <span className="text-muted-foreground">= {tenseEnglish(q.tense)}</span>
      </p>
      <p className="mt-2 flex gap-2">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />
        <span>
          <span className="font-medium">Clue: «{q.clue}»</span> — {q.why}
        </span>
      </p>
      {q.alsoCorrect.length > 0 && (
        <p className="mt-1 text-muted-foreground">
          Also correct:{' '}
          {q.alsoCorrect.map((a) => (
            <span key={a.tense}>
              <strong className="text-foreground">{a.display}</strong> ({tenseFullLabel(a.tense)})
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

export function SentencePractice() {
  const [scope, setScope] = useState<string>('all')
  const [chosen, setChosen] = useState<string[]>(['essere', 'avere', 'andare', 'fare'])
  // B1 tenses by default; the beyond-B1 ones can be switched on with the chips.
  const [tenses, setTenses] = useState<TenseId[]>(() => SENTENCE_TENSES.filter((t) => TENSE_BY_ID[t].b1))
  const [mode, setMode] = useState<AnswerMode>('fill')

  const verbs = useMemo(() => {
    if (scope === 'choose') return chosen
    if (isPriority(scope)) return VERBS.filter((v) => v.priority === scope).map((v) => v.infinitive)
    return VERBS.map((v) => v.infinitive)
  }, [scope, chosen])

  const [round, setRound] = useState<Round>(() => newRound(verbs, tenses))
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [showEnglish, setShowEnglish] = useState(false)
  const [finished, setFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const startWith = (r: Round) => {
    setRound(r)
    setIndex(0)
    setInput('')
    setShowEnglish(false)
    setFinished(false)
  }
  const start = (v = verbs, t = tenses) => startWith(newRound(v, t))

  // Changing the verbs or tenses restarts the round, so every sentence uses only the current selection.
  const selectionKey = `${verbs.join(',')}|${tenses.join(',')}`
  const roundKey = useRef(selectionKey)
  useEffect(() => {
    if (roundKey.current === selectionKey) return
    roundKey.current = selectionKey
    startWith(newRound(verbs, tenses))
  }, [selectionKey, verbs, tenses])

  const q = round.questions[index]
  const answer = round.answers[index]
  const isLast = index === round.questions.length - 1
  const correctCount = round.answers.filter((a) => a?.correct).length
  const answeredCount = round.answers.filter(Boolean).length

  useEffect(() => {
    if (answer) nextRef.current?.focus()
    else if (mode === 'fill') inputRef.current?.focus({ preventScroll: true })
  }, [answer, index, mode])

  const submit = (text: string, correct: boolean) => {
    if (answer || !q) return
    recordAnswer(q.verb, q.tense, correct)
    const answers = [...round.answers]
    answers[index] = { text, correct }
    setRound({ ...round, answers })
    setShowEnglish(true)
  }

  const submitFill = () => {
    if (!input.trim() || !q) return
    submit(input, isCorrect(q, input))
  }

  /** Re-open a wrongly answered sentence so it can be answered again. */
  const tryAgain = () => {
    if (!answer || answer.correct) return
    const answers = [...round.answers]
    answers[index] = undefined
    const wrongTries = round.wrongTries.map((w, i) => (i === index ? [...w, answer.text] : w))
    setRound({ ...round, answers, wrongTries })
    setInput('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const next = () => {
    if (isLast) {
      recordAttempt('test')
      setFinished(true)
      return
    }
    setIndex((i) => i + 1)
    setInput('')
    setShowEnglish(false)
  }

  const insertAccent = (char: string) => {
    const el = inputRef.current
    if (!el || answer) return
    const { value, caret } = insertAtCaret(el, char)
    setInput(value)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(caret, caret)
    })
  }

  // A sentence is a mistake if it was ever answered wrongly, even if fixed with "Try again".
  const mistakes = round.questions
    .map((question, i) => ({ question, answer: round.answers[i], wrong: round.wrongTries[i] }))
    .filter((x) => x.wrong.length > 0 || (x.answer && !x.answer.correct))
  const firstTryCount = round.questions.filter((_, i) => round.answers[i]?.correct && !round.wrongTries[i].length).length
  const previousWrong = round.wrongTries[index] ?? []

  return (
    <div className="flex flex-col gap-5">
      {/* Settings */}
      <Card className="p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sentence-scope">Verbs</Label>
            <NativeSelect
              id="sentence-scope"
              value={scope}
              onChange={(e) => {
                setScope(e.target.value)
              }}
            >
              <option value="all">All 200 verbs</option>
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.expectedCount})
                </option>
              ))}
              <option value="choose">Choose verbs…</option>
            </NativeSelect>
          </div>
          <div className="hidden md:block" />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Answer mode</span>
            <Segmented
              label="Sentence answer mode"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'fill', label: 'Fill in', icon: <PencilLine /> },
                { value: 'mcq', label: 'Multiple choice', icon: <ListChecks /> },
              ]}
            />
          </div>
        </div>
        {scope === 'choose' && (
          <div className="mt-4">
            <VerbChecklist verbs={VERBS} selected={chosen} onChange={setChosen} testIdPrefix="sentence-verb" />
          </div>
        )}
        <div className="mt-4">
          <TenseSelectChips available={SENTENCE_TENSES} value={tenses} onChange={setTenses} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={() => start()} disabled={!tenses.length || !verbs.length} data-testid="sentence-new-round">
            <Shuffle /> New round of {ROUND_SIZE} sentences
          </Button>
          <span className="text-xs text-muted-foreground" data-testid="sentence-selection-note">
            Sentences use only the{' '}
            {scope === 'choose' ? `${verbs.length} verb${verbs.length === 1 ? '' : 's'} you chose` : `${verbs.length} verbs selected`} and{' '}
            {tenses.length} tense{tenses.length === 1 ? '' : 's'}. Changing them starts a new round.
          </span>
        </div>
      </Card>

      {!round.questions.length ? (
        <Card className="p-6 text-center text-muted-foreground">No sentences for this selection — choose more tenses or verbs.</Card>
      ) : finished ? (
        <Card className="animate-fade-in p-6" data-testid="sentence-results">
          <div className="flex flex-col items-center gap-2 text-center">
            <Trophy className={cn('size-9', correctCount / round.questions.length >= 0.8 ? 'text-amber-500' : 'text-muted-foreground')} aria-hidden />
            <h3 className="font-display text-3xl font-semibold" data-testid="sentence-score">
              {correctCount} / {round.questions.length}
            </h3>
            <p className="text-muted-foreground">
              Accuracy {percent(answeredCount ? correctCount / answeredCount : 0)} ·{' '}
              <span data-testid="sentence-first-try">{firstTryCount} right first time</span>
            </p>
          </div>
          {mistakes.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-2 font-semibold">Review your mistakes</h4>
              <ul className="divide-y rounded-lg border">
                {mistakes.map(({ question, answer: a, wrong }) => {
                  const wrongAnswers = [...wrong, ...(a && !a.correct ? [a.text] : [])]
                  return (
                    <li key={question.id} className="p-3 text-sm">
                      <p lang="it">
                        {question.before}
                        <strong className="text-success-foreground">{question.display}</strong>
                        {question.after}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        You wrote{' '}
                        {wrongAnswers.map((w, i) => (
                          <span key={i}>
                            {i > 0 && ', '}
                            <span className="text-danger-foreground line-through">{w}</span>
                          </span>
                        ))}
                        {a?.correct && <span className="text-success-foreground"> → fixed on retry</span>} · {tenseFullLabel(question.tense)} — clue «
                        {question.clue}»
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {mistakes.length > 0 && (
              <Button onClick={() => startWith(roundFrom(mistakes.map((m) => m.question)))} data-testid="sentence-retry-mistakes">
                <Undo2 /> Retry my mistakes ({mistakes.length})
              </Button>
            )}
            <Button variant={mistakes.length ? 'outline' : 'default'} onClick={() => start()}>
              <RotateCcw /> New round
            </Button>
          </div>
        </Card>
      ) : (
        q && (
          <Card key={`${round.id}-${index}`} className="animate-fade-in p-5 sm:p-6" data-testid="sentence-question">
            <div className="mb-4">
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-semibold" data-testid="sentence-counter">
                  Sentence {index + 1} / {round.questions.length}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {correctCount}/{answeredCount} correct
                </span>
              </div>
              <Progress value={(index + (answer ? 1 : 0)) / round.questions.length} label="Round progress" />
            </div>

            <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Fill in the verb in the right tense
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (answer) next()
                else submitFill()
              }}
            >
              <p className="text-xl leading-relaxed sm:text-2xl" lang="it" data-testid="sentence-text">
                <span>{q.before}</span>
                {mode === 'fill' && !answer ? (
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    aria-label={`Answer: ${getVerbEntry(q.verb).infinitive}`}
                    data-testid="sentence-input"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    lang="it"
                    size={Math.max(8, input.length + 2)}
                    className="mx-1 inline-block rounded-md border-2 border-dashed border-primary/50 bg-card px-2 py-0.5 text-center font-semibold text-primary outline-none focus:border-solid focus:border-primary"
                  />
                ) : (
                  <span
                    className={cn(
                      'mx-1 inline-block rounded-md px-2 py-0.5 font-semibold',
                      !answer && 'border-2 border-dashed border-muted-foreground/40 px-6 text-muted-foreground',
                      answer?.correct && 'bg-success-soft text-success-foreground',
                      answer && !answer.correct && 'bg-danger-soft text-danger-foreground line-through',
                    )}
                  >
                    {answer ? answer.text : '?'}
                  </span>
                )}
                <span className="font-medium text-primary" data-testid="sentence-verb">
                  ({getVerbEntry(q.verb).infinitive})
                </span>
                <span>{q.after}</span>
              </p>

              {!answer && previousWrong.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground" data-testid="sentence-previous-try">
                  Try again — previous answer:{' '}
                  <span className="text-danger-foreground line-through">{previousWrong[previousWrong.length - 1]}</span>
                </p>
              )}

              <div className="mt-2 min-h-6 text-sm text-muted-foreground">
                {showEnglish ? (
                  <span data-testid="sentence-english">{q.en}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowEnglish(true)}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-primary hover:underline"
                  >
                    <Eye className="size-4" aria-hidden /> Show English translation (hint)
                  </button>
                )}
              </div>

              {!answer &&
                (mode === 'fill' ? (
                  <div className="mt-4 flex flex-col gap-3">
                    <div>
                      <Button type="submit" disabled={!input.trim()} data-testid="sentence-check">
                        <Send /> Check
                      </Button>
                    </div>
                    <AccentBar onInsert={insertAccent} />
                  </div>
                ) : (
                  <div className="mt-4">
                    <McqOptionButtons
                      name="Answer options"
                      options={round.options[q.id]}
                      onSelect={(text) => submit(text, !!round.options[q.id].find((o) => o.text === text)?.correct)}
                    />
                  </div>
                ))}
            </form>

            {answer && (
              <div className="mt-4 flex flex-col gap-3">
                {mode === 'mcq' && round.options[q.id].some((o) => o.text === answer.text) && (
                  <McqOptionButtons name="Answer options" options={round.options[q.id]} selected={answer.text} onSelect={() => {}} />
                )}
                {answer.correct ? <CorrectFeedback /> : <IncorrectFeedback answer={answer.text} correct={q.display} />}
                <TenseExplanation q={q} />
                <div className="flex flex-wrap justify-end gap-2">
                  {!answer.correct && (
                    <Button variant="outline" onClick={tryAgain} data-testid="sentence-try-again">
                      <Undo2 /> Try again
                    </Button>
                  )}
                  <Button ref={nextRef} onClick={next} data-testid="sentence-next">
                    {isLast ? 'See results' : 'Next sentence'} <ArrowRight />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )
      )}
    </div>
  )
}
