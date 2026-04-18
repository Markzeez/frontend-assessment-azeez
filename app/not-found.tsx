import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      maxWidth: 500,
      margin: "0 auto",
      padding: "80px 24px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    }}>
      <p style={{
        fontFamily: "var(--font-display)",
        fontSize: 120,
        lineHeight: 1,
        color: "var(--text-muted)",
        letterSpacing: "0.05em",
      }}>
        404
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: "var(--text-primary)" }}>
        Page not found
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6 }}>
        This page doesn't exist. The movie you're looking for may have been removed or the URL is incorrect.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 22px",
          background: "var(--accent-dim)",
          border: "1px solid var(--accent)",
          borderRadius: 10,
          color: "var(--accent)",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        ← Back to home
      </Link>
    </div>
  );
}
