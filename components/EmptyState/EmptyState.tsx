import Link from "next/link";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  query?: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.icon} aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M8 11h6M11 8v6" />
        </svg>
      </div>
      <h2 className={styles.title}>No results found</h2>
      <p className={styles.desc}>
        {query
          ? `We couldn't find any movies matching "${query}". Try a different search or clear your filters.`
          : "No movies match the current filters. Try adjusting or clearing them."}
      </p>
      <Link href="/" className={styles.btn}>
        Clear all filters
      </Link>
    </div>
  );
}
