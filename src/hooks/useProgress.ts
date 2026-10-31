import { useSyncExternalStore } from 'react'
import { getProgress, subscribeProgress, type ProgressData } from '@/lib/progress/store'

/** Live, persisted learning progress (re-renders on every change). */
export function useProgress(): ProgressData {
  return useSyncExternalStore(subscribeProgress, getProgress, getProgress)
}
