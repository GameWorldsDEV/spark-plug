import { describe, expect, it } from "vitest";

import { detectMobileStore, detectReleasePlatform } from "./release-downloads";

describe("release platform detection", () => {
  it.each([
    ["MacIntel", "macos"],
    ["iPhone", null],
    ["iPad", null],
    ["Windows NT 10.0", "windows"],
    ["X11; Linux aarch64", "linux"],
    ["Linux; Android 16", "android"],
  ])("maps %s to %s", (value, expected) => {
    expect(detectReleasePlatform(value)).toBe(expected);
  });

  it("leaves unknown platforms neutral", () => {
    expect(detectReleasePlatform("unknown device")).toBeNull();
  });

  it("does not highlight macOS for an iPad requesting the desktop site", () => {
    const desktopIPad = "MacIntel Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/18.6 Safari/605.1.15";
    expect(detectReleasePlatform(desktopIPad, 5)).toBeNull();
    expect(detectMobileStore(desktopIPad, 5)).toBe("ios");
  });

  it("keeps a real Mac mapped to macOS", () => {
    const mac = "MacIntel Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15";
    expect(detectReleasePlatform(mac, 0)).toBe("macos");
    expect(detectMobileStore(mac, 0)).toBeNull();
  });

  it.each([
    ["iPhone", "ios"],
    ["iPad", "ios"],
    ["Linux; Android 16", "android"],
    ["MacIntel", null],
  ])("maps %s to its mobile store %s", (value, expected) => {
    expect(detectMobileStore(value)).toBe(expected);
  });
});
