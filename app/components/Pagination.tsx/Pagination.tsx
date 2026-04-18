"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void | Promise<void>;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Central handler (decides behavior)
  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    // If parent controls pagination (your MoviesSection)
    if (onPageChange) {
      onPageChange(page);
    } else {
      // Fallback: URL-based pagination
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`?${params.toString()}`);
    }
  };

  // Generate page numbers with "..."
  const getVisiblePages = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];
    const pages: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Start
    if (currentPage - delta > 2) {
      pages.push(1, "...");
    } else {
      pages.push(1);
    }

    pages.push(...range);

    // End
    if (currentPage + delta < totalPages - 1) {
      pages.push("...", totalPages);
    } else if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Don't render if only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      {/* Previous */}
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && changePage(page)}
          disabled={page === "..."}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            page === currentPage
              ? "bg-blue-500 text-white border border-blue-500"
              : page === "..."
              ? "cursor-default border border-gray-300 text-gray-500"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}