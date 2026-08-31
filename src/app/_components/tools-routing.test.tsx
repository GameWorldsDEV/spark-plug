import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { RoutingSection } from "./routing-section";
import { ToolsCarousel } from "./tools-carousel";

describe("ToolsCarousel", () => {
  it("exposes one accessible link per compatible tool and hides the looping duplicate", async () => {
    const { container } = render(<ToolsCarousel />);
    const region = screen.getByRole("region", { name: /plug in/i });

    expect(within(region).getAllByRole("link")).toHaveLength(5);
    expect(within(region).getByRole("link", { name: /hermes agent/i })).toHaveAttribute(
      "href",
      "https://github.com/NousResearch/hermes-agent",
    );
    expect(screen.getByText("OpenAI-compatible endpoint")).toBeInTheDocument();
    expect(screen.getByText("Anthropic-compatible endpoint")).toBeInTheDocument();
    expect(within(region).getAllByText(/compatibility only/i)).toHaveLength(1);
    expect(container.querySelectorAll("img[data-tool-mark]")).toHaveLength(10);
    expect(container.querySelectorAll('[src="/integrations/codex.png"]')).toHaveLength(2);
    expect(container.querySelectorAll('[src="/integrations/claude-code.png"]')).toHaveLength(2);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RoutingSection", () => {
  it("shows distinct round-trip routes to different approved models", async () => {
    const { container } = render(<RoutingSection />);

    expect(screen.getByRole("heading", { name: /one broker.*right model/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Illustrative requests")).toHaveTextContent("What time is it?");
    expect(screen.getByLabelText("Illustrative requests")).toHaveTextContent("Build a watch app.");
    expect(screen.getByLabelText("Illustrative requests")).toHaveTextContent("Prepare five days of reports.");
    expect(screen.getByLabelText("Illustrative model destinations")).toHaveTextContent("vLLM / Nemotron 8B");
    expect(screen.getByLabelText("Illustrative model destinations")).toHaveTextContent("vLLM / Qwen 27B");
    expect(screen.getByLabelText("Illustrative model destinations")).toHaveTextContent("Colibri / GLM-5.2");
    const legend = screen.getByRole("list", { name: /request route examples/i });
    expect(within(legend).getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText(/explicit model selection bypasses Switchyard.*never Broker admission/i)).toBeInTheDocument();
    expect(screen.getByText(/ComfyUI media workflows/i)).toHaveTextContent(/not Switchyard text routing/i);
    expect(await axe(container)).toHaveNoViolations();
  });
});
