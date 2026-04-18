"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.code} aria-hidden="true">500</div>
      <h1 className={styles.title}>Something went wrong</h1>
      <p className={styles.desc}>
        We had trouble loading movie data. This might be a temporary issue — try again or go back home.
      </p>
      <div className={styles.actions}>
        <button onClick={reset} className={styles.btnPrimary}>
          Try again
        </button>
        <Link href="/" className={styles.btnSecondary}>
          Go home
        </Link>
      </div>
      {error.digest && (
        <p className={styles.digest}>Error ID: {error.digest}</p>
      )}
    </div>
  );
}
