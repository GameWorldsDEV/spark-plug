import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { comfyCapabilities, comfyQueueStates, ComfySection } from "./comfy-section";

describe("ComfySection", () => {
  it("describes the supported media workflow boundaries precisely", () => {
    render(<ComfySection />);

    expect(comfyCapabilities.map(([kind]) => kind)).toEqual(["IMAGE", "VIDEO", "3D", "AUDIO"]);
    expect(screen.getByAltText("ComfyUI logo")).toHaveAttribute("src", "/engines/comfyui.svg");
    expect(screen.getByText("Audio through imported or custom ComfyUI workflows.")).toBeVisible();
    expect(screen.getByText(/there is not yet a dedicated one-click audio endpoint/i)).toBeVisible();
    expect(screen.getByText(/TRELLIS runs as a ComfyUI workflow—not as a separate Spark Plug engine/i)).toBeVisible();
  });

  it("shows the full queue and verified memory arbitration sequence", () => {
    render(<ComfySection />);

    for (const [state] of comfyQueueStates) {
      expect(screen.getByText(state)).toBeVisible();
    }
    expect(screen.getByRole("list", { name: /ComfyUI memory arbitration sequence/i })).toHaveTextContent(/HOLD.*EVICT.*RENDER.*RESTORE/);
    expect(screen.getByText(/unload that conflicting model/i)).toBeVisible();
    expect(screen.getByText(/restore the previous model afterward/i)).toBeVisible();
    expect(screen.getByRole("button", { name: "LOAD" })).toBeVisible();
    expect(screen.getByRole("button", { name: "UNLOAD" })).toBeVisible();
  });

  it("has no automated accessibility violations", async () => {
    const { container } = render(<ComfySection />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
