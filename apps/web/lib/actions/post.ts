"use server";

import { print } from "graphql";
import z from "zod";

import { Post } from "@/types/modelTypes";

import { authFetchGraphQL, fetchGraphQL } from "../graphql/fetchQueries";
import {
  CREATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POST_BY_SLUG,
  GET_POSTS,
  GET_USER_POSTS,
  UPDATE_POST_MUTATION,
} from "../graphql/gqlQueries";
import { transformTakeSkip } from "../helpers";
import { PostFormSchema } from "../schemas/postFormSchema";
import { PostFormState } from "../types/formState";

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

export const fetchPostById = async (id: string) => {
  try {
    const data = await fetchGraphQL(print(GET_POST_BY_ID), { id });

    if (!data.getPostById) {
      throw new Error(`Post with id "${id}" not found`);
    }

    return data.getPostById as Post;
  } catch (error) {
    throw new Error(`Failed to fetch post: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

/**
 * Fetch posts created by the authenticated user
 * @param param0
 * @returns
 */
export const fetchUserPosts = async ({ page, pageSize }: { page?: number; pageSize: number }) => {
  const { skip, take } = transformTakeSkip({ page, pageSize });

  const data = await authFetchGraphQL(print(GET_USER_POSTS), { skip, take });

  return {
    posts: data.getUserPosts as Post[],
    totalPosts: data.userPostCount as number,
  };
};

/**
 * Save a new post
 * @param state
 * @param formData
 */
export const saveNewPost = async (state: PostFormState, formData: FormData): Promise<PostFormState> => {
  const formObject = Object.fromEntries(formData.entries());

  const validatedFields = PostFormSchema.safeParse(formObject);

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);

    return {
      data: formObject,
      errors: flattened.fieldErrors,
    };
  }

  // Generate slug from title
  const slug = validatedFields.data.title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  const thumbnailUrl = "";
  // TODO: Upload thumbnail to supabase

  // Remove id field for new post creation and prepare the input
  const { id, ...postData } = validatedFields.data;
  const createPostInput = {
    ...postData,
    slug,
    thumbnail: thumbnailUrl,
  };

  try {
    const data = await authFetchGraphQL(print(CREATE_POST_MUTATION), {
      input: createPostInput,
    });

    if (data?.createPost?.id) {
      return { message: "Post created successfully!", ok: true };
    } else {
      return { message: "Failed to create post", ok: false };
    }
  } catch (error) {
    console.error("Error creating post:", error);

    // Don't treat Next.js redirect as an error
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return { message: "Post created successfully!", ok: true };
    }

    return {
      message: `Failed to create post: ${error instanceof Error ? error.message : "Unknown error"}`,
      ok: false,
    };
  }
};

/**
 * Update an existing post
 * @param state
 * @param formData
 */
export const updatePost = async (state: PostFormState, formData: FormData): Promise<PostFormState> => {
  const validatedFields = PostFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    const flattened = z.flattenError(validatedFields.error);

    return {
      data: Object.fromEntries(formData.entries()),
      errors: flattened.fieldErrors,
    };
  }

  const thumbnailUrl = "";
  // Todo:Upload Thumbnail to supabase

  const data = await authFetchGraphQL(print(UPDATE_POST_MUTATION), {
    input: {
      ...validatedFields.data,
      ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
    },
  });

  let response;
  if (data) {
    response = { message: "Post updated successfully", ok: true };
  } else {
    response = { message: "Failed to update post", ok: false };
  }

  return response;
};

/**
 * Delete a post by its ID
 * @param postId
 */
export const deletePost = async (postId: string) => {
  const data = await authFetchGraphQL(print(DELETE_POST_MUTATION), { postId });

  return data.removePost;
};
