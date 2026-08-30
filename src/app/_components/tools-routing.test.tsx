import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { RoutingSection } from "./routing-section";
import { ToolsCarousel } from "./tools-carousel";

describe("ToolsCarousel", () => {
  it("exposes one accessible link per compatible tool and hides the looping duplicate", async () => {
    const { container } = render(<ToolsCarousel />);
    const region = screen.getByRole("region", { name: /bring the tools/i });

    expect(within(region).getAllByRole("link")).toHaveLength(5);
    expect(within(region).getByRole("link", { name: /hermes agent/i })).toHaveAttribute(
      "href",
      "https://github.com/NousResearch/hermes-agent",
    );
    expect(screen.getByText("OpenAI-compatible endpoint")).toBeInTheDocument();
    expect(screen.getByText("Anthropic-compatible endpoint")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RoutingSection", () => {
  it("describes every return path and keeps Switchyard advisory", async () => {
    const { container } = render(<RoutingSection />);

    expect(screen.getByRole("heading", { name: /one broker/i })).toBeInTheDocument();
    expect(screen.getByText(/Switchyard recommends a configured endpoint/i)).toBeInTheDocument();
    expect(screen.getByText(/Explicit model selection bypasses Switchyard/i)).toBeInTheDocument();
    expect(screen.getAllByText(/back to the requester/i)).toHaveLength(4);
    expect(screen.getAllByText(/vLLM \/ Nemotron 8B/i)).toHaveLength(2);
    expect(screen.getAllByText(/Colibri \/ GLM-5.2/i)).toHaveLength(2);
    expect(await axe(container)).toHaveNoViolations();
  });
});
