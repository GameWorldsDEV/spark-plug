"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import styles from "./rabbit-section.module.css";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MODEL_ID = "603e8491e9494904827369f6408a265a";
const MODEL_URL = "https://sketchfab.com/3d-models/rabbit-r1-ai-603e8491e9494904827369f6408a265a";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
const RABBIT_AGENT_DOCS = "https://www.rabbit.tech/support/article/agents-on-rabbit-r1";

export const rabbitOutboundPath = [
  ["Rabbit R1", "VOICE OR TEXT"],
  ["Rabbit service", "TRANSPORT TO YOUR COMPUTER"],
  ["Rabbit Agent", "REACHES THE ENROLLED COMPUTER"],
  ["Approved local harness", "OPENCLAW · HERMES · CLAUDE CODE"],
  ["Spark Plug + Guardian", "POLICY · AUTHENTICATION · ADMISSION"],
  ["Approved local model", "INFERENCE RUNS ON YOUR HARDWARE"],
] as const;

export const rabbitReturnPath = [
  ["Approved local model", "RESPONSE CREATED LOCALLY"],
  ["Spark Plug + Guardian", "RESULT OBSERVED + RELEASED"],
  ["Approved local harness", "SESSION RESULT"],
  ["Rabbit Agent", "ENROLLED COMPUTER"],
  ["Rabbit service", "TRANSPORT BACK TO THE DEVICE"],
  ["Rabbit R1", "YOUR ANSWER RETURNS"],
] as const;

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
      <div className={styles.intro}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>RABBIT R1 / AGENT HANDLING</p>
          <h2 id="rabbit-title">Bring Rabbit R1 into your local AI workflow</h2>
          <p className={styles.lead}>
            Connect Rabbit Agent to the local harnesses and models you approve.
            Spark Plug coordinates the workflow while Guardian policy and GW Broker
            check identity, permissions, capacity, and the active profile before work runs.
          </p>
          <div className={styles.previewState}>
            <span>EARLY ACCESS VALIDATION</span>
            <p>We are validating the Rabbit Agent connection path before its public release.</p>
          </div>
          <p className={styles.integrationBoundary}>
            After Rabbit delivers a request to your enrolled computer, an approved
            local harness can hand it to Spark Plug. Inference runs on your hardware;
            Rabbit still transports the prompt and response between the R1 and that computer.
          </p>
          <p className={styles.rabbitLinks}>
            <a href={RABBIT_AGENT_DOCS} rel="noopener noreferrer">Rabbit Agent documentation ↗</a>
            <Link href="/terms#rabbit-r1">Read the complete disclosure</Link>
          </p>
          <p className={styles.nonAffiliation}>
            Independent Rabbit Agent compatibility. No Rabbit partnership,
            sponsorship, or endorsement.
          </p>
        </div>

        <div className={styles.viewerColumn}>
          <div className={styles.viewerShell}>
            <div className={styles.staticFallback} aria-hidden={!viewerFailed}>
              <div
                className={styles.fallbackDevice}
                role={viewerFailed ? "img" : undefined}
                aria-label={viewerFailed ? "Static Rabbit R1 preview" : undefined}
              >
                <span>r1</span><i aria-hidden="true" /><strong>SPARK PLUG</strong>
              </div>
              {viewerFailed && (
                <p>The interactive model could not load. <a href={MODEL_URL} rel="noopener noreferrer">View it on Sketchfab ↗</a></p>
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
          <p className={styles.viewerPrivacy}>
            The 3D viewer loads automatically and contacts Sketchfab.
            Sketchfab&apos;s terms and privacy practices apply.
          </p>
        </div>
      </div>

      <div className={styles.roundTrip}>
        <header>
          <div><p className={styles.eyebrow}>HOW RABBIT AGENT CONNECTS</p><h3>Ask from Rabbit. Run locally. Get the answer back.</h3></div>
          <p>Spark Plug gives Rabbit Agent a managed path into your approved local harness. Guardian policy and GW Broker keep every request inside the permissions, model routes, and capacity limits you set.</p>
        </header>

        <div className={styles.pathGroup}>
          <div className={styles.pathLabel}><span>01</span><strong>ASK FROM RABBIT R1</strong><small>to your approved local model</small></div>
          <ol className={styles.path} aria-label="Rabbit prompt outbound path">
            {rabbitOutboundPath.map(([name, boundary], index) => (
              <li key={name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <small>{boundary}</small>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.pathGroup} data-direction="return">
          <div className={styles.pathLabel}><span>02</span><strong>ANSWER RETURNS</strong><small>from your local model to Rabbit R1</small></div>
          <ol className={styles.path} aria-label="Rabbit response return path">
            {rabbitReturnPath.map(([name, boundary], index) => (
              <li key={`${name}-return`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{name}</strong>
                <small>{boundary}</small>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.failureRow} aria-label="Rabbit integration feasibility gates">
          <span>RABBIT SERVICE ONLINE</span>
          <span>COMPUTER ENROLLED</span>
          <span>HARNESS AVAILABLE</span>
          <span>GUARDIAN POLICY APPROVES</span>
          <span>BROKER ADMITS REQUEST</span>
          <span>LOCAL MODEL READY</span>
        </div>
      </div>
    </section>
  );
}
