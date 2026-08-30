import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import { getRabbitEmbedUrl, RabbitSection } from "./rabbit-section";

describe("RabbitSection", () => {
  it("loads the supplied Sketchfab model immediately with the required parameters", async () => {
    render(<RabbitSection />);

    const viewer = screen.getByTitle("Interactive 3D model of the Rabbit R1");
    await waitFor(() => expect(viewer).toHaveAttribute("src", getRabbitEmbedUrl(false)));

    const url = new URL(viewer.getAttribute("src") ?? "");
    expect(url.pathname).toBe("/models/603e8491e9494904827369f6408a265a/embed");
    expect(url.searchParams.get("autostart")).toBe("1");
    expect(url.searchParams.get("autospin")).toBe("0.18");
    expect(url.searchParams.get("scrollwheel")).toBe("0");
    expect(url.searchParams.get("dnt")).toBe("1");
    expect(viewer).not.toHaveAttribute("loading", "lazy");
  });

  it("turns model rotation off when the user prefers reduced motion", () => {
    const originalMatchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...originalMatchMedia(query),
      matches: query === "(prefers-reduced-motion: reduce)",
    }));

    render(<RabbitSection />);

    const viewer = screen.getByTitle("Interactive 3D model of the Rabbit R1");
    const url = new URL(viewer.getAttribute("src") ?? "");
    expect(url.searchParams.get("autospin")).toBe("0");
    expect(screen.getByText("ROTATION OFF")).toBeVisible();
  });

  it("shows attribution, the transport boundary, terms, and a static error fallback", async () => {
    render(<RabbitSection />);

    expect(screen.getByText(/Rabbit R1 \| AI/)).toBeVisible();
    expect(screen.getByText(/by ItsKevin on Sketchfab/)).toBeVisible();
    expect(screen.getByRole("link", { name: "CC BY 4.0" })).toHaveAttribute("href", "https://creativecommons.org/licenses/by/4.0/");
    expect(screen.getByRole("link", { name: "Read the complete disclosure." })).toHaveAttribute("href", "/terms#rabbit-r1");
    expect(screen.getByText(/The 3D viewer loads automatically and contacts Sketchfab/i)).toBeVisible();

    const viewer = screen.getByTitle("Interactive 3D model of the Rabbit R1");
    await waitFor(() => expect(viewer).toHaveAttribute("src", getRabbitEmbedUrl(false)));
    fireEvent.error(viewer);

    await waitFor(() => expect(screen.queryByTitle("Interactive 3D model of the Rabbit R1")).not.toBeInTheDocument());
    expect(screen.getByRole("img", { name: "Static Rabbit R1 preview" })).toBeVisible();
    expect(screen.getByText(/interactive model could not load/i)).toBeVisible();
  });

  it("has no automated accessibility violations", async () => {
    const { container } = render(<RabbitSection />);
    const viewer = screen.getByTitle("Interactive 3D model of the Rabbit R1");
    await waitFor(() => expect(viewer).toHaveAttribute("src", getRabbitEmbedUrl(false)));
    fireEvent.error(viewer);
    await screen.findByRole("img", { name: "Static Rabbit R1 preview" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
