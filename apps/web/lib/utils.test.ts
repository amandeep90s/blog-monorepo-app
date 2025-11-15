import { cn } from "./utils";

describe("Utils", () => {
  describe("cn - className utility function", () => {
    it("should merge single class", () => {
      expect(cn("px-2")).toBe("px-2");
    });

    it("should merge multiple classes", () => {
      const result = cn("px-2", "py-1");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("should handle undefined and null values", () => {
      const result = cn("px-2", undefined, "py-1", null);
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("should merge tailwind classes correctly", () => {
      const result = cn("px-2 py-1", "px-4");
      expect(result).toContain("py-1");
      expect(result).toContain("px-4");
      expect(result).not.toContain("px-2");
    });

    it("should handle conditional classes with ternary", () => {
      const isActive = true;
      const result = cn("base-class", isActive ? "active-class" : "inactive-class");
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
      expect(result).not.toContain("inactive-class");
    });

    it("should handle object notation with boolean values", () => {
      const result = cn({
        "px-2": true,
        "py-1": false,
      });
      expect(result).toContain("px-2");
      expect(result).not.toContain("py-1");
    });

    it("should merge complex tailwind overrides", () => {
      const result = cn("flex items-center justify-start", "justify-end");
      expect(result).toContain("flex");
      expect(result).toContain("items-center");
      expect(result).toContain("justify-end");
      expect(result).not.toContain("justify-start");
    });

    it("should handle array of classes", () => {
      const result = cn(["px-2", "py-1"]);
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });

    it("should handle empty string", () => {
      const result = cn("px-2", "", "py-1");
      expect(result).toContain("px-2");
      expect(result).toContain("py-1");
    });
  });
});
