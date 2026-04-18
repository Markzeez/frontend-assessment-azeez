import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Must be hoisted above imports that use it
const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
  useSearchParams: () => mockSearchParams,
}));

// Import AFTER mocks are set up
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders the search input", () => {
    render(<SearchBar />);
    expect(screen.getByRole("searchbox", { name: /search movies/i })).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "Batman");
    expect(input).toHaveValue("Batman");
  });

  it("debounces URL updates — does not push immediately on keystroke", async () => {
    const user = userEvent.setup({ delay: 10 });
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "Inc");
    // Should not have pushed yet (debounce is 350ms)
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("pushes to router after debounce delay", async () => {
    const user = userEvent.setup({ delay: 10 });
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "Inception");
    await waitFor(() => expect(mockPush).toHaveBeenCalled(), { timeout: 1000 });
    const pushedUrl = mockPush.mock.calls[0][0] as string;
    expect(pushedUrl).toContain("query=Inception");
  });

  it("shows clear button when input has a value", async () => {
    const user = userEvent.setup({ delay: 10 });
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "Batman");
    expect(screen.getByRole("button", { name: /clear search/i })).toBeInTheDocument();
  });

  it("clears the input when clear button is clicked", async () => {
    const user = userEvent.setup({ delay: 10 });
    render(<SearchBar />);
    const input = screen.getByRole("searchbox");
    await user.type(input, "Batman");
    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    await user.click(clearBtn);
    expect(input).toHaveValue("");
  });

  it("does not show clear button when input is empty", () => {
    render(<SearchBar />);
    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();
  });
});
