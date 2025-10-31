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

  if (result.errors) {
    console.error("GraphQl errors:", result.errors);
    throw new Error("Failed to fetch the data from GraphQL");
  }

  return result.data;
};
