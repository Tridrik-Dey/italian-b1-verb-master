import { ArrowLeft, ArrowRight, CircleCheck, CircleX, Flag, Play, RotateCcw, Sparkles, Trophy, Undo2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CorrectFeedback, IncorrectFeedback, McqOptionButtons } from '@/components/test/Feedback'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Segmented } from '@/components/ui/segmented'
import { BestScoreLabel, Emphasis, VocabTypeToggle } from '@/components/vocab/VocabParts'
import {
  BATCH_BY_ID,
  SUB_BATCH_BY_ID,
  VOCAB_TYPE_LABEL,
  scopeItems,
  scopeTitle,
  type VocabScope,
  type VocabType,
} from '@/data/vocabulary'
import { cn, percent } from '@/lib/utils'
import { useVocabType, vocabBatchUrl } from '@/lib/vocab/prefs'
import {
  buildVocabQuiz,
  retryQuestions,
  uniqueItems,
  type QuestionCount,
  type VocabDirection,
  type VocabQuestion,
} from '@/lib/vocab/quiz'
import { recordVocabScore, scoreKey, useVocabScores } from '@/lib/vocab/scores'

const DIRECTION_LABEL: Record<VocabDirection, string> = {
  'it-en': 'Italiano → English',
  'en-it': 'English → Italiano',
  mixed: 'Mixed',
}

function parseScope(params: URLSearchParams): VocabScope {
  const kind = params.get('scope')
  const id = params.get('id') ?? ''
  if (kind === 'sub' && SUB_BATCH_BY_ID.has(id)) return { kind: 'sub', id }
  if (kind === 'batch' && BATCH_BY_ID.has(id)) return { kind: 'batch', id }
  return { kind: 'all' }
}

function backLink(scope: VocabScope, type: VocabType): { to: string; label: string } {
  if (scope.kind === 'sub') {
    const batch = SUB_BATCH_BY_ID.get(scope.id)!.batch
    return { to: vocabBatchUrl(batch.id, type), label: `Back to ${batch.title}` }
  }
  if (scope.kind === 'batch') return { to: vocabBatchUrl(scope.id, type), label: `Back to ${BATCH_BY_ID.get(scope.id)!.title}` }
  return { to: `/vocabolario?type=${type}`, label: 'Back to batches' }
}

interface Run {
  id: number
  questions: VocabQuestion[]
  /** The learner's current option per question (cleared by "Try again"). */
  answers: (string | undefined)[]
  /** The first option picked per question — this is what the score counts. */
  firstAnswers: (string | undefined)[]
  /** Retry runs never count as a best score. */
  isRetry: boolean
}

const newRun = (questions: VocabQuestion[], isRetry: boolean): Run => ({
  id: Date.now(),
  questions,
  answers: questions.map(() => undefined),
  firstAnswers: questions.map(() => undefined),
  isRetry,
})

/** Score = right on the first try, so "Try again" helps you learn but never inflates a best score. */
const firstTryCorrect = (run: Run) => run.firstAnswers.filter((a, i) => a === run.questions[i].answer).length
const firstTryWrong = (run: Run) =>
  run.questions.filter((q, i) => run.firstAnswers[i] !== undefined && run.firstAnswers[i] !== q.answer)

function Runner({
  run,
  onAnswer,
  onTryAgain,
  onFinish,
}: {
  run: Run
  onAnswer: (i: number, a: string) => void
  onTryAgain: (i: number) => void
  onFinish: () => void
}) {
  const [index, setIndex] = useState(0)
  const nextRef = useRef<HTMLButtonElement>(null)
  const q = run.questions[index]
  const answer = run.answers[index]
  const isLast = index === run.questions.length - 1
  const answered = run.firstAnswers.filter((a) => a !== undefined)
  const correct = firstTryCorrect(run)
  const first = run.firstAnswers[index]
  const retrying = answer === undefined && first !== undefined && first !== q.answer

  useEffect(() => {
    if (answer !== undefined) nextRef.current?.focus()
  }, [answer])

  const next = () => (isLast ? onFinish() : setIndex((i) => i + 1))

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Badge variant="secondary">{q.direction === 'it-en' ? 'Italiano → English' : 'English → Italiano'}</Badge>
        <Button variant="ghost" size="sm" onClick={onFinish}>
          <Flag /> End test
        </Button>
      </div>
      <div>
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="font-semibold" data-testid="vocab-question-counter">
            Question {index + 1} / {run.questions.length}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {correct}/{answered.length} correct
          </span>
        </div>
        <Progress value={(index + (answer !== undefined ? 1 : 0)) / run.questions.length} label="Test progress" />
      </div>

      <Card key={q.id} className="animate-fade-in p-5 sm:p-6" data-testid="vocab-question">
        <p className="text-sm text-muted-foreground">
          {q.direction === 'it-en' ? 'What does this mean in English?' : 'How do you say this in Italian?'}
        </p>
        <p
          className={cn('mt-2 text-2xl font-semibold sm:text-3xl', q.direction === 'it-en' && 'font-display')}
          lang={q.direction === 'it-en' ? 'it' : 'en'}
          data-testid="vocab-prompt"
        >
          <Emphasis text={q.prompt} />
        </p>

        <div className="mt-5">
          <McqOptionButtons
            name="Answer options"
            options={q.options.map((text) => ({ text, correct: text === q.answer }))}
            selected={answer}
            onSelect={(text) => onAnswer(index, text)}
          />
        </div>

        {answer !== undefined && (
          <div className="mt-4 flex flex-col gap-3">
            {answer === q.answer ? <CorrectFeedback /> : <IncorrectFeedback answer={answer} correct={q.answer} />}
            {q.item.note && (
              <p className="text-xs text-muted-foreground">
                Note: <Emphasis text={q.item.note} />
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              {answer !== q.answer && (
                <Button variant="outline" onClick={() => onTryAgain(index)} data-testid="vocab-try-again">
                  <Undo2 /> Try again
                </Button>
              )}
              <Button ref={nextRef} onClick={next} data-testid="vocab-next">
                {isLast ? 'See results' : 'Next'} <ArrowRight />
              </Button>
            </div>
          </div>
        )}
        {retrying && (
          <p className="mt-3 text-sm text-muted-foreground" data-testid="vocab-previous-try">
            Try again — first answer: <span className="text-danger-foreground line-through">{first}</span>
            <span className="block text-xs">The score counts your first answer.</span>
          </p>
        )}
      </Card>
    </div>
  )
}

function Summary({
  run,
  newBest,
  onRetryWrong,
  onRestart,
  back,
}: {
  run: Run
  newBest: boolean
  onRetryWrong: () => void
  onRestart: () => void
  back: { to: string; label: string }
}) {
  const total = run.questions.length
  const correct = firstTryCorrect(run)
  const answered = run.firstAnswers.filter((a) => a !== undefined).length
  const wrong = run.questions
    .map((q, i) => ({ q, a: run.firstAnswers[i], fixed: run.answers[i] === q.answer }))
    .filter(({ q, a }) => a !== undefined && a !== q.answer)
  const ratio = total ? correct / total : 0
  const pct = Math.round(ratio * 100)

  return (
    <div className="mx-auto flex max-w-3xl animate-fade-in flex-col gap-5" data-testid="vocab-results">
      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-2 bg-gradient-to-b from-secondary/70 to-transparent p-6 text-center sm:p-8">
          <Trophy className={cn('size-10', pct >= 80 ? 'text-amber-500' : 'text-muted-foreground')} aria-hidden />
          <h2 className="font-display text-3xl font-semibold" data-testid="vocab-score">
            {correct} / {total}
          </h2>
          <p className="text-muted-foreground">
            <strong className="text-foreground">{percent(ratio)}</strong>
            {answered < total && ` · ${total - answered} not answered`}
            {run.isRetry && ' · retry of the wrong ones (not counted as a best score)'}
          </p>
          {newBest && (
            <Badge variant="success" data-testid="vocab-new-best">
              <Sparkles aria-hidden /> New best score!
            </Badge>
          )}
          <Progress
            value={ratio}
            className="mt-2 max-w-sm"
            indicatorClassName={pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-amber-500' : 'bg-danger'}
            label="Score"
          />
          <div className="mt-3 flex gap-3">
            <Badge variant="success">
              <CircleCheck aria-hidden /> {correct} correct
            </Badge>
            <Badge variant="danger">
              <CircleX aria-hidden /> {wrong.length} wrong
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t p-4 sm:flex-row sm:flex-wrap sm:justify-center">
          <Button onClick={onRetryWrong} disabled={!wrong.length} data-testid="vocab-retry-wrong">
            <RotateCcw /> Retry only the wrong ones
          </Button>
          <Button variant="outline" onClick={onRestart} data-testid="vocab-restart">
            <Play /> New test
          </Button>
          <Button variant="ghost" asChild>
            <Link to={back.to}>
              <ArrowLeft /> {back.label}
            </Link>
          </Button>
        </div>
      </Card>

      {wrong.length > 0 ? (
        <Card className="p-5">
          <h3 className="mb-2 font-semibold">Wrong answers</h3>
          <ul className="divide-y" data-testid="vocab-wrong-list">
            {wrong.map(({ q, a, fixed }) => (
              <li key={q.id} className="flex flex-col gap-0.5 py-2.5 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="font-medium">
                  <Emphasis text={q.prompt} />
                </span>
                <span>
                  <span className="text-danger-foreground line-through">{a}</span>
                  <span className="mx-1.5 text-muted-foreground">→</span>
                  <strong className="text-success-foreground">{q.answer}</strong>
                  {fixed && <span className="ml-1.5 text-xs text-success-foreground">(fixed on try again)</span>}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        answered > 0 && (
          <Card className="p-6 text-center">
            <p className="font-medium text-success-foreground">Perfetto! No mistakes in this test.</p>
          </Card>
        )
      )}
    </div>
  )
}

export function VocabTestPage() {
  const [params] = useSearchParams()
  const scope = useMemo(() => parseScope(params), [params])
  const [type, setType] = useVocabType()
  const scores = useVocabScores()
  const [direction, setDirection] = useState<VocabDirection>('mixed')
  const [count, setCount] = useState<QuestionCount>(10)
  const [phase, setPhase] = useState<'setup' | 'running' | 'summary'>('setup')
  const [run, setRun] = useState<Run | null>(null)
  const [newBest, setNewBest] = useState(false)

  const items = useMemo(() => scopeItems(scope, type), [scope, type])
  const available = useMemo(() => uniqueItems(items).length, [items])
  const label = VOCAB_TYPE_LABEL[type]
  const back = backLink(scope, type)
  const scopeKey = scoreKey(type, scope)

  // A different scope or type means a different test.
  useEffect(() => {
    setPhase('setup')
    setRun(null)
  }, [scopeKey])

  const start = () => {
    setRun(newRun(buildVocabQuiz(items, { direction, count }), false))
    setNewBest(false)
    setPhase('running')
  }

  const finish = () => {
    if (!run) return
    const complete = run.firstAnswers.every((a) => a !== undefined)
    setNewBest(!run.isRetry && complete && recordVocabScore(type, scope, firstTryCorrect(run), run.questions.length))
    setPhase('summary')
  }

  const retryWrong = () => {
    if (!run) return
    const wrong = firstTryWrong(run)
    if (!wrong.length) return
    setRun(newRun(retryQuestions(wrong), true))
    setNewBest(false)
    setPhase('running')
  }

  const sub = scope.kind === 'sub' ? SUB_BATCH_BY_ID.get(scope.id) : undefined

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3">
        <Link to={back.to}>
          <ArrowLeft /> {back.label}
        </Link>
      </Button>
      <div className="mb-5">
        <p className="text-sm font-medium text-primary">
          Test · {label.it} ({label.en.toLowerCase()})
          {sub && ` · ${sub.batch.title}`}
        </p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl" lang="it" data-testid="vocab-test-title">
          {scopeTitle(scope)}
        </h1>
      </div>

      {phase === 'setup' && (
        <Card className="mx-auto flex max-w-2xl flex-col gap-5 p-5 sm:p-6" data-testid="vocab-setup">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Parole o frasi</span>
            <VocabTypeToggle value={type} onChange={setType} className="self-start" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Direction</span>
            <Segmented
              label="Direction"
              value={direction}
              onChange={setDirection}
              className="self-start"
              options={(['it-en', 'en-it', 'mixed'] as const).map((d) => ({ value: d, label: DIRECTION_LABEL[d] }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Questions</span>
            <Segmented
              label="Number of questions"
              value={String(count) as '10' | '20' | 'all'}
              onChange={(v) => setCount(v === 'all' ? 'all' : (Number(v) as 10 | 20))}
              className="self-start"
              options={[
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: 'all', label: `All (${available})` },
              ]}
            />
            {count !== 'all' && available < count && (
              <p className="text-xs text-muted-foreground">Only {available} available — the test will use all of them.</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <BestScoreLabel score={scores.best[scopeKey]} />
            <Button size="lg" onClick={start} disabled={!available} data-testid="vocab-start">
              <Play /> Start test
            </Button>
          </div>
          {!available && (
            <p className="text-sm text-muted-foreground">
              There are no {label.en.toLowerCase()} here. Switch to {type === 'words' ? 'Frasi' : 'Parole'}.
            </p>
          )}
        </Card>
      )}

      {phase === 'running' && run && (
        <Runner
          key={run.id}
          run={run}
          onAnswer={(i, a) =>
            setRun((r) =>
              r && r.answers[i] === undefined
                ? {
                    ...r,
                    answers: r.answers.map((x, j) => (j === i ? a : x)),
                    firstAnswers: r.firstAnswers.map((x, j) => (j === i ? (x ?? a) : x)),
                  }
                : r,
            )
          }
          onTryAgain={(i) => setRun((r) => r && { ...r, answers: r.answers.map((x, j) => (j === i ? undefined : x)) })}
          onFinish={finish}
        />
      )}

      {phase === 'summary' && run && (
        <Summary run={run} newBest={newBest} onRetryWrong={retryWrong} onRestart={() => setPhase('setup')} back={back} />
      )}
    </div>
  )
}
