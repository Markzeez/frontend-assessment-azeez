// /app/types/tmdb.ts

export type Genre = {
  id: number;
  name: string;
};

export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genres?: Genre[];
  // add more fields as needed
};

export type TMDBListResponse = {
  page: number;
  results: MovieDetail[];
  total_pages: number;
  total_results: number;
};