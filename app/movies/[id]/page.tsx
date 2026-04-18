import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBackdropUrl, getMovieById, getMovieCredits, getPosterUrl } from "@/lib/api";
import { formatCurrency, formatRuntime, formatYear } from "@/lib/utils";
import { Breadcrumb } from "@/components/Breadcrumb/Breadcrumb";
import { RatingBadge } from "@/components/RatingBadge/RatingBadge";
import styles from "./page.module.css";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await getMovieById(id);
    const posterUrl = getPosterUrl(movie.poster_path, "w342");

    return {
      title: `${movie.title} (${formatYear(movie.release_date)})`,
      description: movie.overview || `Details and information about ${movie.title}.`,
      openGraph: {
        title: movie.title,
        description: movie.overview,
        images: [{ url: posterUrl, width: 342, height: 513, alt: `${movie.title} poster` }],
        type: "video.movie",
      },
      twitter: {
        card: "summary_large_image",
        title: movie.title,
        description: movie.overview,
        images: [posterUrl],
      },
    };
  } catch {
    return { title: "Movie not found" };
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;

  let movie, credits;
  try {
    [movie, credits] = await Promise.all([
      getMovieById(id),
      getMovieCredits(id),
    ]);
  } catch {
    notFound();
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, "w1280");
  const posterUrl = getPosterUrl(movie.poster_path, "w500");
  const year = formatYear(movie.release_date);
  const topCast = credits.cast.slice(0, 8);

  return (
    <article>
      {/* Backdrop */}
      <div className={styles.backdrop} aria-hidden="true">
        {movie.backdrop_path && (
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className={styles.backdropImg}
          />
        )}
        <div className={styles.backdropOverlay} />
      </div>

      <div className={styles.container}>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: movie.title },
          ]}
        />

        <div className={styles.hero}>
          {/* Poster */}
          <div className={styles.posterWrapper}>
            <Image
              src={posterUrl}
              alt={`${movie.title} poster`}
              width={300}
              height={450}
              className={styles.poster}
              priority
            />
          </div>

          {/* Info */}
          <div className={styles.info}>
            <div className={styles.meta}>
              <span className={styles.year}>{year}</span>
              {movie.runtime && (
                <span className={styles.dot} aria-hidden="true">·</span>
              )}
              {movie.runtime && (
                <span>{formatRuntime(movie.runtime)}</span>
              )}
            </div>

            <h1 className={styles.title}>{movie.title}</h1>

            {movie.tagline && (
              <p className={styles.tagline}>"{movie.tagline}"</p>
            )}

            <div className={styles.ratingRow}>
              <RatingBadge rating={movie.vote_average} size="lg" />
              <span className={styles.voteCount}>
                {movie.vote_count.toLocaleString()} ratings
              </span>
            </div>

            {movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((genre) => (
                  <span key={genre.id} className={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <div className={styles.section}>
                <h2 className={styles.sectionLabel}>Overview</h2>
                <p className={styles.overview}>{movie.overview}</p>
              </div>
            )}

            <div className={styles.statsRow}>
              {movie.budget > 0 && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Budget</span>
                  <span className={styles.statValue}>{formatCurrency(movie.budget)}</span>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Revenue</span>
                  <span className={styles.statValue}>{formatCurrency(movie.revenue)}</span>
                </div>
              )}
              {movie.status && (
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Status</span>
                  <span className={styles.statValue}>{movie.status}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {topCast.length > 0 && (
          <section className={styles.castSection} aria-labelledby="cast-heading">
            <h2 id="cast-heading" className={styles.castHeading}>Cast</h2>
            <div className={styles.castGrid}>
              {topCast.map((member) => (
                <div key={member.id} className={styles.castCard}>
                  <div className={styles.castPhoto}>
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                        fill
                        sizes="100px"
                        className={styles.castImg}
                      />
                    ) : (
                      <div className={styles.castPlaceholder} aria-hidden="true">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={styles.castInfo}>
                    <span className={styles.castName}>{member.name}</span>
                    <span className={styles.castChar}>{member.character}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
