/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { existsSync } from 'node:fs'

// Vocabulary tests check the textbook data, which isn't in the public repository.
const hasBookVocab = existsSync(fileURLToPath(new URL('./src/data/vocabulary/italian_vocabulary.json', import.meta.url)))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: hasBookVocab ? [] : ['src/lib/vocab/vocab.test.ts', 'src/pages/vocab/VocabTestPage.test.tsx'],
    setupFiles: ['src/test/setup.ts'],
    // Several tests check every verb × tense × person (~25,000 forms); allow time when files run in parallel.
    testTimeout: 30_000,
  },
})
