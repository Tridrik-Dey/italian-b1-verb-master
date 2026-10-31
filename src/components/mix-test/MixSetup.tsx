import { ListChecks, PencilLine, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { VerbChecklist } from '@/components/test/VerbChecklist'
import { BeyondB1Badge } from '@/components/learn/BeyondB1Badge'
import { PRIORITIES } from '@/data/priorities'
import { PRIORITY_STYLE } from '@/data/priority-style'
import { B1_TENSE_IDS, CORE_TENSE_IDS, MOODS, TENSES } from '@/data/tenses'
import { VERBS } from '@/data/verbs'
import { getTense } from '@/lib/conjugation'
import type { AnswerMode } from '@/lib/testing/types'
import { cn } from '@/lib/utils'
import type { Priority, TenseId } from '@/types/verb'

export interface MixSettings {
  priorities: Priority[]
  verbScope: 'all' | 'custom'
  verbs: string[]
  tenses: TenseId[]
  count: number
  mode: AnswerMode
}

export const DEFAULT_MIX_SETTINGS: MixSettings = {
  priorities: ['essenziali'],
  verbScope: 'all',
  verbs: [],
  tenses: ['ind-presente', 'ind-passato-prossimo', 'ind-imperfetto', 'ind-futuro-semplice'],
  count: 20,
  mode: 'fill',
}

export const COUNT_PRESETS = [10, 20, 30, 50]

/** The verbs a configuration actually draws from. */
export function selectedVerbs(s: MixSettings): string[] {
  const inPriorities = VERBS.filter((v) => s.priorities.includes(v.priority)).map((v) => v.infinitive)
  if (s.verbScope === 'all') return inPriorities
  const allowed = new Set(inPriorities)
  return s.verbs.filter((v) => allowed.has(v))
}

export function poolSize(verbs: string[], tenses: TenseId[]): number {
  let n = 0
  for (const v of verbs) for (const t of tenses) n += getTense(v, t).rows.length
  return n
}

function toggle<T>(list: T[], item: T, on: boolean): T[] {
  return on ? (list.includes(item) ? list : [...list, item]) : list.filter((x) => x !== item)
}

interface Props {
  settings: MixSettings
  onChange: (s: MixSettings) => void
  onStart: () => void
}

export function MixSetup({ settings: s, onChange, onStart }: Props) {
  const [customCount, setCustomCount] = useState(!COUNT_PRESETS.includes(s.count))
  const set = (patch: Partial<MixSettings>) => onChange({ ...s, ...patch })

  const verbs = selectedVerbs(s)
  const pool = useMemo(() => poolSize(verbs, s.tenses), [verbs, s.tenses])
  const available = VERBS.filter((v) => s.priorities.includes(v.priority))
  const effectiveCount = Math.min(s.count, pool)

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div className="flex flex-col gap-5">
        {/* 1. Priorities */}
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">1. Priority categories</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {PRIORITIES.map((p) => {
              const on = s.priorities.includes(p.id)
              return (
                <label
                  key={p.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-sm transition-colors',
                    on ? 'border-primary/60 bg-secondary/60' : 'hover:bg-accent',
                  )}
                >
                  <Checkbox
                    checked={on}
                    onCheckedChange={(c) => set({ priorities: toggle(s.priorities, p.id, c) })}
                    data-testid={`mix-priority-${p.id}`}
                  />
                  <span className={cn('size-2 rounded-full', PRIORITY_STYLE[p.id].dot)} aria-hidden />
                  <span className="font-medium">{p.title}</span>
                </label>
              )
            })}
          </div>
        </Card>

        {/* 2. Verbs */}
        <Card className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">2. Verbs</h2>
            <Segmented
              label="Verb selection"
              value={s.verbScope}
              onChange={(v) => set({ verbScope: v })}
              options={[
                { value: 'all', label: 'All in categories' },
                { value: 'custom', label: 'Choose verbs' },
              ]}
            />
          </div>
          {s.verbScope === 'all' ? (
            <p className="text-sm text-muted-foreground">
              Using all <strong className="text-foreground">{verbs.length}</strong> verbs in the selected categories.
            </p>
          ) : available.length ? (
            <VerbChecklist
              verbs={available}
              selected={s.verbs.filter((v) => available.some((a) => a.infinitive === v))}
              onChange={(v) => set({ verbs: v })}
              testIdPrefix="mix-verb"
            />
          ) : (
            <p className="text-sm text-muted-foreground">No verbs — select a category first.</p>
          )}
        </Card>

        {/* 3. Tenses */}
        <Card className="p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">3. Tenses</h2>
            <div className="flex flex-wrap gap-1.5">
              <Button variant="outline" size="sm" onClick={() => set({ tenses: [...CORE_TENSE_IDS] })}>
                Core B1
              </Button>
              <Button variant="outline" size="sm" onClick={() => set({ tenses: [...B1_TENSE_IDS] })}>
                All B1
              </Button>
              <Button variant="outline" size="sm" onClick={() => set({ tenses: TENSES.map((t) => t.id) })}>
                All (incl. beyond B1)
              </Button>
              <Button variant="outline" size="sm" onClick={() => set({ tenses: [] })} data-testid="mix-tenses-clear">
                Clear
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {MOODS.map((m) => (
              <fieldset key={m.id}>
                <legend className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{m.label}</legend>
                <div className="flex flex-col gap-0.5">
                  {TENSES.filter((t) => t.mood === m.id).map((t) => (
                    <label key={t.id} className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-accent">
                      <Checkbox
                        checked={s.tenses.includes(t.id)}
                        onCheckedChange={(c) => set({ tenses: toggle(s.tenses, t.id, c) })}
                        data-testid={`mix-tense-${t.id}`}
                      />
                      {t.label}
                      <span className="text-xs text-muted-foreground">· {t.english}</span>
                      {!t.b1 && <BeyondB1Badge compact />}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </Card>
      </div>

      {/* 4–5. Count, mode, start */}
      <div className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
        <Card className="p-5">
          <h2 className="mb-3 font-semibold">4. Number of questions</h2>
          <div className="grid grid-cols-5 gap-1.5">
            {COUNT_PRESETS.map((n) => (
              <Button
                key={n}
                size="sm"
                variant={!customCount && s.count === n ? 'default' : 'outline'}
                onClick={() => {
                  setCustomCount(false)
                  set({ count: n })
                }}
                aria-pressed={!customCount && s.count === n}
              >
                {n}
              </Button>
            ))}
            <Button size="sm" variant={customCount ? 'default' : 'outline'} onClick={() => setCustomCount(true)} aria-pressed={customCount}>
              Custom
            </Button>
          </div>
          {customCount && (
            <Input
              type="number"
              min={1}
              max={500}
              value={s.count}
              onChange={(e) => set({ count: Math.max(1, Math.min(500, Number(e.target.value) || 1)) })}
              className="mt-2"
              aria-label="Custom number of questions"
              data-testid="mix-custom-count"
            />
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-3 font-semibold">5. Answer mode</h2>
          <Segmented
            label="Answer mode"
            className="w-full"
            value={s.mode}
            onChange={(m) => set({ mode: m })}
            options={[
              { value: 'fill', label: 'Fill in', icon: <PencilLine /> },
              { value: 'mcq', label: 'Multiple choice', icon: <ListChecks /> },
            ]}
          />
        </Card>

        <Card className="p-5">
          <p className="text-sm text-muted-foreground" data-testid="mix-summary">
            {verbs.length} verbs × {s.tenses.length} tenses → <strong className="text-foreground">{pool}</strong> possible questions
          </p>
          {pool > 0 && s.count > pool && (
            <p className="mt-1 text-xs text-muted-foreground">Only {pool} unique questions are available, so the test will have {pool}.</p>
          )}
          <Button size="lg" className="mt-3 w-full" onClick={onStart} disabled={pool === 0} data-testid="mix-start">
            <Play /> Start {effectiveCount || ''} questions
          </Button>
          {pool === 0 && <p className="mt-2 text-xs text-danger-foreground">Select at least one category, verb and tense.</p>}
        </Card>
      </div>
    </div>
  )
}
