// Frontend types — camelCase, used by React components
export interface User {
  id: string
  email: string
  displayName: string
  avatarUrl: string | null
  bio: string | null
  createdAt: string
}

// Block types for post content
export interface TextBlock {
  type: 'text'
  content: string
}

export interface ImageBlock {
  type: 'image'
  url: string
}

export type PostBlock = TextBlock | ImageBlock

export interface Post {
  id: string
  authorId: string
  content: PostBlock[]
  createdAt: string
  author?: User
}

export type FriendshipStatus = 'pending' | 'accepted' | 'declined'

export interface Friendship {
  id: string
  requesterId: string
  addresseeId: string
  status: FriendshipStatus
  createdAt: string
}

// Database types — snake_case, matching Supabase/Postgres columns
export interface DbUser {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface DbPost {
  id: string
  author_id: string
  content: PostBlock[]
  created_at: string
}

export interface DbFriendship {
  id: string
  requester_id: string
  addressee_id: string
  status: FriendshipStatus
  created_at: string
}