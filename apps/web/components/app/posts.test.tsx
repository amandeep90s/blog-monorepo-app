import { render, screen } from "@testing-library/react";

import { Post } from "@/types/modelTypes";

import Posts from "./posts";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock PostCard component
jest.mock("./post-card", () => ({
  __esModule: true,
  default: ({ post }: { post: Post }) => <div data-testid={`post-card-${post.id}`}>{post.title}</div>,
}));

// Mock PostPagination component
jest.mock("./post-pagination", () => ({
  __esModule: true,
  default: ({ currentPage, totalPages }: { currentPage: number; totalPages: number }) => (
    <div data-testid="post-pagination">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

describe("Posts Component", () => {
  const mockPosts: Post[] = [
    {
      id: "1",
      title: "First Post",
      slug: "first-post",
      content: "Content 1",
      thumbnail: "/img1.jpg",
      published: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      authorId: "author-1",
      author: {
        id: "author-1",
        name: "Author",
        email: "author@test.com",
        avatar: "/avatar.jpg",
        bio: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      tags: [],
      _count: {
        likes: 5,
        comments: 2,
      },
    },
    {
      id: "2",
      title: "Second Post",
      slug: "second-post",
      content: "Content 2",
      thumbnail: "/img2.jpg",
      published: true,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      authorId: "author-1",
      author: {
        id: "author-1",
        name: "Author",
        email: "author@test.com",
        avatar: "/avatar.jpg",
        bio: null,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      tags: [],
      _count: {
        likes: 10,
        comments: 5,
      },
    },
  ];

  it("should render the section with heading", () => {
    render(<Posts posts={mockPosts} currentPage={1} totalPages={5} />);

    expect(screen.getByText(/Latest Posts from Our Community/i)).toBeInTheDocument();
    expect(screen.getByText(/Discover insights, tutorials, and stories/i)).toBeInTheDocument();
  });

  it("should render all post cards", () => {
    render(<Posts posts={mockPosts} currentPage={1} totalPages={5} />);

    expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("post-card-2")).toBeInTheDocument();
  });

  it("should render post titles in cards", () => {
    render(<Posts posts={mockPosts} currentPage={1} totalPages={5} />);

    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
  });

  it("should render pagination component with correct props", () => {
    render(<Posts posts={mockPosts} currentPage={2} totalPages={5} />);

    expect(screen.getByTestId("post-pagination")).toBeInTheDocument();
    expect(screen.getByText(/Page 2 of 5/i)).toBeInTheDocument();
  });

  it("should render pagination for page 1", () => {
    render(<Posts posts={mockPosts} currentPage={1} totalPages={3} />);

    expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument();
  });

  it("should handle empty posts array", () => {
    render(<Posts posts={[]} currentPage={1} totalPages={1} />);

    expect(screen.getByText(/Latest Posts from Our Community/i)).toBeInTheDocument();
    expect(screen.queryByTestId(/post-card/)).not.toBeInTheDocument();
  });

  it("should render with grid layout", () => {
    const { container } = render(<Posts posts={mockPosts} currentPage={1} totalPages={5} />);

    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass("gap-3", "sm:grid-cols-2", "lg:grid-cols-3");
  });

  it("should handle single post", () => {
    const singlePost = [mockPosts[0]];
    render(<Posts posts={singlePost} currentPage={1} totalPages={1} />);

    expect(screen.getByTestId("post-card-1")).toBeInTheDocument();
    expect(screen.queryByTestId("post-card-2")).not.toBeInTheDocument();
  });

  it("should render pagination on last page", () => {
    render(<Posts posts={mockPosts} currentPage={5} totalPages={5} />);

    expect(screen.getByText(/Page 5 of 5/i)).toBeInTheDocument();
  });
});
