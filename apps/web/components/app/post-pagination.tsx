import { calculatePageNumbers } from "@/lib/helpers";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PostPaginationProps = {
  currentPage: number;
  totalPages: number;
  pageNeighbors?: number;
};

export default function PostPagination({ currentPage, totalPages, pageNeighbors = 2 }: PostPaginationProps) {
  const pageNumbers = calculatePageNumbers({ pageNeighbors, totalPages, currentPage });

  console.log(pageNumbers);

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem>
            <PaginationPrevious href={`?page=${currentPage - 1}`} />
          </PaginationItem>
        )}

        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink isActive={currentPage === page} href={`?page=${page}`}>
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {currentPage !== totalPages && (
          <PaginationItem>
            <PaginationNext href={`?page=${currentPage + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
