import { fireEvent, render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { ProfileWorkflow, workflowProfiles } from "./profile-workflow";

describe("ProfileWorkflow", () => {
  it("switches engines, models, queues, routes, and status atomically", () => {
    render(<ProfileWorkflow />);
    const tabs = screen.getAllByRole("tab");
    const panel = screen.getByRole("tabpanel");
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(within(panel).getByText("Qwen")).toBeVisible();
    expect(within(panel).getByText("READY")).toBeVisible();

    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(panel).toHaveAttribute("aria-labelledby", "profile-tab-creative");
    expect(within(panel).getByText("Preferred workflow")).toBeVisible();
    expect(within(panel).getByText("MEDIA READY")).toBeVisible();
    expect(within(panel).getByText(/Switchyard is not a media runtime/i)).toBeVisible();

    fireEvent.click(tabs[2]);
    expect(within(panel).getByText("GLM")).toBeVisible();
    expect(within(panel).getByText("Nemotron")).toBeVisible();
    expect(within(panel).getByText("QUEUES READY")).toBeVisible();
  });

  it("supports ArrowLeft, ArrowRight, Home, and End with one tab stop", async () => {
    const { container } = render(<ProfileWorkflow />);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[1]);
    fireEvent.keyDown(tabs[1], { key: "End" });
    expect(document.activeElement).toBe(tabs[2]);
    fireEvent.keyDown(tabs[2], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(tabs[1]);
    fireEvent.keyDown(tabs[1], { key: "Home" });
    expect(document.activeElement).toBe(tabs[0]);
    expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
    expect(workflowProfiles.map(({ id }) => id)).toEqual(["code", "creative", "background"]);
    expect(await axe(container)).toHaveNoViolations();
  });
});
