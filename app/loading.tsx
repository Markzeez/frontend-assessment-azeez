import { SkeletonGrid } from "@/components/SkeletonCard/SkeletonCard";
import styles from "./page.module.css";

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div style={{ height: 72, width: 340, borderRadius: 6, background: "var(--bg-card-hover)", marginBottom: 10 }} className="skeleton" />
        <div style={{ height: 16, width: 200, borderRadius: 4, background: "var(--bg-card-hover)" }} className="skeleton" />
      </div>
      <div className={styles.controls}>
        <div style={{ height: 46, borderRadius: 10, background: "var(--bg-card)" }} className="skeleton" />
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 34, width: 80, borderRadius: 100, background: "var(--bg-card)" }} className="skeleton" />
          ))}
        </div>
      </div>
      <SkeletonGrid count={20} />
    </div>
  );
}
