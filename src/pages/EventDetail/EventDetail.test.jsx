globalThis.mockUseParams = vi.fn();

import { render, screen, waitFor } from "@testing-library/react";
import EventDetail from "./EventDetail";

vi.mock("../../firebase/firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}));
vi.mock("react-router-dom", () => {
  const actual = vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => globalThis.mockUseParams(),
  };
});

import { getDoc } from "firebase/firestore";

describe("EventDetail component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    globalThis.mockUseParams.mockReturnValue({ eventId: "1" });
    render(<EventDetail />);
    expect(screen.getByText(/Loading event details/i)).toBeInTheDocument();
  });

  it("renders event details after fetch", async () => {
    globalThis.mockUseParams.mockReturnValue({ eventId: "1" });
    getDoc.mockResolvedValue({
      exists: () => true,
      id: "1",
      data: () => ({
        title: "Test Event",
        description: "Event description",
        date: "2024-06-01T12:00:00Z",
        location: "NY",
        category: "Music",
        imageUrl: "https://img.com/test.jpg",
        organizerName: "Org",
        contactEmail: "org@email.com",
      }),
    });
    render(<EventDetail />);
    await waitFor(() => expect(screen.getByText(/Test Event/i)).toBeInTheDocument());
    expect(screen.getByText(/Event description/i)).toBeInTheDocument();
    expect(screen.getByText(/Music/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Org/i)[0]).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Test Event/i })).toHaveAttribute("src", "https://img.com/test.jpg");
  });

  it("renders error if event not found", async () => {
    globalThis.mockUseParams.mockReturnValue({ eventId: "2" });
    getDoc.mockResolvedValue({ exists: () => false });
    render(<EventDetail />);
    await waitFor(() => expect(screen.getByText(/Event not found/i)).toBeInTheDocument());
  });

  it("renders error on fetch failure", async () => {
    globalThis.mockUseParams.mockReturnValue({ eventId: "3" });
    getDoc.mockRejectedValue(new Error("fail"));
    render(<EventDetail />);
    await waitFor(() => expect(screen.getByText(/Failed to fetch event details/i)).toBeInTheDocument());
  });
});
