import { useState } from 'react'
import { MixRunner } from '@/components/mix-test/MixRunner'
import { DEFAULT_MIX_SETTINGS, MixSetup, selectedVerbs, type MixSettings } from '@/components/mix-test/MixSetup'
import { MixSummaryView } from '@/components/mix-test/MixSummaryView'
import { isTenseId } from '@/data/tenses'
import { VERB_BY_INFINITIVE } from '@/data/verbs'
import { recordAnswer, recordAttempt } from '@/lib/progress/store'
import { buildMixQuestions, mcqOptions, shuffle } from '@/lib/testing/generate'
import { summarizeMix, type MixAnswer } from '@/lib/testing/mix'
import type { AnswerMode, McqOption, Question } from '@/lib/testing/types'

const SETTINGS_KEY = 'italian-b1-verb-master:mix-settings'

/** Remembered setup (a per-browser convenience; falls back to defaults if unreadable). */
function loadSettings(): MixSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_MIX_SETTINGS
    const s = { ...DEFAULT_MIX_SETTINGS, ...(JSON.parse(raw) as Partial<MixSettings>) }
    return {
      ...s,
      verbs: s.verbs.filter((v) => VERB_BY_INFINITIVE.has(v)),
      tenses: s.tenses.filter((t) => isTenseId(t)),
    }
  } catch {
    return DEFAULT_MIX_SETTINGS
  }
}

function saveSettings(s: MixSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
  } catch {
    // ignore unavailable storage
  }
}

interface Run {
  id: number
  questions: Question[]
  options: Record<string, McqOption[]>
  answers: (MixAnswer | undefined)[]
  /** Wrong answers given before "Try again", per question. */
  wrongTries: string[][]
}

function newRun(questions: Question[]): Run {
  return {
    id: Date.now(),
    questions,
    options: Object.fromEntries(questions.map((q) => [q.id, mcqOptions(q)])),
    answers: questions.map(() => undefined),
    wrongTries: questions.map(() => []),
  }
}

export function MixTestPage() {
  const [settings, setSettings] = useState<MixSettings>(loadSettings)
  const [phase, setPhase] = useState<'setup' | 'running' | 'summary'>('setup')
  const [run, setRun] = useState<Run | null>(null)
  const [mode, setMode] = useState<AnswerMode>(settings.mode)

  const updateSettings = (s: MixSettings) => {
    setSettings(s)
    saveSettings(s)
  }

  const start = () => {
    const { questions } = buildMixQuestions({ verbs: selectedVerbs(settings), tenses: settings.tenses, count: settings.count })
    if (!questions.length) return
    setMode(settings.mode)
    setRun(newRun(questions))
    setPhase('running')
  }

  const finish = (r: Run) => {
    if (r.answers.some(Boolean)) recordAttempt('mix')
    setPhase('summary')
  }

  const onAnswer = (index: number, answer: MixAnswer) => {
    if (!run || run.answers[index]) return
    const q = run.questions[index]
    recordAnswer(q.verb, q.tense, answer.correct)
    const answers = [...run.answers]
    answers[index] = answer
    setRun({ ...run, answers })
  }

  /** Re-open a wrongly answered question. */
  const onTryAgain = (index: number) => {
    const a = run?.answers[index]
    if (!run || !a || a.correct) return
    const answers = [...run.answers]
    answers[index] = undefined
    const wrongTries = run.wrongTries.map((w, i) => (i === index ? [...w, a.answer] : w))
    setRun({ ...run, answers, wrongTries })
  }

  const retryIncorrect = () => {
    if (!run) return
    const wrong = run.questions.filter((_, i) => run.wrongTries[i].length > 0 || (run.answers[i] && !run.answers[i]!.correct))
    if (!wrong.length) return
    setRun(newRun(shuffle(wrong)))
    setPhase('running')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <p className="text-sm font-medium text-primary">Mix Test</p>
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          {phase === 'summary' ? 'Results' : phase === 'running' ? 'Randomised practice' : 'Build your mix'}
        </h1>
        {phase === 'setup' && (
          <p className="mt-1 text-muted-foreground">Choose categories, verbs and tenses — questions are drawn at random from your selection.</p>
        )}
      </div>

      {phase === 'setup' && <MixSetup settings={settings} onChange={updateSettings} onStart={start} />}

      {phase === 'running' && run && (
        <MixRunner
          key={run.id}
          questions={run.questions}
          options={run.options}
          answers={run.answers}
          mode={mode}
          onModeChange={setMode}
          onAnswer={onAnswer}
          onTryAgain={onTryAgain}
          previousWrong={run.wrongTries}
          onFinish={() => finish(run)}
        />
      )}

      {phase === 'summary' && run && (
        <MixSummaryView
          summary={summarizeMix(run.questions, run.answers, run.wrongTries)}
          onRetryIncorrect={retryIncorrect}
          onNew={() => {
            setRun(null)
            setPhase('setup')
          }}
        />
      )}
    </div>
  )
}
