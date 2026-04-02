"use client";

import { useState, useEffect, Suspense } from "react";
import { getMovies, searchMovies } from "@/app/lib/api.type";
import { TMDBListResponse, Movie } from "@/app/types/tmdb";
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
  currentPage,
  query,
  genre
}: MoviesSectionProps) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTotalPages, setCurrentTotalPages] = useState(totalPages);

  // Show skeleton cards for 2 seconds initially
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 2000); // Show skeleton for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    try {
      let movieData: TMDBListResponse;
      if (query) {
        movieData = await searchMovies(query, page, genre);
      } else {
        movieData = await getMovies(page);
      }
      setMovies(movieData.results);
      setCurrentTotalPages(movieData.total_pages);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSkeleton) {
    return <SkeletonGrid />;
  }

  if (movies.length === 0) {
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

  return (
    <Suspense fallback={<SkeletonGrid />}>
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={currentPage}
            totalPages={currentTotalPages}
          />
        </>
      )}
    </Suspense>
  );
}