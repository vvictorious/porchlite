import type { DbUser, DbPost, DbFriendship, User, Post, Friendship } from './types'

export function mapUser(db: DbUser): User {
  return {
    id: db.id,
    email: db.email,
    displayName: db.display_name,
    avatarUrl: db.avatar_url,
    bio: db.bio,
    createdAt: db.created_at,
  }
}

export function mapPost(db: DbPost & { profiles?: DbUser }): Post {
  return {
    id: db.id,
    authorId: db.author_id,
    text: db.text,
    imageUrl: db.image_url,
    createdAt: db.created_at,
    author: db.profiles ? mapUser(db.profiles) : undefined,
  }
}

export function mapFriendship(db: DbFriendship): Friendship {
  return {
    id: db.id,
    requesterId: db.requester_id,
    addresseeId: db.addressee_id,
    status: db.status,
    createdAt: db.created_at,
  }
}
