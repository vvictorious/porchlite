import { FriendSearch } from './FriendSearch'
import { PendingRequests } from './PendingRequests'
import { FriendsList } from './FriendsList'

export const FriendsPage = () => {
  return (
    <div className="max-w-md mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-stone-900">Friends</h2>

      <section>
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
          Find Friends
        </h3>
        <FriendSearch />
      </section>

      <PendingRequests />

      <FriendsList />
    </div>
  )
}
