import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { reloadProgressFromStorage, resetProgress } from '@/lib/progress/store'
import { TestPage } from './TestPage'

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  resetProgress()
  reloadProgressFromStorage()
})
afterEach(cleanup)

describe('Test tab', () => {
  it('opens with the verb and tense from the URL', () => {
    renderAt('/test?verb=stare&tense=ind-presente')
    expect(screen.getByTestId('test-heading')).toHaveTextContent('stare')
    expect(screen.getByTestId('test-tense-badge')).toHaveTextContent('Indicativo — Presente')
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('reveals the correct form immediately under a wrong answer and keeps the user answer', async () => {
    const user = userEvent.setup()
    renderAt('/test?verb=stare&tense=ind-presente')
    await user.type(screen.getByLabelText('Io'), 'sto')
    await user.type(screen.getByLabelText('Tu'), 'stei{Enter}')
    const tuRow = screen.getByTestId('row-tu')
    expect(within(tuRow).getByTestId('incorrect-feedback')).toHaveTextContent('stei')
    expect(within(tuRow).getByTestId('correct-answer')).toHaveTextContent('stai')
    await user.click(screen.getByTestId('check-answers'))
    expect(within(screen.getByTestId('row-io')).getByTestId('correct-feedback')).toBeInTheDocument()
    expect(screen.getByTestId('score')).toHaveTextContent('1/6 correct — 17%')
  })

  it('switching to multiple choice and back does not lose fill-in answers', async () => {
    const user = userEvent.setup()
    renderAt('/test?verb=fare&tense=ind-futuro-semplice')
    await user.type(screen.getByLabelText('Noi'), 'faremo{Enter}')
    await user.click(screen.getByRole('radio', { name: /Multiple Choice/ }))
    expect(screen.getAllByTestId('mcq-option')).toHaveLength(24)
    expect(screen.getByTestId('score')).toHaveTextContent('0/6')
    // Answer one MCQ question correctly.
    const ioRow = screen.getByTestId('row-io')
    await user.click(within(ioRow).getByRole('button', { name: /^farò/ }))
    expect(within(ioRow).getByTestId('correct-feedback')).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: /Fill in the Blanks/ }))
    expect(screen.getByLabelText('Noi')).toHaveValue('faremo')
    expect(screen.getByTestId('score')).toHaveTextContent('1/6 correct')
  })

  it('shows only the applicable imperative persons', () => {
    renderAt('/test?verb=andare&tense=imp-presente')
    expect(screen.queryByLabelText('Io')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Lei (formale)')).toBeInTheDocument()
    expect(screen.getAllByRole('textbox')).toHaveLength(5)
  })

  it('explains when a verb has no forms for the chosen tense', () => {
    renderAt('/test?verb=potere&tense=imp-presente')
    expect(screen.getByTestId('no-forms')).toHaveTextContent('no imperative')
  })
})
