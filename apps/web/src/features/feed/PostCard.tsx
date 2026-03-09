import type { Post } from '@porchlite/shared'
import { useDeletePostMutation } from '@porchlite/api'
import { useAuth } from '../auth/useAuth'

const timeAgo = (dateString: string): string => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)

  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ]

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`
  }

  return 'just now'
}

interface PostCardProps {
  post: Post
}

export const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth()
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation()

  const isAuthor = user?.id === post.authorId
  const authorInitial = post.author?.displayName?.charAt(0).toUpperCase() ?? '?'

  return (
    <article className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          {post.author?.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-700">
              {authorInitial}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-stone-900">
              {post.author?.displayName ?? 'Unknown'}
            </p>
            <p className="text-xs text-stone-400">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {isAuthor && (
          <button
            onClick={() => deletePost(post.id)}
            disabled={isDeleting}
            className="text-xs text-stone-400 hover:text-red-500 transition-colors
                       disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>

      <div>
        {post.content.map((block, index) =>
          block.type === 'text' ? (
            <p key={index} className="px-5 py-2 text-stone-700 whitespace-pre-wrap">
              {block.content}
            </p>
          ) : (
            <img
              key={index}
              src={block.url}
              alt=""
              className="w-full max-h-[32rem] object-cover my-2"
            />
          ),
        )}
      </div>

      <div className="pb-4" />
    </article>
  )
}