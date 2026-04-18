"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Genre } from "@/types/tmdb";
import styles from "./GenreFilter.module.css";

interface GenreFilterProps {
  genres: Genre[];
}

export function GenreFilter({ genres }: GenreFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get("genre") ?? "";

  const handleGenreClick = useCallback(
    (genreId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (genreId === activeGenre) {
        params.delete("genre");
      } else {
        params.set("genre", genreId);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams, activeGenre]
  );

  return (
    <div className={styles.wrapper} role="group" aria-label="Filter by genre">
      <button
        className={`${styles.pill} ${!activeGenre ? styles.active : ""}`}
        onClick={() => handleGenreClick("")}
        aria-pressed={!activeGenre}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`${styles.pill} ${activeGenre === String(genre.id) ? styles.active : ""}`}
          onClick={() => handleGenreClick(String(genre.id))}
          aria-pressed={activeGenre === String(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
