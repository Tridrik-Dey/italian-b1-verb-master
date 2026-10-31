import type { Priority } from '@/types/verb'

/** Distinct visual accents for the four priority categories. */
export const PRIORITY_STYLE: Record<
  Priority,
  { dot: string; bar: string; soft: string; text: string; ring: string; gradient: string }
> = {
  essenziali: {
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
    soft: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'hover:border-rose-300 dark:hover:border-rose-700',
    gradient: 'from-rose-500/15 via-rose-500/5 to-transparent',
  },
  alta: {
    dot: 'bg-sky-500',
    bar: 'bg-sky-500',
    soft: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    ring: 'hover:border-sky-300 dark:hover:border-sky-700',
    gradient: 'from-sky-500/15 via-sky-500/5 to-transparent',
  },
  media: {
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
    soft: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'hover:border-amber-300 dark:hover:border-amber-700',
    gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
  },
  bassa: {
    dot: 'bg-violet-500',
    bar: 'bg-violet-500',
    soft: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    ring: 'hover:border-violet-300 dark:hover:border-violet-700',
    gradient: 'from-violet-500/15 via-violet-500/5 to-transparent',
  },
}
