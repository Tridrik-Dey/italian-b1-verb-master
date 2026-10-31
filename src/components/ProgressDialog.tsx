import { BarChart3, RotateCcw, TriangleAlert } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { tenseFullLabel } from '@/data/tenses'
import { VERB_BY_INFINITIVE } from '@/data/verbs'
import { useProgress } from '@/hooks/useProgress'
import { accuracyByTense, accuracyByVerb, overallStats } from '@/lib/progress/mastery'
import { resetProgress } from '@/lib/progress/store'
import { formatDate, percent } from '@/lib/utils'
import type { TenseId } from '@/types/verb'

export function MasteryRule() {
  return (
    <div className="rounded-lg border bg-muted/50 p-4 text-sm">
      <p className="mb-2 font-semibold">How progress and mastery work</p>
      <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
        <li>For each verb and tense, your last 10 answers are kept.</li>
        <li>
          A tense is <strong className="text-foreground">mastered</strong> when you have answered it at least 6 times and
          at least 80% of those recent answers are correct.
        </li>
        <li>Until then, each correct recent answer adds 1/6 to that tense’s progress (up to 83%).</li>
        <li>
          Verb progress is the average over its 8 core B1 tenses: presente, imperfetto, passato prossimo, trapassato
          prossimo, futuro semplice, congiuntivo presente, condizionale presente and imperativo (where it exists).
        </li>
        <li>A verb is mastered when all of its core tenses are mastered.</li>
      </ul>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  )
}

export function ProgressDialog({ trigger }: { trigger?: ReactNode }) {
  const data = useProgress()
  const [confirming, setConfirming] = useState(false)
  const stats = overallStats(data)
  const byTense = accuracyByTense(data).sort((a, b) => a.accuracy - b.accuracy)
  const weakVerbs = accuracyByVerb(data)
    .filter((r) => r.correct + r.incorrect >= 3)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)

  return (
    <Dialog onOpenChange={() => setConfirming(false)}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" aria-label="Learning progress" title="Learning progress">
            <BarChart3 />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Your progress</DialogTitle>
          <DialogDescription>Saved automatically in this browser. Last practised: {formatDate(stats.lastPracticed)}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Verbs studied" value={stats.studiedVerbs} />
          <Stat label="Verbs practised" value={stats.practicedVerbs} />
          <Stat label="Tenses practised" value={stats.practicedTenses} />
          <Stat label="Test attempts" value={stats.attempts} />
          <Stat label="Correct answers" value={<span className="text-success-foreground">{stats.correct}</span>} />
          <Stat label="Incorrect answers" value={<span className="text-danger-foreground">{stats.incorrect}</span>} />
          <Stat label="Accuracy" value={percent(stats.accuracy)} />
          <Stat label="Mix / Test sessions" value={`${data.attempts.mix} / ${data.attempts.test}`} />
        </div>

        {byTense.length > 0 && (
          <section>
            <h4 className="mb-2 text-sm font-semibold">Accuracy by tense</h4>
            <ul className="space-y-2">
              {byTense.map((r) => (
                <li key={r.key} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-sm">
                  <span className="truncate">{tenseFullLabel(r.key as TenseId)}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {r.correct}/{r.correct + r.incorrect} · {percent(r.accuracy)}
                  </span>
                  <Progress
                    value={r.accuracy}
                    className="col-span-2 h-1.5"
                    indicatorClassName={r.accuracy >= 0.8 ? 'bg-success' : r.accuracy >= 0.5 ? 'bg-amber-500' : 'bg-danger'}
                    label={`Accuracy ${tenseFullLabel(r.key as TenseId)}`}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {weakVerbs.length > 0 && (
          <section>
            <h4 className="mb-2 text-sm font-semibold">Verbs to review</h4>
            <div className="flex flex-wrap gap-2">
              {weakVerbs.map((r) => {
                const entry = VERB_BY_INFINITIVE.get(r.key)
                if (!entry) return null
                return (
                  <Link
                    key={r.key}
                    to={`/learn/${entry.priority}/${entry.infinitive}`}
                    className="rounded-full border px-3 py-1 text-sm hover:bg-accent"
                  >
                    {entry.infinitive} <span className="text-muted-foreground">{percent(r.accuracy)}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {stats.correct + stats.incorrect === 0 && (
          <p className="text-sm text-muted-foreground">No answers yet — try the Test or Mix Test tab to start tracking.</p>
        )}

        <MasteryRule />

        <DialogFooter className="items-center">
          {confirming ? (
            <div
              role="alertdialog"
              aria-label="Confirm reset"
              className="flex w-full flex-col gap-3 rounded-lg border border-danger/40 bg-danger-soft p-3 sm:flex-row sm:items-center"
            >
              <p className="flex flex-1 items-start gap-2 text-sm text-danger-foreground">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                Delete all progress, statistics and study history? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    resetProgress()
                    setConfirming(false)
                  }}
                >
                  Yes, reset
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setConfirming(true)}>
              <RotateCcw /> Reset progress
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
