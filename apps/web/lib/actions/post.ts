"use server";

import { print } from "graphql";

import { Post } from "@/types/modelTypes";

import { fetchGraphQL } from "../graphql/fetchQueries";
import { GET_POSTS } from "../graphql/gqlQueries";
import { transformTakeSkip } from "../helpers";

export const fetchPosts = async ({ page, pageSize }: { page?: number; pageSize?: number }) => {
  const { skip, take } = transformTakeSkip({ page, pageSize });
  const data = await fetchGraphQL(print(GET_POSTS), { skip, take });

  return { posts: data.posts as Post[], totalPosts: data.postsCount };
};
