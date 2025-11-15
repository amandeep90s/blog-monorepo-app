import { render, screen } from "@testing-library/react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

describe("Card Component", () => {
  it("should render card with all subcomponents", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
    expect(screen.getByText("Card Footer")).toBeInTheDocument();
  });

  it("should apply custom className to Card", () => {
    const { container } = render(
      <Card className="custom-card-class">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = container.firstChild;
    expect(card).toHaveClass("custom-card-class");
  });

  it("should render CardHeader with custom className", () => {
    const { container } = render(
      <Card>
        <CardHeader className="custom-header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    );

    expect(container.querySelector(".custom-header")).toBeInTheDocument();
  });

  it("should render without optional components", () => {
    render(
      <Card>
        <CardContent>Just content</CardContent>
      </Card>
    );

    expect(screen.getByText("Just content")).toBeInTheDocument();
  });
});
