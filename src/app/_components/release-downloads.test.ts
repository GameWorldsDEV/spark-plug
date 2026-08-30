import { describe, expect, it } from "vitest";

import { detectReleasePlatform } from "./release-downloads";

describe("release platform detection", () => {
  it.each([
    ["MacIntel", "macos"],
    ["iPhone", "macos"],
    ["Windows NT 10.0", "windows"],
    ["X11; Linux aarch64", "linux"],
    ["Linux; Android 16", "android"],
  ])("maps %s to %s", (value, expected) => {
    expect(detectReleasePlatform(value)).toBe(expected);
  });

  it("leaves unknown platforms neutral", () => {
    expect(detectReleasePlatform("unknown device")).toBeNull();
  });
});
