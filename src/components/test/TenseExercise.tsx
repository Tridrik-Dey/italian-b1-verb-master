import { CircleCheck, CircleX, RotateCcw, Send, Undo2 } from 'lucide-react'
import { useMemo, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { recordAnswer, recordAttempt } from '@/lib/progress/store'
import { mcqOptions, questionsForTense } from '@/lib/testing/generate'
import {
  checkFill,
  createSession,
  isComplete,
  markAttemptRecorded,
  resetMode,
  retryIncorrect,
  retryItem,
  score,
  selectOption,
  setInput,
  type SessionState,
  type Transition,
} from '@/lib/testing/session'
import type { AnswerMode, McqOption, Question } from '@/lib/testing/types'
import { cn } from '@/lib/utils'
import type { TenseId } from '@/types/verb'
import { AccentBar, insertAtCaret } from './AccentBar'
import { CorrectFeedback, IncorrectFeedback, McqOptionButtons, distractorExplanation } from './Feedback'

function buildOptions(questions: Question[]): Record<string, McqOption[]> {
  return Object.fromEntries(questions.map((q) => [q.id, mcqOptions(q)]))
}

interface Props {
  verb: string
  tense: TenseId
  mode: AnswerMode
  /** Extra controls rendered next to Retry/Reset (Change tense, Change verb, Return to Learn). */
  extraControls?: ReactNode
}

export function TenseExercise({ verb, tense, mode, extraControls }: Props) {
  const questions = useMemo(() => questionsForTense(verb, tense), [verb, tense])
  const [session, setSession] = useState<SessionState>(() => createSession(questions, buildOptions(questions)))
  const inputs = useRef<Record<string, HTMLInputElement | null>>({})
  const lastFocused = useRef<string | null>(null)

  /** Apply a grading transition: persist answers and count a completed attempt once per mode. */
  const apply = ({ state, events }: Transition) => {
    for (const e of events) recordAnswer(e.question.verb, e.question.tense, e.correct)
    let next = state
    if (events.length && isComplete(next, mode) && !next.attemptRecorded[mode]) {
      recordAttempt('test')
      next = markAttemptRecorded(next, mode)
    }
    setSession(next)
    return next
  }

  const s = score(session, mode)
  const items = session.modes[mode]
  const pendingWithInput = questions.some((q) => items[q.id].status === 'pending' && items[q.id].input.trim())
  const hasIncorrect = s.incorrect > 0

  const focusNextPending = (afterId: string, state: SessionState) => {
    const idx = questions.findIndex((q) => q.id === afterId)
    const ordered = [...questions.slice(idx + 1), ...questions.slice(0, idx + 1)]
    const next = ordered.find((q) => state.modes.fill[q.id].status === 'pending')
    if (next) inputs.current[next.id]?.focus()
  }

  const insertAccent = (char: string) => {
    const id = lastFocused.current ?? questions.find((q) => items[q.id].status === 'pending')?.id
    if (!id) return
    const el = inputs.current[id]
    if (!el || el.disabled) return
    const { value, caret } = insertAtCaret(el, char)
    setSession((st) => setInput(st, id, value))
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(caret, caret)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Score */}
      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-full text-sm font-bold tabular-nums',
              s.answered === 0 ? 'bg-muted text-muted-foreground' : s.percent >= 80 ? 'bg-success-soft text-success-foreground' : s.percent >= 50 ? 'bg-irregular text-irregular-foreground' : 'bg-danger-soft text-danger-foreground',
            )}
            aria-hidden
          >
            {s.percent}%
          </div>
          <div>
            <p className="font-semibold" data-testid="score" aria-live="polite">
              {s.correct}/{s.total} correct — {s.percent}%
            </p>
            <p className="text-xs text-muted-foreground">
              {s.answered} of {s.total} answered{s.incorrect ? ` · ${s.incorrect} to retry` : ''}
            </p>
          </div>
        </div>
        <Progress value={s.total ? s.correct / s.total : 0} indicatorClassName="bg-success" className="sm:w-56" label="Score" />
      </Card>

      {/* Questions */}
      <Card className="overflow-hidden">
        <ol className="divide-y" data-testid="exercise">
          {questions.map((q) => {
            const item = items[q.id]
            return (
              <li key={q.id} className="grid gap-2 p-4 sm:grid-cols-[9rem_1fr] sm:items-start sm:gap-4" data-testid={`row-${q.key}`}>
                <label htmlFor={`answer-${q.key}`} className="pt-2 text-sm font-semibold text-muted-foreground">
                  {q.personLabel}
                </label>
                <div className="flex flex-col gap-2">
                  {mode === 'fill' ? (
                    <>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={`answer-${q.key}`}
                            ref={(el) => {
                              inputs.current[q.id] = el
                            }}
                            value={item.status === 'pending' ? item.input : (item.answer ?? '')}
                            disabled={item.status !== 'pending'}
                            onChange={(e) => setSession((st) => setInput(st, q.id, e.target.value))}
                            onFocus={() => (lastFocused.current = q.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                const next = apply(checkFill(session, q.id))
                                focusNextPending(q.id, next)
                              }
                            }}
                            autoComplete="off"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            lang="it"
                            placeholder={item.previousAnswer ? `Previous: ${item.previousAnswer}` : 'Type the conjugation…'}
                            aria-invalid={item.status === 'incorrect' || undefined}
                            aria-describedby={item.status !== 'pending' ? `feedback-${q.key}` : undefined}
                            className={cn(
                              'pr-9',
                              item.status === 'correct' && 'border-success bg-success-soft font-medium text-success-foreground disabled:opacity-100',
                              item.status === 'incorrect' && 'border-danger bg-danger-soft font-medium text-danger-foreground line-through decoration-2 disabled:opacity-100',
                            )}
                          />
                          {item.status === 'correct' && (
                            <CircleCheck className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-success" aria-hidden />
                          )}
                          {item.status === 'incorrect' && (
                            <CircleX className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-danger" aria-hidden />
                          )}
                        </div>
                        {item.status === 'incorrect' && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSession((st) => retryItem(st, 'fill', q.id))
                              requestAnimationFrame(() => inputs.current[q.id]?.focus())
                            }}
                            aria-label={`Retry ${q.personLabel}`}
                            title="Try again"
                          >
                            <Undo2 />
                          </Button>
                        )}
                      </div>
                      <div id={`feedback-${q.key}`}>
                        {item.status === 'correct' && <CorrectFeedback />}
                        {item.status === 'incorrect' && <IncorrectFeedback answer={item.answer ?? ''} correct={q.display} />}
                      </div>
                    </>
                  ) : (
                    <>
                      <McqOptionButtons
                        name={`${q.personLabel} options`}
                        options={session.options[q.id]}
                        selected={item.status === 'pending' ? undefined : item.answer}
                        onSelect={(text) => apply(selectOption(session, q.id, text))}
                      />
                      {item.status === 'correct' && <CorrectFeedback />}
                      {item.status === 'incorrect' && (
                        <div className="space-y-1">
                          <IncorrectFeedback answer={item.answer ?? ''} correct={q.display} />
                          <p className="text-xs text-muted-foreground">
                            {distractorExplanation(
                              session.options[q.id].find((o) => o.text === item.answer),
                              q.verb,
                            )}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
        {mode === 'fill' && (
          <div className="border-t bg-muted/40 px-4 py-3">
            <AccentBar onInsert={insertAccent} />
          </div>
        )}
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {mode === 'fill' && (
          <Button onClick={() => apply(checkFill(session))} disabled={!pendingWithInput} data-testid="check-answers">
            <Send /> Check Answer
          </Button>
        )}
        <Button variant="secondary" onClick={() => setSession((st) => retryIncorrect(st, mode))} disabled={!hasIncorrect}>
          <Undo2 /> Retry Incorrect
        </Button>
        <Button
          variant="outline"
          onClick={() => setSession((st) => resetMode(st, mode, mode === 'mcq' ? buildOptions(questions) : undefined))}
        >
          <RotateCcw /> Reset Test
        </Button>
        {extraControls}
      </div>
    </div>
  )
}
