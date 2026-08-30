# Spark Plug public-site redesign

Status: approved for implementation on `main` in this repository.

## Product story

The homepage explains Spark Plug through the real operating flow: install the
app, download models, combine multiple engines and models into reusable
profiles, switch profiles, connect compatible agent harnesses, and route work
through GW Broker with optional NVIDIA NeMo Switchyard advice.

The page order is hero, release downloads, profiles, compatible tools, routing,
engines and telemetry, ComfyUI, remote control, Rabbit R1, Why Spark Plug,
roadmap, FAQ, and GameWorlds footer.

## Truth boundaries

- vLLM is the first qualified DGX Spark engine. Colibri and ComfyUI are working
  builds. MLX and Ollama remain platform-qualified roadmap engines.
- Current working control surfaces are browser, Mac, iPhone, and iPad. Public
  artifacts remain disabled until their release evidence exists.
- ComfyUI supports typed image, video, and 3D work plus audio outputs through
  imported or custom workflows; there is no dedicated typed audio endpoint.
- Local node telemetry stays on the node by default. Optional cloud routes,
  Rabbit transport, and the public Sketchfab viewer have separate disclosures.
- Compatibility marks are descriptive and do not imply partnership or endorsement.

## Visual acceptance

The scroll story uses continuous transitions and a complete reduced-motion
equivalent. The tool carousel pauses on hover and focus. Routing shows labeled,
bidirectional harness-to-broker-to-Switchyard-to-model paths on desktop and
mobile. Headings must not clip at phone, tablet, laptop, wide, or short-desktop
viewports.

## Delivery

Work is split into isolated component and asset ownership on the same `main`
checkout. Commits are serialized, shared files are integrated once, and the
exact reviewed commit is pushed and deployed only after typecheck, lint, unit,
browser, accessibility, build, dependency-audit, and secret-scan gates pass.
