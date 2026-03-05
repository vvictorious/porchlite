export interface User {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface Post {
  id: string
  author_id: string
  text: string
  image_url: string | null
  created_at: string
  author?: User
}

export type FriendshipStatus = 'pending' | 'accepted' | 'declined'

export interface Friendship {
  id: string
  requester_id: string
  addressee_id: string
  status: FriendshipStatus
  created_at: string
}
