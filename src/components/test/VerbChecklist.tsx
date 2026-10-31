import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PRIORITIES } from '@/data/priorities'
import { PRIORITY_STYLE } from '@/data/priority-style'
import { cn } from '@/lib/utils'
import type { VerbEntry } from '@/types/verb'

interface Props {
  /** Verbs that can be ticked. */
  verbs: VerbEntry[]
  selected: string[]
  onChange: (verbs: string[]) => void
  /** Prefix for test ids, e.g. "mix-verb" → data-testid="mix-verb-fare". */
  testIdPrefix: string
}

/** Accent-insensitive match on the Italian infinitive or English meaning. */
function fold(s: string) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

/** Searchable, grouped checklist for picking any number of individual verbs. */
export function VerbChecklist({ verbs, selected, onChange, testIdPrefix }: Props) {
  const [query, setQuery] = useState('')
  const q = fold(query.trim())
  const visible = verbs.filter((v) => !q || fold(v.infinitive).includes(q) || fold(v.english).includes(q))
  const toggle = (inf: string, on: boolean) =>
    onChange(on ? (selected.includes(inf) ? selected : [...selected, inf]) : selected.filter((x) => x !== inf))

  return (
    <div>
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Italian or English…"
            className="pl-9"
            aria-label="Search verbs"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onChange([...new Set([...selected, ...visible.map((v) => v.infinitive)])])}>
            Select shown
          </Button>
          <Button variant="outline" size="sm" onClick={() => onChange([])}>
            Clear
          </Button>
        </div>
      </div>
      <p className="mb-2 text-xs text-muted-foreground" data-testid={`${testIdPrefix}-count`}>
        {selected.length} selected{selected.length > 0 && `: ${selected.slice(0, 8).join(', ')}${selected.length > 8 ? '…' : ''}`}
      </p>
      <div className="max-h-72 overflow-y-auto rounded-lg border p-2">
        {PRIORITIES.map((p) => {
          const group = visible.filter((v) => v.priority === p.id)
          if (!group.length) return null
          return (
            <div key={p.id} className="mb-2 last:mb-0">
              <p className="sticky top-0 z-10 mb-1 flex items-center gap-2 bg-card px-2 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <span className={cn('size-2 rounded-full', PRIORITY_STYLE[p.id].dot)} aria-hidden />
                {p.title}
              </p>
              <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((v) => (
                  <label
                    key={v.infinitive}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    title={v.english}
                  >
                    <Checkbox
                      checked={selected.includes(v.infinitive)}
                      onCheckedChange={(c) => toggle(v.infinitive, c)}
                      data-testid={`${testIdPrefix}-${v.infinitive}`}
                    />
                    <span className="truncate">
                      {v.infinitive} <span className="text-xs text-muted-foreground">— {v.english}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
        {!visible.length && <p className="p-2 text-sm text-muted-foreground">No verbs match “{query}”.</p>}
      </div>
    </div>
  )
}
