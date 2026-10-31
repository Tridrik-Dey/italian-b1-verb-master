import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { scopeItems } from '@/data/vocabulary'
import { getVocabScores, recordVocabScore, reloadVocabScoresFromStorage, resetVocabScores } from '@/lib/vocab/scores'
import { VocabBatchPage } from './VocabBatchPage'
import { VocabTestPage } from './VocabTestPage'

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/vocabolario/test" element={<VocabTestPage />} />
        <Route path="/vocabolario/:batchId" element={<VocabBatchPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  resetVocabScores()
  reloadVocabScoresFromStorage()
  localStorage.clear()
})
afterEach(cleanup)

describe('Vocabolario test', () => {
  it('runs a 10-question test, shows the score and the wrong answers, and saves the best score', async () => {
    const user = userEvent.setup()
    renderAt('/vocabolario/test?scope=sub&id=b1-s1&type=words')
    expect(screen.getByTestId('vocab-test-title')).toHaveTextContent('Il pranzo è pronto!')
    await user.click(screen.getByTestId('vocab-start'))

    // Always pick the first option: the score is whatever that gives, and the wrong list must match it.
    for (let i = 0; i < 10; i++) {
      expect(screen.getByTestId('vocab-question-counter')).toHaveTextContent(`Question ${i + 1} / 10`)
      const options = screen.getAllByTestId('mcq-option')
      expect(options).toHaveLength(4)
      await user.click(options[0])
      // After answering, exactly one option is marked correct.
      expect(screen.getAllByTestId('mcq-option').filter((o) => o.dataset.correct === 'true')).toHaveLength(1)
      await user.click(screen.getByTestId('vocab-next'))
    }

    const results = screen.getByTestId('vocab-results')
    const score = within(results).getByTestId('vocab-score').textContent!
    const correct = Number(score.split('/')[0])
    expect(score).toMatch(/\d+ \/ 10/)
    const wrongItems = screen.queryByTestId('vocab-wrong-list')?.querySelectorAll('li').length ?? 0
    expect(wrongItems).toBe(10 - correct)
    expect(getVocabScores().best['words|sub:b1-s1']).toMatchObject({ correct, total: 10 })
  })

  it('highlights the correct option after a wrong pick and lets you retry only the wrong ones', async () => {
    const user = userEvent.setup()
    renderAt('/vocabolario/test?scope=sub&id=b1-s4&type=words')
    await user.click(screen.getByRole('radio', { name: 'Italiano → English' }))
    await user.click(screen.getByRole('radio', { name: /All \(15\)/ }))
    await user.click(screen.getByTestId('vocab-start'))

    let wrong = 0
    for (let i = 0; i < 15; i++) {
      const card = screen.getByTestId('vocab-question')
      const prompt = within(card).getByTestId('vocab-prompt').textContent
      expect(prompt).toBeTruthy()
      const options = screen.getAllByTestId('mcq-option')
      // We don't know the answer up front: click, then check what happened.
      await user.click(options[i % 4])
      const picked = screen.getAllByTestId('mcq-option')[i % 4]
      if (picked.dataset.correct === 'false') {
        wrong++
        expect(screen.getAllByTestId('mcq-option').filter((o) => o.dataset.correct === 'true')).toHaveLength(1)
        expect(screen.getByTestId('incorrect-feedback')).toBeInTheDocument()
      } else {
        expect(screen.getByTestId('correct-feedback')).toBeInTheDocument()
      }
      await user.click(screen.getByTestId('vocab-next'))
    }

    expect(screen.getByTestId('vocab-score')).toHaveTextContent(`${15 - wrong} / 15`)
    if (wrong > 0) {
      await user.click(screen.getByTestId('vocab-retry-wrong'))
      expect(screen.getByTestId('vocab-question-counter')).toHaveTextContent(`Question 1 / ${wrong}`)
    }
  })

  it('greys out sub-batches with nothing of the current type and shows best scores', async () => {
    renderAt('/vocabolario/b1?type=phrases')
    const kitchen = screen.getByTestId('vocab-sub-b1-s4') // kitchen items: words only
    expect(kitchen).toHaveAttribute('aria-disabled', 'true')
    expect(within(kitchen).queryByTestId('vocab-test')).toBeNull()
    expect(within(screen.getByTestId('vocab-sub-b1-s1')).getByTestId('vocab-sub-count')).toHaveTextContent('34')
  })

  it('Try again lets you re-answer a wrong question, but the score counts the first answer', async () => {
    const user = userEvent.setup()
    const kitchen = scopeItems({ kind: 'sub', id: 'b1-s4' }, 'words')
    const answerFor = (prompt: string) => kitchen.find((i) => i.it === prompt)!.en
    renderAt('/vocabolario/test?scope=sub&id=b1-s4&type=words')
    await user.click(screen.getByRole('radio', { name: 'Italiano → English' }))
    await user.click(screen.getByTestId('vocab-start'))

    for (let i = 0; i < 10; i++) {
      const right = answerFor(screen.getByTestId('vocab-prompt').textContent!)
      const options = screen.getAllByTestId('mcq-option')
      if (i === 0) {
        // Wrong first, then Try again and pick the right one.
        await user.click(options.find((o) => o.textContent !== right)!)
        expect(screen.getByTestId('incorrect-feedback')).toBeInTheDocument()
        await user.click(screen.getByTestId('vocab-try-again'))
        expect(screen.getByTestId('vocab-previous-try')).toBeInTheDocument()
        await user.click(screen.getAllByTestId('mcq-option').find((o) => o.textContent === right)!)
        expect(screen.getByTestId('correct-feedback')).toBeInTheDocument()
        expect(screen.queryByTestId('vocab-try-again')).toBeNull()
      } else {
        await user.click(options.find((o) => o.textContent === right)!)
      }
      await user.click(screen.getByTestId('vocab-next'))
    }

    expect(screen.getByTestId('vocab-score')).toHaveTextContent('9 / 10')
    expect(screen.getByTestId('vocab-wrong-list')).toHaveTextContent('fixed on try again')
    expect(getVocabScores().best['words|sub:b1-s4']).toMatchObject({ correct: 9, total: 10 })
  })

  it('marks sub-batches: green check at 100%, half-filled amber when partial', () => {
    recordVocabScore('words', { kind: 'sub', id: 'b1-s1' }, 10, 10)
    recordVocabScore('words', { kind: 'sub', id: 'b1-s2' }, 7, 10)
    renderAt('/vocabolario/b1?type=words')
    const mark = (id: string) => within(screen.getByTestId(`vocab-sub-${id}`)).getByTestId('status-mark')
    expect(mark('b1-s1')).toHaveAttribute('data-status', 'perfect')
    expect(mark('b1-s1')).toHaveAccessibleName('Completed with 100%')
    expect(mark('b1-s2')).toHaveAttribute('data-status', 'partial')
    expect(mark('b1-s3')).toHaveAttribute('data-status', 'untested')
    expect(screen.getByTestId('marks-perfect')).toHaveTextContent('1')
    expect(screen.getByTestId('marks-partial')).toHaveTextContent('1')
    // Marks are per type: phrases are still untested.
    cleanup()
    renderAt('/vocabolario/b1?type=phrases')
    expect(within(screen.getByTestId('vocab-sub-b1-s1')).getByTestId('status-mark')).toHaveAttribute('data-status', 'untested')
  })
})
