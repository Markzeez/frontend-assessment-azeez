"use client";

"use client";

import { useState, useEffect } from "react";
import { getMovies, searchMovies } from "@/app/lib/api.type";       
import { TMDBListResponse } from "@/app/lib/api.type";         
import { Movie } from "@/app/types/tmdb";                       
import MovieGrid from "@/app/components/MovieGrid/MovieGrid";
import SkeletonCard from "@/app/components/SkeletonCard/SkeletonCard";
import EmptyState from "@/app/components/EmptyState/EmptyState";
import Pagination from "@/app/components/Pagination.tsx/Pagination";

interface MoviesSectionProps {
  initialMovies: Movie[];
  totalPages: number;
  currentPage: number;
  query?: string;
  genre?: string;
}



function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
      {Array.from({ length: 20 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default function MoviesSection({
  initialMovies,
  totalPages,
  currentPage: initialPage,
  query,
  genre
}: MoviesSectionProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentTotalPages, setCurrentTotalPages] = useState(totalPages);

  // Sync state if props change (useful for search/filter updates)
  useEffect(() => {
    setMovies(initialMovies);
    setCurrentTotalPages(totalPages);
    setCurrentPage(initialPage);
  }, [initialMovies, totalPages, initialPage]);

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    setCurrentPage(page); // Update local page state immediately
    
    try {
      let movieData: TMDBListResponse;
      if (query) {
        movieData = await searchMovies(query, page, genre);
      } else {
        movieData = await getMovies(page);
      }
      setMovies(movieData.results as Movie[]);
      setCurrentTotalPages(movieData.total_pages);
      
      // Scroll to top on page change for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Check for empty state first, BUT only if we aren't loading
  if (movies.length === 0 && !isLoading) {
    return (
      <EmptyState
        message={
          query
            ? `No movies found for "${query}". Try a different search term.`
            : "No movies available at the moment."
        }
      />
    );
  }

  // 2. Render UI
  return (
    <>
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <>
          <MovieGrid movies={movies} />
          {currentTotalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={currentTotalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
}