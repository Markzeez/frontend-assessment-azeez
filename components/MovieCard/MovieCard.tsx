import Image from "next/image";
import Link from "next/link";
import { getPosterUrl } from "@/lib/api";
import { formatYear } from "@/lib/utils";
import type { Movie } from "@/types/tmdb";
import { RatingBadge } from "@/components/RatingBadge/RatingBadge";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
}

export function MovieCard({ movie, priority = false }: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.poster_path, "w500");
  const year = formatYear(movie.release_date);

  return (
    <Link
      href={`/movies/${movie.id}`}
      className={styles.card}
      aria-label={`${movie.title} (${year})`}
    >
      <div className={styles.poster}>
        <Image
          src={posterUrl}
          alt={`${movie.title} poster`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.posterImg}
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k="
        />
        <div className={styles.overlay} aria-hidden="true" />
        <div className={styles.badge}>
          <RatingBadge rating={movie.vote_average} size="sm" />
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <span className={styles.year}>{year}</span>
      </div>
    </Link>
  );
}
