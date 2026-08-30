"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import styles from "./rabbit-section.module.css";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MODEL_ID = "603e8491e9494904827369f6408a265a";
const MODEL_URL = "https://sketchfab.com/3d-models/rabbit-r1-ai-603e8491e9494904827369f6408a265a";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";

function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function prefersReducedMotion() {
  return window.matchMedia(MOTION_QUERY).matches;
}

function serverPrefersReducedMotion() {
  return true;
}

export function getRabbitEmbedUrl(reducedMotion: boolean) {
  const parameters = new URLSearchParams({
    autostart: "1",
    autospin: reducedMotion ? "0" : "0.18",
    scrollwheel: "0",
    dnt: "1",
  });

  return `https://sketchfab.com/models/${MODEL_ID}/embed?${parameters.toString()}`;
}

export function RabbitSection() {
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    prefersReducedMotion,
    serverPrefersReducedMotion,
  );
  const [viewerFailed, setViewerFailed] = useState(false);
  const viewerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleFailure = () => setViewerFailed(true);
    viewer.addEventListener("error", handleFailure);
    return () => viewer.removeEventListener("error", handleFailure);
  }, [reducedMotion]);

  return (
    <section className={styles.section} id="rabbit-r1" aria-labelledby="rabbit-title">
      <div className={styles.viewerColumn}>
        <div className={styles.viewerShell}>
          <div
            className={styles.staticFallback}
            aria-hidden={!viewerFailed}
          >
            <div
              className={styles.fallbackDevice}
              role={viewerFailed ? "img" : undefined}
              aria-label={viewerFailed ? "Static Rabbit R1 preview" : undefined}
            >
              <span>r1</span>
              <i aria-hidden="true" />
              <strong>SPARK PLUG</strong>
            </div>
            {viewerFailed && (
              <p>
                The interactive model could not load.{" "}
                <a href={MODEL_URL} rel="noopener noreferrer">View it on Sketchfab ↗</a>
              </p>
            )}
          </div>

          {!viewerFailed && (
            <iframe
              ref={viewerRef}
              key={reducedMotion ? "reduced" : "animated"}
              className={styles.viewer}
              title="Interactive 3D model of the Rabbit R1"
              src={getRabbitEmbedUrl(reducedMotion)}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
          )}

          <div className={styles.viewerLabel} aria-hidden="true">
            <span>INTERACTIVE MODEL</span>
            <strong>{reducedMotion ? "ROTATION OFF" : "GENTLE ROTATION"}</strong>
          </div>
        </div>

        <p className={styles.attribution}>
          <a href={MODEL_URL} rel="noopener noreferrer">Rabbit R1 | AI</a>
          {" by ItsKevin on Sketchfab — "}
          <a href={LICENSE_URL} rel="noopener noreferrer">CC BY 4.0</a>.
        </p>
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}>RABBIT R1 / INTEGRATION PREVIEW</p>
        <h2 id="rabbit-title">Bring Spark Plug to your Rabbit R1.</h2>
        <p className={styles.lead}>
          Start from the handheld you already carry, then send approved work to
          the Spark Plug broker and models running on your own machine.
        </p>

        <div className={styles.flow} aria-label="Rabbit R1 request path">
          <div><span>01</span><strong>ASK</strong><small>Rabbit R1</small></div>
          <i aria-hidden="true">→</i>
          <div><span>02</span><strong>TRANSPORT</strong><small>Rabbit service</small></div>
          <i aria-hidden="true">→</i>
          <div><span>03</span><strong>RUN</strong><small>Spark Plug node</small></div>
        </div>

        <p className={styles.disclosure}>
          Rabbit transports requests between the device and the connected
          computer. Local execution begins after that transport reaches Spark
          Plug. This independent integration is not a Rabbit partnership or
          endorsement. <Link href="/terms#rabbit-r1">Read the complete disclosure.</Link>
        </p>

        <p className={styles.viewerPrivacy}>
          The 3D viewer loads automatically and contacts Sketchfab. Sketchfab&apos;s
          terms and privacy practices apply.
        </p>
      </div>
    </section>
  );
}
