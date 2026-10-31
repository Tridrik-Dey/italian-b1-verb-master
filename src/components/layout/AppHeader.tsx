import { BookOpen, ClipboardCheck, Languages, Moon, Shuffle, Sun, Type } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { ProgressDialog } from '@/components/ProgressDialog'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { modeFromPath, modeHome, type AppMode } from '@/lib/vocab/prefs'

const TABS = [
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/test', label: 'Test', icon: ClipboardCheck },
  { to: '/mix', label: 'Mix Test', icon: Shuffle },
]

const MODES: { mode: AppMode; label: string; icon: typeof BookOpen }[] = [
  { mode: 'verbi', label: 'Verbi', icon: Type },
  { mode: 'vocabolario', label: 'Vocabolario', icon: Languages },
]

/** Top-level switch between the verb trainer and the vocabulary trainer. */
function ModeSwitch({ mode }: { mode: AppMode }) {
  return (
    <nav aria-label="Section" className="flex rounded-xl border bg-muted p-1" data-testid="mode-switch">
      {MODES.map(({ mode: m, label, icon: Icon }) => (
        <NavLink
          key={m}
          to={modeHome(m)}
          aria-current={m === mode ? 'page' : undefined}
          data-testid={`mode-${m}`}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all',
            m === mode ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
          )}
        >
          <Icon className="size-4" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppHeader() {
  const { theme, toggle } = useTheme()
  const mode = modeFromPath(useLocation().pathname)
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:flex-nowrap">
        <NavLink to={modeHome(mode)} className="mr-auto flex items-center gap-2.5 rounded-md sm:mr-0">
          <span aria-hidden className="flex h-7 w-7 overflow-hidden rounded-md shadow-sm ring-1 ring-black/10">
            <span className="flex-1 bg-green-600" />
            <span className="flex-1 bg-white" />
            <span className="flex-1 bg-red-600" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[1.05rem] font-semibold">Verb Master</span>
            <span className="block text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
              Italian B1
            </span>
          </span>
        </NavLink>

        <div className="order-last flex w-full flex-col items-stretch justify-center gap-2 sm:order-none sm:w-auto sm:flex-1 sm:flex-row sm:items-center">
          <ModeSwitch mode={mode} />
          {mode === 'verbi' && (
          <nav aria-label="Main" className="flex w-full rounded-xl border bg-muted p-1 sm:w-auto">
            {TABS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all sm:flex-none',
                    isActive
                      ? 'bg-card text-primary shadow-sm ring-1 ring-border'
                      : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="size-4" aria-hidden />
                    {label}
                    {isActive && (
                      <span aria-hidden className="absolute inset-x-4 -bottom-[3px] h-0.5 rounded-full bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          )}
        </div>

        <div className="flex items-center gap-1">
          <ProgressDialog />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </header>
  )
}
