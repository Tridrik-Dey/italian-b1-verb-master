import { expect, test, type Page } from '@playwright/test'

async function fillRow(page: Page, label: string, value: string) {
  await page.getByLabel(label, { exact: true }).fill(value)
}

test.describe('Learn tab navigation', () => {
  test('opens with the four priority cards (not a list of 200 verbs)', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/learn$/)
    for (const id of ['essenziali', 'alta', 'media', 'bassa']) {
      await expect(page.getByTestId(`priority-card-${id}`)).toBeVisible()
    }
    await expect(page.locator('[data-testid^="verb-card-"]')).toHaveCount(0)
  })

  test('each priority card opens the right verb list', async ({ page }) => {
    const expected = { essenziali: 50, alta: 50, media: 60, bassa: 40 }
    for (const [id, count] of Object.entries(expected)) {
      await page.goto('/learn')
      await page.getByTestId(`priority-card-${id}`).click()
      await expect(page).toHaveURL(new RegExp(`/learn/${id}$`))
      await expect(page.locator('[data-testid^="verb-card-"]')).toHaveCount(count)
    }
  })

  test('search filters the verb cards and Back to Priorities works', async ({ page }) => {
    await page.goto('/learn/essenziali')
    await page.getByLabel('Search verbs').fill('drink')
    await expect(page.locator('[data-testid^="verb-card-"]')).toHaveCount(1)
    await expect(page.getByTestId('verb-card-bere')).toBeVisible()
    await page.getByRole('link', { name: 'Back to Priorities' }).click()
    await expect(page).toHaveURL(/\/learn$/)
  })

  test('a verb card opens the correct conjugation chart', async ({ page }) => {
    await page.goto('/learn/essenziali')
    await page.getByTestId('verb-card-stare').click()
    await expect(page).toHaveURL(/\/learn\/essenziali\/stare/)
    await expect(page.getByTestId('verb-title')).toContainText('stare')
    await expect(page.getByTestId('tense-heading')).toHaveText(/Indicativo — Presente/i)
    await expect(page.getByTestId('tense-english')).toHaveText('Present')
    const table = page.getByTestId('conjugation-table')
    for (const form of ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno']) {
      await expect(table.getByText(form, { exact: true })).toBeVisible()
    }
    // Each row has a short Italian example with its English translation.
    const ioExample = table.locator('tr', { hasText: 'Io' }).getByTestId('row-example').filter({ visible: true })
    await expect(ioExample).toContainText('Io sto bene.')
    await expect(ioExample).toContainText('I am well.')
  })

  test('tense dropdown, next/previous and the all-tenses view', async ({ page }) => {
    await page.goto('/learn/essenziali/fare')
    await page.getByLabel('Select tense').selectOption('ind-futuro-semplice')
    await expect(page.getByTestId('tense-heading')).toHaveText(/Futuro semplice/i)
    await expect(page.getByTestId('conjugation-table').getByText('faremo', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Next tense' }).click()
    await expect(page.getByTestId('tense-heading')).toHaveText(/Futuro anteriore/i)
    await page.getByRole('button', { name: 'Previous tense' }).click()
    await expect(page.getByTestId('tense-heading')).toHaveText(/Futuro semplice/i)
    // Tenses beyond B1 are available and clearly labelled.
    await page.getByLabel('Select tense').selectOption('ind-passato-remoto')
    await expect(page.getByTestId('tense-heading')).toHaveText(/Passato remoto/i)
    await expect(page.getByTestId('beyond-b1')).toHaveText('Beyond B1')
    await expect(page.getByTestId('conjugation-table').getByText('feci', { exact: true })).toBeVisible()
    await page.getByLabel('Select tense').selectOption('ind-futuro-semplice')
    await expect(page.getByTestId('beyond-b1')).toHaveCount(0)
    await page.getByRole('radio', { name: 'All tenses' }).click()
    await expect(page.locator('[data-testid^="tense-card-"]')).toHaveCount(23)
  })
})

test.describe('Learn → Verb → Tense → Test workflow', () => {
  test('Test This Tense opens the Test tab pre-configured, and answers are corrected', async ({ page }) => {
    await page.goto('/learn')
    await page.getByTestId('priority-card-essenziali').click()
    await page.getByTestId('verb-card-andare').click()
    await page.getByLabel('Select tense').selectOption('ind-passato-prossimo')
    await page.getByTestId('test-this-tense').click()

    await expect(page).toHaveURL(/\/test\?verb=andare&tense=ind-passato-prossimo/)
    await expect(page.getByLabel('Verb', { exact: true })).toHaveValue('andare')
    await expect(page.getByLabel('Tense', { exact: true })).toHaveValue('ind-passato-prossimo')
    await expect(page.getByTestId('test-tense-badge')).toHaveText('Indicativo — Passato prossimo')

    await fillRow(page, 'Io', 'sono andata')
    await fillRow(page, 'Tu', 'sei andato')
    await fillRow(page, 'Lui/Lei', 'ha andato')
    await page.getByTestId('check-answers').click()

    await expect(page.getByTestId('row-io').getByTestId('correct-feedback')).toBeVisible()
    await expect(page.getByTestId('row-tu').getByTestId('correct-feedback')).toBeVisible()
    const lui = page.getByTestId('row-lui')
    await expect(lui.getByTestId('incorrect-feedback')).toContainText('ha andato')
    await expect(lui.getByTestId('correct-answer')).toHaveText('è andato/a')
    await expect(page.getByTestId('score')).toHaveText('2/6 correct — 33%')

    // Retry the wrong one.
    await page.getByRole('button', { name: 'Retry Incorrect' }).click()
    await fillRow(page, 'Lui/Lei', 'è andato')
    await page.getByLabel('Lui/Lei', { exact: true }).press('Enter')
    await expect(lui.getByTestId('correct-feedback')).toBeVisible()
    await expect(page.getByTestId('score')).toHaveText('3/6 correct — 50%')

    // Return to Learn keeps the verb and tense.
    await page.getByRole('button', { name: 'Return to Learn' }).click()
    await expect(page).toHaveURL(/\/learn\/essenziali\/andare\?tense=ind-passato-prossimo/)
  })

  test('accents are required and the accent buttons insert them', async ({ page }) => {
    await page.goto('/test?verb=essere&tense=ind-presente')
    await fillRow(page, 'Lui/Lei', 'e')
    await page.getByLabel('Lui/Lei', { exact: true }).press('Enter')
    await expect(page.getByTestId('row-lui').getByTestId('correct-answer')).toHaveText('è')
    await page.getByLabel('Io', { exact: true }).click()
    await page.getByRole('button', { name: 'Retry Lui/Lei' }).click()
    await page.getByRole('button', { name: 'Insert è' }).click()
    await page.getByLabel('Lui/Lei', { exact: true }).press('Enter')
    await expect(page.getByTestId('row-lui').getByTestId('correct-feedback')).toBeVisible()
  })

  test('MCQ answers are checked immediately and switching modes keeps state', async ({ page }) => {
    await page.goto('/test?verb=fare&tense=ind-presente')
    await fillRow(page, 'Io', 'faccio')
    await page.getByTestId('check-answers').click()
    await page.getByRole('radio', { name: 'Multiple Choice' }).click()
    await expect(page).toHaveURL(/mode=mcq/)

    const row = page.getByTestId('row-noi')
    const options = row.getByTestId('mcq-option')
    await expect(options).toHaveCount(4)
    const texts = await options.allTextContents()
    expect(new Set(texts).size).toBe(4)

    const wrong = options.filter({ hasNotText: /^facciamo/ }).first()
    await wrong.click()
    await expect(row.locator('[data-correct="true"]')).toHaveText(/facciamo/)
    await expect(row.getByTestId('incorrect-feedback')).toBeVisible()
    await expect(row.getByTestId('correct-answer')).toHaveText('facciamo')

    await page.getByRole('radio', { name: 'Fill in the Blanks' }).click()
    await expect(page.getByLabel('Io', { exact: true })).toHaveValue('faccio')
    await expect(page.getByTestId('row-io').getByTestId('correct-feedback')).toBeVisible()
  })
})

test.describe('Progress persistence', () => {
  test('progress survives a page refresh and can be reset', async ({ page }) => {
    await page.goto('/test?verb=parlare&tense=ind-presente')
    for (const [label, value] of [
      ['Io', 'parlo'],
      ['Tu', 'parli'],
      ['Lui/Lei', 'parla'],
      ['Noi', 'parliamo'],
      ['Voi', 'parlate'],
      ['Loro', 'parlano'],
    ]) {
      await fillRow(page, label, value)
    }
    await page.getByTestId('check-answers').click()
    await expect(page.getByTestId('score')).toHaveText('6/6 correct — 100%')

    await page.goto('/learn/essenziali/parlare')
    await expect(page.getByText(/Mastered · 6\/6 recent/)).toBeVisible()
    await page.reload()
    await expect(page.getByText(/Mastered · 6\/6 recent/)).toBeVisible()

    // 1 of 8 core tenses of 1 of 50 verbs: tiny but visible progress on the priority card.
    await page.goto('/learn')
    await expect(page.getByTestId('priority-card-essenziali').getByTestId('priority-progress')).toHaveText('<1%')
    await page.goto('/learn/essenziali')
    await expect(page.getByTestId('verb-card-parlare')).toContainText('13%')

    await page.goto('/learn')
    await page.getByRole('button', { name: 'Learning progress' }).click()
    await page.getByRole('button', { name: 'Reset progress' }).click()
    await page.getByRole('button', { name: 'Yes, reset' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByTestId('priority-card-essenziali').getByTestId('priority-progress')).toHaveText('0%')
    await page.reload()
    await expect(page.getByTestId('priority-card-essenziali').getByTestId('priority-progress')).toHaveText('0%')
  })
})

test.describe('Mix Test', () => {
  test('uses only the selected verbs and tenses, then shows grouped results', async ({ page }) => {
    await page.goto('/mix')
    await page.getByRole('radio', { name: 'Choose verbs' }).click()
    await page.getByTestId('mix-verb-fare').check()
    await page.getByTestId('mix-verb-andare').check()
    await page.getByTestId('mix-tenses-clear').click()
    await page.getByTestId('mix-tense-ind-futuro-semplice').check()
    await page.getByTestId('mix-tense-cong-presente').check()
    await page.getByRole('button', { name: 'Custom', exact: true }).click()
    await page.getByTestId('mix-custom-count').fill('8')
    await expect(page.getByTestId('mix-summary')).toContainText('2 verbs × 2 tenses → 24 possible questions')
    await page.getByTestId('mix-start').click()

    for (let i = 1; i <= 8; i++) {
      await expect(page.getByTestId('question-counter')).toHaveText(`Question ${i} / 8`)
      expect(['fare', 'andare']).toContain(await page.getByTestId('mix-verb').textContent())
      expect(['ind-futuro-semplice', 'cong-presente']).toContain(await page.getByTestId('mix-tense').getAttribute('data-tense'))
      await page.getByLabel('Answer', { exact: true }).fill('sbagliato')
      await page.getByTestId('mix-check').click()
      await expect(page.getByTestId('incorrect-feedback')).toBeVisible()
      await expect(page.getByTestId('correct-answer')).not.toBeEmpty()
      if (i === 1) {
        // Try again on the first question, then fix it.
        const correct = (await page.getByTestId('correct-answer').textContent())!.replace('/a', '').replace('/e', '')
        await page.getByTestId('mix-try-again').click()
        await expect(page.getByTestId('mix-previous-try')).toContainText('sbagliato')
        await page.getByLabel('Answer', { exact: true }).fill(correct)
        await page.getByTestId('mix-check').click()
        await expect(page.getByTestId('correct-feedback')).toBeVisible()
      }
      await page.getByTestId('mix-next').click()
    }

    await expect(page.getByTestId('mix-results')).toBeVisible()
    await expect(page.getByTestId('mix-total')).toHaveText('1 / 8')
    await expect(page.getByTestId('mix-first-try')).toHaveText('0 right first time')
    await expect(page.getByText('(fixed on retry)').first()).toBeVisible()
    await expect(page.getByText('Mistakes by verb')).toBeVisible()
    await expect(page.getByText('Mistakes by tense')).toBeVisible()

    await page.getByTestId('mix-retry-incorrect').click()
    await expect(page.getByTestId('question-counter')).toHaveText('Question 1 / 8')
  })

  test('multiple-choice mix questions are graded on click', async ({ page }) => {
    await page.goto('/mix')
    await page.getByRole('radio', { name: 'Multiple choice' }).click()
    await page.getByRole('button', { name: '10', exact: true }).click()
    await page.getByTestId('mix-start').click()
    const options = page.getByTestId('mix-question').getByTestId('mcq-option')
    await expect(options).toHaveCount(4)
    await options.first().click()
    await expect(page.getByTestId('mix-question').locator('[data-correct="true"]')).toHaveCount(1)
    await expect(page.getByTestId('mix-next')).toBeVisible()
  })
})

test.describe('Sentence practice', () => {
  test('fill in the verb, then see the tense and the clue', async ({ page }) => {
    await page.goto('/test')
    await page.getByRole('radio', { name: 'Sentence practice' }).click()
    await expect(page).toHaveURL(/section=sentences/)

    // Only andare, only passato prossimo.
    await page.getByLabel('Verbs', { exact: true }).selectOption('choose')
    await page.getByRole('button', { name: 'Clear' }).click()
    await page.getByTestId('sentence-verb-andare').check()
    await expect(page.getByTestId('sentence-verb-count')).toHaveText('1 selected: andare')
    await page.getByRole('button', { name: 'None' }).click()
    await page.getByTestId('sentence-tense-ind-passato-prossimo').click()
    await page.getByTestId('sentence-new-round').click()

    await expect(page.getByTestId('sentence-counter')).toHaveText('Sentence 1 / 6')
    await expect(page.getByTestId('sentence-text')).toContainText('Ieri')
    await expect(page.getByTestId('sentence-verb')).toHaveText('(andare)')

    await page.getByTestId('sentence-input').fill('vado')
    await page.getByTestId('sentence-check').click()
    await expect(page.getByTestId('incorrect-feedback')).toBeVisible()
    await expect(page.getByTestId('correct-answer')).toHaveText(/andat/)
    await expect(page.getByTestId('sentence-tense')).toHaveText('Indicativo — Passato prossimo')
    await expect(page.getByTestId('sentence-explanation')).toContainText('Clue: «Ieri»')
    await expect(page.getByTestId('sentence-english')).toContainText('Yesterday')

    // Try the same sentence again with the revealed answer.
    const correct = (await page.getByTestId('correct-answer').textContent())!.replace('/a', '').replace('/e', '')
    await page.getByTestId('sentence-try-again').click()
    await expect(page.getByTestId('sentence-counter')).toHaveText('Sentence 1 / 6')
    await expect(page.getByTestId('sentence-previous-try')).toContainText('vado')
    await page.getByTestId('sentence-input').fill(correct)
    await page.getByTestId('sentence-check').click()
    await expect(page.getByTestId('correct-feedback')).toBeVisible()
    await expect(page.getByTestId('sentence-try-again')).toHaveCount(0)

    await page.getByTestId('sentence-next').click()
    await expect(page.getByTestId('sentence-counter')).toHaveText('Sentence 2 / 6')
  })

  test('mistakes can be retried as a new round', async ({ page }) => {
    await page.goto('/test?section=sentences')
    await page.getByLabel('Verbs', { exact: true }).selectOption('choose')
    await page.getByRole('button', { name: 'Clear' }).click()
    await page.getByTestId('sentence-verb-essere').check()
    await page.getByRole('button', { name: 'None' }).click()
    await page.getByTestId('sentence-tense-ind-futuro-semplice').click()
    await page.getByTestId('sentence-new-round').click()
    for (let i = 0; i < 6; i++) {
      await page.getByTestId('sentence-input').fill('sbagliato')
      await page.getByTestId('sentence-check').click()
      await page.getByTestId('sentence-next').click()
    }
    await expect(page.getByTestId('sentence-score')).toHaveText('0 / 6')
    await page.getByTestId('sentence-retry-mistakes').click()
    await expect(page.getByTestId('sentence-counter')).toHaveText('Sentence 1 / 6')
  })

  test('several individual verbs can be chosen, across priorities', async ({ page }) => {
    await page.goto('/test?section=sentences')
    // Answer one sentence of the default round first, then change the verbs mid-round.
    await page.getByTestId('sentence-input').fill('x')
    await page.getByTestId('sentence-check').click()
    await page.getByTestId('sentence-next').click()
    await expect(page.getByTestId('sentence-counter')).toHaveText('Sentence 2 / 10')
    await page.getByLabel('Verbs', { exact: true }).selectOption('choose')
    await page.getByRole('button', { name: 'Clear' }).click()
    await page.getByLabel('Search verbs').fill('drink')
    await page.getByTestId('sentence-verb-bere').check()
    await page.getByLabel('Search verbs').fill('')
    await page.getByTestId('sentence-verb-sognare').check() // Media priorità
    await page.getByTestId('sentence-verb-rompere').check() // Bassa priorità
    await expect(page.getByTestId('sentence-verb-count')).toHaveText('3 selected: bere, sognare, rompere')
    await expect(page.getByTestId('sentence-selection-note')).toContainText('3 verbs you chose')
    // No "New round" click: changing the selection restarts the round by itself.
    await expect(page.getByTestId('sentence-counter')).toHaveText('Sentence 1 / 10')
    for (let i = 0; i < 10; i++) {
      await expect(page.getByTestId('sentence-verb')).toHaveText(/\((bere|sognare|rompere)\)/)
      await page.getByTestId('sentence-input').fill('x')
      await page.getByTestId('sentence-check').click()
      await page.getByTestId('sentence-next').click()
    }
    await expect(page.getByTestId('sentence-results')).toBeVisible()
  })

  test('multiple choice offers the same verb in different tenses', async ({ page }) => {
    await page.goto('/test?section=sentences')
    await page.getByRole('radio', { name: 'Multiple choice' }).click()
    const options = page.getByTestId('sentence-question').getByTestId('mcq-option')
    await expect(options).toHaveCount(4)
    await options.first().click()
    await expect(page.getByTestId('sentence-question').locator('[data-correct="true"]')).toHaveCount(1)
    await expect(page.getByTestId('sentence-explanation')).toBeVisible()
  })
})

test('dark mode toggle persists', async ({ page }) => {
  await page.goto('/learn')
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})
