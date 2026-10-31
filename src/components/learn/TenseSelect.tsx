import { NativeSelect } from '@/components/ui/native-select'
import { MOODS, TENSES } from '@/data/tenses'
import type { TenseId } from '@/types/verb'

interface Props {
  value: TenseId
  onChange: (tense: TenseId) => void
  id?: string
  /** Tenses to offer (defaults to all). */
  tenses?: TenseId[]
  className?: string
  'aria-label'?: string
}

/** Tense dropdown grouped by mood. */
export function TenseSelect({ value, onChange, id, tenses, className, ...rest }: Props) {
  const allowed = new Set(tenses ?? TENSES.map((t) => t.id))
  return (
    <NativeSelect
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as TenseId)}
      className={className}
      aria-label={rest['aria-label']}
    >
      {MOODS.map((mood) => {
        const items = TENSES.filter((t) => t.mood === mood.id && allowed.has(t.id))
        if (!items.length) return null
        return (
          <optgroup key={mood.id} label={mood.label}>
            {items.map((t) => (
              <option key={t.id} value={t.id}>
                {t.mood === 'progressivo' ? t.label : `${mood.label} — ${t.label}`} ({t.english}){t.b1 ? '' : ' · beyond B1'}
              </option>
            ))}
          </optgroup>
        )
      })}
    </NativeSelect>
  )
}
