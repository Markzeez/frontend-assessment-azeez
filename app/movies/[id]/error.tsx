"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function MovieError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Movie detail error:", error);
  }, [error]);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 80, color: "var(--text-muted)", lineHeight: 1 }}>404</p>
      <h1 style={{ fontSize: 22, fontWeight: 500, margin: "16px 0 10px", color: "var(--text-primary)" }}>
        Movie not found
      </h1>
      <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>
        This movie doesn't exist or may have been removed. Try searching for something else.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "10px 22px",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent)",
            borderRadius: 10,
            color: "var(--accent)",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "var(--font-body)",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 22px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--text-secondary)",
            fontSize: 14,
          }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
