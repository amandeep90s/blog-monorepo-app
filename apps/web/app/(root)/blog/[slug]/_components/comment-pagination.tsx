import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { calculatePageNumbers } from "@/lib/helpers";
import { Button } from "@/components/ui/button";

type CommentPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageNeighbors?: number;
};

export default function CommentPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageNeighbors = 2,
}: CommentPaginationProps) {
  const pageNumbers = calculatePageNumbers({ pageNeighbors, totalPages, currentPage });

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center space-x-1" aria-label="Comments pagination">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousClick}
        disabled={currentPage === 1}
        className="gap-1 pl-2.5"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <div className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageClick(page)}
                className="h-9 w-9 p-0"
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className="gap-1 pr-2.5"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
