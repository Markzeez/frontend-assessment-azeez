import styles from "./SkeletonCard.module.css";

export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.poster} />
      <div className={styles.info}>
        <div className={`${styles.line} ${styles.title}`} />
        <div className={`${styles.line} ${styles.year}`} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 20 }: { count?: number }) {
  return (
    <div className={styles.grid} role="status" aria-label="Loading movies">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
