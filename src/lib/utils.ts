import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function percent(value: number | null | undefined): string {
  return value == null ? '—' : `${Math.round(value * 100)}%`
}

/** Progress percentage that never hides early progress as "0%". */
export function progressPercent(value: number): string {
  if (value > 0 && value < 0.01) return '<1%'
  return `${Math.round(value * 100)}%`
}

export function formatDate(ts: number | null | undefined): string {
  if (!ts) return 'Never'
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
