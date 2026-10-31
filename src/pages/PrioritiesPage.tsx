import { Info } from 'lucide-react'
import { PriorityCard } from '@/components/learn/PriorityCard'
import { ProgressDialog } from '@/components/ProgressDialog'
import { Button } from '@/components/ui/button'
import { PRIORITIES } from '@/data/priorities'
import { VERBS, verbsByPriority } from '@/data/verbs'
import { useProgress } from '@/hooks/useProgress'
import { groupProgress } from '@/lib/progress/mastery'
import { progressPercent } from '@/lib/utils'

export function PrioritiesPage() {
  const data = useProgress()
  const overall = groupProgress(
    data,
    VERBS.map((v) => v.infinitive),
  )
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Learn</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Choose a priority</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            200 verbs grouped by how useful they are at B1 level. Open a group, pick a verb and explore every mood and
            tense.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm shadow-xs">
          <div>
            <div className="text-xs text-muted-foreground">Overall progress</div>
            <div className="font-semibold tabular-nums">
              {progressPercent(overall.progress)} · {overall.mastered} mastered
            </div>
          </div>
          <ProgressDialog
            trigger={
              <Button variant="outline" size="sm">
                <Info /> Details
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {PRIORITIES.map((p) => {
          const verbs = verbsByPriority(p.id).map((v) => v.infinitive)
          const g = groupProgress(data, verbs)
          return <PriorityCard key={p.id} info={p} count={verbs.length} progress={g.progress} mastered={g.mastered} started={g.started} />
        })}
      </div>
    </div>
  )
}
