import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata(
  "Trademark notice",
  "Trademark ownership and non-affiliation notices for Spark Plug compatibility references.",
  "/trademarks",
);

export default function TrademarksPage() {
  return (
    <LegalShell
      eyebrow="BRAND BOUNDARY / COMPATIBILITY IS NOT ENDORSEMENT"
      title="Compatibility does not mean endorsement."
      summary="Product and company names are used only to identify hardware, software, or services discussed by this independent project."
    >
      <h2>GameWorlds and Spark Plug</h2>
      <p>
        The GameWorlds and Spark Plug names, logos, icons, visual identity, and trade
        dress belong to their owner. An open-source software license does not grant
        permission to use those marks in a way that suggests sponsorship, affiliation,
        or endorsement.
      </p>

      <h2>NVIDIA and DGX</h2>
      <p>
        NVIDIA and DGX are trademarks and/or registered trademarks of NVIDIA
        Corporation in the United States and other countries. Spark Plug and
        GameWorlds are independent and are not affiliated with, sponsored by, or
        endorsed by NVIDIA Corporation. Any DGX reference is descriptive of a
        current development and first planned public deployment target only.
      </p>

      <h2>Connected clients and other marks</h2>
      <p>
        Apple, macOS, iPhone, iPad, Android, Tailscale, OpenAI,
        Codex, Anthropic, Claude, Claude Code, NVIDIA NeMo, Switchyard, OpenClaw,
        Hermes, Paperclip, vLLM, ComfyUI, TRELLIS, Colibri, MLX, Ollama, Headscale,
        Hugging Face, Unsloth, Vercel, and other names are marks of their respective owners where applicable.
        Compatibility references do not imply endorsement, certification, or a
        commercial relationship.
      </p>

      <h2>Logos and compatibility tiles</h2>
      <p>
        The website uses third-party logos with owner authorization for descriptive
        compatibility references and records their upstream provenance. The marks
        remain subordinate to the Spark Plug identity and may be replaced or removed
        when an upstream owner changes its branding or requests a change.
      </p>

      <h2>Future distributions and listings</h2>
      <p>
        Modified distributions should use their own name and visual identity unless
        they have separate written permission. If community publishing opens later,
        creators must identify their work accurately and must not present themselves
        as official Spark Plug publishers or partners without authorization.
      </p>
    </LegalShell>
  );
}
