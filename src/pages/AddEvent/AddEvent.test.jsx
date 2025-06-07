globalThis.mockDb = {};
global.URL.createObjectURL = vi.fn(() => "mock-url");
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ secure_url: "https://img.com/test.jpg" }),
  })
);

vi.mock("../../firebase/firebase", () => ({ db: globalThis.mockDb }));
vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(() => Promise.resolve()),
  collection: vi.fn(),
  serverTimestamp: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
}));
vi.mock("react-hot-toast", () => ({
  toast: {
    loading: vi.fn(() => 1),
    dismiss: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import AddEvent from "./AddEvent";

describe("AddEvent component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls addDoc and shows success toast on submit", async () => {
    const { addDoc } = await import("firebase/firestore");
    const { toast } = await import("react-hot-toast");
    const fetchSpy = vi.spyOn(global, "fetch");
    render(<AddEvent />);
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Event Title/i), { target: { value: "Test Event" } });
    fireEvent.change(screen.getByLabelText(/Event Description/i), { target: { value: "desc" } });
    fireEvent.change(screen.getByLabelText(/Date and Time/i), { target: { value: "2024-06-01T12:00" } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: "NY" } });
    fireEvent.change(screen.getByLabelText(/Event Category/i), { target: { value: "Music" } });
    fireEvent.change(screen.getByLabelText(/Organizer Name/i), { target: { value: "Org" } });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), { target: { value: "test@email.com" } });
    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    await act(async () => {
    fireEvent.submit(screen.getByTestId("add-event-form"));
    });
    await waitFor(() => expect(addDoc).toHaveBeenCalled(), { timeout: 3000 });
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Event created successfully!"));
  });
});
