import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

// Mock useAuth
vi.mock("../../contexts/authContext", () => ({
  useAuth: vi.fn(),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  toast: { error: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { useAuth } from "../../contexts/authContext";
import { toast } from "react-hot-toast";

describe("Home component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title, tagline, and buttons", () => {
    useAuth.mockReturnValue({ isLoggedIn: false });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Discover, host, and manage events/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Explore Events/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Add Event/i })
    ).toBeInTheDocument();
  });

  it('"Explore Events" button links to /events', () => {
    useAuth.mockReturnValue({ isLoggedIn: false });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const exploreLink = screen.getByRole("link", { name: /Explore Events/i });
    expect(exploreLink).toHaveAttribute("href", "/events");
  });

  it('"Add Event" button allows navigation if logged in', () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const addEventLink = screen.getByRole("link", { name: /Add Event/i });
    fireEvent.click(addEventLink);
    expect(toast.error).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('"Add Event" button prevents navigation, shows toast, and redirects if not logged in', () => {
    useAuth.mockReturnValue({ isLoggedIn: false });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const addEventLink = screen.getByRole("link", { name: /Add Event/i });
    fireEvent.click(addEventLink, { button: 0 });
    expect(toast.error).toHaveBeenCalledWith(
      "Please login to add an event",
      expect.objectContaining({ duration: 3000 })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      state: { from: "/addevent" },
    });
  });
});
