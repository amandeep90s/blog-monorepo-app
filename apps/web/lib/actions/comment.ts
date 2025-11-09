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
  const validatedFields = CommentFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);

    return {
      data: Object.fromEntries(formData.entries()),
      errors: flattened.fieldErrors,
    };
  }

  const data = await authFetchGraphQL(print(CREATE_COMMENT_MUTATION), { input: { ...validatedFields.data } });

  if (data.errors) {
    return {
      data: Object.fromEntries(formData.entries()),
      message: data.errors?.[0]?.message ?? "Something went wrong",
      ok: false,
      open: true,
    };
  }

  return {
    message: "Success! Your comment saved!",
    ok: true,
    open: false,
  };
}
