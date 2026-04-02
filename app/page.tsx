import { Suspense } from "react";
import { getMovies, searchMovies } from "@/app/lib/api.type";
import { TMDBListResponse } from "@/app/types/tmdb";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import MoviesSection from "@/app/components/MoviesSection/MoviesSection";
import EmptyState from "@/app/components/EmptyState/EmptyState";

interface PageProps {
  searchParams: {
    page?: string;
    query?: string;
    genre?: string;
  };
}

async function getMovieData(searchParams: PageProps["searchParams"]): Promise<TMDBListResponse> {
  const page = parseInt(searchParams.page || "1", 10);
  const query = searchParams.query;
  const genre = searchParams.genre;

  if (query) {
    return searchMovies(query, page, genre);
  } else {
    return getMovies(page);
  }
}

export default async function Home({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page || "1", 10);
  const query = searchParams.query;
  const genre = searchParams.genre;

  let movieData: TMDBListResponse;

  try {
    movieData = await getMovieData(searchParams);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState message="Failed to load movies. Please try again later." />
        </div>
      </div>
    );
  }

  const { results: movies, total_pages: totalPages } = movieData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {query ? `Search Results for "${query}"` : "Popular Movies"}
          </h1>
          <Suspense fallback={<div className="w-full max-w-md mx-auto h-12 bg-gray-200 animate-pulse rounded"></div>}>
            <SearchBar />
          </Suspense>
        </div>

        <MoviesSection
          initialMovies={movies}
          totalPages={totalPages}
          currentPage={currentPage}
          query={query}
          genre={genre}
        />
      </div>
    </div>
  );
}
