import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router'

export default function FeedPage() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">Porchlite</h1>
          <button
            onClick={handleSignOut}
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-lg text-stone-500">Your feed is empty.</p>
          <p className="mt-2 text-sm text-stone-400">
            Add some friends and share your first update!
          </p>
        </div>
      </main>
    </div>
  )
}
