import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EventCard from "./EventCard";

describe("EventCard component", () => {
  const event = {
    id: "1",
    title: "Sample Event",
    description: "This is a sample event description that is quite long and should be truncated in the card display for testing purposes.",
    date: "2024-06-01T12:00:00Z",
    location: "New York",
    category: "Music",
    imageUrl: "https://example.com/image.jpg",
  };

  it("renders event details correctly", () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );
    expect(screen.getByText("Sample Event")).toBeInTheDocument();
    expect(screen.getByText("Music")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Sample Event/i })).toHaveAttribute("src", event.imageUrl);
    expect(screen.getByText(/View Details/i)).toHaveAttribute("href", "/events/1");
  });

  it("truncates long description", () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );
    const truncated = event.description.slice(0, 80) + "...";
    expect(screen.getByText(truncated)).toBeInTheDocument();
  });

  it("shows formatted date", () => {
    render(
      <MemoryRouter>
        <EventCard event={event} />
      </MemoryRouter>
    );
    // The formatted date for 2024-06-01T12:00:00Z in en-US is "Jun 1, 2024"
    expect(screen.getByText("Jun 1, 2024")).toBeInTheDocument();
  });
});
