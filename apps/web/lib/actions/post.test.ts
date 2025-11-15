import { fetchGraphQL } from "../graphql/fetchQueries";
import { fetchPostBySlug, fetchPosts } from "./post";

// Mock the GraphQL fetch function
jest.mock("../graphql/fetchQueries", () => ({
  fetchGraphQL: jest.fn(),
}));

const mockFetchGraphQL = fetchGraphQL as jest.MockedFunction<typeof fetchGraphQL>;

describe("Post Actions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchPosts", () => {
    it("should fetch posts with default pagination", async () => {
      const mockPosts = [
        { id: "1", title: "Post 1", slug: "post-1" },
        { id: "2", title: "Post 2", slug: "post-2" },
      ];
      const mockResponse = {
        posts: mockPosts,
        postsCount: 10,
      };

      mockFetchGraphQL.mockResolvedValue(mockResponse);

      const result = await fetchPosts({});

      expect(result.posts).toEqual(mockPosts);
      expect(result.totalPosts).toBe(10);
      expect(mockFetchGraphQL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          skip: expect.any(Number),
          take: expect.any(Number),
        })
      );
    });

    it("should fetch posts with custom pagination", async () => {
      const mockResponse = {
        posts: [],
        postsCount: 0,
      };

      mockFetchGraphQL.mockResolvedValue(mockResponse);

      await fetchPosts({ page: 2, pageSize: 5 });

      expect(mockFetchGraphQL).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          skip: 5,
          take: 5,
        })
      );
    });
  });

  describe("fetchPostBySlug", () => {
    it("should fetch a single post by slug", async () => {
      const mockPost = {
        id: "1",
        title: "Test Post",
        slug: "test-post",
        content: "Test content",
      };

      mockFetchGraphQL.mockResolvedValue({
        getPostBySlug: mockPost,
      });

      const result = await fetchPostBySlug("test-post");

      expect(result).toEqual(mockPost);
      expect(mockFetchGraphQL).toHaveBeenCalledWith(expect.any(String), { slug: "test-post" });
    });

    it("should handle non-existent post", async () => {
      mockFetchGraphQL.mockResolvedValue({
        getPostBySlug: null,
      });

      await expect(fetchPostBySlug("non-existent")).rejects.toThrow(
        'Failed to fetch post: Post with slug "non-existent" not found'
      );
    });
  });
});
