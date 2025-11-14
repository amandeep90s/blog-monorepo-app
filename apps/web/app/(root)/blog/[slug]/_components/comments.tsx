"use client";

import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/app";
import { useQuery } from "@tanstack/react-query";

import { getPostComments } from "@/lib/actions/comment";
import { SessionUser } from "@/lib/session";

import { AddComment } from "./add-comment";
import { CommentCard } from "./comment-card";
import CommentPagination from "./comment-pagination";
import { CommentCardSkeleton } from "./commet-card-skeleton";

type CommentsProps = {
  postId: string;
  user?: SessionUser;
};

export const Comments = ({ postId, user }: CommentsProps) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["GET_POST_COMMENTS", postId, page],
    queryFn: async () => {
      return await getPostComments({ postId, skip: (page - 1) * DEFAULT_PAGE_SIZE, take: DEFAULT_PAGE_SIZE });
    },
    retry: 1,
  });

  const totalPages = Math.ceil((data?.count ?? 0) / DEFAULT_PAGE_SIZE);
  const comments = data?.comments ?? [];

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600">Error loading comments: {error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <CommentCardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comments ({data?.count ?? 0})</h3>
      </div>
      {!!user && <AddComment postId={postId} user={user} refetchComments={refetch} />}

      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {totalPages > 1 && <CommentPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
};
