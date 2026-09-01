import { detailMetadata } from "@/lib/metadata";
import { LegalShell } from "../_components/legal-shell";

export const metadata = detailMetadata(
  "Pre-release notice",
  "Current status and basic use conditions for the Spark Plug public preview website.",
  "/terms",
);

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="PUBLIC PREVIEW / NOT PRODUCT TERMS"
      title="What this preview is—and is not."
      summary="This website explains a product in development. It is not yet a software download, product account, subscription, marketplace transaction, or promise of a release date. It does offer a separate voluntary support link."
    >
      <h2>Current scope</h2>
      <p>
        You may read and link to this public preview for lawful purposes. Do not use
        the site to probe, disrupt, overload, or bypass its security controls. The
        product descriptions distinguish the working private build from the public
        release still being prepared.
      </p>

      <h2>No public software license or purchase yet</h2>
      <p>
        Visiting this site does not grant a license to unreleased Spark Plug source,
        binaries, branding, or private product materials. No price, paid plan, hosted
        account, marketplace listing, or product checkout is currently offered here.
        Final software licenses and any service terms must be published with the
        corresponding release or service.
      </p>

      <h2>Voluntary support</h2>
      <p>
        The external Stripe support page accepts optional one-time payments to support
        development. Support is not a software purchase, preorder, subscription,
        charitable contribution, investment, license, feature promise, priority-support
        commitment, endorsement, or governance right. Stripe&rsquo;s terms apply to its
        payment service. Contact support@gameworlds.ai with the Stripe receipt identifier
        for a duplicate or mistaken payment. Approved or legally required refunds use the
        original payment provider and method.
      </p>

      <h2>Product responsibility</h2>
      <p>
        When software is released, operators remain responsible for the models,
        hardware, credentials, tools, prompts, outputs, and third-party services they
        choose; for reviewing requested permissions; and for following applicable
        software and model licenses. The release documentation will define the
        supported installation target and known limitations.
      </p>

      <h2>Profiles, models, and training tools</h2>
      <p>
        Marketplace profiles remain declarative configuration, not trusted plug-ins.
        Operators must review a profile before applying it and remain responsible for
        model licenses, dataset rights, engine compatibility, requested downloads,
        training inputs, generated adapters, and third-party service terms.
      </p>
      <p>
        The public marketplace, public profile downloads, Unsloth integration, and
        LoRA training workspace are not active offers on this preview. Their final
        review, moderation, license, billing, privacy, and security terms must be
        published before those services open.
      </p>

      <h2>Availability and changes</h2>
      <p>
        This preview and the product under development may change, pause, or contain
        errors. A working feature in the private build is not automatically a promise
        that it will appear in the first public release. Public support, pricing,
        subscription, marketplace, refund, and consumer terms will be stated before
        the relevant offer opens.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this notice can be sent to{" "}
        <a href="mailto:support@gameworlds.ai?subject=Spark%20Plug%20terms">
          support@gameworlds.ai
        </a>.
      </p>
    </LegalShell>
  );
}
