import { BACKEND_URL } from "@/constants/app";

import { getSession } from "../session";

/**
 * Fetch data from GraphQL endpoint
 * @param query
 * @param variables
 * @returns
 */
export const fetchGraphQL = async (query: string, variables = {}) => {
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  return result.errors ? result : result.data;
};

/**
 * Fetch data from GraphQL endpoint with authentication
 * @param query
 * @param variables
 * @returns
 */
export const authFetchGraphQL = async (query: string, variables = {}) => {
  const session = await getSession();

  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  return result.errors ? result : result.data;
};
