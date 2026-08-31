# Spark Plug public site: final polish execution board

Status: approved for implementation on `main` in this repository.

This file is the implementation contract and self-audit checklist for the final
public-site polish. Every agent must read it before editing, remain inside its
owned paths, and verify its section against the shared acceptance criteria.

## Product and truth boundaries

- The hero tells one ordered story: Spark Plug app, engines, compatible agents,
  Hugging Face models, reusable profiles, then local work and profile switching.
- vLLM is qualified first for DGX Spark. Colibri and ComfyUI are working builds.
  MLX and Ollama remain planned and must never look installed or downloadable.
- Browser, Mac, iPhone, and iPad control surfaces are working builds. Working
  builds are not public-download claims. Windows and Android remain coming soon.
- GW Broker owns authentication, admission, profiles, runtime lifecycle,
  capacity, and observability. Optional NVIDIA NeMo Switchyard only selects from
  already-configured, profile-approved text endpoints; it does not start,
  unload, or manage engines.
- ComfyUI media work routes through Spark Plug and the Broker, not through a
  fictional Switchyard media capability.
- Compatibility marks are descriptive. They never imply a partnership,
  endorsement, or affiliation.
- Rabbit is an integration-feasibility preview until a complete canary passes.
  Prompts and responses traverse Rabbit infrastructure even if model inference
  later runs on a local Spark Plug node.
- No private Spark Plug source, screenshots, sessions, paths, hosts, credentials,
  output references, topology, or customer data may enter this public repository.

## Agent A: hero and interactive profiles

Owned paths:

- `src/app/_components/story.tsx`
- `src/app/_components/story.module.css`
- `src/app/_components/profile-workflow.tsx`
- `src/app/_components/profile-workflow.module.css`
- New focused story/profile tests and `public/story/**`

Tasks:

- [ ] Render six stable stages in this exact order: Spark Plug app, engines,
  agents, Hugging Face/model download, profile build/capacity check, run/switch.
- [ ] Make the first stage visibly download Spark Plug into the DGX using a
  green path or beam.
- [ ] Stack the app and engine marks vertically so they visibly enter Spark Plug
  and the DGX rather than floating randomly around the machine.
- [ ] Reuse verified engine marks and adjacent labels. vLLM is qualified first;
  Colibri and ComfyUI are working builds; MLX and Ollama are planned.
- [ ] Show OpenClaw, Hermes, Paperclip, Codex, and Claude Code as compatible
  agent and coding tools, then Hugging Face as the model source.
- [ ] Give each scroll stage a readable dwell and a continuous crossfade.
- [ ] Prevent outgoing and incoming controls from being focusable together.
- [ ] Render the same six-stage information as normal-flow cards when reduced
  motion is enabled.
- [ ] Make Code, Creative, and Background Research real tabs. Selection updates
  the active engines/models, queue/routing summary, and status atomically.
- [ ] Support click, ArrowLeft/ArrowRight, Home, and End without autoplay.

Self-audit:

- [ ] Exact six-stage order and status mapping are covered by focused tests.
- [ ] Every visible mark has adjacent text; decorative duplicates are hidden.
- [ ] Planned engines never look installed, supported, or downloadable.
- [ ] No logo, heading, CTA, machine, or profile panel clips at shared viewports.
- [ ] Reduced-motion content is complete and profile switching still works.

## Agent B: compatible tools, routing, and GitHub proof

Owned paths:

- `src/app/_components/tools-carousel.tsx` and its CSS/test
- `src/app/_components/routing-section.tsx` and its CSS/test
- Harness assets under `public/integrations/**`
- New `src/lib/github-metrics.ts` and focused tests
- New `src/app/_components/github-proof.tsx` and its CSS/test
- `docs/BRAND-ASSETS.md` and `docs/GITHUB.md`

Tasks:

- [ ] Replace the incorrect Codex arrow and every indirect/recreated harness
  mark with an unmodified, verified first-party asset. Use a text tile when a
  first-party downloadable mark cannot be verified; never invent one.
- [ ] Record upstream URL, revision, owner, terms, retrieval date, SHA-256, and
  modification status for every mark.
- [ ] Keep tool copy concise and energetic: connect existing agent harnesses and
  coding tools through Spark Plug's OpenAI- and Anthropic-compatible endpoints.
- [ ] Add small compatibility/non-affiliation fine print outside the main copy.
- [ ] Preserve five accessible carousel links, pause on hover/focus, hide the
  duplicate loop from assistive technology, and use a reduced-motion grid.
- [ ] Replace the oversized routing maze with a digestible semantic flow:
  Agent/app -> GW Broker -> optional Switchyard -> engine/model -> result through
  GW Broker.
- [ ] Use short card subtitles and descriptions that fit every container.
- [ ] Include Fast -> vLLM/Nemotron, Code -> vLLM/Qwen, and Background ->
  Colibri/GLM examples plus a selected-model Broker bypass path.
- [ ] List vLLM, Colibri, ComfyUI, MLX planned, and Ollama planned without
  implying that Switchyard routes media or manages their runtime.
- [ ] Fetch GitHub stars and latest-release asset downloads server-side for the
  allowlisted `GameWorldsDEV/spark-plug` repository with a one-hour refresh,
  timeout, safe schema handling, and no browser token exposure.
- [ ] When no release exists, show `Preparing`; never turn absence into a
  misleading numeric zero or an all-time-download claim.

Self-audit:

- [ ] All visible tool marks match documented first-party hashes.
- [ ] The Codex arrow glyph is gone.
- [ ] Routing remains understandable from text alone and in vertical mobile form.
- [ ] Color is never the only route label; reduced motion stops packets only.
- [ ] GitHub tests cover live, verified zero, no-release, malformed, rate-limit,
  timeout, network-error, and token/header/cache behavior.
- [ ] Build succeeds when GitHub is unavailable.

## Agent C: remote devices and Rabbit R1

Owned paths:

- `src/app/_components/devices-section.tsx` and its CSS/test
- Optional new assets under `public/devices/**`
- `src/app/_components/rabbit-section.tsx` and its CSS/test

Tasks:

- [ ] Replace the overlapping device collage with four independent panels:
  Computer (browser/Mac working build), iPhone (working build), iPad (working
  build), and Android mobile (coming soon).
- [ ] Give each panel a distinct silhouette, status, and representative control
  interface without implying that a control surface is a compute node.
- [ ] Keep Tailscale, Headscale, or another trusted user-managed VPN and explain
  that reachability does not replace Spark Plug pairing and authentication.
- [ ] Make all four panels fit without overlap at phone, tablet, and short
  desktop sizes, including when images or motion are unavailable.
- [ ] Rebuild Rabbit as an explicit round trip: Rabbit R1 -> Rabbit service ->
  Rabbit Agent on an enrolled computer -> supported harness -> GW Broker ->
  approved local engine/model, then the response returns along that path.
- [ ] Say that inference may run locally after transport reaches the enrolled
  computer, but both the prompt and response cross Rabbit infrastructure.
- [ ] Call it an integration-feasibility preview until a real canary verifies the
  route. Preserve the terms link and non-affiliation language.
- [ ] Keep the current Sketchfab embed for now with attribution, reduced-motion
  no-spin behavior, fallback, and automatic third-party-loading disclosure.

Self-audit:

- [ ] Device working-build and coming-soon states are truthful and distinct.
- [ ] No public-download claim is inferred from a working control surface.
- [ ] Rabbit outbound and return paths are both visible and readable.
- [ ] No direct, fully local, end-to-end local, or supported-today Rabbit claim.
- [ ] Existing Sketchfab parameters, fallback, attribution, and CC BY link pass.

## Root integrator: shared wiring, release, legal, and delivery

Reserved paths include `page.tsx`, shared homepage/shell styles, release UI,
navigation/footer, legal pages, shared connection docs, CSP, E2E tests, GitHub
push, and Vercel production deployment.

Tasks:

- [ ] Insert GitHub proof directly beneath the release block.
- [ ] Present release status as Linux/DGX node software preparing; Mac, iPhone,
  and iPad working control builds with public artifacts preparing; Windows and
  Android coming soon. Keep unavailable downloads disabled.
- [ ] Tighten homepage copy and move deep terminology into documentation.
- [ ] Update Terms and Privacy for the complete Rabbit prompt-and-response cloud
  boundary, Rabbit history/retention control, and existing Sketchfab loading.
- [ ] Preserve all non-affiliation, trademark, noindex, release-manifest, and
  public-boundary requirements.
- [ ] Update shared E2E assertions only after component copy and structure settle.
- [ ] Review every explicit agent commit and staged path before integration.
- [ ] Push and deploy only the exact final reviewed `main` commit.

Deferred follow-up: replace the Sketchfab Rabbit viewer with a locally hosted
licensed model only after the asset, attribution, viewer, performance, fallback,
and reduced-motion implementation are reviewed. The present release keeps the
Sketchfab viewer.

## Shared visual and release gates

- [ ] Inspect widths 320, 375, 390, 430, 768, 1280, and 1440 pixels.
- [ ] Inspect short desktop viewports 1366x507 and 1280x720.
- [ ] No clipped headings, sticky-header collisions, hidden connectors, text
  beneath decoration, card overflow, or horizontal scrolling.
- [ ] All important meaning survives disabled animation, missing images, and
  reduced motion.
- [ ] All asset requests return successfully with nonzero natural dimensions.
- [ ] Keyboard, focus, landmarks, names, contrast, and axe checks pass.
- [ ] Run typecheck, lint, focused and full unit tests, production build,
  Playwright E2E, accessibility checks, `npm audit --audit-level=high`, and
  `gitleaks git --redact` before push/deployment.

The Codex mascot, task-status bubbles, browser chrome, macOS dock, and operating
system notifications visible in owner screenshots are external overlays, not
Spark Plug website defects. The website must still fit the unobscured viewport.
