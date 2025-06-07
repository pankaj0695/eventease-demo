import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "./Auth";
import { useAuth } from "../../contexts/authContext";

vi.mock("../../contexts/authContext", () => ({
  useAuth: vi.fn(() => ({ isLoggedIn: false })),
}));
vi.mock("../../firebase/auth", () => ({
  LoginWithGoogle: vi.fn(() => Promise.resolve()),
}));


describe("Auth component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form by default", () => {
    render(
      <MemoryRouter>
        <Auth isSignup={false} onSubmit={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("renders signup form when isSignup is true", () => {
    render(
      <MemoryRouter>
        <Auth isSignup={true} onSubmit={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /continue with google/i })).not.toBeInTheDocument();
  });

  it("shows error message if error prop is provided", () => {
    render(
      <MemoryRouter>
        <Auth isSignup={false} onSubmit={vi.fn()} error="Test error" />
      </MemoryRouter>
    );
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", async () => {
    const onSubmit = vi.fn(() => Promise.resolve());
    render(
      <MemoryRouter>
        <Auth isSignup={false} onSubmit={onSubmit} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it("calls LoginWithGoogle when Google button is clicked", async () => {
    const { LoginWithGoogle } = await import("../../firebase/auth");
    render(
      <MemoryRouter>
        <Auth isSignup={false} onSubmit={vi.fn()} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));
    await waitFor(() => expect(LoginWithGoogle).toHaveBeenCalled());
  });

  it("redirects to home if already logged in", () => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    render(
      <MemoryRouter>
        <Auth isSignup={false} onSubmit={vi.fn()} />
      </MemoryRouter>
    );
    // The form should not be in the document
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });
});
