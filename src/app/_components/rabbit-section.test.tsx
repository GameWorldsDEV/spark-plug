import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import {
  getRabbitEmbedUrl,
  rabbitOutboundPath,
  rabbitReturnPath,
  RabbitSection,
} from "./rabbit-section";

describe("RabbitSection", () => {
  it("renders the complete prompt and response path through Rabbit infrastructure", () => {
    render(<RabbitSection />);

    expect(rabbitOutboundPath.map(([name]) => name)).toEqual([
      "Rabbit R1",
      "Rabbit service",
      "Rabbit Agent",
      "Supported harness",
      "GW Broker",
      "Approved local engine/model",
    ]);
    expect(rabbitReturnPath.map(([name]) => name)).toEqual([
      "Approved local engine/model",
      "GW Broker",
      "Supported harness",
      "Rabbit Agent",
      "Rabbit service",
      "Rabbit R1",
    ]);

    const outbound = screen.getByRole("list", { name: "Rabbit prompt outbound path" });
    const returned = screen.getByRole("list", { name: "Rabbit response return path" });
    expect(within(outbound).getByText("PROMPT CROSSES CLOUD")).toBeVisible();
    expect(within(returned).getByText("RESPONSE CROSSES CLOUD")).toBeVisible();
    expect(within(outbound).getByText("INFERENCE MAY RUN LOCALLY")).toBeVisible();
    expect(within(returned).getByText("ANSWER RETURNS")).toBeVisible();
  });

  it("keeps the Rabbit claim at feasibility and states both cloud crossings", () => {
    render(<RabbitSection />);

    expect(screen.getByText("RABBIT R1 / INTEGRATION-FEASIBILITY PREVIEW")).toBeVisible();
    expect(screen.getByText("CANARY REQUIRED")).toBeVisible();
    expect(screen.getByText(/not a supported-today Spark Plug integration/i)).toBeVisible();
    expect(screen.getByText(/Both the prompt and the response still cross Rabbit infrastructure/i)).toBeVisible();
    expect(screen.getByText(/Spark Plug authentication still applies/i)).toBeVisible();
    expect(screen.getByText(/No Rabbit partnership, sponsorship, or endorsement/i)).toBeVisible();
    expect(screen.getByRole("link", { name: "Rabbit Agent documentation ↗" })).toHaveAttribute(
      "href",
      "https://www.rabbit.tech/support/article/agents-on-rabbit-r1",
    );
  });

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

  it("preserves attribution, terms, automatic-loading disclosure, and fallback", async () => {
    render(<RabbitSection />);

    expect(screen.getByText(/Rabbit R1 \| AI/)).toBeVisible();
    expect(screen.getByText(/by ItsKevin on Sketchfab/)).toBeVisible();
    expect(screen.getByRole("link", { name: "CC BY 4.0" })).toHaveAttribute("href", "https://creativecommons.org/licenses/by/4.0/");
    expect(screen.getByRole("link", { name: "Read the complete disclosure" })).toHaveAttribute("href", "/terms#rabbit-r1");
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
