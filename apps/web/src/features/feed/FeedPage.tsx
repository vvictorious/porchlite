import { useGetFeedQuery } from "@porchlite/api";
import { PostComposer } from "./PostComposer";
import { PostCard } from "./PostCard";

export const FeedPage = () => {
  const { data: posts, isLoading, error } = useGetFeedQuery();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <PostComposer />

      {isLoading && (
        <p className="text-stone-400 text-center py-8">Loading your feed...</p>
      )}

      {!!error && (
        <p className="text-red-600 text-center py-8">
          Something went wrong loading your feed.
        </p>
      )}

      {posts && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-stone-500">Your feed is empty.</p>
          <p className="mt-2 text-sm text-stone-400">
            Add some friends and share your first update!
          </p>
        </div>
      )}

      {posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
