import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'

// The vocabulary E2E tests check the textbook data, which isn't in the public repository.
const hasBookVocab = existsSync('src/data/vocabulary/italian_vocabulary.json')

export default defineConfig({
  testDir: './e2e',
  testIgnore: hasBookVocab ? [] : ['vocab.spec.ts'],
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
