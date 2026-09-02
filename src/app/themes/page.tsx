import { CartridgeArt, DiscArt } from "../_components/media-objects";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";
import Link from "next/link";
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

const colorThemes = [
  ["Neon Grid", "green", "Electric green structure on a deep control-room canvas."],
  ["Cyberdeck Amber", "amber", "Warm terminal amber built for dense operational views."],
  ["Matrix Rain", "matrix", "A playful falling-glyph backdrop with a calmer readable panel layer."],
  ["Synthwave Sunset", "sunset", "Violet, magenta, and sunset-orange accents for creative sessions."],
  ["Tokyo Night", "tokyo", "A balanced blue-violet palette designed for everyday work."],
  ["Ice / Holo", "ice", "A bright holographic option for daylight and high-ambient-light rooms."],
] as const;

const expansionSlots = [
  "COMMUNITY SLOT 01",
  "COMMUNITY SLOT 02",
  "COMMUNITY SLOT 03",
  "COMMUNITY SLOT 04",
  "COMMUNITY SLOT 05",
  "COMMUNITY SLOT 06",
] as const;

const animationSlots = [
  "MOTION SLOT 01",
  "MOTION SLOT 02",
  "MOTION SLOT 03",
  "MOTION SLOT 04",
  "MOTION SLOT 05",
  "MOTION SLOT 06",
] as const;

export default function ThemesPage() {
  return (
    <LegalShell
      eyebrow="THEME LIBRARY / FREE + EDITABLE"
      title="Make the control room yours."
      summary="Spark Plug themes change presentation—not node authority. The bundled collection stays free; future premium theme and motion packs may be included with Pro without locking the local core."
    >
      <div className={styles.notice}>
        <strong>INCLUDED WITH OPEN SOURCE / FREE</strong>
        <p>
          Cartridge, Compact Disc, and the color collection come with the
          open-source Spark Plug release at no charge. Downloads activate when
          the first verified app package and matching theme files are published.
        </p>
      </div>

      <h2>Animated concepts</h2>
      <p>
        Cartridge and Compact Disc are included open-source themes that establish the first physical-media
        language. Both preserve labels, status, contrast, keyboard operation,
        and reduced-motion behavior.
      </p>
      <div className={styles.featured} aria-label="Featured Spark Plug theme concepts">
        {themeConcepts.map((theme) => (
          <article key={theme.name} className={styles.card}>
            <div className={theme.className}>{theme.art}</div>
            <div className={styles.cardCopy}>
              <div className={styles.metaRow}>
                <small>{theme.label}</small>
                <strong>$0.00</strong>
              </div>
              <h3>{theme.name}</h3>
              <p>{theme.copy}</p>
              <button type="button" disabled aria-label={`${theme.name} included free with the open-source release`}>
                INCLUDED FREE / RELEASE PENDING
              </button>
            </div>
          </article>
        ))}
      </div>

      <h2>Included color themes</h2>
      <p>
        Six color systems round out the DGX Spark collection. Every palette
        ships free, remains editable, and preserves the same runtime information
        and controls.
      </p>
      <div className={styles.colorGrid} aria-label="Included Spark Plug color themes">
        {colorThemes.map(([name, tone, copy]) => (
          <article key={name} data-tone={tone}>
            <div className={styles.swatch} aria-hidden="true"><i /><i /><i /><i /></div>
            <div className={styles.metaRow}>
              <span>COLOR THEME / INCLUDED FREE</span>
              <strong>$0.00</strong>
            </div>
            <h3>{name}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>

      <h2>More themes coming soon</h2>
      <p>
        The library has room to grow without turning unfinished ideas into fake
        products. These slots are reserved for original GameWorlds and community
        themes that pass packaging, licensing, accessibility, and compatibility review.
        Future releases may be free, included with Pro, or carry a clearly displayed one-time price.
      </p>
      <div className={styles.expansion} aria-label="Future Spark Plug theme slots">
        {expansionSlots.map((slot) => (
          <article key={slot}>
            <div aria-hidden="true"><span>+</span></div>
            <small>{slot}</small>
            <h3>Theme coming soon</h3>
            <p>Preview, creator, license, and compatibility will appear here.</p>
          </article>
        ))}
      </div>

      <h2>More animations coming soon</h2>
      <p>
        Motion packs will be installable separately from color themes, so a user
        can mix a palette with loading, transition, status, and ambient animation
        styles. Future motion packs may be included with Pro. Pricing and licensing will always appear before download.
      </p>
      <div className={styles.expansion} aria-label="Future Spark Plug animation slots">
        {animationSlots.map((slot) => (
          <article key={slot}>
            <div className={styles.motionPlaceholder} aria-hidden="true"><i /><i /><i /></div>
            <small>{slot}</small>
            <h3>Animation coming soon</h3>
            <p>Motion preview, creator, license, compatibility, and price will appear here.</p>
          </article>
        ))}
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
      <p><Link href="/marketplace/create">Open the local creator builder</Link> or <a href="/templates/theme-boilerplate.sparkplug-theme" download>download the theme boilerplate</a>.</p>
    </LegalShell>
  );
}
