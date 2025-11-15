import { render, screen } from "@testing-library/react";

import TechStacksSection from "./tech-stacks";

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock tech-stack-icons
jest.mock("tech-stack-icons", () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div data-testid={`stack-icon-${name}`}>{name}</div>,
}));

// Mock Button component
jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    asChild,
    variant,
    size,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    variant?: string;
    size?: string;
  }) => {
    if (asChild) {
      return children;
    }
    return <button className={`btn btn-${variant} btn-${size}`}>{children}</button>;
  },
}));

describe("TechStacksSection Component", () => {
  it("should render tech stacks section heading", () => {
    render(<TechStacksSection />);

    expect(screen.getByText(/Built with Modern Technologies/i)).toBeInTheDocument();
  });

  it("should render description about tech stack", () => {
    render(<TechStacksSection />);

    expect(screen.getByText(/Powered by Next.js, NestJS, Prisma, and more/i)).toBeInTheDocument();
  });

  it("should render all technology stack icons", () => {
    render(<TechStacksSection />);

    expect(screen.getByTestId("stack-icon-nextjs2")).toBeInTheDocument();
    expect(screen.getByTestId("stack-icon-prisma")).toBeInTheDocument();
    expect(screen.getByTestId("stack-icon-nestjs")).toBeInTheDocument();
    expect(screen.getByTestId("stack-icon-typescript")).toBeInTheDocument();
    expect(screen.getByTestId("stack-icon-graphql")).toBeInTheDocument();
    expect(screen.getByTestId("stack-icon-jest")).toBeInTheDocument();
    expect(screen.getByTestId("stack-icon-tailwindcss")).toBeInTheDocument();
  });

  it("should render CTA button with correct link", () => {
    render(<TechStacksSection />);

    const ctaButton = screen.getByRole("link", { name: /Join the Community/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute("href", "/sign-up");
  });

  it("should mention full-stack TypeScript solution in description", () => {
    render(<TechStacksSection />);

    expect(screen.getByText(/full-stack TypeScript solution with GraphQL API/i)).toBeInTheDocument();
  });

  it("should render integration cards for tech icons", () => {
    render(<TechStacksSection />);

    // Check that icons are grouped
    const icons = screen.getAllByTestId(/stack-icon-/);
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should have proper section structure", () => {
    const { container } = render(<TechStacksSection />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });

  it("should render grid layout", () => {
    const { container } = render(<TechStacksSection />);

    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
  });
});
