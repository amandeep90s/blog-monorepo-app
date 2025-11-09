"use server";

import { print } from "graphql";

import { Post } from "@/types/modelTypes";

import { fetchGraphQL } from "../graphql/fetchQueries";
import { GET_POST_BY_SLUG, GET_POSTS } from "../graphql/gqlQueries";
import { transformTakeSkip } from "../helpers";

/**
 * Fetch a paginated list of posts
 * @param page
 * @param pageSize
 * @returns
 */
export const fetchPosts = async ({ page, pageSize }: { page?: number; pageSize?: number }) => {
  const { skip, take } = transformTakeSkip({ page, pageSize });
  const data = await fetchGraphQL(print(GET_POSTS), { skip, take });

  return { posts: data.posts as Post[], totalPosts: data.postsCount };
};

/**
 * Fetch a single post by its slug
 * @param slug
 * @returns
 */
export const fetchPostBySlug = async (slug: string) => {
  try {
    const data = await fetchGraphQL(print(GET_POST_BY_SLUG), { slug });

    if (!data.getPostBySlug) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    return data.getPostBySlug as Post;
  } catch (error) {
    throw new Error(`Failed to fetch post: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
