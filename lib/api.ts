import type {
  Genre,
  MovieCredits,
  MovieDetail,
  TMDBListResponse,
} from "@/types/tmdb";

const BASE_URL = "https://api.themoviedb.org/3";

function getHeaders(): HeadersInit {
  const token = process.env.TMDB_BEARER_TOKEN;
  if (!token) throw new Error("TMDB_BEARER_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getPopularMovies(page = 1): Promise<TMDBListResponse> {
  const res = await fetch(`${BASE_URL}/movie/popular?page=${page}&language=en-US`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch popular movies: ${res.status}`);
  return res.json();
}

export async function searchMovies(
  query: string,
  page = 1,
  genreId?: string
): Promise<TMDBListResponse> {
  const endpoint = query.trim()
    ? `${BASE_URL}/search/movie`
    : `${BASE_URL}/discover/movie`;

  const params = new URLSearchParams({
    page: String(page),
    language: "en-US",
    include_adult: "false",
  });

  if (query.trim()) {
    params.set("query", query.trim());
  } else {
    params.set("sort_by", "popularity.desc");
  }

  if (genreId) params.set("with_genres", genreId);

  const res = await fetch(`${endpoint}?${params}`, {
    headers: getHeaders(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to search movies: ${res.status}`);
  return res.json();
}

export async function getMovieById(id: string): Promise<MovieDetail> {
  const res = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch movie ${id}: ${res.status}`);
  return res.json();
}

export async function getMovieCredits(id: string): Promise<MovieCredits> {
  const res = await fetch(`${BASE_URL}/movie/${id}/credits?language=en-US`, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch credits for ${id}: ${res.status}`);
  return res.json();
}

export async function getGenres(): Promise<Genre[]> {
  const res = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch genres: ${res.status}`);
  const data = await res.json();
  return data.genres;
}

export function getPosterUrl(
  path: string | null,
  size: "w185" | "w342" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "/fallback-poster.png";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w300" | "w780" | "w1280" | "original" = "w1280"
): string {
  if (!path) return "/fallback-backdrop.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
