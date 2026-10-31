import { cn } from '@/lib/utils'

interface ProgressProps {
  /** 0–1 */
  value: number
  className?: string
  indicatorClassName?: string
  label?: string
}

export function Progress({ value, className, indicatorClassName, label }: ProgressProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label={label}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className={cn('h-full rounded-full bg-primary transition-[width] duration-500 ease-out', indicatorClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
