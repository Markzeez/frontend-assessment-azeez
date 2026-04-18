import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    default: "CineScope — Discover Movies",
    template: "%s | CineScope",
  },
  description:
    "Browse, search, and discover the most popular movies. Powered by TMDB.",
  openGraph: {
    siteName: "CineScope",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <header className="site-header">
          <div className="site-header__inner">
            <a href="/" className="site-header__logo">
              CineScope
            </a>
            <span className="site-header__tagline">Powered by TMDB</span>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>Movie data provided by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">The Movie Database</a></p>
        </footer>
        <style>{`
          .site-header {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(10, 10, 11, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
          }
          .site-header__inner {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 24px;
            height: 60px;
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .site-header__logo {
            font-family: var(--font-display);
            font-size: 26px;
            letter-spacing: 0.04em;
            color: var(--accent);
          }
          .site-header__tagline {
            font-size: 12px;
            color: var(--text-muted);
            border-left: 1px solid var(--border);
            padding-left: 16px;
          }
          .site-footer {
            text-align: center;
            padding: 32px 24px;
            color: var(--text-muted);
            font-size: 13px;
            border-top: 1px solid var(--border);
            margin-top: 80px;
          }
          .site-footer a {
            color: var(--accent);
          }
        `}</style>
      </body>
    </html>
  );
}
