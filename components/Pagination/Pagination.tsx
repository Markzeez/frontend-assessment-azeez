"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clamp } from "@/lib/utils";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // TMDB caps at 500 pages
  const cappedTotal = Math.min(totalPages, 500);

  const goToPage = useCallback(
    (page: number) => {
      const clamped = clamp(page, 1, cappedTotal);
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(clamped));
      router.push(`${pathname}?${params.toString()}`, { scroll: true });
    },
    [pathname, router, searchParams, cappedTotal]
  );

  if (cappedTotal <= 1) return null;

  const getPages = (): (number | "...")[] => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(cappedTotal - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const pages: (number | "...")[] = [1];
    if (range[0] > 2) pages.push("...");
    pages.push(...range);
    if (range[range.length - 1] < cappedTotal - 1) pages.push("...");
    if (cappedTotal > 1) pages.push(cappedTotal);

    return pages;
  };

  const pages = getPages();

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <button
        className={styles.btn}
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div className={styles.pages}>
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
          ) : (
            <button
              key={page}
              className={`${styles.btn} ${page === currentPage ? styles.active : ""}`}
              onClick={() => goToPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className={styles.btn}
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= cappedTotal}
        aria-label="Next page"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}
