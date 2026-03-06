import { api } from './api'
import { getSupabase } from './supabase'
import type { User, DbUser } from '@porchlite/shared'
import { mapUser } from '@porchlite/shared'

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<User, string>({
      queryFn: async (userId) => {
        const { data, error } = await getSupabase()
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }
        return { data: mapUser(data as DbUser) }
      },
      providesTags: (_result, _error, userId) => [{ type: 'Profile', id: userId }],
    }),

    updateProfile: builder.mutation<User, { userId: string; updates: Partial<Pick<User, 'displayName' | 'bio' | 'avatarUrl'>> }>({
      queryFn: async ({ userId, updates }) => {
        const dbUpdates: Partial<DbUser> = {}
        if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName
        if (updates.bio !== undefined) dbUpdates.bio = updates.bio
        if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl

        const { data, error } = await getSupabase()
          .from('profiles')
          .update(dbUpdates)
          .eq('id', userId)
          .select()
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }
        return { data: mapUser(data as DbUser) }
      },
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'Profile', id: userId }],
    }),
  }),
})

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi
