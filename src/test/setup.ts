import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { afterEach, expect } from "vitest";

expect.extend(toHaveNoViolations);
afterEach(() => {
  if (typeof document !== "undefined") cleanup();
});

class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0];

  disconnect() {}
  observe(target: Element) {
    target.setAttribute("data-visible", "true");
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

if (typeof window !== "undefined") {
  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    value: IntersectionObserverStub,
  });

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });

  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => window.setTimeout(callback, 0),
  });

  Object.defineProperty(window, "cancelAnimationFrame", {
    configurable: true,
    value: (id: number) => window.clearTimeout(id),
  });
}
