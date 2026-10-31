import { Sparkles } from 'lucide-react'
import { rowLabel } from '@/data/tenses'
import { getTense } from '@/lib/conjugation'
import { rowExample, type RowExample } from '@/lib/examples'
import { cn } from '@/lib/utils'
import type { TenseId } from '@/types/verb'

interface Props {
  verb: string
  tense: TenseId
  compact?: boolean
}

export function ConjugationTable({ verb, tense, compact }: Props) {
  const conj = getTense(verb, tense)
  if (!conj.rows.length) {
    return (
      <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground" data-testid="conjugation-empty">
        {conj.note}
      </p>
    )
  }
  const hasAlternatives = conj.rows.some((r) => r.forms.length > 1 && !r.display.includes('/'))
  return (
    <div>
      <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg border text-left" data-testid="conjugation-table">
        <thead className="bg-muted/70 text-xs tracking-wide text-muted-foreground uppercase">
          <tr>
            <th
              scope="col"
              className={cn('border-b font-medium', compact ? 'w-[38%] px-3 py-1.5' : 'w-[30%] px-4 py-2 sm:w-[18%]')}
            >
              Pronoun
            </th>
            <th scope="col" className={cn('border-b font-medium', compact ? 'px-3 py-1.5' : 'px-4 py-2 sm:w-[30%]')}>
              Conjugation
            </th>
            {!compact && (
              <th scope="col" className="hidden border-b px-4 py-2 font-medium sm:table-cell">
                Example
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {conj.rows.map((row, i) => (
            <tr key={row.key} className={cn(i % 2 === 1 && 'bg-muted/30')}>
              <th
                scope="row"
                className={cn(
                  'border-b font-medium text-muted-foreground [tr:last-child_&]:border-b-0',
                  compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5',
                )}
              >
                {rowLabel(tense, row.key)}
              </th>
              <td className={cn('border-b [tr:last-child_&]:border-b-0', compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5')}>
                <span
                  className={cn(
                    'font-semibold',
                    !compact && 'text-[1.05rem]',
                    row.irregular && 'rounded-md bg-irregular px-1.5 py-0.5 text-irregular-foreground',
                  )}
                  data-irregular={row.irregular || undefined}
                >
                  {row.display}
                </span>
                {row.irregular && (
                  <>
                    <Sparkles className="ml-1.5 inline size-3.5 text-irregular-foreground" aria-hidden />
                    <span className="sr-only"> (irregular)</span>
                  </>
                )}
                {/* On phones the example sits under the form instead of in its own column. */}
                {!compact && <ExampleText example={rowExample(verb, tense, row.key)} className="mt-1.5 sm:hidden" />}
              </td>
              {!compact && (
                <td className="hidden border-b px-4 py-2.5 align-middle sm:table-cell [tr:last-child_&]:border-b-0">
                  <ExampleText example={rowExample(verb, tense, row.key)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!compact && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {conj.rows.some((r) => r.irregular) && (
            <span className="inline-flex items-center gap-1">
              <span className="inline-block size-2.5 rounded-sm bg-irregular ring-1 ring-irregular-foreground/30" /> Irregular
              form (differs from the regular pattern)
            </span>
          )}
          {conj.rows.some((r) => r.display.includes('/a') || r.display.includes('/e')) && (
            <span>-o/-a, -i/-e: the participle agrees with the subject when the auxiliary is essere.</span>
          )}
          {hasAlternatives && <span>Alternative forms (e.g. {firstAlternative(conj.rows)}) are also accepted in tests.</span>}
          {conj.note && <span>{conj.note}</span>}
        </div>
      )}
    </div>
  )
}

function ExampleText({ example, className }: { example: RowExample | null; className?: string }) {
  if (!example) {
    return (
      <span className={cn('block text-sm text-muted-foreground/60', className)} aria-label="No example">
        —
      </span>
    )
  }
  return (
    <span className={cn('block leading-snug', className)} data-testid="row-example">
      <span className="block text-sm font-medium" lang="it">
        {example.it}
      </span>
      <span className="block text-xs text-muted-foreground" lang="en">
        {example.en}
      </span>
    </span>
  )
}

function firstAlternative(rows: { forms: string[]; display: string }[]): string {
  const row = rows.find((r) => r.forms.length > 1 && !r.display.includes('/'))
  return row ? row.forms[1] : ''
}
