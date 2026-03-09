import type { DbUser, DbPost, DbFriendship, User, Post, Friendship } from './types'

export const mapUser = (db: DbUser): User => ({
  id: db.id,
  email: db.email,
  displayName: db.display_name,
  avatarUrl: db.avatar_url,
  bio: db.bio,
  createdAt: db.created_at,
})

export const mapPost = (db: DbPost & { profiles?: DbUser }): Post => ({
  id: db.id,
  authorId: db.author_id,
  content: db.content,
  createdAt: db.created_at,
  author: db.profiles ? mapUser(db.profiles) : undefined,
})

export const mapFriendship = (db: DbFriendship): Friendship => ({
  id: db.id,
  requesterId: db.requester_id,
  addresseeId: db.addressee_id,
  status: db.status,
  createdAt: db.created_at,
})