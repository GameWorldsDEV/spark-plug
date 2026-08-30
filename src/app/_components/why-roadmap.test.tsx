import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import WhySparkPlugPage from "../why-spark-plug/page";
import { RoadmapSection } from "./roadmap-section";
import { WhyTeaser } from "./why-teaser";

describe("WhyTeaser", () => {
  it("links the homepage promise to the full explanation", async () => {
    const { container } = render(<WhyTeaser />);
    expect(screen.getByRole("link", { name: /why spark plug exists/i })).toHaveAttribute("href", "/why-spark-plug");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RoadmapSection", () => {
  it("keeps current builds, preparing artifacts, next work, and roadmap separate", async () => {
    const { container } = render(<RoadmapSection />);
    const timeline = screen.getByRole("list");

    expect(within(timeline).getByText("NOW")).toBeInTheDocument();
    expect(within(timeline).getByText("PREPARING")).toBeInTheDocument();
    expect(within(timeline).getByText("NEXT")).toBeInTheDocument();
    expect(within(timeline).getByText("ROADMAP")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /benchmarks/i })).toHaveAttribute("href", "/benchmarks");
    expect(screen.getAllByRole("img", { name: /reserved space for a scrubbed/i })).toHaveLength(2);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("WhySparkPlugPage", () => {
  it("distinguishes remote reachability from authorization", async () => {
    const { container } = render(<WhySparkPlugPage />);
    expect(screen.getByRole("heading", { name: "Reachability is not authorization." })).toBeInTheDocument();
    expect(screen.getByText(/pairing and node authentication remain the gate/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /for developers and businesses/i })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
