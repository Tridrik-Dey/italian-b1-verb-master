import { BookOpen, Dices, ListChecks, MessageSquareText, PencilLine, Repeat2, Shapes, Table2 } from 'lucide-react'
import { SentencePractice } from '@/components/test/SentencePractice'
import { BeyondB1Badge } from '@/components/learn/BeyondB1Badge'
import { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { TenseSelect } from '@/components/learn/TenseSelect'
import { TenseExercise } from '@/components/test/TenseExercise'
import { VerbSelect } from '@/components/test/VerbSelect'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Segmented } from '@/components/ui/segmented'
import { PRIORITY_BY_ID } from '@/data/priorities'
import { TENSE_BY_ID, isTenseId, tenseEnglish, tenseFullLabel } from '@/data/tenses'
import { VERBS, VERB_BY_INFINITIVE } from '@/data/verbs'
import { getVerb } from '@/lib/conjugation'
import { learnVerbUrl } from '@/lib/routes'
import type { AnswerMode } from '@/lib/testing/types'
import type { TenseId } from '@/types/verb'

const DEFAULT_VERB = 'essere'
const DEFAULT_TENSE: TenseId = 'ind-presente'

type Section = 'conjugation' | 'sentences'

export function TestPage() {
  const [params, setParams] = useSearchParams()
  const section: Section = params.get('section') === 'sentences' ? 'sentences' : 'conjugation'

  const setSection = (s: Section) => {
    const next = new URLSearchParams(params)
    if (s === 'sentences') next.set('section', 'sentences')
    else next.delete('section')
    setParams(next, { replace: true })
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Test</p>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            {section === 'sentences' ? 'Which tense?' : 'One verb, one tense'}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {section === 'sentences'
              ? 'Complete each sentence with the verb in brackets. The words around the gap tell you which tense to use.'
              : 'Conjugate every person, then check your answers.'}
          </p>
        </div>
        <Segmented
          label="Test section"
          value={section}
          onChange={setSection}
          options={[
            { value: 'conjugation', label: 'Conjugation table', icon: <Table2 /> },
            { value: 'sentences', label: 'Sentence practice', icon: <MessageSquareText /> },
          ]}
        />
      </div>
      {section === 'sentences' ? <SentencePractice /> : <ConjugationTest />}
    </div>
  )
}

function ConjugationTest() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const verbRef = useRef<HTMLSelectElement>(null)
  const tenseWrap = useRef<HTMLDivElement>(null)

  const verbParam = params.get('verb') ?? ''
  const verb = VERB_BY_INFINITIVE.has(verbParam) ? verbParam : DEFAULT_VERB
  const tenseParam = params.get('tense')
  const tense: TenseId = isTenseId(tenseParam) ? tenseParam : DEFAULT_TENSE
  const mode: AnswerMode = params.get('mode') === 'mcq' ? 'mcq' : 'fill'

  const info = getVerb(verb)
  const conj = info.conjugations[tense]
  const def = TENSE_BY_ID[tense]

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params)
    next.set('verb', verb)
    next.set('tense', tense)
    for (const [k, v] of Object.entries(patch)) next.set(k, v)
    if (next.get('mode') === 'fill') next.delete('mode')
    setParams(next, { replace: true })
  }

  const randomVerb = () => {
    let v = verb
    while (v === verb) v = VERBS[Math.floor(Math.random() * VERBS.length)].infinitive
    update({ verb: v })
  }

  const extraControls = (
    <>
      <Button variant="ghost" onClick={() => tenseWrap.current?.querySelector('select')?.focus()}>
        <Shapes /> Change Tense
      </Button>
      <Button variant="ghost" onClick={() => verbRef.current?.focus()}>
        <Repeat2 /> Change Verb
      </Button>
      <Button variant="ghost" onClick={() => navigate(learnVerbUrl(info.entry.priority, verb, tense))}>
        <BookOpen /> Return to Learn
      </Button>
    </>
  )

  return (
    <div>
      <Card className="mb-5 p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="test-verb">Verb</Label>
            <div className="flex gap-2">
              <VerbSelect id="test-verb" ref={verbRef} value={verb} onChange={(v) => update({ verb: v })} className="flex-1" />
              <Button variant="outline" size="icon" onClick={randomVerb} aria-label="Random verb" title="Random verb">
                <Dices />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5" ref={tenseWrap}>
            <Label htmlFor="test-tense">Tense</Label>
            <TenseSelect id="test-tense" value={tense} onChange={(t) => update({ tense: t })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium" id="mode-label">
              Answer mode
            </span>
            <Segmented
              label="Answer mode"
              value={mode}
              onChange={(m) => update({ mode: m })}
              options={[
                { value: 'fill', label: 'Fill in the Blanks', icon: <PencilLine /> },
                { value: 'mcq', label: 'Multiple Choice', icon: <ListChecks /> },
              ]}
            />
          </div>
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-display text-2xl font-semibold" data-testid="test-heading">
          {verb} <span className="text-lg font-normal text-muted-foreground">— {info.entry.english}</span>
        </h2>
        <Badge variant="secondary" data-testid="test-tense-badge">
          {tenseFullLabel(tense)}
        </Badge>
        <span className="text-sm text-muted-foreground" data-testid="test-tense-english">
          = {tenseEnglish(tense)}
        </span>
        {!def.b1 && <BeyondB1Badge />}
        <Badge variant="outline">{PRIORITY_BY_ID[info.entry.priority].title}</Badge>
        {info.reflexive && <Badge variant="outline">Riflessivo</Badge>}
      </div>
      {def.kind === 'nonfinite' && (
        <p className="mb-3 text-sm text-muted-foreground">Non-finite form: give the single form of the verb (no persons).</p>
      )}
      {def.kind === 'imperative' && conj.rows.length > 0 && (
        <p className="mb-3 text-sm text-muted-foreground">Only the persons that have an imperative are tested (no “io”).</p>
      )}

      {conj.rows.length ? (
        // The key resets the whole exercise when verb or tense changes.
        <TenseExercise key={`${verb}|${tense}`} verb={verb} tense={tense} mode={mode} extraControls={extraControls} />
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground" data-testid="no-forms">
            {conj.note}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">{extraControls}</div>
        </Card>
      )}
    </div>
  )
}
