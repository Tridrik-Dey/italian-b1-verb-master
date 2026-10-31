import { ChevronRight, CircleCheck } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PRIORITY_BY_ID } from '@/data/priorities'
import { PRIORITY_STYLE } from '@/data/priority-style'
import type { VerbProgress } from '@/lib/progress/mastery'
import { cn } from '@/lib/utils'
import type { VerbInfo } from '@/types/verb'

const STATUS_LABEL = { new: 'Not started', studied: 'Studied', learning: 'Learning', mastered: 'Mastered' }

export function VerbCard({ info, progress }: { info: VerbInfo; progress: VerbProgress }) {
  const { entry } = info
  const style = PRIORITY_STYLE[entry.priority]
  return (
    <Link
      to={`/learn/${entry.priority}/${entry.infinitive}`}
      data-testid={`verb-card-${entry.infinitive}`}
      className={cn(
        'group flex flex-col rounded-xl border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        style.ring,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl font-semibold">{entry.infinitive}</h3>
          <p className="truncate text-sm text-muted-foreground">{entry.english}</p>
        </div>
        <span
          className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', style.dot)}
          title={PRIORITY_BY_ID[entry.priority].title}
          aria-label={`Priority: ${PRIORITY_BY_ID[entry.priority].title}`}
          role="img"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant={info.irregular ? 'irregular' : 'muted'}>{info.irregular ? 'Irregolare' : 'Regolare'}</Badge>
        {info.reflexive && <Badge variant="secondary">Riflessivo</Badge>}
        {entry.modal && <Badge variant="secondary">Modale</Badge>}
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className={cn('inline-flex items-center gap-1', progress.status === 'mastered' ? 'text-success-foreground' : 'text-muted-foreground')}>
            {progress.status === 'mastered' && <CircleCheck className="size-3.5" aria-hidden />}
            {STATUS_LABEL[progress.status]}
          </span>
          <span className="font-medium tabular-nums">{Math.round(progress.progress * 100)}%</span>
        </div>
        <Progress
          value={progress.progress}
          className="h-1.5"
          indicatorClassName={progress.status === 'mastered' ? 'bg-success' : style.bar}
          label={`${entry.infinitive} progress`}
        />
      </div>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Open conjugation chart
        <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  )
}
