import { useGetPendingRequestsQuery, useRespondToRequestMutation } from '@porchlite/api'

export const PendingRequests = () => {
  const { data: requests = [], isLoading } = useGetPendingRequestsQuery()
  const [respond, { isLoading: isResponding }] = useRespondToRequestMutation()

  if (isLoading) {
    return <p className="text-sm text-stone-400">Loading requests...</p>
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">
        Pending Requests ({requests.length})
      </h3>
      <ul className="space-y-2">
        {requests.map((request) => (
          <li
            key={request.id}
            className="flex items-center justify-between bg-amber-50 rounded-lg border border-amber-200 px-4 py-3"
          >
            <div>
              <p className="font-medium text-stone-900">{request.requester.displayName}</p>
              <p className="text-sm text-stone-500">{request.requester.email}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => respond({ friendshipId: request.id, status: 'accepted' })}
                disabled={isResponding}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-sm font-medium
                           hover:bg-amber-700 disabled:opacity-50 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => respond({ friendshipId: request.id, status: 'declined' })}
                disabled={isResponding}
                className="px-3 py-1.5 rounded-lg text-stone-600 text-sm font-medium
                           hover:bg-stone-100 disabled:opacity-50 transition-colors"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
