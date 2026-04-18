import { MovieCard } from "@/components/MovieCard/MovieCard";
import type { Movie } from "@/types/tmdb";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className={styles.grid} role="list">
      {movies.map((movie, index) => (
        <li key={movie.id}>
          {/* Prioritize first 8 cards (above the fold on most screens) */}
          <MovieCard movie={movie} priority={index < 8} />
        </li>
      ))}
    </ul>
  );
}
