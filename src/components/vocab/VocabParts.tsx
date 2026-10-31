import { Check, Trophy } from 'lucide-react'
import { Fragment } from 'react'
import { Segmented } from '@/components/ui/segmented'
import { VOCAB_TYPE_LABEL, type VocabType } from '@/data/vocabulary'
import type { BestScore } from '@/lib/vocab/scores'
import { cn } from '@/lib/utils'

/** Renders the source's *emphasis* markers as italics. */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : <Fragment key={i}>{p}</Fragment>))}
    </>
  )
}

export function VocabTypeToggle({ value, onChange, className }: { value: VocabType; onChange: (t: VocabType) => void; className?: string }) {
  return (
    <Segmented
      label="Parole o frasi"
      value={value}
      onChange={onChange}
      className={className}
      options={(['words', 'phrases'] as const).map((t) => ({
        value: t,
        label: (
          <span>
            {VOCAB_TYPE_LABEL[t].it} <span className="hidden text-xs font-normal opacity-70 sm:inline">({VOCAB_TYPE_LABEL[t].en})</span>
          </span>
        ),
      }))}
    />
  )
}

export type ScoreStatus = 'perfect' | 'partial' | 'untested'

export function scoreStatus(score: BestScore | undefined): ScoreStatus {
  if (!score) return 'untested'
  return score.correct === score.total ? 'perfect' : 'partial'
}

/** Round mark: green check for a 100% best score, amber half-circle for a partial one, dashed ring if untested. */
export function StatusMark({ score, className }: { score: BestScore | undefined; className?: string }) {
  const status = scoreStatus(score)
  const label = status === 'perfect' ? 'Completed with 100%' : status === 'partial' ? 'Tested, not yet 100%' : 'Not tested yet'
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      data-testid="status-mark"
      data-status={status}
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full border-2',
        status === 'perfect' && 'border-success bg-success text-white dark:text-background',
        // Half-filled amber circle: started but not perfect.
        status === 'partial' && 'border-amber-500 bg-[linear-gradient(90deg,var(--color-amber-500)_50%,transparent_50%)]',
        status === 'untested' && 'border-dashed border-muted-foreground/40',
        className,
      )}
    >
      {status === 'perfect' && <Check className="size-4" strokeWidth={3} aria-hidden />}
    </span>
  )
}

/** "Best 17/20 · 85%" — or a quiet "Not tested yet". */
export function BestScoreLabel({ score, prefix, className }: { score: BestScore | undefined; prefix?: string; className?: string }) {
  if (!score) return <span className={cn('text-xs text-muted-foreground', className)}>{prefix}Not tested yet</span>
  const pct = Math.round((score.correct / score.total) * 100)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium tabular-nums',
        pct >= 80 ? 'text-success-foreground' : pct >= 50 ? 'text-amber-700 dark:text-amber-400' : 'text-danger-foreground',
        className,
      )}
      data-testid="best-score"
    >
      <Trophy className="size-3.5" aria-hidden />
      {prefix}Best {score.correct}/{score.total} · {pct}%
    </span>
  )
}
