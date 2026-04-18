import styles from "./page.module.css";

export default function MovieLoading() {
  return (
    <article>
      <div className={styles.backdrop} style={{ background: "var(--bg-secondary)" }} />
      <div className={styles.container}>
        <div style={{ height: 20, width: 180, borderRadius: 4, marginBottom: 24 }} className="skeleton" />
        <div className={styles.hero}>
          <div className={styles.posterWrapper}>
            <div style={{ width: "100%", aspectRatio: "2/3", borderRadius: 16 }} className="skeleton" />
          </div>
          <div className={styles.info} style={{ paddingTop: 8 }}>
            <div style={{ height: 14, width: 80, borderRadius: 4, marginBottom: 12 }} className="skeleton" />
            <div style={{ height: 56, width: "70%", borderRadius: 6, marginBottom: 16 }} className="skeleton" />
            <div style={{ height: 18, width: "45%", borderRadius: 4, marginBottom: 20 }} className="skeleton" />
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[60, 80, 70].map((w, i) => (
                <div key={i} style={{ height: 28, width: w, borderRadius: 100 }} className="skeleton" />
              ))}
            </div>
            <div style={{ height: 13, width: 60, borderRadius: 4, marginBottom: 8 }} className="skeleton" />
            {[100, 92, 85, 60].map((w, i) => (
              <div key={i} style={{ height: 14, width: `${w}%`, borderRadius: 4, marginBottom: 6 }} className="skeleton" />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
