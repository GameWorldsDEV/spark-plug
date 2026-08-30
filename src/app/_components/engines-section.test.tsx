import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { engineCards, EnginesSection } from "./engines-section";

describe("EnginesSection", () => {
  it("keeps every runtime and qualification status separate", () => {
    render(<EnginesSection />);

    expect(engineCards.map(({ name }) => name)).toEqual(["vLLM", "Colibri", "ComfyUI", "MLX", "Ollama"]);
    expect(screen.getByAltText("vLLM logo")).toHaveAttribute("src", "/engines/vllm.svg");
    expect(screen.getByAltText("Colibri logo")).toHaveAttribute("src", "/engines/colibri.svg");
    expect(screen.getByAltText("ComfyUI logo")).toHaveAttribute("src", "/engines/comfyui.svg");
    expect(screen.getByAltText("MLX logo")).toHaveAttribute("src", "/engines/mlx.svg");
    expect(screen.getByAltText("Ollama logo")).toHaveAttribute("src", "/engines/ollama.svg");
    expect(screen.getAllByText("WORKING BUILD")).toHaveLength(2);
    expect(screen.getAllByText("PLANNED")).toHaveLength(2);
    expect(screen.queryByText(/MLX \+ Ollama/i)).not.toBeInTheDocument();
    expect(screen.getByText("APPLE SILICON NODES")).toBeVisible();
    expect(screen.getByText("PENDING PLATFORM QUALIFICATION")).toBeVisible();
  });

  it("labels sample capacity and telemetry without making universal privacy claims", () => {
    render(<EnginesSection />);

    expect(screen.getByText("ILLUSTRATIVE LIVE SNAPSHOT")).toBeVisible();
    expect(screen.getByText("Unified memory")).toBeVisible();
    expect(screen.getByText("Loaded models")).toBeVisible();
    expect(screen.getByText("Queue pressure")).toBeVisible();
    expect(screen.getByText("Power")).toBeVisible();
    expect(screen.getByText("Runtime health")).toBeVisible();
    expect(screen.getByText(/remain on the Spark Plug node by default/i)).toBeVisible();
    expect(screen.queryByText(/nothing ever leaves/i)).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /illustrative unified memory allocation/i })).toHaveAttribute("aria-valuenow", "86");
  });

  it("has no automated accessibility violations", async () => {
    const { container } = render(<EnginesSection />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
