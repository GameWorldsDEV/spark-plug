import { describe, expect, it } from "vitest";
import { launchCapabilities, parseLaunchStage } from "./launch-stage";

describe("launch stage", () => {
  it("fails closed to Preview", () => {
    expect(parseLaunchStage(undefined)).toBe("preview");
    expect(parseLaunchStage("anything-else")).toBe("preview");
    expect(launchCapabilities("preview", true)).toEqual({
      stage: "preview",
      downloads: false,
      indexable: false,
    });
  });

  it("enables only verified release capabilities", () => {
    expect(launchCapabilities("release", true)).toMatchObject({
      downloads: true,
      indexable: true,
    });
    expect(parseLaunchStage("commercial")).toBe("preview");
  });
});
