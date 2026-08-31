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
  ["Rabbit service", "PROMPT CROSSES CLOUD"],
  ["Rabbit Agent", "ENROLLED COMPUTER"],
  ["Supported harness", "OPENCLAW · HERMES · CLAUDE CODE"],
  ["GW Broker", "AUTHENTICATE + ADMIT"],
  ["Approved local engine/model", "INFERENCE MAY RUN LOCALLY"],
] as const;

export const rabbitReturnPath = [
  ["Approved local engine/model", "RESPONSE CREATED"],
  ["GW Broker", "RESULT OBSERVED"],
  ["Supported harness", "SESSION RESULT"],
  ["Rabbit Agent", "ENROLLED COMPUTER"],
  ["Rabbit service", "RESPONSE CROSSES CLOUD"],
  ["Rabbit R1", "ANSWER RETURNS"],
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
          <p className={styles.eyebrow}>RABBIT R1 / INTEGRATION-FEASIBILITY PREVIEW</p>
          <h2 id="rabbit-title">Ask on Rabbit. Run approved work at home.</h2>
          <p className={styles.lead}>
            Rabbit documents a way to reach supported agents on an enrolled
            computer. Spark Plug is evaluating that path so an approved harness
            could submit work to local models through GW Broker.
          </p>
          <div className={styles.previewState}>
            <span>CANARY REQUIRED</span>
            <p>This is a feasibility route—not a supported-today Spark Plug integration.</p>
          </div>
          <p className={styles.integrationBoundary}>
            Inference may run locally after the prompt reaches the enrolled
            computer. Both the prompt and the response still cross Rabbit
            infrastructure, and Spark Plug authentication still applies.
          </p>
          <p className={styles.rabbitLinks}>
            <a href={RABBIT_AGENT_DOCS} rel="noopener noreferrer">Rabbit Agent documentation ↗</a>
            <Link href="/terms#rabbit-r1">Read the complete disclosure</Link>
          </p>
          <p className={styles.nonAffiliation}>
            Independent compatibility exploration. No Rabbit partnership,
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
          <div><p className={styles.eyebrow}>THE COMPLETE BOUNDARY</p><h3>One prompt. One response. Two cloud crossings.</h3></div>
          <p>Rabbit&apos;s public documentation names Rabbit Agent and supported third-party harnesses. The exact Spark Plug route remains subject to enrollment, authentication, endpoint compatibility, and a real canary.</p>
        </header>

        <div className={styles.pathGroup}>
          <div className={styles.pathLabel}><span>01</span><strong>PROMPT / OUTBOUND</strong><small>toward local inference</small></div>
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
          <div className={styles.pathLabel}><span>02</span><strong>RESPONSE / RETURN</strong><small>back to the handheld</small></div>
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
          <span>BROKER ADMITS REQUEST</span>
          <span>LOCAL MODEL READY</span>
        </div>
      </div>
    </section>
  );
}
