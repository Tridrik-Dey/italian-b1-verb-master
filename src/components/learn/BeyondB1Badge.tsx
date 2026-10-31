import { cn } from '@/lib/utils'

/** Marks tenses outside the B1 syllabus (passato remoto, congiuntivo imperfetto…). */
export function BeyondB1Badge({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-amber-300 bg-amber-50 font-semibold tracking-normal text-amber-700 normal-case dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
        compact ? 'px-1.5 py-0 text-[0.65rem]' : 'px-2 py-0.5 text-xs',
        className,
      )}
      title="Not part of the B1 syllabus — usually studied at B2 or above"
      data-testid="beyond-b1"
    >
      {compact ? 'B2+' : 'Beyond B1'}
    </span>
  )
}
