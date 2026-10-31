import { ArrowLeft, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router'
import { VerbCard } from '@/components/learn/VerbCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { PRIORITY_BY_ID, isPriority } from '@/data/priorities'
import { PRIORITY_STYLE } from '@/data/priority-style'
import { VERB_ORDER, verbsByPriority } from '@/data/verbs'
import { useProgress } from '@/hooks/useProgress'
import { getVerb } from '@/lib/conjugation'
import { groupProgress, verbProgress } from '@/lib/progress/mastery'
import { cn, progressPercent } from '@/lib/utils'

type SortKey = 'frequency' | 'az' | 'za' | 'progress-asc' | 'progress-desc'
type FilterKey = 'all' | 'regular' | 'irregular' | 'reflexive'

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'frequency', label: 'Most useful first' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
  { value: 'progress-asc', label: 'Least progress first' },
  { value: 'progress-desc', label: 'Most progress first' },
]

/** Accent-insensitive search matching the Italian infinitive and English meaning. */
function fold(s: string) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

export function VerbListPage() {
  const { priority } = useParams()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const data = useProgress()
  const sort = (params.get('sort') as SortKey) || 'frequency'
  const filter = (params.get('filter') as FilterKey) || 'all'

  const verbs = useMemo(() => (isPriority(priority) ? verbsByPriority(priority).map((v) => getVerb(v.infinitive)) : []), [priority])

  if (!isPriority(priority)) return <Navigate to="/learn" replace />
  const info = PRIORITY_BY_ID[priority]
  const style = PRIORITY_STYLE[priority]
  const group = groupProgress(
    data,
    verbs.map((v) => v.entry.infinitive),
  )

  const q = fold(query.trim())
  const rows = verbs
    .map((v) => ({ info: v, progress: verbProgress(data, v.entry.infinitive) }))
    .filter(({ info: v }) => {
      if (filter === 'regular' && v.irregular) return false
      if (filter === 'irregular' && !v.irregular) return false
      if (filter === 'reflexive' && !v.reflexive) return false
      return !q || fold(v.entry.infinitive).includes(q) || fold(v.entry.english).includes(q)
    })
    .sort((a, b) => {
      const ia = a.info.entry.infinitive
      const ib = b.info.entry.infinitive
      switch (sort) {
        case 'az':
          return ia.localeCompare(ib, 'it')
        case 'za':
          return ib.localeCompare(ia, 'it')
        case 'progress-asc':
          return a.progress.progress - b.progress.progress || VERB_ORDER.get(ia)! - VERB_ORDER.get(ib)!
        case 'progress-desc':
          return b.progress.progress - a.progress.progress || VERB_ORDER.get(ia)! - VERB_ORDER.get(ib)!
        default:
          return VERB_ORDER.get(ia)! - VERB_ORDER.get(ib)!
      }
    })

  const setParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params)
    if (value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" size="sm" asChild className="-ml-3 mb-3">
        <Link to="/learn">
          <ArrowLeft /> Back to Priorities
        </Link>
      </Button>

      <div className={cn('mb-6 rounded-2xl border p-5 sm:p-6', style.soft)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className={cn('inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase', style.text)}>
              <span className={cn('size-2 rounded-full', style.dot)} aria-hidden />
              {info.importance}
            </span>
            <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{info.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {verbs.length} verbs · {progressPercent(group.progress)} progress · {group.mastered} mastered
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            placeholder="Search Italian or English…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search verbs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 md:flex">
          <NativeSelect
            value={filter}
            onChange={(e) => setParam('filter', e.target.value, 'all')}
            aria-label="Filter verbs"
            className="md:w-40"
          >
            <option value="all">All verbs</option>
            <option value="regular">Regular</option>
            <option value="irregular">Irregular</option>
            <option value="reflexive">Reflexive</option>
          </NativeSelect>
          <NativeSelect value={sort} onChange={(e) => setParam('sort', e.target.value, 'frequency')} aria-label="Sort verbs" className="md:w-52">
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </NativeSelect>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {rows.length} verbs shown
      </p>

      {rows.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="verb-grid">
          {rows.map((r) => (
            <VerbCard key={r.info.entry.infinitive} info={r.info} progress={r.progress} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No verbs match “{query}”.
        </div>
      )}
    </div>
  )
}
