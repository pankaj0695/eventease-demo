import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

vi.mock("../../firebase/auth", () => ({
  LoginWithEmailPassword: vi.fn(),
}));
vi.mock("../../contexts/authContext", () => ({
  useAuth: () => ({ isLoggedIn: false }),
}));

describe("Login page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});
