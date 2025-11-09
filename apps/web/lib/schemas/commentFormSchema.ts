import { z } from "zod";

export const CommentFormSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment cannot exceed 500 characters"),
  postId: z.string().min(1, "Post ID cannot be empty"),
});
