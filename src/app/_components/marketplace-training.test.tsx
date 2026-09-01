import { render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import { MarketplaceSection, marketplaceProfiles } from "./marketplace-section";
import { TrainingSection, trainingSteps } from "./training-section";

describe("MarketplaceSection", () => {
  it("presents editable curated profiles without claiming the catalog is live", async () => {
    const { container } = render(<MarketplaceSection />);
    expect(screen.getByRole("heading", { name: /start with a profile/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /catalog preparing/i })).toHaveLength(marketplaceProfiles.length);
    expect(screen.getByText(/public catalog interface is preparing/i)).toBeInTheDocument();
    expect(screen.getByText(/review each model.*license and requirements/i)).toBeInTheDocument();
    expect(container.querySelector('img[src="/integrations/hugging-face.svg"]')).toBeInTheDocument();
    expect(within(screen.getByLabelText("Engine-specific model lanes")).getAllByRole("listitem")).toHaveLength(5);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("TrainingSection", () => {
  it("keeps Unsloth and LoRA training explicitly on the roadmap", async () => {
    const { container } = render(<TrainingSection />);
    expect(screen.getByRole("heading", { name: /tune the model/i })).toBeInTheDocument();
    expect(screen.getAllByText(/coming soon/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/not a first-release claim/i)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(trainingSteps.length);
    expect(await axe(container)).toHaveNoViolations();
  });
});
