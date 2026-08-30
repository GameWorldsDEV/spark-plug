# Connections, routing, and third-party boundaries

This document is the detailed truth behind the shorter connection diagrams on
the public website. A listed integration is not a partnership, endorsement, or
promise that every feature of the third-party product is supported.

## Agent and coding harnesses

Spark Plug's stable broker endpoints are designed for enrolled tools rather than
one hard-coded chat application.

- OpenClaw and Hermes use their reviewed local connection paths.
- Paperclip submits bounded background work through its Spark Plug harnesses.
- Codex and other OpenAI SDK-compatible clients can use the OpenAI-compatible
  local gateway.
- Claude Code uses the supported Anthropic-compatible gateway path.
- Other tools may connect only when they implement a published endpoint and pass
  authentication, admission, lifecycle, and output tests.

The website uses approved descriptive compatibility marks with recorded upstream
provenance. See `BRAND-ASSETS.md`. Those marks remain the property of their owners
and do not imply a partnership or endorsement.

## GW Broker and Switchyard

GW Broker is the node authority. It authenticates the caller, checks the active
profile, admits work against current runtime state, chooses or adopts a route,
and records observable queue and result state.

NVIDIA NeMo Switchyard is an optional automatic text-routing advisor in the
current Spark Plug integration. It receives only candidates from the active
profile. The broker adopts a recommendation only when it still matches that live
profile. Explicit engine or model requests bypass the advisor.

Switchyard does not launch engines, change profiles, override memory admission,
or route typed ComfyUI media work.

## Media and TRELLIS

ComfyUI has a separate typed media lane with its own queue, status, memory policy,
and returned assets. TRELLIS image-to-3D generation runs as a ComfyUI workflow;
it is not a separate broker engine.

## Devices and remote reachability

Browser, Mac, iPhone, and iPad clients enroll to one exact node. Local discovery
can locate a node but cannot authorize a client. Away from the local network,
Tailscale or a compatible user-managed VPN may provide routed HTTPS reachability.
Spark Plug's own pairing and credentials remain required.

Android control, Apple Silicon nodes, and Windows nodes are roadmap items. Apple
Silicon work is centered on qualified MLX and Ollama contracts. Windows work will
use engines proven for each AMD or NVIDIA stack; MLX is not presented as a
Windows engine.

## Rabbit R1

Rabbit R1 is an integration preview. A request initiated on the handheld crosses
Rabbit's service before arriving at the user's computer. Only after that
third-party transport can the computer submit approved work to a local GW Broker
and local engines. The path therefore must not be described as end-to-end local.

The released setup flow must require an explicit acknowledgement of Rabbit's
third-party transport, terms, privacy practices, availability, and account
requirements. Spark Plug and GameWorlds are not affiliated with, sponsored by,
or endorsed by Rabbit.

## Release claim rule

An integration moves from roadmap or qualification to supported only after its
exact client, endpoint, authentication, lifecycle, failure, and output path passes
a real canary against the supported release.
