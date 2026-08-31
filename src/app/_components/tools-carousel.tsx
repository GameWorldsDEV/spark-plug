import Image from "next/image";

import styles from "./tools-carousel.module.css";

const tools = [
  {
    name: "OpenClaw",
    description: "Agent harness",
    icon: "/integrations/openclaw.svg",
    href: "https://github.com/openclaw/openclaw",
  },
  {
    name: "Hermes Agent",
    description: "Local agent runtime",
    icon: "/integrations/hermes.png",
    href: "https://github.com/NousResearch/hermes-agent",
  },
  {
    name: "Paperclip",
    description: "Multi-agent operations",
    icon: "/integrations/paperclip.svg",
    href: "https://github.com/PaperclipAI/paperclip",
  },
  {
    name: "Codex",
    description: "Coding agent",
    icon: "/integrations/codex.png",
    href: "https://openai.com/codex/",
  },
  {
    name: "Claude Code",
    description: "Coding agent",
    icon: "/integrations/claude-code.png",
    href: "https://www.anthropic.com/claude-code",
  },
] as const;

function ToolCards({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className={styles.trackGroup} aria-hidden={duplicate || undefined}>
      {tools.map((tool) => (
        <a
          className={styles.toolCard}
          href={tool.href}
          key={tool.name}
          rel="noopener noreferrer"
          tabIndex={duplicate ? -1 : undefined}
        >
          <span className={styles.iconShell}>
            <Image
              alt=""
              className={styles.toolIcon}
              data-tool-mark={tool.name}
              height={72}
              loading="eager"
              src={tool.icon}
              unoptimized
              width={72}
            />
          </span>
          <span className={styles.toolText}>
            <strong>{tool.name}</strong>
            <small>{tool.description}</small>
          </span>
          <span className={styles.external} aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

export function ToolsCarousel() {
  return (
    <section className={styles.section} aria-labelledby="compatible-tools-title" id="tools">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>YOUR AGENTS. YOUR MODELS. ONE LOCAL ROUTE.</p>
          <h2 id="compatible-tools-title">Plug in. Route locally. Keep moving.</h2>
        </div>
        <p>
          Connect the agent harnesses and coding tools you already use through Spark Plug&apos;s
          OpenAI- and Anthropic-compatible endpoints.
        </p>
      </div>

      <div className={styles.carousel} aria-label="Compatible tools">
        <div className={styles.track}>
          <ToolCards />
          <ToolCards duplicate />
        </div>
      </div>

      <div className={styles.endpointBadges} aria-label="Compatible endpoint types">
        <span><i aria-hidden="true" />OpenAI-compatible endpoint</span>
        <span><i aria-hidden="true" />Anthropic-compatible endpoint</span>
      </div>
      <p className={styles.compatibilityNote}>
        Compatibility only—not a partnership or endorsement. Spark Plug and GameWorlds are not
        affiliated with the named projects or companies.
      </p>
    </section>
  );
}

export { tools as compatibleTools };
