export type Genre = { id: number; name: string };
export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genres?: Genre[];
  // add fields as needed
};
export type TMDBListResponse = {
  page: number;
  results: MovieDetail[];
  total_pages: number;
  total_results: number;
};

const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
  "Content-Type": "application/json",
};

export async function getMovies(page = 1): Promise<TMDBListResponse> {
  const res = await fetch(
    `${BASE_URL}/movie/popular?page=${page}`,
    {
      headers,
      next: { revalidate: 3600 }, // cache 1 hour — popular list changes slowly
    }
  );
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
}

export async function searchMovies(
  query: string,
  page = 1,
  genreId?: string
): Promise<TMDBListResponse> {
  const params = new URLSearchParams({ query, page: String(page) });
  if (genreId) params.set("with_genres", genreId);

  const res = await fetch(
    `${BASE_URL}/search/movie?${params}`,
    {
      headers,
      cache: "no-store", // search results must always be fresh
    }
  );
  if (!res.ok) throw new Error("Failed to search movies");
  return res.json();
}

export async function getMovieById(id: string): Promise<MovieDetail> {
  const res = await fetch(
    `${BASE_URL}/movie/${id}`,
    {
      headers,
      next: { revalidate: 86400 }, // cache 24h — movie details rarely change
    }
  );
  if (!res.ok) throw new Error("Failed to fetch movie");
  return res.json();
}

export async function getGenres(): Promise<Genre[]> {
  const res = await fetch(
    `${BASE_URL}/genre/movie/list`,
    {
      headers,
      next: { revalidate: 86400 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch genres");
  const data = await res.json();
  return data.genres;
}