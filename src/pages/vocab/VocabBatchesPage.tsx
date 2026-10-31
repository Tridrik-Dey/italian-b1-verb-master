import { ArrowRight, ClipboardCheck, Layers } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { BestScoreLabel, StatusMark, VocabTypeToggle, scoreStatus } from '@/components/vocab/VocabParts'
import { VOCAB_BATCHES, VOCAB_TYPE_LABEL, allItems, batchItems, type VocabBatch, type VocabType } from '@/data/vocabulary'
import { useVocabType, vocabBatchUrl, vocabTestUrl } from '@/lib/vocab/prefs'
import { scoreKey, useVocabScores } from '@/lib/vocab/scores'

/** "Unità 1–2" from the units the batch's sub-batches belong to. */
export function unitRange(batch: VocabBatch): string {
  const nums = batch.subBatches.map((s) => Number(/Unità\s+(\d+)/.exec(s.unit)?.[1])).filter((n) => !Number.isNaN(n))
  if (!nums.length) return ''
  const lo = Math.min(...nums)
  const hi = Math.max(...nums)
  return lo === hi ? `Unità ${lo}` : `Unità ${lo}–${hi}`
}

/** "✓ 2 at 100% · ◐ 1 partial · of 7": how far the learner is through a batch's sub-batches. */
export function SubBatchMarks({ batch, type }: { batch: VocabBatch; type: VocabType }) {
  const scores = useVocabScores()
  const subs = batch.subBatches.filter((s) => s[type].length > 0)
  const statuses = subs.map((s) => scoreStatus(scores.best[scoreKey(type, { kind: 'sub', id: s.id })]))
  const perfect = statuses.filter((s) => s === 'perfect').length
  const partial = statuses.filter((s) => s === 'partial').length
  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground" data-testid="sub-batch-marks">
      <span className="inline-flex items-center gap-1.5">
        <StatusMark score={{ correct: 1, total: 1, date: 0 }} className="size-4 [&_svg]:size-2.5" />
        <span className="tabular-nums" data-testid="marks-perfect">
          {perfect}
        </span>{' '}
        at 100%
      </span>
      <span className="inline-flex items-center gap-1.5">
        <StatusMark score={{ correct: 0, total: 1, date: 0 }} className="size-4" />
        <span className="tabular-nums" data-testid="marks-partial">
          {partial}
        </span>{' '}
        partial
      </span>
      <span>
        of <span className="tabular-nums">{subs.length}</span> sub-batches
      </span>
    </span>
  )
}

export function VocabBatchesPage() {
  const [type, setType] = useVocabType()
  const scores = useVocabScores()
  const label = VOCAB_TYPE_LABEL[type]
  const total = allItems(type).length

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Vocabolario</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">Choose a batch</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Words and phrases from the book, grouped in batches and sub-batches. Study them with flashcards, then test
            yourself with multiple choice.
          </p>
        </div>
        <VocabTypeToggle value={type} onChange={setType} className="self-start sm:self-auto" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {VOCAB_BATCHES.map((batch) => {
          const count = batchItems(batch, type).length
          const subs = batch.subBatches.filter((s) => s[type].length > 0).length
          return (
            <Link
              key={batch.id}
              to={vocabBatchUrl(batch.id, type)}
              data-testid={`vocab-batch-${batch.id}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
            >
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/8 to-transparent" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold tracking-wider text-primary uppercase">{unitRange(batch)}</span>
                  <h2 className="mt-1 font-display text-2xl font-semibold">{batch.title}</h2>
                </div>
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-card transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden
                >
                  <ArrowRight className="size-5" />
                </span>
              </div>
              <p className="relative mt-2 text-sm font-medium">
                <span className="tabular-nums" data-testid="vocab-batch-count">
                  {count}
                </span>{' '}
                {label.it.toLowerCase()} · <span className="tabular-nums">{subs}</span> sub-batches
              </p>
              <div className="relative mt-4 flex flex-col gap-1.5 border-t pt-3">
                <SubBatchMarks batch={batch} type={type} />
                <BestScoreLabel prefix="Whole-batch test: " score={scores.best[scoreKey(type, { kind: 'batch', id: batch.id })]} />
              </div>
            </Link>
          )
        })}

        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-dashed bg-muted/40 p-5 sm:p-6">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Layers className="size-3.5" aria-hidden /> Everything
            </span>
            <h2 className="mt-1 font-display text-2xl font-semibold">Tutto il vocabolario</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A test across all <span className="tabular-nums">{total}</span> {label.it.toLowerCase()} ({label.en.toLowerCase()}).
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BestScoreLabel score={scores.best[scoreKey(type, { kind: 'all' })]} />
            <Button asChild data-testid="vocab-test-all">
              <Link to={vocabTestUrl({ kind: 'all' }, type)}>
                <ClipboardCheck /> Test
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
