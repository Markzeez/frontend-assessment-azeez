export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  runtime: number | null;
  genres: Genre[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}