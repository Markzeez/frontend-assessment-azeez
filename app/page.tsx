import { Suspense } from "react";
import { getGenres, searchMovies } from "@/lib/api";
import { MovieGrid } from "@/components/MovieGrid/MovieGrid";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { GenreFilter } from "@/components/GenreFilter/GenreFilter";
import { Pagination } from "@/components/Pagination/Pagination";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonCard/SkeletonCard";
import styles from "./page.module.css";

interface HomePageProps {
  searchParams: Promise<{
    query?: string;
    genre?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const query = params.query ?? "";
  const genre = params.genre ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const [{ results, total_pages }, genres] = await Promise.all([
    searchMovies(query, page, genre),
    getGenres(),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Discover Movies</h1>
        <p className={styles.heroSub}>
          {total_pages > 0
            ? `${results.length > 0 ? "Browsing" : "No results in"} ${query ? `results for "${query}"` : "popular films"}`
            : "Search the world's largest movie database"}
        </p>
      </div>

      <div className={styles.controls}>
        <Suspense fallback={<div className={styles.searchFallback} />}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={null}>
          <GenreFilter genres={genres} />
        </Suspense>
      </div>

      <div className={styles.results}>
        {results.length === 0 ? (
          <EmptyState query={query} />
        ) : (
          <>
            <Suspense fallback={<SkeletonGrid count={20} />}>
              <MovieGrid movies={results} />
            </Suspense>

            <div className={styles.pagination}>
              <Suspense fallback={null}>
                <Pagination currentPage={page} totalPages={total_pages} />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
