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
    expect(container.querySelectorAll("img[data-tool-mark]")).toHaveLength(6);
    expect(container.querySelector('[src="/integrations/codex.svg"]')).not.toBeInTheDocument();
    expect(container.querySelector('[src="/integrations/claude-code.svg"]')).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RoutingSection", () => {
  it("describes a concise return path and keeps Switchyard advisory", async () => {
    const { container } = render(<RoutingSection />);

    expect(screen.getByRole("heading", { name: /one request in/i })).toBeInTheDocument();
    const flow = screen.getByRole("list", { name: /how a routed request moves/i });
    expect(within(flow).getAllByRole("listitem")).toHaveLength(4);
    expect(within(flow).getByText("GW Broker")).toBeInTheDocument();
    expect(within(flow).getByText("Switchyard")).toBeInTheDocument();
    expect(screen.getByText(/result returns through GW Broker/i)).toBeInTheDocument();
    expect(screen.getByText(/Switchyard skipped. Broker admission still applies/i)).toBeInTheDocument();
    expect(screen.getByText(/vLLM \/ Nemotron 8B/i)).toBeInTheDocument();
    expect(screen.getByText(/Colibri \/ GLM-5.2/i)).toBeInTheDocument();
    expect(screen.getByText("MLX").nextSibling).toHaveTextContent("Planned");
    expect(screen.getByText("Ollama").nextSibling).toHaveTextContent("Planned");
    expect(screen.getByText(/ComfyUI image, video, 3D/i)).toHaveTextContent(/not Switchyard text routing/i);
    expect(await axe(container)).toHaveNoViolations();
  });
});
