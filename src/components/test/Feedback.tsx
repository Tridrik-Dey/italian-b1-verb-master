import { CircleCheck, CircleX } from 'lucide-react'
import { rowLabel, tenseFullLabel } from '@/data/tenses'
import type { McqOption } from '@/lib/testing/types'
import { cn } from '@/lib/utils'

/** Shown under a wrong answer: the learner's answer (kept for comparison) and the correct form. */
export function IncorrectFeedback({ answer, correct, className }: { answer: string; correct: string; className?: string }) {
  return (
    <div className={cn('animate-fade-in space-y-0.5 text-sm', className)} data-testid="incorrect-feedback">
      <p className="flex items-center gap-1.5 text-danger-foreground">
        <CircleX className="size-4 shrink-0" aria-hidden />
        <span>
          Incorrect — your answer: <span className="font-medium line-through decoration-2">{answer}</span>
        </span>
      </p>
      <p className="flex items-center gap-1.5 text-success-foreground">
        <CircleCheck className="size-4 shrink-0" aria-hidden />
        <span>
          Correct answer: <strong data-testid="correct-answer">{correct}</strong>
        </span>
      </p>
    </div>
  )
}

export function CorrectFeedback({ className }: { className?: string }) {
  return (
    <p className={cn('flex animate-fade-in items-center gap-1.5 text-sm text-success-foreground', className)} data-testid="correct-feedback">
      <CircleCheck className="size-4" aria-hidden /> Correct!
    </p>
  )
}

/** A short explanation of where a wrong MCQ option comes from. */
export function distractorExplanation(option: McqOption | undefined, verb: string): string | null {
  if (!option?.source) return null
  const person = rowLabel(option.source.tense, option.source.key)
  const which = option.source.key === 'form' ? person.toLowerCase() : `“${person.toLowerCase()}” form`
  return `“${option.text}” is the ${which} of ${verb} (${tenseFullLabel(option.source.tense)}).`
}

interface McqOptionsProps {
  options: McqOption[]
  selected?: string
  onSelect: (text: string) => void
  name: string
}

/** Four answer buttons. Correct = green + check, chosen wrong = red + cross (never colour only). */
export function McqOptionButtons({ options, selected, onSelect, name }: McqOptionsProps) {
  const answered = selected !== undefined
  return (
    <div role="group" aria-label={name} className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const isSelected = o.text === selected
        const showCorrect = answered && o.correct
        const showWrong = answered && isSelected && !o.correct
        return (
          <button
            key={o.text}
            type="button"
            disabled={answered}
            onClick={() => onSelect(o.text)}
            data-testid="mcq-option"
            data-correct={answered ? String(o.correct) : undefined}
            aria-pressed={isSelected}
            className={cn(
              'flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-lg border bg-card px-3.5 py-2 text-left font-medium transition-all disabled:cursor-default',
              !answered && 'hover:border-primary/60 hover:bg-accent',
              showCorrect && 'animate-pop border-success bg-success-soft text-success-foreground',
              showWrong && 'animate-pop border-danger bg-danger-soft text-danger-foreground',
              answered && !showCorrect && !showWrong && 'opacity-55',
            )}
          >
            <span lang="it">{o.text}</span>
            {showCorrect && (
              <>
                <CircleCheck className="size-4 shrink-0" aria-hidden />
                <span className="sr-only">(correct answer)</span>
              </>
            )}
            {showWrong && (
              <>
                <CircleX className="size-4 shrink-0" aria-hidden />
                <span className="sr-only">(your answer, incorrect)</span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
