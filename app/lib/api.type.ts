// /app/lib/api.ts
import { MovieDetail, TMDBListResponse, Genre } from "@/app/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
  "Content-Type": "application/json",
};

/**
 * Generic TMDB fetch helper
 */
async function fetchFromTMDB<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    throw new Error(`TMDB Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get popular movies
 */
export async function getMovies(page = 1): Promise<TMDBListResponse> {
  return fetchFromTMDB<TMDBListResponse>(`/movie/popular?page=${page}`, {
    next: { revalidate: 3600 }, // cache 1 hour
  });
}

/**
 * Search movies with optional genre filter
 */
export async function searchMovies(query: string, page = 1, genreId?: string): Promise<TMDBListResponse> {
  const params = new URLSearchParams({ query, page: String(page) });
  if (genreId) params.set("with_genres", genreId);

  return fetchFromTMDB<TMDBListResponse>(`/search/movie?${params}`, {
    cache: "no-store", // always fresh
  });
}

/**
 * Get single movie details by ID
 */
export async function getMovieById(id: string): Promise<MovieDetail> {
  return fetchFromTMDB<MovieDetail>(`/movie/${id}`, {
    next: { revalidate: 86400 }, // cache 24 hours
  });
}

/**
 * Get all genres
 */
export async function getGenres(): Promise<Genre[]> {
  const data = await fetchFromTMDB<{ genres: Genre[] }>(`/genre/movie/list`, {
    next: { revalidate: 86400 }, // cache 24 hours
  });
  return data.genres;
}