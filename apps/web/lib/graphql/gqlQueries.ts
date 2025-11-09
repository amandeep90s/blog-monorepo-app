import { gql } from "graphql-tag";

export const GET_POSTS = gql`
  query posts($skip: Float, $take: Float) {
    posts(skip: $skip, take: $take) {
      id
      title
      slug
      content
      thumbnail
      createdAt
    }
    postsCount
  }
`;

export const GET_POST_BY_SLUG = gql`
  query getPostBySlug($slug: String!) {
    getPostBySlug(slug: $slug) {
      id
      title
      slug
      thumbnail
      content
      createdAt
      published
      author {
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(createUserInput: $input) {
      id
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation signIn($input: SignInInput!) {
    signIn(signInInput: $input) {
      id
      name
      email
      avatar
      accessToken
    }
  }
`;

export const GET_POST_COMMENTS = gql`
  query getPostComments($postId: String!, $take: Int, $skip: Int) {
    getPostComments(postId: $postId, take: $take, skip: $skip) {
      id
      content
      createdAt
      author {
        id
        name
        avatar
      }
    }

    postCommentCount(postId: $postId)
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(createCommentInput: $input) {
      id
    }
  }
`;

export const POST_LIKES_COUNT = gql`
  query PostLikesCount($postId: String!) {
    postLikesCount: getPostLikesCount(postId: $postId)
  }
`;

export const USER_LIKED_POST = gql`
  query UserLikedPost($postId: String!) {
    userLikedPost: getUserLikedPost(postId: $postId)
  }
`;

export const POST_LIKES = gql`
  query PostLikeData($postId: String!) {
    postLikesCount: getPostLikesCount(postId: $postId)
    userLikedPost: getUserLikedPost(postId: $postId)
  }
`;

export const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: String!) {
    likePost(postId: $postId)
  }
`;

export const UNLIKE_POST_MUTATION = gql`
  mutation UnlikePost($postId: String!) {
    unlikePost(postId: $postId)
  }
`;
