"use server";

import { print } from "graphql";

import { authFetchGraphQL, fetchGraphQL } from "../graphql/fetchQueries";
import { LIKE_POST_MUTATION, POST_LIKES_COUNT, UNLIKE_POST_MUTATION, USER_LIKED_POST } from "../graphql/gqlQueries";

export async function getPostLikeData(postId: string) {
  try {
    // Always fetch like count (no auth required)
    const likeCountData = await fetchGraphQL(print(POST_LIKES_COUNT), {
      postId,
    });

    // Only fetch user liked status if we can (with auth)
    let userLikedPost = false;
    try {
      const userLikedData = await authFetchGraphQL(print(USER_LIKED_POST), {
        postId,
      });
      userLikedPost = userLikedData.userLikedPost as boolean;
    } catch {
      // If auth fails (user not logged in), just use false
      userLikedPost = false;
    }

    return {
      likeCount: (likeCountData.postLikesCount as number) || 0,
      userLikedPost,
    };
  } catch {
    // Return safe defaults if everything fails
    return {
      likeCount: 0,
      userLikedPost: false,
    };
  }
}

export async function likePost(postId: string) {
  return await authFetchGraphQL(print(LIKE_POST_MUTATION), {
    postId,
  });
}

export async function unlikePost(postId: string) {
  return await authFetchGraphQL(print(UNLIKE_POST_MUTATION), {
    postId,
  });
}
