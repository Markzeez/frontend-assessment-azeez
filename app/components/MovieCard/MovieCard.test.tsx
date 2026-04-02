import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MovieCard from "./MovieCard";
import { Movie } from "@/app/types/tmdb";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, fill, className, sizes, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-fill={fill}
      data-sizes={sizes}
      {...props}
    />
  ),
}));

const mockMovie: Movie = {
  id: 123,
  title: "The Dark Knight",
  overview: "A great movie about Batman",
  poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
  release_date: "2008-07-18",
  vote_average: 9.0,
  vote_count: 10000,
  genre_ids: [28, 80, 18],
};

const mockMovieWithoutPoster: Movie = {
  ...mockMovie,
  poster_path: null,
};

const mockMovieWithoutReleaseDate: Movie = {
  ...mockMovie,
  release_date: "",
};

describe("MovieCard", () => {
  it("renders movie title", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
  });

  it("renders movie poster image when poster_path exists", () => {
    render(<MovieCard movie={mockMovie} />);

    const image = screen.getByAltText("The Dark Knight");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    );
  });

  it("renders fallback when poster_path is null", () => {
    render(<MovieCard movie={mockMovieWithoutPoster} />);

    expect(screen.getByText("No Image")).toBeInTheDocument();
    expect(screen.queryByAltText("The Dark Knight")).not.toBeInTheDocument();
  });

  it("renders release year correctly", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("2008")).toBeInTheDocument();
  });

  it("renders N/A when release_date is missing", () => {
    render(<MovieCard movie={mockMovieWithoutReleaseDate} />);
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders vote average with star icon", () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText("9.0")).toBeInTheDocument();
    // Check for star symbol
    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("has correct container styling", () => {
    render(<MovieCard movie={mockMovie} />);
    const container = screen.getByRole("img", { hidden: true }).parentElement?.parentElement;
    expect(container).toHaveClass(
      "bg-white",
      "rounded-lg",
      "shadow-md",
      "overflow-hidden",
      "hover:shadow-lg",
      "transition-shadow",
      "duration-300"
    );
  });

  it("has correct image container dimensions", () => {
    render(<MovieCard movie={mockMovie} />);
    const imageContainer = screen.getByRole("img", { hidden: true }).parentElement;
    expect(imageContainer).toHaveClass("relative", "w-full", "h-64");
  });

  it("has correct content padding", () => {
    render(<MovieCard movie={mockMovie} />);
    const contentDiv = screen.getByText("The Dark Knight").parentElement;
    expect(contentDiv).toHaveClass("p-4");
  });

  it("has correct title styling", () => {
    render(<MovieCard movie={mockMovie} />);
    const title = screen.getByText("The Dark Knight");
    expect(title).toHaveClass("font-semibold", "text-lg", "mb-2", "line-clamp-2");
  });

  it("has correct metadata styling", () => {
    render(<MovieCard movie={mockMovie} />);
    const metadataDiv = screen.getByText("2008").parentElement;
    expect(metadataDiv).toHaveClass("flex", "items-center", "justify-between", "text-sm", "text-gray-600");
  });

  it("displays rating with correct formatting", () => {
    render(<MovieCard movie={mockMovie} />);
    const ratingContainer = screen.getByText("9.0").parentElement;
    expect(ratingContainer).toHaveClass("flex", "items-center");
  });

  it("renders image with correct attributes", () => {
    render(<MovieCard movie={mockMovie} />);
    const image = screen.getByAltText("The Dark Knight");
    expect(image).toHaveAttribute("alt", "The Dark Knight");
    expect(image).toHaveAttribute("data-fill", "true");
    expect(image).toHaveAttribute("data-sizes", "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw");
    expect(image).toHaveClass("object-cover");
  });

  it("renders fallback div with correct styling", () => {
    render(<MovieCard movie={mockMovieWithoutPoster} />);
    const fallbackDiv = screen.getByText("No Image").parentElement;
    expect(fallbackDiv).toHaveClass("w-full", "h-full", "bg-gray-200", "flex", "items-center", "justify-center");
  });

  it("renders fallback text with correct styling", () => {
    render(<MovieCard movie={mockMovieWithoutPoster} />);
    const fallbackText = screen.getByText("No Image");
    expect(fallbackText).toHaveClass("text-gray-500");
  });
});
