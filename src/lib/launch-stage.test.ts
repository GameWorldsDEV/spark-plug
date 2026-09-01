import { describe, expect, it } from "vitest";
import { launchCapabilities, parseLaunchStage } from "./launch-stage";

describe("launch stage", () => {
  it("fails closed to Preview", () => {
    expect(parseLaunchStage(undefined)).toBe("preview");
    expect(parseLaunchStage("anything-else")).toBe("preview");
    expect(launchCapabilities("preview", true)).toEqual({
      stage: "preview",
      downloads: false,
      accounts: false,
      billing: false,
      profilePublishing: false,
      hostedTraining: false,
      indexable: false,
    });
  });

  it("separates Release from Commercial", () => {
    expect(launchCapabilities("release", true)).toMatchObject({
      downloads: true,
      accounts: false,
      billing: false,
      profilePublishing: false,
      indexable: true,
    });
    expect(launchCapabilities("commercial", true)).toMatchObject({
      downloads: true,
      accounts: true,
      billing: true,
      profilePublishing: true,
      hostedTraining: false,
      indexable: true,
    });
  });
});

