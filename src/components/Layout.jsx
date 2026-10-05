import { NavLink, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/', label: '홈', end: true },
  { to: '/books', label: '책 목록', end: true },
  { to: '/books/new', label: '새 기록' },
]

export default function Layout() {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <NavLink to="/" className="logo">
            책갈피
          </NavLink>
          <nav className="nav" aria-label="주요 메뉴">
            {NAV.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className="nav-link">
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
    </>
  )
}
