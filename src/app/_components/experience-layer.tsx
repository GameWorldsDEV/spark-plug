"use client";

import { useEffect } from "react";

export function ExperienceLayer() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      root.dataset.motion = "reduced";
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
        node.dataset.visible = "true";
      });
      return;
    }

    root.dataset.motion = "ready";
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10%", threshold: 0.12 },
    );

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
      observer.observe(node);
    });

    let frame = 0;
    const updateScroll = () => {
      frame = 0;
      const range = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      root.style.setProperty(
        "--page-progress",
        String(Math.min(1, window.scrollY / range)),
      );
    };
    const onScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="page-progress" aria-hidden="true" />;
}
