import { NavLink, Outlet, useNavigate } from 'react-router'
import { getSupabase } from '@porchlite/api'

const navItems = [
  { to: '/', label: 'Feed' },
  { to: '/friends', label: 'Friends' },
  { to: '/profile', label: 'Profile' },
]

export const Layout = () => {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await getSupabase().auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Porchlite</h1>

          <nav className="flex items-center gap-6">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-amber-600' : 'text-stone-500 hover:text-stone-700'
                  }`
                }
                end={to === '/'}
              >
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleSignOut}
              className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
