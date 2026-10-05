import { Compass, House, Plus } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/', label: '홈', icon: House, end: true },
  { to: '/series', label: '탐색', icon: Compass, end: true },
  { to: '/series/new', label: '작품 등록', icon: Plus },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/60">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <rect x="9" y="3" width="14" height="26" rx="3" fill="var(--primary)" />
        <path d="M14 12.5v7l5.5-3.5z" fill="var(--background)" />
      </svg>
      <span className="font-display text-xl tracking-tight">다음화</span>
    </Link>
  )
}

export default function Layout() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />
          <nav aria-label="주요 메뉴" className="hidden items-center gap-1 md:flex">
            {NAV.slice(0, 2).map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn('rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground', isActive && 'font-semibold text-foreground')
                }
              >
                {label}
              </NavLink>
            ))}
            <Button asChild className="ml-2">
              <Link to="/series/new">
                <Plus data-icon="inline-start" />
                작품 등록
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-8 pb-28 md:pb-16">
        <Outlet />
      </main>

      {/* 모바일: 하단 탭 바 */}
      <nav aria-label="주요 메뉴" className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="grid grid-cols-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn('flex flex-col items-center gap-1 py-2.5 text-xs text-muted-foreground', isActive && 'text-primary')
                }
              >
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
