import { render, screen, waitFor } from "@testing-library/react";
import Events from "./Events";

vi.mock("../../firebase/firebase", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
}));
vi.mock("react-hot-toast", () => ({
  toast: { error: vi.fn() },
}));
vi.mock("../../components/EventCard/EventCard", () => ({
  __esModule: true,
  default: ({ event }) => <div data-testid="event-card">{event.title}</div>,
}));

import { getDocs } from "firebase/firestore";
import { toast } from "react-hot-toast";

describe("Events component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<Events />);
    expect(screen.getByText(/Loading events/i)).toBeInTheDocument();
  });

  it("renders event cards after fetch", async () => {
    getDocs.mockResolvedValue({
      docs: [
        { id: "1", data: () => ({ title: "Event 1", date: "2024-06-01" }) },
        { id: "2", data: () => ({ title: "Event 2", date: "2024-06-02" }) },
      ],
    });
    render(<Events />);
    await waitFor(() => expect(screen.getByText(/Discover Events/i)).toBeInTheDocument());
    expect(screen.getAllByTestId("event-card")).toHaveLength(2);
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
  });

  it("renders no events message if none found", async () => {
    getDocs.mockResolvedValue({ docs: [] });
    render(<Events />);
    await waitFor(() => expect(screen.getByText(/No events found/i)).toBeInTheDocument());
  });

  it("shows error toast on fetch failure", async () => {
    getDocs.mockRejectedValue(new Error("fail"));
    render(<Events />);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Failed to load events. Please try again later."));
  });
});
