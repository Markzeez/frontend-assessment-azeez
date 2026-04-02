import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import SearchBar from "./SearchBar";

// Mock Next.js router
const mockPush = vi.fn();
const mockGet = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
    toString: vi.fn(() => ""),
  }),
}));

// Mock the useDebounce hook
vi.mock("@/app/hooks/useDebounce", () => ({
  useDebounce: vi.fn((value) => value), // Return value immediately for testing
}));

describe("SearchBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input with placeholder", () => {
    mockGet.mockReturnValue(null);
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search movies...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders search icon", () => {
    mockGet.mockReturnValue(null);
    render(<SearchBar />);

    const searchIcon = screen.getByRole("img", { hidden: true }); // SVG is treated as img
    expect(searchIcon).toBeInTheDocument();
  });

  it("initializes with query from search params", () => {
    mockGet.mockReturnValue("batman");
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search movies...");
    expect(input).toHaveValue("batman");
  });

  it("updates input value when user types", async () => {
    mockGet.mockReturnValue(null);
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search movies...");
    await user.type(input, "inception");

    expect(input).toHaveValue("inception");
  });

  it("calls router.push with query parameter when search term changes", async () => {
    mockGet.mockReturnValue(null);
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search movies...");
    await user.type(input, "matrix");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("?query=matrix");
    });
  });

  it("removes query parameter when search is cleared", async () => {
    mockGet.mockReturnValue("batman");
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByDisplayValue("batman");
    await user.clear(input);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("?");
    });
  });

  it("preserves other search params when updating query", async () => {
    // Mock search params with existing page and genre
    const mockToString = vi.fn(() => "page=2&genre=28");
    vi.mocked(vi.importMock("next/navigation")).useSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    });

    mockGet.mockReturnValue(null);
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search movies...");
    await user.type(input, "action");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("?page=2&genre=28&query=action");
    });
  });

  it("resets page parameter when search changes", async () => {
    const mockToString = vi.fn(() => "page=3&genre=28");
    vi.mocked(vi.importMock("next/navigation")).useSearchParams.mockReturnValue({
      get: mockGet,
      toString: mockToString,
    });

    mockGet.mockReturnValue(null);
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search movies...");
    await user.type(input, "comedy");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("?genre=28&query=comedy");
    });
  });

  it("has correct styling classes", () => {
    mockGet.mockReturnValue(null);
    render(<SearchBar />);

    const input = screen.getByPlaceholderText("Search movies...");
    expect(input).toHaveClass(
      "w-full",
      "px-4",
      "py-3",
      "pl-12",
      "text-gray-900",
      "bg-white",
      "border",
      "border-gray-300",
      "rounded-lg",
      "focus:ring-2",
      "focus:ring-blue-500",
      "focus:border-transparent",
      "outline-none"
    );
  });

  it("has proper accessibility attributes", () => {
    mockGet.mockReturnValue(null);
    render(<SearchBar />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Search movies...");
  });
});
