import { calculatePageNumbers, transformTakeSkip } from "./helpers";

describe("Helper Functions", () => {
  describe("transformTakeSkip", () => {
    it("should return default pagination values when no parameters provided", () => {
      const result = transformTakeSkip({});
      expect(result.skip).toBe(0);
      expect(result.take).toBe(9); // DEFAULT_PAGE_SIZE
    });

    it("should calculate skip correctly for page 2", () => {
      const result = transformTakeSkip({ page: 2 });
      expect(result.skip).toBe(9); // (2-1) * 9
      expect(result.take).toBe(9);
    });

    it("should calculate skip correctly for page 3 with custom pageSize", () => {
      const result = transformTakeSkip({ page: 3, pageSize: 20 });
      expect(result.skip).toBe(40); // (3-1) * 20
      expect(result.take).toBe(20);
    });

    it("should handle page 1 correctly", () => {
      const result = transformTakeSkip({ page: 1, pageSize: 15 });
      expect(result.skip).toBe(0); // (1-1) * 15
      expect(result.take).toBe(15);
    });

    it("should use default pageSize when not provided", () => {
      const result = transformTakeSkip({ page: 5 });
      expect(result.take).toBe(9); // DEFAULT_PAGE_SIZE
      expect(result.skip).toBe(36); // (5-1) * 9
    });

    it("should use default page 1 when not provided", () => {
      const result = transformTakeSkip({ pageSize: 25 });
      expect(result.skip).toBe(0); // (1-1) * 25
      expect(result.take).toBe(25);
    });
  });

  describe("calculatePageNumbers", () => {
    it("should return all page numbers when total pages is small", () => {
      const result = calculatePageNumbers({
        pageNeighbors: 1,
        currentPage: 1,
        totalPages: 5,
      });
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should add ellipsis when total pages exceeds threshold", () => {
      const result = calculatePageNumbers({
        pageNeighbors: 2,
        currentPage: 5,
        totalPages: 20,
      });
      expect(result[0]).toBe(1);
      expect(result[result.length - 1]).toBe(20);
      expect(result).toContain("...");
    });

    it("should include current page within neighbors", () => {
      const result = calculatePageNumbers({
        pageNeighbors: 2,
        currentPage: 10,
        totalPages: 20,
      });
      expect(result).toContain(8);
      expect(result).toContain(10);
      expect(result).toContain(12);
    });

    it("should not add leading ellipsis when start page is 2", () => {
      const result = calculatePageNumbers({
        pageNeighbors: 1,
        currentPage: 2,
        totalPages: 20,
      });
      expect(result[0]).toBe(1);
      expect(result[1]).toBe(2);
      expect(result[2]).not.toBe("...");
    });

    it("should not add trailing ellipsis when end page is total pages - 1", () => {
      const result = calculatePageNumbers({
        pageNeighbors: 1,
        currentPage: 19,
        totalPages: 20,
      });
      expect(result[result.length - 1]).toBe(20);
      expect(result[result.length - 2]).not.toBe("...");
    });

    it("should handle single page", () => {
      const result = calculatePageNumbers({
        pageNeighbors: 1,
        currentPage: 1,
        totalPages: 1,
      });
      expect(result).toEqual([1]);
    });

    it("should handle large page neighbors", () => {
      const result = calculatePageNumbers({
        pageNeighbors: 5,
        currentPage: 1,
        totalPages: 5,
      });
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle current page at the end", () => {
      const result = calculatePageNumbers({
        pageNeighbors: 2,
        currentPage: 20,
        totalPages: 20,
      });
      expect(result[result.length - 1]).toBe(20);
      expect(result).toContain(18);
      expect(result).toContain(19);
    });
  });
});
