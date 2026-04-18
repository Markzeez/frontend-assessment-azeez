"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import styles from "./SearchBar.module.css";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("query") ?? "");
  const debouncedValue = useDebounce(value, 350);

  const updateURL = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }
      params.delete("page"); // reset to page 1 on new search
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    updateURL(debouncedValue);
  }, [debouncedValue, updateURL]);

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className={styles.wrapper} role="search">
      <label htmlFor="movie-search" className={styles.srOnly}>
        Search movies
      </label>
      <div className={styles.inputWrapper}>
        <svg
          className={styles.icon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          id="movie-search"
          type="search"
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search movies..."
          autoComplete="off"
          spellCheck="false"
        />
        {value && (
          <button
            className={styles.clear}
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
