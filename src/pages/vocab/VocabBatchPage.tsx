import { ArrowLeft, BookOpen, ClipboardCheck } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { BestScoreLabel, StatusMark, VocabTypeToggle, scoreStatus } from '@/components/vocab/VocabParts'
import { BATCH_BY_ID, VOCAB_TYPE_LABEL, batchItems } from '@/data/vocabulary'
import { cn } from '@/lib/utils'
import { useVocabType, vocabStudyUrl, vocabTestUrl } from '@/lib/vocab/prefs'
import { scoreKey, useVocabScores } from '@/lib/vocab/scores'
import { SubBatchMarks, unitRange } from './VocabBatchesPage'

export function VocabBatchPage() {
  const { batchId = '' } = useParams()
  const [type, setType] = useVocabType()
  const scores = useVocabScores()
  const batch = BATCH_BY_ID.get(batchId)
  if (!batch) return <Navigate to="/vocabolario" replace />

  const label = VOCAB_TYPE_LABEL[type]
  const count = batchItems(batch, type).length
  // Sub-batches stay in the book's order; the ones with nothing of this type are greyed out at the end.
  const subs = [...batch.subBatches].sort((a, b) => Number(!a[type].length) - Number(!b[type].length))

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3">
        <Link to={`/vocabolario?type=${type}`}>
          <ArrowLeft /> Back to batches
        </Link>
      </Button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{unitRange(batch)}</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl" data-testid="vocab-batch-title">
            {batch.title}
          </h1>
          <p className="mt-1 text-muted-foreground">
            <span className="tabular-nums">{count}</span> {label.it.toLowerCase()} in{' '}
            <span className="tabular-nums">{batch.subBatches.filter((s) => s[type].length).length}</span> sub-batches
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <VocabTypeToggle value={type} onChange={setType} />
          <Button asChild data-testid="vocab-test-batch">
            <Link to={vocabTestUrl({ kind: 'batch', id: batch.id }, type)}>
              <ClipboardCheck /> Test whole batch
            </Link>
          </Button>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
        <BestScoreLabel prefix="Whole-batch test: " score={scores.best[scoreKey(type, { kind: 'batch', id: batch.id })]} />
        <SubBatchMarks batch={batch} type={type} />
      </div>

      <ul className="flex flex-col gap-3">
        {subs.map((sub) => {
          const n = sub[type].length
          const empty = n === 0
          const best = scores.best[scoreKey(type, { kind: 'sub', id: sub.id })]
          const status = scoreStatus(best)
          return (
            <li
              key={sub.id}
              data-testid={`vocab-sub-${sub.id}`}
              aria-disabled={empty || undefined}
              data-status={empty ? undefined : status}
              className={cn(
                'flex flex-col gap-3 rounded-xl border border-l-4 bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-5',
                empty && 'bg-muted/40 opacity-60 shadow-none',
                !empty && status === 'perfect' && 'border-l-success bg-success-soft/40',
                !empty && status === 'partial' && 'border-l-amber-500',
              )}
            >
              <div className="flex min-w-0 items-start gap-3">
                {!empty && <StatusMark score={best} className="mt-0.5" />}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{sub.unit}</p>
                  <h2 className="mt-0.5 font-semibold leading-snug" lang="it">
                    {sub.title}
                  </h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="text-muted-foreground">
                      <span className="tabular-nums" data-testid="vocab-sub-count">
                        {n}
                      </span>{' '}
                      {label.it.toLowerCase()}
                      {empty && ` — no ${label.en.toLowerCase()} in this section`}
                    </span>
                    {!empty && <BestScoreLabel score={best} />}
                  </p>
                </div>
              </div>
              {!empty && (
                <div className="flex shrink-0 gap-2">
                  <Button variant="outline" asChild className="flex-1 sm:flex-none">
                    <Link to={vocabStudyUrl(batch.id, sub.id, type)} data-testid="vocab-study">
                      <BookOpen /> Studia
                    </Link>
                  </Button>
                  <Button asChild className="flex-1 sm:flex-none">
                    <Link to={vocabTestUrl({ kind: 'sub', id: sub.id }, type)} data-testid="vocab-test">
                      <ClipboardCheck /> Test
                    </Link>
                  </Button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
