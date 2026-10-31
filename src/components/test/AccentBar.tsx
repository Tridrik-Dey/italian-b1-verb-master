const ACCENTS = ['à', 'è', 'é', 'ì', 'ò', 'ù', "'"]

/**
 * Inserts accented letters into the most recently focused answer input.
 * Uses onMouseDown + preventDefault so the input keeps focus.
 */
export function AccentBar({ onInsert }: { onInsert: (char: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-label="Insert accented letter">
      <span className="mr-1 text-xs text-muted-foreground">Accents:</span>
      {ACCENTS.map((c) => (
        <button
          key={c}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(c)}
          className="h-8 min-w-8 cursor-pointer rounded-md border bg-card px-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent"
          aria-label={c === "'" ? 'Insert apostrophe' : `Insert ${c}`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}

/** Insert text at the caret of an input and return the new value + caret. */
export function insertAtCaret(input: HTMLInputElement, text: string): { value: string; caret: number } {
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? input.value.length
  const value = input.value.slice(0, start) + text + input.value.slice(end)
  return { value, caret: start + text.length }
}
