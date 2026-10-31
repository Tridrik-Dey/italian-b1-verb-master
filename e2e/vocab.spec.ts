import { expect, test } from '@playwright/test'

test.describe('Vocabolario', () => {
  test('Verbi | Vocabolario switch, and the app remembers the last mode', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/learn$/)
    await page.getByTestId('mode-vocabolario').click()
    await expect(page).toHaveURL(/\/vocabolario$/)
    // The verb tabs belong to Verbi only.
    await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0)
    for (const id of ['b1', 'b2', 'b3', 'b4', 'b5']) await expect(page.getByTestId(`vocab-batch-${id}`)).toBeVisible()

    await page.goto('/')
    await expect(page).toHaveURL(/\/vocabolario$/)
    await page.getByTestId('mode-verbi').click()
    await expect(page).toHaveURL(/\/learn$/)
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()
    await page.goto('/')
    await expect(page).toHaveURL(/\/learn$/)
  })

  test('Parole | Frasi toggle changes the counts and is remembered', async ({ page }) => {
    await page.goto('/vocabolario')
    const b1 = page.getByTestId('vocab-batch-b1').getByTestId('vocab-batch-count')
    await expect(b1).toHaveText('233')
    await page.getByRole('radio', { name: /Frasi/ }).click()
    await expect(b1).toHaveText('178')
    await page.goto('/vocabolario')
    await expect(page.getByTestId('vocab-batch-b1').getByTestId('vocab-batch-count')).toHaveText('178')
  })

  test('batch → sub-batch → Studia with flashcards', async ({ page }) => {
    await page.goto('/vocabolario?type=words')
    await page.getByTestId('vocab-batch-b1').click()
    await expect(page.getByTestId('vocab-batch-title')).toHaveText('Batch 1')
    await page.getByTestId('vocab-sub-b1-s1').getByTestId('vocab-study').click()
    await expect(page.getByTestId('vocab-study-title')).toContainText('Il pranzo è pronto!')
    await expect(page.getByTestId('flashcard-counter')).toHaveText('1 / 24')
    await expect(page.getByTestId('flashcard-it')).toHaveText('quella')
    await page.getByTestId('flashcard').click()
    await expect(page.getByTestId('flashcard-en')).toHaveText('that (one)')
    await expect(page.getByTestId('flashcard-note')).toContainText('feminine of quello')
    await page.getByTestId('flashcard-next').click()
    await expect(page.getByTestId('flashcard-counter')).toHaveText('2 / 24')
    await expect(page.getByTestId('flashcard-it')).toHaveText('la compagnia')
    await page.getByRole('radio', { name: 'List' }).click()
    await expect(page.getByTestId('vocab-list').locator('li')).toHaveCount(24)
  })

  test('sub-batches without phrases are greyed out in Frasi', async ({ page }) => {
    await page.goto('/vocabolario/b1?type=phrases')
    const kitchen = page.getByTestId('vocab-sub-b1-s4')
    await expect(kitchen).toHaveAttribute('aria-disabled', 'true')
    await expect(kitchen.getByTestId('vocab-test')).toHaveCount(0)
  })

  test('a full test: feedback, Next, score, wrong answers, retry and best score', async ({ page }) => {
    await page.goto('/vocabolario/b1?type=words')
    await page.getByTestId('vocab-sub-b1-s1').getByTestId('vocab-test').click()
    await expect(page.getByRole('radio', { name: 'Mixed' })).toHaveAttribute('aria-checked', 'true')
    await page.getByTestId('vocab-start').click()

    for (let i = 1; i <= 10; i++) {
      await expect(page.getByTestId('vocab-question-counter')).toHaveText(`Question ${i} / 10`)
      const options = page.getByTestId('vocab-question').getByTestId('mcq-option')
      await expect(options).toHaveCount(4)
      await options.first().click()
      await expect(page.getByTestId('vocab-question').locator('[data-correct="true"]')).toHaveCount(1)
      await page.getByTestId('vocab-next').click()
    }

    await expect(page.getByTestId('vocab-results')).toBeVisible()
    const score = await page.getByTestId('vocab-score').textContent()
    const correct = Number(score!.split('/')[0])
    await expect(page.getByTestId('vocab-new-best')).toBeVisible()
    if (correct < 10) {
      await expect(page.getByTestId('vocab-wrong-list').locator('li')).toHaveCount(10 - correct)
      await page.getByTestId('vocab-retry-wrong').click()
      await expect(page.getByTestId('vocab-question-counter')).toHaveText(`Question 1 / ${10 - correct}`)
    }

    await page.goto('/vocabolario/b1?type=words')
    await expect(page.getByTestId('vocab-sub-b1-s1').getByTestId('best-score')).toHaveText(`Best ${correct}/10 · ${correct * 10}%`)
  })

  test('the verb section still works after visiting Vocabolario', async ({ page }) => {
    await page.goto('/vocabolario')
    await page.getByTestId('mode-verbi').click()
    await page.getByTestId('priority-card-essenziali').click()
    await expect(page.locator('[data-testid^="verb-card-"]')).toHaveCount(50)
  })
})
