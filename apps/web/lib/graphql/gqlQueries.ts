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
