import Image from "next/image";

import styles from "./tools-carousel.module.css";

const tools = [
  {
    name: "OpenClaw",
    description: "Local agent harness",
    icon: "/integrations/openclaw.svg",
    href: "https://github.com/openclaw/openclaw",
  },
  {
    name: "Hermes Agent",
    description: "Local agent harness",
    icon: "/integrations/hermes.png",
    href: "https://github.com/NousResearch/hermes-agent",
  },
  {
    name: "Paperclip",
    description: "Multi-agent orchestration",
    icon: "/integrations/paperclip.svg",
    href: "https://github.com/PaperclipAI/paperclip",
  },
  {
    name: "Codex",
    description: "Coding agent",
    icon: "/integrations/codex.svg",
    href: "https://openai.com/codex/",
  },
  {
    name: "Claude Code",
    description: "Coding agent",
    icon: "/integrations/claude-code.svg",
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
          <p className={styles.eyebrow}>COMPATIBLE AGENT + CODING TOOLS</p>
          <h2 id="compatible-tools-title">Bring the tools you already use.</h2>
        </div>
        <p>
          Connect authorized local harnesses and coding agents to stable Spark Plug endpoints.
          Compatibility describes the interface—not a partnership or endorsement.
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
    </section>
  );
}

export { tools as compatibleTools };
