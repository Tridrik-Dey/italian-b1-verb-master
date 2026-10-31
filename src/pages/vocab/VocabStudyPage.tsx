import { ArrowLeft, ArrowRight, ClipboardCheck, GalleryHorizontal, List, RotateCcw, Shuffle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Segmented } from '@/components/ui/segmented'
import { Emphasis, VocabTypeToggle } from '@/components/vocab/VocabParts'
import { SUB_BATCH_BY_ID, VOCAB_TYPE_LABEL, subBatchItems, type VocabItem } from '@/data/vocabulary'
import { shuffle } from '@/lib/testing/generate'
import { cn } from '@/lib/utils'
import { useVocabType, vocabBatchUrl, vocabTestUrl } from '@/lib/vocab/prefs'

type View = 'cards' | 'list'

function Flashcards({ items }: { items: VocabItem[] }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const item = items[index]

  const go = (delta: number) => {
    setIndex((i) => (i + delta + items.length) % items.length)
    setFlipped(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [role="radiogroup"]')) return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div>
        <div className="mb-1.5 flex justify-between text-sm">
          <span className="font-semibold tabular-nums" data-testid="flashcard-counter">
            {index + 1} / {items.length}
          </span>
          <span className="text-muted-foreground">Tap the card to turn it</span>
        </div>
        <Progress value={(index + 1) / items.length} label="Flashcard position" />
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? 'Show Italian' : 'Show English'}
        data-testid="flashcard"
        data-side={flipped ? 'back' : 'front'}
        className={cn(
          'flex min-h-60 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border p-6 text-center shadow-sm transition-colors sm:min-h-72 sm:p-10',
          flipped ? 'border-primary/40 bg-secondary/60' : 'bg-card hover:bg-accent/50',
        )}
      >
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          {flipped ? 'English' : 'Italiano'}
        </span>
        {flipped ? (
          <span key={`${item.id}-en`} className="animate-fade-in text-xl font-medium sm:text-2xl" data-testid="flashcard-en">
            <Emphasis text={item.en} />
          </span>
        ) : (
          <span key={`${item.id}-it`} className="animate-fade-in font-display text-2xl font-semibold sm:text-3xl" lang="it" data-testid="flashcard-it">
            <Emphasis text={item.it} />
          </span>
        )}
        {flipped && item.note && (
          <span className="text-sm text-muted-foreground" data-testid="flashcard-note">
            <Emphasis text={item.note} />
          </span>
        )}
      </button>

      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" onClick={() => go(-1)} aria-label="Previous card">
          <ArrowLeft /> <span className="hidden sm:inline">Previous</span>
        </Button>
        <Button variant="secondary" onClick={() => setFlipped((f) => !f)}>
          <RotateCcw /> Turn
        </Button>
        <Button variant="outline" onClick={() => go(1)} aria-label="Next card" data-testid="flashcard-next">
          <span className="hidden sm:inline">Next</span> <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

function WordList({ items }: { items: VocabItem[] }) {
  return (
    <Card className="overflow-hidden">
      <ul className="divide-y" data-testid="vocab-list">
        {items.map((item) => (
          <li key={item.id} className="grid gap-0.5 px-4 py-3 sm:grid-cols-2 sm:gap-4 sm:px-5">
            <span className="font-medium" lang="it">
              <Emphasis text={item.it} />
            </span>
            <span>
              <Emphasis text={item.en} />
              {item.note && (
                <span className="block text-xs text-muted-foreground">
                  <Emphasis text={item.note} />
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function VocabStudyPage() {
  const { batchId = '', subId = '' } = useParams()
  const [type, setType] = useVocabType()
  const [view, setView] = useState<View>('cards')
  const [order, setOrder] = useState<{ seed: number; shuffled: boolean }>({ seed: 0, shuffled: false })
  const found = SUB_BATCH_BY_ID.get(subId)

  const items = useMemo(() => {
    if (!found) return []
    const base = subBatchItems(found.batch, found.sub, type)
    return order.shuffled ? shuffle(base) : base
  }, [found, type, order]) // a new `order` object (new seed) reshuffles on every click

  if (!found || found.batch.id !== batchId) return <Navigate to="/vocabolario" replace />
  const { batch, sub } = found
  const label = VOCAB_TYPE_LABEL[type]

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-3">
        <Link to={vocabBatchUrl(batch.id, type)}>
          <ArrowLeft /> Back to {batch.title}
        </Link>
      </Button>

      <div className="mb-5">
        <p className="text-sm font-medium text-primary">
          Studia · {batch.title} · {sub.unit}
        </p>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl" lang="it" data-testid="vocab-study-title">
          {sub.title}
        </h1>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <VocabTypeToggle value={type} onChange={setType} />
        <Segmented
          label="View"
          value={view}
          onChange={setView}
          options={[
            { value: 'cards', label: 'Flashcards', icon: <GalleryHorizontal /> },
            { value: 'list', label: 'List', icon: <List /> },
          ]}
        />
        <Button
          variant={order.shuffled ? 'secondary' : 'outline'}
          onClick={() => setOrder((o) => ({ seed: o.seed + 1, shuffled: true }))}
          data-testid="vocab-shuffle"
        >
          <Shuffle /> Shuffle
        </Button>
        {order.shuffled && (
          <Button variant="ghost" onClick={() => setOrder((o) => ({ seed: o.seed + 1, shuffled: false }))}>
            Book order
          </Button>
        )}
        <Button asChild className="sm:ml-auto">
          <Link to={vocabTestUrl({ kind: 'sub', id: sub.id }, type)}>
            <ClipboardCheck /> Test this
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          This sub-batch has no {label.en.toLowerCase()}. Switch to {type === 'words' ? 'Frasi' : 'Parole'}.
        </Card>
      ) : view === 'cards' ? (
        <Flashcards key={`${type}-${order.seed}`} items={items} />
      ) : (
        <WordList items={items} />
      )}
    </div>
  )
}
