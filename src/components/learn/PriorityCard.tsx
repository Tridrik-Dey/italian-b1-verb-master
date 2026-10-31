import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Progress } from '@/components/ui/progress'
import type { PriorityInfo } from '@/data/priorities'
import { PRIORITY_STYLE } from '@/data/priority-style'
import { cn, progressPercent } from '@/lib/utils'

interface Props {
  info: PriorityInfo
  count: number
  progress: number
  mastered: number
  started: number
}

export function PriorityCard({ info, count, progress, mastered, started }: Props) {
  const style = PRIORITY_STYLE[info.id]
  return (
    <Link
      to={`/learn/${info.id}`}
      data-testid={`priority-card-${info.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        style.ring,
      )}
    >
      <div aria-hidden className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br', style.gradient)} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <span className={cn('inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase', style.text)}>
            <span className={cn('size-2 rounded-full', style.dot)} aria-hidden />
            {info.importance}
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{info.title}</h2>
        </div>
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-card transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        >
          <ArrowRight className="size-5" />
        </span>
      </div>
      <p className="relative mt-1 text-sm font-medium">
        <span className="tabular-nums">{count}</span> verbs
      </p>
      <p className="relative mt-2 flex-1 text-sm text-muted-foreground">{info.description}</p>
      <div className="relative mt-5">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>
            {started} started · {mastered} mastered
          </span>
          <span className="font-semibold text-foreground tabular-nums" data-testid="priority-progress">
            {progressPercent(progress)}
          </span>
        </div>
        <Progress value={progress} indicatorClassName={style.bar} label={`${info.title} progress`} />
      </div>
    </Link>
  )
}
