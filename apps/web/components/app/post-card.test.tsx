import { render, screen } from "@testing-library/react";

import { Post } from "@/types/modelTypes";

import PostCard from "./post-card";

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

describe("PostCard Component", () => {
  const mockPost: Post = {
    id: "1",
    title: "Test Blog Post Title",
    slug: "test-blog-post",
    content: "This is a test blog post content that should be displayed in the card.",
    thumbnail: "/test-image.jpg",
    published: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    authorId: "author-1",
    author: {
      id: "author-1",
      name: "Test Author",
      email: "author@test.com",
      avatar: "/avatar.jpg",
      bio: "Test bio",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    tags: [],
    _count: {
      likes: 0,
      comments: 0,
    },
  };

  it("should render post card with all elements", () => {
    render(<PostCard post={mockPost} />);

    // Check if title is rendered
    expect(screen.getByText(/Test Blog Post Title/i)).toBeInTheDocument();

    // Check if content is rendered
    expect(screen.getByText(/This is a test blog post content/i)).toBeInTheDocument();

    // Check if image is rendered
    const image = screen.getByAltText("Test Blog Post Title");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");

    // Check if "Read More" button is rendered
    expect(screen.getByText(/Read More/i)).toBeInTheDocument();
  });

  it("should render with correct link to blog post", () => {
    render(<PostCard post={mockPost} />);

    const link = screen.getByRole("link", { name: /Read More/i });
    expect(link).toHaveAttribute("href", "/blog/test-blog-post");
  });

  it("should display relative time", () => {
    render(<PostCard post={mockPost} />);

    // The time element should be present
    const timeElement = screen.getByText(/ago/i);
    expect(timeElement).toBeInTheDocument();
  });

  it("should handle post without thumbnail", () => {
    const postWithoutThumbnail = { ...mockPost, thumbnail: null };
    render(<PostCard post={postWithoutThumbnail} />);

    const image = screen.getByAltText("Test Blog Post Title");
    expect(image).toHaveAttribute("src", "/no-image.png");
  });

  it("should truncate long content", () => {
    const longContent = "A".repeat(200);
    const postWithLongContent = { ...mockPost, content: longContent };

    render(<PostCard post={postWithLongContent} />);

    // Content should be truncated (100 chars limit)
    const contentElement = screen.getByTitle(longContent);
    expect(contentElement.textContent?.length).toBeLessThanOrEqual(103); // 100 + "..."
  });

  it("should display likes and comments count", () => {
    const postWithEngagement = {
      ...mockPost,
      _count: {
        likes: 42,
        comments: 8,
      },
    };

    render(<PostCard post={postWithEngagement} />);

    // Check if likes count is displayed
    expect(screen.getByText("42")).toBeInTheDocument();

    // Check if comments count is displayed
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("should display zero likes and comments when no engagement", () => {
    render(<PostCard post={mockPost} />);

    // Both should show 0
    const zeroElements = screen.getAllByText("0");
    expect(zeroElements.length).toBeGreaterThanOrEqual(2);
  });

  it("should render disabled button when post has no slug", () => {
    const postWithoutSlug = { ...mockPost, slug: null };
    render(<PostCard post={postWithoutSlug} />);

    const disabledButton = screen.getByRole("button", { name: /No Slug Available/i });
    expect(disabledButton).toBeDisabled();
  });
});
