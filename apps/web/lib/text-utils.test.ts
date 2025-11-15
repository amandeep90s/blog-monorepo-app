import { formatDate, getRelativeTime, truncateByWords, truncateText } from "./text-utils";

describe("Text Utils", () => {
  describe("truncateText", () => {
    it("should return empty string for empty input", () => {
      expect(truncateText("", 10)).toBe("");
    });

    it("should return original text if length is less than maxLength", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
    });

    it("should truncate text and add ellipsis if longer than maxLength", () => {
      expect(truncateText("This is a long text", 10)).toBe("This is a...");
    });

    it("should handle exact maxLength", () => {
      expect(truncateText("Exact", 5)).toBe("Exact");
    });
  });

  describe("truncateByWords", () => {
    it("should return empty string for empty input", () => {
      expect(truncateByWords("", 5)).toBe("");
    });

    it("should return original text if word count is less than maxWords", () => {
      expect(truncateByWords("Hello world", 5)).toBe("Hello world");
    });

    it("should truncate by words and add ellipsis", () => {
      expect(truncateByWords("This is a very long sentence", 3)).toBe("This is a...");
    });

    it("should handle exact maxWords", () => {
      expect(truncateByWords("One two three", 3)).toBe("One two three");
    });
  });

  describe("formatDate", () => {
    it("should format Date object correctly", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date);
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/2024/);
    });

    it("should format ISO string correctly", () => {
      const formatted = formatDate("2024-01-15T00:00:00Z");
      expect(formatted).toMatch(/Jan/);
      expect(formatted).toMatch(/2024/);
    });

    it("should handle different dates", () => {
      const formatted = formatDate("2023-12-25");
      expect(formatted).toMatch(/Dec/);
      expect(formatted).toMatch(/2023/);
    });
  });

  describe("getRelativeTime", () => {
    beforeEach(() => {
      // Mock the current time
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "just now" for very recent dates', () => {
      const recentDate = new Date("2024-01-15T11:59:50Z");
      expect(getRelativeTime(recentDate)).toBe("just now");
    });

    it("should return minutes ago", () => {
      const date = new Date("2024-01-15T11:55:00Z");
      expect(getRelativeTime(date)).toBe("5 minutes ago");
    });

    it("should return hours ago", () => {
      const date = new Date("2024-01-15T10:00:00Z");
      expect(getRelativeTime(date)).toBe("2 hours ago");
    });

    it("should return days ago", () => {
      const date = new Date("2024-01-13T12:00:00Z");
      expect(getRelativeTime(date)).toBe("2 days ago");
    });

    it("should return weeks ago", () => {
      const date = new Date("2024-01-01T12:00:00Z");
      expect(getRelativeTime(date)).toBe("2 weeks ago");
    });

    it("should handle singular units correctly", () => {
      const date = new Date("2024-01-15T11:00:00Z");
      expect(getRelativeTime(date)).toBe("1 hour ago");
    });

    it("should work with ISO string input", () => {
      const result = getRelativeTime("2024-01-15T11:00:00Z");
      expect(result).toBe("1 hour ago");
    });
  });
});
