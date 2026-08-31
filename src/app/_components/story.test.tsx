import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { Story, storyStages } from "./story";

describe("Story", () => {
  it("keeps the approved six-stage story and status mapping in order", () => {
    expect(storyStages.map(({ key }) => key)).toEqual(["app", "engines", "agents", "models", "profile", "run"]);
    expect(storyStages.map(({ status }) => status)).toEqual([
      "APP DOWNLOADING", "ENGINES CONFIGURING", "AGENTS CONNECTED", "MODELS DOWNLOADING", "CAPACITY CHECKED", "LOCAL AI READY",
    ]);
    const { container } = render(<Story />);
    expect(container.querySelector('[data-stage="0"][data-intro="true"]')).toBeTruthy();
    for (const item of storyStages) {
      expect(screen.getAllByRole("heading", { name: item.title, hidden: true }).length).toBeGreaterThan(0);
      expect(screen.getAllByText(item.status).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole("link", { name: /download for dgx spark/i })).toHaveAttribute("href", "#release");
    expect(screen.getByRole("link", { name: /see compatible tools/i })).toHaveAttribute("href", "#tools");
    expect(screen.getByRole("button", { name: /ios app store.*coming soon/i, hidden: true })).toBeDisabled();
    expect(screen.getByRole("button", { name: /google play.*coming soon/i, hidden: true })).toBeDisabled();
  });

  it("labels planned engines separately and keeps every decorative mark beside text", async () => {
    const { container } = render(<Story />);
    expect(screen.getAllByText("QUALIFIED FIRST").length).toBeGreaterThan(0);
    expect(screen.getAllByText("WORKING BUILD")).toHaveLength(2);
    expect(screen.getByText("PLANNED / MAC NODES")).toBeInTheDocument();
    expect(screen.getByText("PLANNED")).toBeInTheDocument();
    for (const name of ["OpenClaw", "Hermes Agent", "Paperclip", "Codex", "Claude Code", "HUGGING FACE"]) expect(screen.getByText(name)).toBeInTheDocument();
    expect(container.querySelectorAll('img[alt=""]')).toHaveLength(12);
    expect(container.querySelector('img[src="/integrations/codex.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/integrations/claude-code.png"]')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
