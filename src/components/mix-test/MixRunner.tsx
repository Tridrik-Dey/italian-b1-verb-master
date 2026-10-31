import { ArrowRight, Flag, ListChecks, PencilLine, Send, Undo2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { AccentBar, insertAtCaret } from '@/components/test/AccentBar'
import { CorrectFeedback, IncorrectFeedback, McqOptionButtons, distractorExplanation } from '@/components/test/Feedback'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Segmented } from '@/components/ui/segmented'
import { tenseEnglish, tenseFullLabel } from '@/data/tenses'
import type { MixAnswer } from '@/lib/testing/mix'
import type { AnswerMode, McqOption, Question } from '@/lib/testing/types'
import { isCorrect } from '@/lib/testing/validate'

interface Props {
  questions: Question[]
  options: Record<string, McqOption[]>
  answers: (MixAnswer | undefined)[]
  mode: AnswerMode
  onModeChange: (m: AnswerMode) => void
  onAnswer: (index: number, answer: MixAnswer) => void
  /** Re-open a wrongly answered question. */
  onTryAgain: (index: number) => void
  /** Wrong answers already given per question (shown when trying again). */
  previousWrong: string[][]
  onFinish: () => void
}

export function MixRunner({
  questions,
  options,
  answers,
  mode,
  onModeChange,
  onAnswer,
  onTryAgain,
  previousWrong,
  onFinish,
}: Props) {
  const [index, setIndex] = useState(() => {
    const firstOpen = answers.findIndex((a) => !a)
    return firstOpen === -1 ? 0 : firstOpen
  })
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const q = questions[index]
  const answer = answers[index]
  const isLast = index === questions.length - 1
  const answeredCount = answers.filter(Boolean).length
  const correctCount = answers.filter((a) => a?.correct).length

  useEffect(() => {
    if (answer) nextRef.current?.focus()
    else if (mode === 'fill') inputRef.current?.focus()
  }, [answer, mode, index])

  const goNext = () => {
    if (isLast) return onFinish()
    setIndex((i) => i + 1)
    setInput('')
  }

  const submitFill = () => {
    if (answer || !input.trim()) return
    onAnswer(index, { answer: input, correct: isCorrect(q, input) })
  }

  const tryAgain = () => {
    onTryAgain(index)
    setInput('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }
  const lastWrong = previousWrong[index]?.at(-1)

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

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Answer mode"
          value={mode}
          onChange={onModeChange}
          options={[
            { value: 'fill', label: 'Fill in', icon: <PencilLine /> },
            { value: 'mcq', label: 'Multiple choice', icon: <ListChecks /> },
          ]}
        />
        <Button variant="ghost" size="sm" onClick={onFinish}>
          <Flag /> End test
        </Button>
      </div>

      <div>
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="font-semibold" data-testid="question-counter">
            Question {index + 1} / {questions.length}
          </span>
          <span className="text-muted-foreground tabular-nums">
            {correctCount}/{answeredCount} correct
          </span>
        </div>
        <Progress value={(index + (answer ? 1 : 0)) / questions.length} label="Test progress" />
      </div>

      <Card key={q.id} className="animate-fade-in p-5 sm:p-6" data-testid="mix-question">
        <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-2.5 text-sm">
          <dt className="text-muted-foreground">Verb</dt>
          <dd>
            <span className="font-display text-xl font-semibold" data-testid="mix-verb">
              {q.verb}
            </span>{' '}
            <span className="text-muted-foreground">— {q.english}</span>
          </dd>
          <dt className="text-muted-foreground">Tense</dt>
          <dd>
            <Badge variant="secondary" data-testid="mix-tense" data-tense={q.tense}>
              {tenseFullLabel(q.tense)}
            </Badge>
            <span className="ml-2 text-muted-foreground">= {tenseEnglish(q.tense)}</span>
          </dd>
          <dt className="text-muted-foreground">{q.key === 'form' ? 'Form' : 'Pronoun'}</dt>
          <dd className="font-semibold" data-testid="mix-person">
            {q.personLabel}
          </dd>
        </dl>

        <div className="mt-5">
          {mode === 'fill' || (answer && !options[q.id]?.some((o) => o.text === answer.answer)) ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (answer) goNext()
                else submitFill()
              }}
              className="flex flex-col gap-3"
            >
              <label htmlFor="mix-answer" className="text-sm font-medium">
                Answer
              </label>
              <div className="flex gap-2">
                <Input
                  id="mix-answer"
                  ref={inputRef}
                  value={answer ? answer.answer : input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!!answer}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  lang="it"
                  placeholder="Type the conjugation…"
                  className={
                    answer
                      ? answer.correct
                        ? 'border-success bg-success-soft font-medium text-success-foreground disabled:opacity-100'
                        : 'border-danger bg-danger-soft font-medium text-danger-foreground line-through disabled:opacity-100'
                      : ''
                  }
                />
                {!answer && (
                  <Button type="submit" disabled={!input.trim()} data-testid="mix-check">
                    <Send /> Check
                  </Button>
                )}
              </div>
              {!answer && <AccentBar onInsert={insertAccent} />}
            </form>
          ) : (
            <McqOptionButtons
              name="Answer options"
              options={options[q.id]}
              selected={answer?.answer}
              onSelect={(text) => {
                const opt = options[q.id].find((o) => o.text === text)
                onAnswer(index, { answer: text, correct: !!opt?.correct })
              }}
            />
          )}

          {answer && (
            <div className="mt-4 flex flex-col gap-3">
              {answer.correct ? (
                <CorrectFeedback />
              ) : (
                <>
                  <IncorrectFeedback answer={answer.answer} correct={q.display} />
                  {mode === 'mcq' && (
                    <p className="text-xs text-muted-foreground">
                      {distractorExplanation(
                        options[q.id]?.find((o) => o.text === answer.answer),
                        q.verb,
                      )}
                    </p>
                  )}
                </>
              )}
              <div className="flex flex-wrap justify-end gap-2">
                {!answer.correct && (
                  <Button variant="outline" onClick={tryAgain} data-testid="mix-try-again">
                    <Undo2 /> Try again
                  </Button>
                )}
                <Button ref={nextRef} onClick={goNext} data-testid="mix-next">
                  {isLast ? 'See results' : 'Next question'} <ArrowRight />
                </Button>
              </div>
            </div>
          )}
          {!answer && lastWrong && (
            <p className="mt-3 text-sm text-muted-foreground" data-testid="mix-previous-try">
              Try again — previous answer: <span className="text-danger-foreground line-through">{lastWrong}</span>
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
