import { Check } from 'lucide-react'
import { TENSE_BY_ID, tenseFullLabel } from '@/data/tenses'
import { cn } from '@/lib/utils'
import type { TenseId } from '@/types/verb'

interface Props {
  available: TenseId[]
  value: TenseId[]
  onChange: (tenses: TenseId[]) => void
}

/** Toggleable tense chips with "B1 only" / "All" / "None" shortcuts. Beyond-B1 tenses are marked. */
export function TenseSelectChips({ available, value, onChange }: Props) {
  const toggle = (t: TenseId) => onChange(value.includes(t) ? value.filter((x) => x !== t) : available.filter((x) => x === t || value.includes(x)))
  const shortcut = 'cursor-pointer text-primary hover:underline'
  return (
    <fieldset>
      <legend className="mb-2 flex w-full items-center justify-between text-sm font-medium">
        <span>Tenses ({value.length})</span>
        <span className="flex gap-3 text-xs font-normal">
          <button type="button" className={shortcut} onClick={() => onChange(available.filter((t) => TENSE_BY_ID[t].b1))}>
            B1 only
          </button>
          <button type="button" className={shortcut} onClick={() => onChange([...available])}>
            All
          </button>
          <button type="button" className={shortcut} onClick={() => onChange([])}>
            None
          </button>
        </span>
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {available.map((t) => {
          const on = value.includes(t)
          const def = TENSE_BY_ID[t]
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              title={def.b1 ? def.english : `${def.english} — beyond B1`}
              onClick={() => toggle(t)}
              data-testid={`sentence-tense-${t}`}
              className={cn(
                'inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors',
                on ? 'border-primary/60 bg-secondary text-secondary-foreground' : 'bg-card text-muted-foreground hover:bg-accent',
              )}
            >
              {on && <Check className="size-3" aria-hidden />}
              {tenseFullLabel(t)}
              {!def.b1 && <span className="font-semibold text-amber-600 dark:text-amber-400">· B2+</span>}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
