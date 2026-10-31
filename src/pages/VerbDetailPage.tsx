import { ArrowLeft, ChevronLeft, ChevronRight, ClipboardCheck, LayoutGrid, Lightbulb, Quote, Rows3 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router'
import { BeyondB1Badge } from '@/components/learn/BeyondB1Badge'
import { ConjugationTable } from '@/components/learn/ConjugationTable'
import { TenseSelect } from '@/components/learn/TenseSelect'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Segmented } from '@/components/ui/segmented'
import { PRIORITY_BY_ID } from '@/data/priorities'
import { PRIORITY_STYLE } from '@/data/priority-style'
import { MOODS, MOOD_LABEL, TENSES, TENSE_BY_ID, isTenseId, tenseFullLabel } from '@/data/tenses'
import { VERB_BY_INFINITIVE } from '@/data/verbs'
import { useProgress } from '@/hooks/useProgress'
import { getVerb } from '@/lib/conjugation'
import { tenseMastery, verbProgress } from '@/lib/progress/mastery'
import { markStudied, statKey } from '@/lib/progress/store'
import { testUrl } from '@/lib/routes'
import { cn, percent } from '@/lib/utils'
import type { TenseId, VerbInfo } from '@/types/verb'

const TENSE_ORDER = TENSES.map((t) => t.id)

function TenseHeading({ tense }: { tense: TenseId }) {
  const t = TENSE_BY_ID[tense]
  return (
    <div>
      <h2 className="font-display text-xl font-semibold tracking-tight uppercase sm:text-2xl" data-testid="tense-heading">
        {t.mood === 'progressivo' ? t.label : `${MOOD_LABEL[t.mood]} — ${t.label}`}
      </h2>
      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm font-medium text-primary" lang="en">
        <span data-testid="tense-english">{t.english}</span>
        {!t.b1 && <BeyondB1Badge />}
      </p>
    </div>
  )
}

function TenseStatus({ verb, tense }: { verb: string; tense: TenseId }) {
  const data = useProgress()
  const m = tenseMastery(data.stats[statKey(verb, tense)])
  if (!m.answered) return <Badge variant="muted">Not practised yet</Badge>
  return (
    <Badge variant={m.mastered ? 'success' : 'secondary'}>
      {m.mastered ? 'Mastered' : 'Learning'} · {m.correct}/{m.answered} recent · {percent(m.accuracy)}
    </Badge>
  )
}

function SingleTense({ info, tense, onTense }: { info: VerbInfo; tense: TenseId; onTense: (t: TenseId) => void }) {
  const navigate = useNavigate()
  const verb = info.entry.infinitive
  const def = TENSE_BY_ID[tense]
  const idx = TENSE_ORDER.indexOf(tense)
  const prev = idx > 0 ? TENSE_ORDER[idx - 1] : null
  const next = idx < TENSE_ORDER.length - 1 ? TENSE_ORDER[idx + 1] : null
  const example = info.entry.examples.find((e) => e.tense === tense)
  const testable = info.conjugations[tense].rows.length > 0

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <Card className="p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <TenseHeading tense={tense} />
            {!def.standard && (
              <Badge variant="outline" className="mt-1.5">
                Construction: stare + gerundio (not a separate tense)
              </Badge>
            )}
          </div>
          <TenseStatus verb={verb} tense={tense} />
        </div>
        <ConjugationTable verb={verb} tense={tense} />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button variant="outline" disabled={!prev} onClick={() => prev && onTense(prev)} aria-label="Previous tense">
            <ChevronLeft /> <span className="hidden sm:inline">{prev ? tenseFullLabel(prev) : 'Previous'}</span>
            <span className="sm:hidden">Previous</span>
          </Button>
          <Button variant="outline" disabled={!next} onClick={() => next && onTense(next)} aria-label="Next tense">
            <span className="hidden sm:inline">{next ? tenseFullLabel(next) : 'Next'}</span>
            <span className="sm:hidden">Next</span> <ChevronRight />
          </Button>
          <Button className="sm:ml-auto" disabled={!testable} onClick={() => navigate(testUrl(verb, tense))} data-testid="test-this-tense">
            <ClipboardCheck /> Test This Tense
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="size-4 text-amber-500" aria-hidden /> When to use it
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{def.explanation}</p>
        </Card>
        <Card className="p-5">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Quote className="size-4 text-primary" aria-hidden /> {example ? `Example with ${verb}` : 'Example'}
          </h3>
          <p className="font-medium" lang="it">
            {(example ?? def.example).it}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{(example ?? def.example).en}</p>
        </Card>
      </div>
    </div>
  )
}

function AllTenses({ info }: { info: VerbInfo }) {
  const verb = info.entry.infinitive
  return (
    <div className="flex flex-col gap-8">
      {MOODS.map((mood) => {
        const tenses = TENSES.filter((t) => t.mood === mood.id)
        return (
          <section key={mood.id} aria-labelledby={`mood-${mood.id}`}>
            <h2 id={`mood-${mood.id}`} className="mb-3 font-display text-2xl font-semibold">
              {mood.label}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tenses.map((t) => (
                <Card key={t.id} className="flex flex-col p-4" data-testid={`tense-card-${t.id}`}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      <h3 className="flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase">
                        {t.label}
                        {!t.b1 && <BeyondB1Badge compact />}
                      </h3>
                      <p className="text-xs text-muted-foreground">{t.english}</p>
                    </div>
                    {info.conjugations[t.id].rows.length > 0 && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={testUrl(verb, t.id)} aria-label={`Test ${tenseFullLabel(t.id)}`}>
                          <ClipboardCheck /> Test
                        </Link>
                      </Button>
                    )}
                  </div>
                  <ConjugationTable verb={verb} tense={t.id} compact />
                </Card>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function VerbDetailPage() {
  const { priority, verb = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const data = useProgress()
  const entry = VERB_BY_INFINITIVE.get(verb)

  const moodBar = useRef<HTMLDivElement>(null)
  const moodParam = TENSE_BY_ID[isTenseId(params.get('tense')) ? (params.get('tense') as TenseId) : 'ind-presente'].mood

  useEffect(() => {
    if (entry) markStudied(entry.infinitive)
  }, [entry])

  // Keep the active mood chip visible in the horizontally scrolling bar (mobile).
  useEffect(() => {
    const bar = moodBar.current
    const active = bar?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (bar && active) bar.scrollTo({ left: active.offsetLeft - bar.clientWidth / 2 + active.clientWidth / 2, behavior: 'smooth' })
  }, [moodParam])

  if (!entry) return <Navigate to={priority ? `/learn/${priority}` : '/learn'} replace />
  if (entry.priority !== priority) return <Navigate to={`/learn/${entry.priority}/${entry.infinitive}`} replace />

  const info = getVerb(entry.infinitive)
  const tenseParam = params.get('tense')
  const tense: TenseId = isTenseId(tenseParam) ? tenseParam : 'ind-presente'
  const view = params.get('view') === 'all' ? 'all' : 'single'
  const prog = verbProgress(data, entry.infinitive)
  const style = PRIORITY_STYLE[entry.priority]
  const currentMood = TENSE_BY_ID[tense].mood

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k)
      else next.set(k, v)
    }
    setParams(next, { replace: true })
  }

  return (
    <div className="animate-fade-in">
      <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap gap-1">
        <Button variant="ghost" size="sm" asChild className="-ml-3">
          <Link to={`/learn/${entry.priority}`}>
            <ArrowLeft /> Back to Verbs
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/learn">Back to Priorities</Link>
        </Button>
      </nav>

      {/* Hero */}
      <section className={cn('mb-6 rounded-2xl border p-5 sm:p-7', style.soft)}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl" data-testid="verb-title">
              <span className="tracking-wide uppercase">{entry.infinitive}</span>
              <span className="text-muted-foreground"> — </span>
              <span className="text-2xl font-normal text-muted-foreground sm:text-3xl">{capitalizeFirst(entry.english)}</span>
            </h1>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="bg-card">
                <span className={cn('size-2 rounded-full', style.dot)} aria-hidden />
                {PRIORITY_BY_ID[entry.priority].title}
              </Badge>
              <Badge variant={info.irregular ? 'irregular' : 'muted'}>{info.irregular ? 'Irregolare' : 'Regolare'}</Badge>
              {info.types
                .filter((t) => t !== 'regolare' && t !== 'irregolare')
                .map((t) => (
                  <Badge key={t} variant="secondary" className="capitalize">
                    {t}
                  </Badge>
                ))}
              <Badge variant="outline" className="bg-card">
                Ausiliare: {entry.auxiliary}
                {entry.altAuxiliary ? ` (anche ${entry.altAuxiliary})` : ''}
              </Badge>
              <Badge variant="outline" className="bg-card">
                {info.group}
              </Badge>
            </div>
          </div>
          <div className="w-full max-w-xs">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>
                {prog.masteredCore}/{prog.coreTenses.length} core tenses mastered
              </span>
              <span className="font-semibold text-foreground tabular-nums">{Math.round(prog.progress * 100)}%</span>
            </div>
            <Progress value={prog.progress} indicatorClassName={prog.status === 'mastered' ? 'bg-success' : style.bar} label="Verb progress" />
          </div>
        </div>
        {entry.notes && entry.notes.length > 0 && (
          <ul className="mt-4 space-y-1 border-t border-black/5 pt-3 text-sm text-muted-foreground dark:border-white/10">
            {entry.notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span aria-hidden>•</span>
                {n}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Segmented
            label="View"
            value={view}
            onChange={(v) => update({ view: v === 'all' ? 'all' : null })}
            options={[
              { value: 'single', label: 'One tense', icon: <Rows3 /> },
              { value: 'all', label: 'All tenses', icon: <LayoutGrid /> },
            ]}
          />
          {view === 'single' && (
            <TenseSelect
              value={tense}
              onChange={(t) => update({ tense: t })}
              aria-label="Select tense"
              className="sm:w-80"
            />
          )}
        </div>
        {view === 'single' && (
          <div className="flex flex-col gap-2">
            <div ref={moodBar} className="relative flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Moods">
              {MOODS.map((m) => {
                const first = TENSES.find((t) => t.mood === m.id)!
                const active = m.id === currentMood
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => !active && update({ tense: first.id })}
                    className={cn(
                      'shrink-0 cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors',
                      active ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-accent',
                    )}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-1.5" aria-label={`${MOOD_LABEL[currentMood]} tenses`}>
              {TENSES.filter((t) => t.mood === currentMood).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update({ tense: t.id })}
                  aria-pressed={t.id === tense}
                  title={t.b1 ? t.english : `${t.english} — beyond B1`}
                  className={cn(
                    'cursor-pointer rounded-md px-2.5 py-1 text-sm transition-colors',
                    t.id === tense ? 'bg-secondary font-medium text-secondary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {t.label}
                  {!t.b1 && <sup className="ml-0.5 text-[0.65rem] font-semibold text-amber-600 dark:text-amber-400">B2</sup>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {view === 'single' ? <SingleTense info={info} tense={tense} onTense={(t) => update({ tense: t })} /> : <AllTenses info={info} />}

      {entry.examples.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-semibold">Examples</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {entry.examples.map((ex) => (
              <Card key={ex.it} className="p-4">
                <p className="font-medium" lang="it">
                  {ex.it}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{ex.en}</p>
                {ex.tense && (
                  <button
                    type="button"
                    onClick={() => update({ tense: ex.tense!, view: null })}
                    className="mt-2 cursor-pointer text-xs font-medium text-primary hover:underline"
                  >
                    {tenseFullLabel(ex.tense)}
                  </button>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function capitalizeFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
