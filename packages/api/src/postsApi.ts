import { api } from './api'
import { getSupabase } from './supabase'
import type { Post, PostBlock, DbPost, DbUser } from '@porchlite/shared'
import { mapPost } from '@porchlite/shared'

interface DbPostWithProfile extends DbPost {
  profiles: DbUser
}

export const postsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFeed: builder.query<Post[], void>({
      queryFn: async () => {
        const { data, error } = await getSupabase()
          .from('posts')
          .select('*, profiles(*)')
          .order('created_at', { ascending: false })

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }
        return { data: (data as DbPostWithProfile[]).map(mapPost) }
      },
      providesTags: ['Post'],
    }),

    createPost: builder.mutation<Post, PostBlock[]>({
      queryFn: async (content) => {
        const { data: { user } } = await getSupabase().auth.getUser()
        if (!user) return { error: { status: 'CUSTOM_ERROR' as const, error: 'Not authenticated' } }

        const { data, error } = await getSupabase()
          .from('posts')
          .insert({ author_id: user.id, content })
          .select('*, profiles(*)')
          .single()

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }
        return { data: mapPost(data as DbPostWithProfile) }
      },
      invalidatesTags: ['Post'],
    }),

    deletePost: builder.mutation<void, string>({
      queryFn: async (postId) => {
        const { error } = await getSupabase()
          .from('posts')
          .delete()
          .eq('id', postId)

        if (error) return { error: { status: 'CUSTOM_ERROR' as const, error: error.message } }
        return { data: undefined }
      },
      invalidatesTags: ['Post'],
    }),

    uploadPostImage: builder.mutation<string, File>({
      queryFn: async (file) => {
        const ext = file.name.split('.').pop()
        const path = `${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await getSupabase()
          .storage
          .from('post-images')
          .upload(path, file)

        if (uploadError) return { error: { status: 'CUSTOM_ERROR' as const, error: uploadError.message } }

        const { data: { publicUrl } } = getSupabase()
          .storage
          .from('post-images')
          .getPublicUrl(path)

        return { data: publicUrl }
      },
    }),
  }),
})

export const {
  useGetFeedQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUploadPostImageMutation,
} = postsApi