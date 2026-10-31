import { CircleCheck, CircleX, Plus, RotateCcw, Trophy } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { tenseFullLabel } from '@/data/tenses'
import { VERB_BY_INFINITIVE } from '@/data/verbs'
import type { Mistake, MixSummary } from '@/lib/testing/mix'
import { learnVerbUrl } from '@/lib/routes'
import { cn, percent } from '@/lib/utils'

function MistakeLine({ m, show }: { m: Mistake; show: 'verb' | 'tense' }) {
  return (
    <li className="flex flex-col gap-0.5 py-2 text-sm sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
      <span className="text-muted-foreground">
        {show === 'tense' ? tenseFullLabel(m.question.tense) : m.question.verb} · {m.question.personLabel}
      </span>
      <span>
        <span className="text-danger-foreground line-through">{m.answer}</span>
        <span className="mx-1.5 text-muted-foreground">→</span>
        <strong className="text-success-foreground">{m.question.display}</strong>
        {m.fixed && <span className="ml-1.5 text-xs text-success-foreground">(fixed on retry)</span>}
      </span>
    </li>
  )
}

interface Props {
  summary: MixSummary
  onRetryIncorrect: () => void
  onNew: () => void
}

export function MixSummaryView({ summary: s, onRetryIncorrect, onNew }: Props) {
  const pct = Math.round(s.accuracy * 100)
  return (
    <div className="mx-auto flex max-w-3xl animate-fade-in flex-col gap-5" data-testid="mix-results">
      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-2 bg-gradient-to-b from-secondary/70 to-transparent p-6 text-center sm:p-8">
          <Trophy className={cn('size-10', pct >= 80 ? 'text-amber-500' : 'text-muted-foreground')} aria-hidden />
          <h2 className="font-display text-3xl font-semibold" data-testid="mix-total">
            {s.correct} / {s.total}
          </h2>
          <p className="text-muted-foreground">
            Accuracy <strong className="text-foreground">{percent(s.accuracy)}</strong> ·{' '}
            <span data-testid="mix-first-try">{s.firstTry} right first time</span>
            {s.answered < s.total && ` · ${s.total - s.answered} not answered`}
          </p>
          <Progress value={s.accuracy} className="mt-2 max-w-sm" indicatorClassName={pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-amber-500' : 'bg-danger'} label="Accuracy" />
          <div className="mt-3 flex gap-3">
            <Badge variant="success">
              <CircleCheck aria-hidden /> {s.correct} correct
            </Badge>
            <Badge variant="danger">
              <CircleX aria-hidden /> {s.incorrect} incorrect
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t p-4 sm:flex-row sm:justify-center">
          <Button onClick={onRetryIncorrect} disabled={!s.mistakes.length} data-testid="mix-retry-incorrect">
            <RotateCcw /> Retry Incorrect Questions
          </Button>
          <Button variant="outline" onClick={onNew} data-testid="mix-new">
            <Plus /> Start New Mix Test
          </Button>
        </div>
      </Card>

      {s.mistakes.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-2 font-semibold">Mistakes by verb</h3>
            <div className="flex flex-col gap-3">
              {s.byVerb.map((g) => {
                const entry = VERB_BY_INFINITIVE.get(g.verb)
                return (
                  <section key={g.verb}>
                    <div className="flex items-center justify-between">
                      {entry ? (
                        <Link to={learnVerbUrl(entry.priority, g.verb)} className="font-display text-lg font-semibold hover:underline">
                          {g.verb}
                        </Link>
                      ) : (
                        <span className="font-semibold">{g.verb}</span>
                      )}
                      <Badge variant="danger">{g.mistakes.length}</Badge>
                    </div>
                    <ul className="divide-y">
                      {g.mistakes.map((m) => (
                        <MistakeLine key={m.question.id} m={m} show="tense" />
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-2 font-semibold">Mistakes by tense</h3>
            <div className="flex flex-col gap-3">
              {s.byTense.map((g) => (
                <section key={g.tense}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{tenseFullLabel(g.tense)}</span>
                    <Badge variant="danger">{g.mistakes.length}</Badge>
                  </div>
                  <ul className="divide-y">
                    {g.mistakes.map((m) => (
                      <MistakeLine key={m.question.id} m={m} show="verb" />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        s.answered > 0 && (
          <Card className="p-6 text-center">
            <p className="font-medium text-success-foreground">Perfetto! No mistakes in this test.</p>
          </Card>
        )
      )}
    </div>
  )
}
