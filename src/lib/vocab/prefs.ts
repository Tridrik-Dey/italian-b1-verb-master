import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { isVocabType, type VocabScope, type VocabType } from '@/data/vocabulary'

/** Top-level section of the app: the verb trainer or the vocabulary trainer. */
export type AppMode = 'verbi' | 'vocabolario'

export const MODE_KEY = 'italian-b1-verb-master:mode'
export const VOCAB_TYPE_KEY = 'italian-b1-verb-master:vocab-type'

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore unavailable storage
  }
}

export const modeFromPath = (pathname: string): AppMode => (pathname.startsWith('/vocabolario') ? 'vocabolario' : 'verbi')

export function lastMode(): AppMode {
  return read(MODE_KEY) === 'vocabolario' ? 'vocabolario' : 'verbi'
}

export function rememberMode(mode: AppMode) {
  write(MODE_KEY, mode)
}

export const modeHome = (mode: AppMode) => (mode === 'vocabolario' ? '/vocabolario' : '/learn')

function storedType(): VocabType {
  const v = read(VOCAB_TYPE_KEY)
  return isVocabType(v) ? v : 'words'
}

/** Parole/Frasi: taken from `?type=` when present, otherwise the last choice; changing it updates both. */
export function useVocabType(): [VocabType, (t: VocabType) => void] {
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('type')
  const type = isVocabType(fromUrl) ? fromUrl : storedType()
  const setType = useCallback(
    (t: VocabType) => {
      write(VOCAB_TYPE_KEY, t)
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('type', t)
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )
  useEffect(() => {
    if (isVocabType(fromUrl)) write(VOCAB_TYPE_KEY, fromUrl)
  }, [fromUrl])
  return [type, setType]
}

export const vocabBatchUrl = (batchId: string, type: VocabType) => `/vocabolario/${batchId}?type=${type}`

export const vocabStudyUrl = (batchId: string, subId: string, type: VocabType) =>
  `/vocabolario/${batchId}/${subId}?type=${type}`

export function vocabTestUrl(scope: VocabScope, type: VocabType) {
  const id = scope.kind === 'all' ? '' : `&id=${encodeURIComponent(scope.id)}`
  return `/vocabolario/test?scope=${scope.kind}${id}&type=${type}`
}
