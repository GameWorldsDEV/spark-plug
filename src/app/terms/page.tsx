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
      summary="Spark Plug is a free and open-source community project. The repository is public; verified installers will also be free when released. The site offers a separate voluntary support link."
    >
      <h2>Current scope</h2>
      <p>
        You may read and link to this public preview for lawful purposes. Do not use
        the site to probe, disrupt, overload, or bypass its security controls. The
        product descriptions distinguish the working private build from the public
        release still being prepared.
      </p>

      <h2>Open-source software, not a purchase</h2>
      <p>
        Repository source is offered under Apache License 2.0 as stated in its LICENSE
        file. Spark Plug has no paid plan, feature paywall, product account, paid
        marketplace listing, or product checkout. Branding and third-party materials
        remain subject to their stated trademark and license terms.
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
        Community profiles will be shared free through GitHub after review. Unsloth
        integration and the LoRA training workspace remain local roadmap work, not a
        hosted service promise.
      </p>

      <h2>Availability and changes</h2>
      <p>
        This preview and the product under development may change, pause, or contain
        errors. A working feature in development is not automatically a promise that
        it will appear in the first public release. Releases and compatibility claims
        are governed by the evidence published with each GitHub tag.
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
