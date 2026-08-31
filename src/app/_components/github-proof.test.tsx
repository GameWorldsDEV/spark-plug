import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { GitHubProof } from "./github-proof";

describe("GitHubProof", () => {
  it("labels live stars and latest-release downloads precisely", async () => {
    const view = await GitHubProof({ metrics: {
      stars: 1234,
      latestReleaseDownloads: 0,
      releaseTag: "v1.0.0",
      updatedAt: "2026-08-31T12:00:00.000Z",
      status: "live",
    } });
    const { container } = render(view);

    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Latest release downloads")).toBeInTheDocument();
    expect(screen.getByText(/not repository clones or all-time traffic/i)).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows Coming soon instead of a false zero when no release exists", async () => {
    render(await GitHubProof({ metrics: {
      stars: 4,
      latestReleaseDownloads: null,
      releaseTag: null,
      updatedAt: "2026-08-31T12:00:00.000Z",
      status: "preparing",
    } }));

    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByText("No public release asset yet")).toBeInTheDocument();
  });

  it("fails visibly safe when GitHub is unavailable", async () => {
    render(await GitHubProof({ metrics: {
      stars: null,
      latestReleaseDownloads: null,
      releaseTag: null,
      updatedAt: null,
      status: "unavailable",
    } }));

    expect(screen.getAllByText("Unavailable")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /open the GitHub repository/i })).toHaveAttribute(
      "href",
      "https://github.com/GameWorldsDEV/spark-plug",
    );
  });
});
