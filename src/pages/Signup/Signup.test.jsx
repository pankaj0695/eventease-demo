import { render, screen } from "@testing-library/react";
import Signup from "./Signup";
import { MemoryRouter } from "react-router-dom";

// Removed Auth mock to use the real Auth component for realistic form submission
vi.mock("../../firebase/auth", () => ({
  signUpWithEmailPassword: vi.fn(),
}));
vi.mock("../../contexts/authContext", () => ({
  useAuth: () => ({ isLoggedIn: false }),
}));

describe("Signup page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders signup form", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });
});
