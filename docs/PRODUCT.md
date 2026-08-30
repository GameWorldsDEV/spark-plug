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

Authorized apps and agents use stable endpoints. Spark Plug routes requests only
to candidates allowed by the active profile and maintains separate engine
queues. `accepted`, `loading`, `ready`, `busy`, and `failed` are distinct states.

## Engine state in the current build

| Engine | Current role | Current truth |
| --- | --- | --- |
| vLLM | General local inference | Integrated with profile model selection, context, streaming, concurrency, residency, and memory admission |
| Colibri | Separate local inference lane | Text, streaming, and reasoning are wired; profile settings include 32K/64K presets, output limit, reasoning effort, temperature, top-p, and streaming |
| ComfyUI | Image and media jobs | Integrated as a separate profile policy, queue, status, and memory consumer |
| Switchyard | Profile-scoped route selection | In qualification; may choose only owner-approved candidates in the active profile |

For the installed Colibri/Qwen path, the validated operational context ceiling
is **65,536 tokens**. The checkpoint declares **262,144 tokens**, but that larger
window is not yet benchmarked or approved as a production claim. The current
gateway does not accept image tensors or tool calls, so Colibri vision and tool
capabilities remain disabled.

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

## Community and optional hosted services

The local core must work without a cloud account or entitlement heartbeat.
Optional hosted services may later provide paid themes, motion packs, private
profile sync, hosted publishing, and creator tools. Those services must unlock
through a locally verifiable signed entitlement and may never gate local
accounts, core engines, routing, queues, security, or accessibility.

See `BILLING.md` for the hosted-service boundary.
