import { Check } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> {
  onCheckedChange?: (checked: boolean) => void
}

export function Checkbox({ className, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <span className={cn('relative inline-flex size-4 shrink-0', className)}>
      <input
        type="checkbox"
        className="peer size-4 cursor-pointer appearance-none rounded-[5px] border border-input bg-card transition-colors checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
      <Check
        className="pointer-events-none absolute inset-0 m-auto size-3 text-primary-foreground opacity-0 peer-checked:opacity-100"
        strokeWidth={3}
        aria-hidden
      />
    </span>
  )
}
