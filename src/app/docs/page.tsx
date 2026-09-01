import { DocsIndex, type DocEntry } from "../_components/docs-index";
import { LegalShell } from "../_components/legal-shell";
import { detailMetadata } from "@/lib/metadata";

export const metadata = detailMetadata("Documentation", "Public Spark Plug setup, routing, engine, and security guides.", "/docs");

const docs = [
  { slug: "quick-start", title: "Quick start", summary: "The verified install path, model download, profile creation, capacity check, and first local run.", topics: ["Install", "First run"] },
  { slug: "profiles", title: "Profiles", summary: "Save engines, models, queues, memory, and routing as a reusable workload without merging engine lifecycles.", topics: ["Profiles", "Capacity"] },
  { slug: "engines", title: "Engines and models", summary: "Understand qualified vLLM support, working Colibri and ComfyUI builds, and planned MLX and Ollama paths.", topics: ["vLLM", "Colibri", "ComfyUI"] },
  { slug: "endpoints", title: "Agent endpoints", summary: "Connect compatible OpenAI- and Anthropic-style clients through authenticated Spark Plug endpoints.", topics: ["Agents", "API"] },
  { slug: "routing", title: "Broker and routing", summary: "Learn what GW Broker admits and observes and when optional Switchyard chooses an approved text endpoint.", topics: ["GW Broker", "Switchyard"] },
  { slug: "comfyui", title: "ComfyUI workflows", summary: "Queue media work, arbitrate memory, return assets, and restore a prior text model after a render.", topics: ["Image", "Video", "3D", "Audio"] },
  { slug: "remote", title: "Remote access", summary: "Use a reviewed HTTPS path while keeping pairing and node authentication separate from VPN reachability.", topics: ["Tailscale", "Headscale"] },
  { slug: "marketplace", title: "Marketplace profiles", summary: "Review declarative manifests, revisions, checksums, licenses, provenance, and risk labels before applying them.", topics: ["Marketplace", "Safety"] },
  { slug: "security", title: "Security boundary", summary: "See what stays local, what optional hosted services store, and how to report a vulnerability.", topics: ["Privacy", "Security"] },
  { slug: "troubleshooting", title: "Troubleshooting", summary: "Work through capacity, runtime, queue, authentication, and network reachability failures.", topics: ["Diagnostics", "Logs"] },
] as const satisfies readonly DocEntry[];

export default function DocsPage() {
  return (
    <LegalShell eyebrow="PUBLIC DOCUMENTATION / PREVIEW" title="Learn the control plane before the first download." summary="These public guides describe verified boundaries and current release status. They do not expose internal deployment details or turn a working private build into a public compatibility claim.">
      <DocsIndex entries={docs} />
      {docs.map((entry) => (
        <section id={entry.slug} key={entry.slug}>
          <h2>{entry.title}</h2>
          <p>{entry.summary}</p>
          <p>Detailed, version-matched instructions will be published with the first verified release. Until then, the download and mutation steps remain intentionally disabled.</p>
        </section>
      ))}
    </LegalShell>
  );
}

