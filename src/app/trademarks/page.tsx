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
      title="Names stay with their owners."
      summary="Spark Plug can accurately describe compatible clients and hardware without borrowing their visual identity or implying a partnership."
    >
      <h2>GameWorlds and Spark Plug</h2>
      <p>
        GameWorlds and Spark Plug names, logos, icons, visual identity, and trade dress
        belong to their respective owner. Open-source software licenses do not grant
        permission to use those marks in a way that suggests sponsorship, affiliation,
        or endorsement.
      </p>

      <h2>NVIDIA and DGX</h2>
      <p>
        NVIDIA and DGX are trademarks and/or registered trademarks of NVIDIA
        Corporation in the United States and other countries. Spark Plug and
        GameWorlds are independent and are not affiliated with, sponsored by, or
        endorsed by NVIDIA Corporation. Any DGX reference is descriptive of a
        possible compatibility or deployment target only.
      </p>

      <h2>Connected clients and other marks</h2>
      <p>
        OpenClaw, Hermes, Claude, Claude Code, Paperclip, Vercel, Supabase, Stripe,
        and other names are marks of their respective owners where applicable.
        Compatibility references do not imply endorsement, certification, or a
        commercial relationship.
      </p>

      <h2>Forks and community profiles</h2>
      <p>
        Modified distributions should use their own name and visual identity unless
        they have separate written permission. Community creators must identify their
        listings accurately and must not present themselves as official Spark Plug or
        partner accounts without authorization.
      </p>
    </LegalShell>
  );
}
