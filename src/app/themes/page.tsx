import { CartridgeArt, DiscArt } from "../_components/media-objects";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import styles from "./themes.module.css";

export const metadata = detailMetadata(
  "Themes",
  "Free, editable visual themes for the Spark Plug control app.",
  "/themes",
);

const themeConcepts = [
  {
    name: "Cartridge",
    label: "PROFILE SHELL",
    copy: "Turns profiles into collectible cartridges. Model, context, vision, and tool settings stay readable instead of becoming decoration.",
    art: <CartridgeArt />,
    className: styles.cartridge,
  },
  {
    name: "Compact Disc",
    label: "MODEL LOAD",
    copy: "A rotating data-disc treatment for model loading and residency. Progress remains text-visible when motion is reduced or disabled.",
    art: <DiscArt />,
    className: styles.disc,
  },
] as const;

export default function ThemesPage() {
  return (
    <LegalShell
      eyebrow="THEME LIBRARY / FREE + EDITABLE"
      title="Make the control room yours."
      summary="Spark Plug themes change presentation—not node authority. Downloadable theme packages will live in the public repository, use the same open format, and never unlock product capabilities."
    >
      <div className={styles.notice}>
        <strong>THEME DOWNLOADS / COMING SOON</strong>
        <p>
          The page is ready, but no package is pretending to be downloadable.
          Buttons activate only after a theme has a version, license, preview,
          checksum, and tested Spark Plug compatibility range.
        </p>
      </div>

      <h2>Animated concepts</h2>
      <p>
        Cartridge and Compact Disc establish the first physical-media theme
        language. Both preserve labels, status, contrast, keyboard operation,
        and reduced-motion behavior.
      </p>
      <div className={styles.featured} aria-label="Featured Spark Plug theme concepts">
        {themeConcepts.map((theme) => (
          <article key={theme.name} className={styles.card}>
            <div className={theme.className}>{theme.art}</div>
            <div className={styles.cardCopy}>
              <small>{theme.label}</small>
              <h3>{theme.name}</h3>
              <p>{theme.copy}</p>
              <button type="button" disabled aria-label={`${theme.name} theme coming soon`}>
                DOWNLOAD COMING SOON
              </button>
            </div>
          </article>
        ))}
      </div>

      <h2>DGX Spark theme collection</h2>
      <p>
        The existing app themes will be listed here with their real names and
        sanitized screenshots after the live app review. We will not invent
        names, previews, or download packages before matching them to the
        actual DGX Spark build.
      </p>
      <div className={styles.catalog}>
        <article>
          <span>BUILT-IN</span>
          <h3>Spark Plug Default</h3>
          <p>The current high-contrast control-room foundation.</p>
          <button type="button" disabled>INCLUDED WITH APP</button>
        </article>
        <article className={styles.pending}>
          <span>DGX SPARK COLLECTION</span>
          <h3>More app themes</h3>
          <p>Names and previews pending a sanitized capture of the actual app.</p>
          <button type="button" disabled>CATALOGING</button>
        </article>
      </div>

      <h2>Open theme format</h2>
      <p>
        The theme boilerplate will separate color tokens, typography, layout,
        component skins, and optional motion. Contributors can fork it, share
        themes through GitHub, or install a package locally without creating an
        account or connecting the node to a theme service.
      </p>
      <ul>
        <li>Theme packages cannot contain commands, credentials, model files, prompts, or node data.</li>
        <li>Motion must provide a reduced-motion fallback and cannot hide runtime state.</li>
        <li>Original artwork must include its license and provenance.</li>
        <li>Compatibility and accessibility are tested per theme version.</li>
      </ul>
    </LegalShell>
  );
}
