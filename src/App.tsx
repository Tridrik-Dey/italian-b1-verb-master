import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { AppHeader } from '@/components/layout/AppHeader'
import { MixTestPage } from '@/pages/MixTestPage'
import { PrioritiesPage } from '@/pages/PrioritiesPage'
import { TestPage } from '@/pages/TestPage'
import { VerbDetailPage } from '@/pages/VerbDetailPage'
import { VerbListPage } from '@/pages/VerbListPage'
import { VocabBatchPage } from '@/pages/vocab/VocabBatchPage'
import { VocabBatchesPage } from '@/pages/vocab/VocabBatchesPage'
import { VocabStudyPage } from '@/pages/vocab/VocabStudyPage'
import { VocabTestPage } from '@/pages/vocab/VocabTestPage'
import { HAS_BOOK_VOCAB } from '@/data/vocabulary'
import { lastMode, modeFromPath, modeHome, rememberMode } from '@/lib/vocab/prefs'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** Remembers Verbi / Vocabolario so the app reopens where the learner left off. */
function RememberMode() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname !== '/') rememberMode(modeFromPath(pathname))
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <RememberMode />
      <AppHeader />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Navigate to={modeHome(lastMode())} replace />} />
          <Route path="/learn" element={<PrioritiesPage />} />
          <Route path="/learn/:priority" element={<VerbListPage />} />
          <Route path="/learn/:priority/:verb" element={<VerbDetailPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/mix" element={<MixTestPage />} />
          <Route path="/vocabolario" element={<VocabBatchesPage />} />
          <Route path="/vocabolario/test" element={<VocabTestPage />} />
          <Route path="/vocabolario/:batchId" element={<VocabBatchPage />} />
          <Route path="/vocabolario/:batchId/:subId" element={<VocabStudyPage />} />
          <Route path="*" element={<Navigate to="/learn" replace />} />
        </Routes>
      </main>
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        Italian B1 Verb Master · 200 verbs · B1 tenses · {HAS_BOOK_VOCAB ? 'book vocabulary' : 'sample vocabulary'} · progress saved locally
      </footer>
    </div>
  )
}
