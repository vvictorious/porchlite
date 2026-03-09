import { useRef, useState } from "react";
import type { PostBlock } from "@porchlite/shared";
import {
  useCreatePostMutation,
  useUploadPostImageMutation,
} from "@porchlite/api";

export const PostComposer = () => {
  const [blocks, setBlocks] = useState<PostBlock[]>([
    { type: "text", content: "" },
  ]);
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(
    new Set(),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingImageIndex = useRef<number | null>(null);

  const [createPost, { isLoading: isPosting }] = useCreatePostMutation();
  const [uploadPostImage] = useUploadPostImageMutation();

  const updateBlock = (index: number, block: PostBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? block : b)));
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const addTextBlock = () => {
    setBlocks((prev) => [...prev, { type: "text", content: "" }]);
  };

  const addImageBlock = () => {
    const newIndex = blocks.length;
    setBlocks((prev) => [...prev, { type: "image", url: "" }]);
    pendingImageIndex.current = newIndex;
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = pendingImageIndex.current;
    if (!file || index === null) return;

    e.target.value = "";

    setUploadingIndexes((prev) => new Set(prev).add(index));
    try {
      const url = await uploadPostImage(file).unwrap();
      updateBlock(index, { type: "image", url });
    } catch {
      removeBlock(index);
    } finally {
      setUploadingIndexes((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      pendingImageIndex.current = null;
    }
  };

  const hasContent = blocks.some((block) =>
    block.type === "text" ? block.content.trim() !== "" : block.url !== "",
  );

  const isUploading = uploadingIndexes.size > 0;
  const canSubmit = hasContent && !isPosting && !isUploading;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    const nonEmptyBlocks = blocks.filter((block) =>
      block.type === "text" ? block.content.trim() !== "" : block.url !== "",
    );

    try {
      await createPost(nonEmptyBlocks).unwrap();
      setBlocks([{ type: "text", content: "" }]);
    } catch {
      // Draft preserved so user doesn't lose their work
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <div key={index} className="group relative">
            {block.type === "text" ? (
              <textarea
                value={block.content}
                onChange={(e) =>
                  updateBlock(index, { type: "text", content: e.target.value })
                }
                placeholder="What's on your mind?"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50
                           text-stone-900 placeholder:text-stone-400 focus:outline-none
                           focus:ring-2 focus:ring-amber-500 focus:border-transparent
                           resize-none"
              />
            ) : (
              <div className="rounded-lg border border-stone-200 bg-stone-50 overflow-hidden">
                {uploadingIndexes.has(index) ? (
                  <div className="flex items-center justify-center py-8 text-sm text-stone-400">
                    Uploading image...
                  </div>
                ) : block.url ? (
                  <img
                    src={block.url}
                    alt=""
                    className="w-full max-h-80 object-cover"
                  />
                ) : null}
              </div>
            )}

            {blocks.length > 1 && (
              <button
                onClick={() => removeBlock(index)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-stone-200
                           text-stone-500 text-xs flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity
                           hover:bg-stone-300"
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
        <div className="flex gap-2">
          <button
            onClick={addTextBlock}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 rounded-lg
                       hover:bg-stone-100 transition-colors"
          >
            + Text
          </button>
          <button
            onClick={addImageBlock}
            disabled={isUploading}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 rounded-lg
                       hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            + Image
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="px-5 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium
                     hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
};
