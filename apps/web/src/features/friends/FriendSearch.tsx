import { useState } from 'react'
import { useSearchUsersQuery, useSendFriendRequestMutation } from '@porchlite/api'

export const FriendSearch = () => {
  const [query, setQuery] = useState('')
  const { data: results = [], isFetching } = useSearchUsersQuery(query, {
    skip: query.length < 3,
  })
  const [sendRequest, { isLoading: isSending }] = useSendFriendRequestMutation()
  const [sentTo, setSentTo] = useState<Set<string>>(new Set())

  const handleSend = async (userId: string) => {
    try {
      await sendRequest(userId).unwrap()
      setSentTo((prev) => new Set(prev).add(userId))
    } catch {
      // Error is handled by RTK Query
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by email (type at least 3 characters)..."
        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-900
                   placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500
                   focus:border-transparent"
      />

      {isFetching && (
        <p className="text-sm text-stone-400">Searching...</p>
      )}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between bg-white rounded-lg border border-stone-200 px-4 py-3"
            >
              <div>
                <p className="font-medium text-stone-900">{user.displayName}</p>
                <p className="text-sm text-stone-500">{user.email}</p>
              </div>
              {sentTo.has(user.id) ? (
                <span className="text-sm text-stone-400">Sent</span>
              ) : (
                <button
                  onClick={() => handleSend(user.id)}
                  disabled={isSending}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-sm font-medium
                             hover:bg-amber-700 disabled:opacity-50 transition-colors"
                >
                  Add friend
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {query.length >= 3 && !isFetching && results.length === 0 && (
        <p className="text-sm text-stone-400">No users found for "{query}"</p>
      )}
    </div>
  )
}
