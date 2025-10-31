import { gql } from "graphql-tag";

export const GET_POSTS = gql`
  query {
    posts {
      id
      title
      slug
      content
      thumbnail
      createdAt
    }
  }
`;
