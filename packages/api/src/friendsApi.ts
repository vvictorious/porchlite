import { api } from './api'
import { getSupabase } from './supabase'
import type { User, Friendship, DbUser, DbFriendship } from '@porchlite/shared'
import { mapUser, mapFriendship } from '@porchlite/shared'

interface FriendshipWithProfiles extends DbFriendship {
  requester: DbUser
  addressee: DbUser
}

export const friendsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: builder.query<User[], string>({
      queryFn: async (email) => {
        if (!email || email.length < 3) return { data: [] }

        const { data: { user: currentUser } } = await getSupabase().auth.getUser()
        if (!currentUser) return { error: { status: 'CUSTOM_ERROR' as const, error: 'Not authenticated' } }

        const { data, error } = await getSupabase()
          .from('profiles')
          .select('*')
          .ilike('email', `%${email}%`)
          .neq('id', currentUser.id)
          .limit(10)

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }
        return { data: (data as DbUser[]).map(mapUser) }
      },
    }),

    getFriends: builder.query<(Friendship & { friend: User })[], void>({
      queryFn: async () => {
        const { data: { user } } = await getSupabase().auth.getUser()
        if (!user) return { error: { status: 'CUSTOM_ERROR' as const, error: 'Not authenticated' } }

        const { data, error } = await getSupabase()
          .from('friendships')
          .select('*, requester:profiles!requester_id(*), addressee:profiles!addressee_id(*)')
          .eq('status', 'accepted')
          .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }

        const friendships = (data as FriendshipWithProfiles[]).map((row) => ({
          ...mapFriendship(row),
          friend: mapUser(row.requester.id === user.id ? row.addressee : row.requester),
        }))

        return { data: friendships }
      },
      providesTags: ['Friend'],
    }),

    getPendingRequests: builder.query<(Friendship & { requester: User })[], void>({
      queryFn: async () => {
        const { data: { user } } = await getSupabase().auth.getUser()
        if (!user) return { error: { status: 'CUSTOM_ERROR' as const, error: 'Not authenticated' } }

        const { data, error } = await getSupabase()
          .from('friendships')
          .select('*, requester:profiles!requester_id(*)')
          .eq('addressee_id', user.id)
          .eq('status', 'pending')

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }

        const requests = (data as (DbFriendship & { requester: DbUser })[]).map((row) => ({
          ...mapFriendship(row),
          requester: mapUser(row.requester),
        }))

        return { data: requests }
      },
      providesTags: ['Friend'],
    }),

    sendFriendRequest: builder.mutation<Friendship, string>({
      queryFn: async (addresseeId) => {
        const { data: { user } } = await getSupabase().auth.getUser()
        if (!user) return { error: { status: 'CUSTOM_ERROR' as const, error: 'Not authenticated' } }

        const { data, error } = await getSupabase()
          .from('friendships')
          .insert({ requester_id: user.id, addressee_id: addresseeId })
          .select()
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }
        return { data: mapFriendship(data as DbFriendship) }
      },
      invalidatesTags: ['Friend'],
    }),

    respondToRequest: builder.mutation<Friendship, { friendshipId: string; status: 'accepted' | 'declined' }>({
      queryFn: async ({ friendshipId, status }) => {
        const { data, error } = await getSupabase()
          .from('friendships')
          .update({ status })
          .eq('id', friendshipId)
          .select()
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }
        return { data: mapFriendship(data as DbFriendship) }
      },
      invalidatesTags: ['Friend'],
    }),
  }),
})

export const {
  useSearchUsersQuery,
  useGetFriendsQuery,
  useGetPendingRequestsQuery,
  useSendFriendRequestMutation,
  useRespondToRequestMutation,
} = friendsApi
