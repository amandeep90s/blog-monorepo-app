"use server";

import { print } from "graphql";

import { Post } from "@/types/modelTypes";

import { fetchGraphQL } from "../graphql/fetchQueries";
import { GET_POSTS } from "../graphql/gqlQueries";

export const fetchPosts = async () => {
  const data = await fetchGraphQL(print(GET_POSTS));

  return data.posts as Post[];
};
