# Spark Plug product contract

This document is the detailed product truth behind the shorter public website.
It describes the current private working build and the boundary for the first
public release. A capability is not a public release promise until it passes the
release gates in `RELEASE-PLAN.md`.

## Product definition

Spark Plug is not a model and is not a cloud account wrapped around a model.
It is a node-and-client control system for AI hardware the operator controls.

The node owns:

- its local account and enrolled clients;
- saved workload profiles and credentials;
- model and engine lifecycle state;
- memory admission and protected system headroom;
- separate inference and media queues;
- runtime receipts, failures, and output provenance.

Clients show and change that node-owned state. Discovery can locate a node but
does not grant access. Credentials move only through the node's reviewed HTTPS
path. Tailscale may provide reachability; it is not Spark Plug authentication.

## Operating workflow

### 1. Pair

A browser, Mac, iPhone, or iPad client enrolls to one exact node. There is no
universal cloud identity required for local use.

### 2. Build a profile

A profile is a saved workload plan, not a visual preset. It includes selected
models and the engine-specific settings needed to run them: context, output
limits, streaming, concurrency, residency, sampling, media policy, memory
policy, and allowed routing candidates.

### 3. Validate and apply

The builder and broker evaluate the profile against the selected compute
target. Today the supported target is a single node. The calculation includes
vLLM commitments, a conservative Colibri launch footprint, current memory,
protected headroom, and other active services. An over-capacity profile is
refused with a reason.

The target abstraction can represent a future cluster, but clustering is not
implemented and no aggregate cluster capacity is advertised.

### 4. Work and observe

Authorized apps and agents use stable endpoints. GW Broker authenticates and
admits every request, routes only to candidates allowed by the active profile,
and maintains separate engine queues. `accepted`, `loading`, `ready`, `busy`,
and `failed` are distinct states.

When automatic text routing is enabled, NVIDIA NeMo Switchyard may recommend a
candidate from the active profile. GW Broker retains final admission and route
authority and adopts only a recommendation that still matches the live profile.
Explicit engine or model routes bypass the advisory step. ComfyUI media requests
use typed media endpoints rather than text-model routing.

## Engine state in the current build

| Engine | Current role | Current truth |
| --- | --- | --- |
| vLLM | General local inference | Integrated with profile model selection, context, streaming, concurrency, residency, and memory admission |
| Colibri | Separate local inference lane | Text, streaming, and reasoning are wired; profile settings include 32K/64K presets, output limit, reasoning effort, temperature, top-p, and streaming |
| ComfyUI | Image, video, and 3D jobs | Integrated as a separate profile policy, queue, status, memory consumer, and asset-return path; TRELLIS runs as a ComfyUI workflow |
| MLX | Future Apple Silicon node engine | Roadmap only; not part of the first supported node contract |
| Ollama | Future node engine | Roadmap only; requires platform-specific installer and runtime qualification |

Switchyard is routing middleware, not an engine, and remains in qualification.
It may recommend only owner-approved candidates in the active profile.

For the installed Colibri/Qwen path, the engine launches at the checkpoint-native
**262,144-token ceiling** and profile request limits can be configured from 4,096
through 262,144 tokens. Text, streaming, and reasoning are wired. The current
gateway does not accept image tensors or tool calls, so Colibri vision, audio,
and tool capabilities remain disabled. A large declared context window is not a
speed or quality benchmark.

## First public support target

- NVIDIA DGX Spark / GB10
- Ubuntu 24.04 ARM64
- one node, not a cluster
- browser and approved native clients
- clean installation through a versioned, checksummed installer with preflight
  checks

Other hardware and clustered targets require their own installer, engine,
capacity, and runtime qualification contracts before they are listed as
supported.

Current control surfaces in the working build are browser, Mac, iPhone, and
iPad. Android is roadmap. A client may reach its node on LAN/Wi-Fi, through
Tailscale, or through a compatible user-managed VPN that provides the reviewed
HTTPS path. Network reachability never replaces Spark Plug pairing or node
authentication.

## Free and accountless

The local core works without a cloud account, subscription, entitlement
heartbeat, or mandatory telemetry. Source, official installers, core engines,
routing, queues, profiles, remote clients, diagnostics, accessibility, and
community-contributed profiles remain free.

Profiles are shared through reviewed GitHub pull requests. Optional Stripe tips
and GitHub Sponsors support project work but never unlock features, priority,
status, publishing rights, or governance.
