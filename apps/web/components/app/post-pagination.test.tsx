import { render, screen } from "@testing-library/react";

import PostPagination from "./post-pagination";

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock the pagination UI components
jest.mock("@/components/ui/pagination", () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => <nav data-testid="pagination">{children}</nav>,
  PaginationContent: ({ children }: { children: React.ReactNode }) => (
    <ul data-testid="pagination-content">{children}</ul>
  ),
  PaginationItem: ({ children }: { children: React.ReactNode }) => <li data-testid="pagination-item">{children}</li>,
  PaginationLink: ({ children, href, isActive }: { children: React.ReactNode; href: string; isActive: boolean }) => (
    <a
      href={href}
      data-testid="pagination-link"
      className={isActive ? "active" : ""}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </a>
  ),
  PaginationPrevious: ({ href }: { href: string }) => (
    <a href={href} data-testid="pagination-previous">
      Previous
    </a>
  ),
  PaginationNext: ({ href }: { href: string }) => (
    <a href={href} data-testid="pagination-next">
      Next
    </a>
  ),
  PaginationEllipsis: () => <span data-testid="pagination-ellipsis">...</span>,
}));

// Mock the helpers
jest.mock("@/lib/helpers", () => ({
  calculatePageNumbers: jest.fn(({ pageNeighbors, totalPages, currentPage }) => {
    const totalNumbers = pageNeighbors * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbors);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbors);

      let pages: (number | string)[] = Array.from(
        {
          length: endPage - startPage + 1,
        },
        (_, i) => startPage + i
      );
      if (startPage > 2) pages = ["...", ...pages];
      if (endPage < totalPages - 1) pages = [...pages, "..."];

      return [1, ...pages, totalPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }),
}));

describe("PostPagination Component", () => {
  it("should render pagination component", () => {
    render(<PostPagination currentPage={1} totalPages={5} />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("should not render Previous button on first page", () => {
    render(<PostPagination currentPage={1} totalPages={5} />);

    expect(screen.queryByTestId("pagination-previous")).not.toBeInTheDocument();
  });

  it("should render Previous button on page 2", () => {
    render(<PostPagination currentPage={2} totalPages={5} />);

    expect(screen.getByTestId("pagination-previous")).toBeInTheDocument();
    expect(screen.getByTestId("pagination-previous")).toHaveAttribute("href", "?page=1");
  });

  it("should not render Next button on last page", () => {
    render(<PostPagination currentPage={5} totalPages={5} />);

    expect(screen.queryByTestId("pagination-next")).not.toBeInTheDocument();
  });

  it("should render Next button when not on last page", () => {
    render(<PostPagination currentPage={1} totalPages={5} />);

    expect(screen.getByTestId("pagination-next")).toBeInTheDocument();
    expect(screen.getByTestId("pagination-next")).toHaveAttribute("href", "?page=2");
  });

  it("should render page numbers for single page", () => {
    render(<PostPagination currentPage={1} totalPages={1} />);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should mark current page as active", () => {
    render(<PostPagination currentPage={2} totalPages={5} />);

    const activeLink = screen.getByRole("link", { current: "page" });
    expect(activeLink).toHaveClass("active");
    expect(activeLink).toHaveTextContent("2");
  });

  it("should render all page numbers for small total", () => {
    render(<PostPagination currentPage={1} totalPages={3} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render with ellipsis for large pagination", () => {
    render(<PostPagination currentPage={10} totalPages={20} />);

    const ellipsis = screen.queryAllByTestId("pagination-ellipsis");
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it("should always include first and last page numbers", () => {
    render(<PostPagination currentPage={1} totalPages={10} />);

    const links = screen.getAllByTestId("pagination-link");
    const pageNumbers = links.map((link) => link.textContent);

    expect(pageNumbers).toContain("1");
    expect(pageNumbers).toContain("10");
  });

  it("should render pagination with custom pageNeighbors", () => {
    render(<PostPagination currentPage={5} totalPages={15} pageNeighbors={3} />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("should handle single page correctly", () => {
    render(<PostPagination currentPage={1} totalPages={1} />);

    expect(screen.queryByTestId("pagination-previous")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pagination-next")).not.toBeInTheDocument();
  });

  it("should generate correct href for page links", () => {
    render(<PostPagination currentPage={1} totalPages={3} />);

    const page1Link = screen.getAllByTestId("pagination-link")[0];
    const page2Link = screen.getAllByTestId("pagination-link")[1];

    expect(page1Link).toHaveAttribute("href", "?page=1");
    expect(page2Link).toHaveAttribute("href", "?page=2");
  });
});
