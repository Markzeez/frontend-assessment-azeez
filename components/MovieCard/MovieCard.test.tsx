import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MovieCard } from "./MovieCard";
import type { Movie } from "@/types/tmdb";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; fill?: boolean; priority?: boolean; sizes?: string; placeholder?: string; blurDataURL?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockMovie: Movie = {
  id: 1,
  title: "Inception",
  overview: "A thief who steals corporate secrets through dream-sharing technology.",
  poster_path: "/inception.jpg",
  backdrop_path: "/inception-bg.jpg",
  release_date: "2010-07-16",
  vote_average: 8.4,
  vote_count: 35000,
  genre_ids: [28, 878],
};

describe("MovieCard", () => {
  it("renders the movie title", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("Inception")).toBeInTheDocument();
  });

  it("renders the release year extracted from date", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  it("renders a link to the movie detail page", () => {
    render(<MovieCard movie={mockMovie} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movies/1");
  });

  it("renders the poster image with correct alt text", () => {
    render(<MovieCard movie={mockMovie} />);
    const img = screen.getByAltText("Inception poster");
    expect(img).toBeInTheDocument();
  });

  it("shows a fallback poster when poster_path is null", () => {
    const movieWithoutPoster: Movie = { ...mockMovie, poster_path: null };
    render(<MovieCard movie={movieWithoutPoster} />);
    const img = screen.getByAltText("Inception poster");
    expect(img.getAttribute("src")).toContain("fallback");
  });

  it("has an accessible aria-label combining title and year", () => {
    render(<MovieCard movie={mockMovie} />);
    const link = screen.getByRole("link", { name: /Inception \(2010\)/i });
    expect(link).toBeInTheDocument();
  });

  it("displays the rating badge", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByLabelText(/Rating: 8.4/i)).toBeInTheDocument();
  });
});
