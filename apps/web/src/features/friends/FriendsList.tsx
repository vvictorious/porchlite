import { useGetFriendsQuery } from '@porchlite/api'

export const FriendsList = () => {
  const { data: friends = [], isLoading } = useGetFriendsQuery()

  if (isLoading) {
    return <p className="text-sm text-stone-400">Loading friends...</p>
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-stone-500">No friends yet.</p>
        <p className="text-sm text-stone-400 mt-1">
          Search for friends by email above!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
        Friends ({friends.length})
      </h3>
      <ul className="space-y-2">
        {friends.map((friendship) => (
          <li
            key={friendship.id}
            className="flex items-center gap-3 bg-white rounded-lg border border-stone-200 px-4 py-3"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700">
              {friendship.friend.displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-stone-900">{friendship.friend.displayName}</p>
              <p className="text-sm text-stone-500">{friendship.friend.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
