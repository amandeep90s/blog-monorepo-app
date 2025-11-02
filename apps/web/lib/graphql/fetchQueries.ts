import { BACKEND_URL } from "@/constants/app";

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
