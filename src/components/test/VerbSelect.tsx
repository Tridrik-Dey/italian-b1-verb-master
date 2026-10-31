import { forwardRef } from 'react'
import { PRIORITIES } from '@/data/priorities'
import { verbsByPriority } from '@/data/verbs'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface Props {
  value: string
  onChange: (verb: string) => void
  id?: string
  className?: string
}

/** All 200 verbs grouped by priority (native select: type-ahead works on every platform). */
export const VerbSelect = forwardRef<HTMLSelectElement, Props>(function VerbSelect({ value, onChange, id, className }, ref) {
  return (
    <div className={cn('relative', className)}>
      <select
        ref={ref}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-card py-2 pr-9 pl-3 text-base shadow-xs focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/25 md:text-sm"
      >
        {PRIORITIES.map((p) => (
          <optgroup key={p.id} label={p.title}>
            {verbsByPriority(p.id).map((v) => (
              <option key={v.infinitive} value={v.infinitive}>
                {v.infinitive} — {v.english}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
    </div>
  )
})
