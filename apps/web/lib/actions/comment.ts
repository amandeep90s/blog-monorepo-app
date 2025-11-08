"use server";

import { print } from "graphql";

import { Comment } from "@/types/modelTypes";

import { fetchGraphQL } from "../graphql/fetchQueries";
import { GET_POST_COMMENTS } from "../graphql/gqlQueries";

export async function getPostComments({ postId, skip, take }: { postId: string; skip: number; take: number }) {
  const data = await fetchGraphQL(print(GET_POST_COMMENTS), { postId, skip, take });

  return { comments: data.getPostComments as Comment[], count: data.postCommentCount as number };
}
