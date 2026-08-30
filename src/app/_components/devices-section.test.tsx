import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { DevicesSection } from "./devices-section";

describe("DevicesSection", () => {
  it("shows official connectivity marks and separates build status from roadmap", () => {
    render(<DevicesSection />);
    expect(screen.getByAltText("Tailscale logo")).toHaveAttribute("src", "/connectivity/tailscale.svg");
    expect(screen.getByAltText("Headscale logo")).toHaveAttribute("src", "/connectivity/headscale.svg");
    expect(screen.getByText("Another trusted user-managed VPN")).toBeVisible();

    const current = screen.getByText("WORKING-BUILD CONTROL SURFACES").closest("article");
    const coming = screen.getByText("COMING SOON").closest("article");
    expect(current).not.toBeNull();
    expect(coming).not.toBeNull();
    for (const client of ["Browser", "Mac", "iPhone", "iPad"]) expect(within(current!).getByText(client)).toBeVisible();
    for (const client of ["Windows", "Android"]) expect(within(coming!).getByText(client)).toBeVisible();
    expect(screen.getByText(/public downloads remain disabled/i)).toBeVisible();
  });

  it("distinguishes network reachability from node authorization", async () => {
    const { container } = render(<DevicesSection />);
    expect(screen.getByText(/VPN reachability gets you to the node/i)).toBeVisible();
    expect(screen.getByText(/pairing and node authentication still decide/i)).toBeVisible();
    expect(screen.getByLabelText(/desktop, laptop, phone, and tablet/i)).toBeVisible();
    expect(await axe(container)).toHaveNoViolations();
  });
});
