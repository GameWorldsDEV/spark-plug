import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { PricingPlans } from "./pricing-plans";

describe("PricingPlans", () => {
  it("switches the visible Pro price and remains accessible", async () => {
    const { container } = render(<PricingPlans />);

    expect(screen.getByText("$5")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /annual/i }));
    expect(screen.getByText("$4")).toBeInTheDocument();
    expect(screen.getByText("Billed $48 yearly")).toBeInTheDocument();

    expect(await axe(container)).toHaveNoViolations();
  });
});
