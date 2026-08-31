import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { devicePanels, DevicesSection } from "./devices-section";

describe("DevicesSection", () => {
  it("renders four independent and truthful control-surface panels", () => {
    render(<DevicesSection />);

    expect(devicePanels.map(({ name, status }) => [name, status])).toEqual([
      ["Computer", "WORKING BUILD"],
      ["iPhone", "WORKING BUILD"],
      ["iPad", "WORKING BUILD"],
      ["Android mobile", "COMING SOON"],
    ]);

    const computer = screen.getByRole("article", { name: "Computer: working build" });
    expect(within(computer).getByText("BROWSER + MAC")).toBeVisible();
    expect(within(computer).getByText("CONTROLS REMOTE NODE")).toBeInTheDocument();

    for (const name of ["iPhone", "iPad"]) {
      expect(screen.getByRole("article", { name: `${name}: working build` })).toBeVisible();
    }

    const android = screen.getByRole("article", { name: "Android mobile: coming soon" });
    expect(within(android).getByText("No public build")).toBeInTheDocument();
    expect(within(android).getByText(/No compatibility or release is claimed yet/i)).toBeVisible();
  });

  it("separates working builds from downloads and preserves both roadmap clients", () => {
    render(<DevicesSection />);

    expect(screen.getByText(/They are not public-download claims/i)).toBeVisible();
    expect(screen.getByText(/Windows and Android control clients are coming soon/i)).toBeVisible();
    expect(screen.getByText(/Public artifacts remain unavailable/i)).toBeVisible();
  });

  it("keeps official network marks and node authorization boundaries", async () => {
    const { container } = render(<DevicesSection />);

    expect(screen.getByAltText("Tailscale logo")).toHaveAttribute("src", "/connectivity/tailscale.svg");
    expect(screen.getByAltText("Headscale logo")).toHaveAttribute("src", "/connectivity/headscale.svg");
    expect(screen.getByText("Another trusted user-managed VPN")).toBeVisible();
    expect(screen.getByText("Reachability does not replace authentication.")).toBeVisible();
    expect(screen.getByText(/Spark Plug pairing, node credentials, and authorization/i)).toBeVisible();
    expect(await axe(container)).toHaveNoViolations();
  });
});
