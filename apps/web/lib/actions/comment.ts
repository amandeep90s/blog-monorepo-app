"use server";

import { print } from "graphql";
import z from "zod";

import { Comment } from "@/types/modelTypes";
import { CommentFormState } from "@/lib/types/formState";

import { authFetchGraphQL, fetchGraphQL } from "../graphql/fetchQueries";
import { CREATE_COMMENT_MUTATION, GET_POST_COMMENTS } from "../graphql/gqlQueries";
import { CommentFormSchema } from "../schemas/commentFormSchema";

/**
 * Fetch comments for a specific post with pagination.
 */
export async function getPostComments({ postId, skip, take }: { postId: string; skip: number; take: number }) {
  const data = await fetchGraphQL(print(GET_POST_COMMENTS), { postId, skip, take });

  return { comments: data.getPostComments as Comment[], count: data.postCommentCount as number };
}

/**
 * Save a new comment.
 */
export async function saveComment(state: CommentFormState, formData: FormData): Promise<CommentFormState> {
  // Validate form fields
  const validatedFields = CommentFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);

    return {
      data: Object.fromEntries(formData.entries()),
      errors: flattened.fieldErrors,
    };
  }

  try {
    const data = await authFetchGraphQL(print(CREATE_COMMENT_MUTATION), { input: { ...validatedFields.data } });

    if (data.errors) {
      return {
        data: Object.fromEntries(formData.entries()),
        message: data.errors?.[0]?.message ?? "Failed to save comment. Please try again.",
        ok: false,
      };
    }

    return {
      message: "Your comment has been added successfully!",
      ok: true,
    };
  } catch (error) {
    console.error("Error saving comment:", error);
    return {
      data: Object.fromEntries(formData.entries()),
      message: "An unexpected error occurred. Please try again.",
      ok: false,
    };
  }
}
