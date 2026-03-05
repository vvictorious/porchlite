import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Base API slice using fakeBaseQuery. Each endpoint writes its own queryFn
 * that calls Supabase directly — this keeps things explicit and easy to follow.
 * Feature-specific endpoints are injected via `api.injectEndpoints()` in their
 * own files (e.g. features/auth/authApi.ts, features/posts/postsApi.ts).
 */
export const api = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Post', 'Profile', 'Friend'],
  endpoints: () => ({}),
})
