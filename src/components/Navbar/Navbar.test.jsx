import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../contexts/authContext";

let mockAuthValue = { isLoggedIn: false, user: null };
const mockLocation = { pathname: "/" };

vi.mock("../../contexts/authContext", () => ({
  useAuth: () => mockAuthValue,
}));
vi.mock("../../firebase/auth", () => ({
  Logout: vi.fn(() => Promise.resolve()),
}));
vi.mock("react-hot-toast", () => ({
  toast: { error: vi.fn() },
}));
import { toast } from "react-hot-toast";
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});
import { Logout } from "../../firebase/auth";

describe("Navbar component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthValue = { isLoggedIn: false, user: null };
    mockLocation.pathname = "/";
  });

  it("shows profile and logout when logged in", () => {
    mockAuthValue = { isLoggedIn: true, user: { displayName: "Test User", photoURL: "" } };
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    // Find the profile button by aria-label
    const profileBtn = screen.getAllByRole("button").find(btn => btn.getAttribute("aria-label") === "Profile");
    expect(profileBtn).toBeTruthy();
    fireEvent.click(profileBtn);
    // Find the user name in the DOM (multiple matches possible)
    expect(screen.getAllByText("Test User")[0]).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  it("calls Logout and navigates to login on logout click", async () => {
    mockAuthValue = { isLoggedIn: true, user: { displayName: "Test User", photoURL: "" } };
    mockLocation.pathname = "/";
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    const profileBtn = screen.getAllByRole("button").find(btn => btn.getAttribute("aria-label") === "Profile");
    fireEvent.click(profileBtn);
    fireEvent.click(screen.getByText(/Logout/i));
    expect(Logout).toHaveBeenCalled();
    await Promise.resolve();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("renders logo, title, and links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/EventEase/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Events/i })).toHaveAttribute("href", "/events");
    expect(screen.getByRole("link", { name: /Add Event/i })).toHaveAttribute("href", "/addevent");
    expect(screen.getByRole("link", { name: /Login/i })).toHaveAttribute("href", "/login");
  });

  it("hides navbar on /login and /signup routes", () => {
    mockLocation.pathname = "/login";
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("shows toast and navigates to login if not logged in and Add Event clicked", () => {
    mockAuthValue = { isLoggedIn: false, user: null };
    mockLocation.pathname = "/";
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("link", { name: /Add Event/i }));
    expect(toast.error).toHaveBeenCalledWith(
      "Please login to add an event",
      expect.objectContaining({ duration: 3000 })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/login", { state: { from: "/addevent" } });
  });
});
