# Spark Plug creator kit

Spark Plug creator packages are declarative data. They cannot execute commands,
carry credentials, change broker authority, silently download models, or start a
runtime. The local app always presents an import review before saving anything.

## Public formats

| Asset | Schema | Boilerplate |
| --- | --- | --- |
| Local AI profile | `schemas/setup-profile.v1.schema.json` | `public/templates/profile-boilerplate.sparkplug-profile` |
| Visual theme | `schemas/theme-package.v1.schema.json` | `public/templates/theme-boilerplate.sparkplug-theme` |
| Motion pack | `schemas/motion-pack.v1.schema.json` | `public/templates/motion-boilerplate.sparkplug-motion` |
| Signed marketplace profile | `schemas/profile-package.v1.schema.json` | `public/examples/valid-profile-package.v1.json` |
| Store listing | `schemas/marketplace-listing.v1.schema.json` | Created during private marketplace submission |

The zero hashes and example identifiers in the profile boilerplate are obvious
placeholders. Replace them with the exact Hugging Face repository, immutable
40-character revision, selected files, file SHA-256 values, byte sizes, and the
license identifier. A placeholder or floating revision cannot be published.

`setup-profile.v1` remains the unsigned editable payload. The marketplace wraps
an approved payload in `profile-package.v1`, binding creator and listing origin,
one exact license decision per engine-scoped model, the canonical profile hash,
and an Ed25519 publisher signature. Structural validation never substitutes for
cryptographic signature verification against the application trust store.
The precise signing projection and app mapping are documented in
`docs/PROFILE-PACKAGE-INTEGRATION.md`.

## Model boundary

Profiles reference model files; they do not include or resell them. A user sees
the repository, revision, files, checksums, gating, license, engine, storage, and
memory plan before approving a separate download from the model source. Paid
profile publication fails closed until GameWorlds has reviewed that exact model
revision and its license for the proposed use.

The v1 engine vocabulary covers Spark Plug's direct targets (`vllm`, `colibri`,
`mlx`, and `ollama`) plus compatible `llama.cpp`, `transformers`, and `comfyui`
references. Profiles may declaratively claim `tools`, `thinking`, `vision`, and
`streaming`; publication must verify those claims against the exact model and
engine revision. Capabilities never carry parser source, templates, commands,
environment variables, or arbitrary runtime knobs.

MLX profiles currently expose only aligned `prefillStepTokens`, which the
official server can apply. Unsupported KV-cache bit/group flags are deliberately
absent. Ollama profiles use only `batchTokens`, `gpuLayers`,
`threadCount`, `keepAliveSeconds`, and `flashAttention`. These bounded settings
are required for their respective engines and rejected on other engines. Exact
Hugging Face repository revisions, selected filenames, hashes, sizes, licenses,
and gating remain mandatory regardless of engine. See the public MLX and Ollama
examples in `public/examples/`.

Marketplace listings declare `engineTargets` using the same closed engine
vocabulary, and each compatibility row uses that enum. Theme and motion listings
use an empty target list when they have no engine dependency.

## Theme boundary

Themes expose a fixed palette and presentation vocabulary. Arbitrary CSS, HTML,
JavaScript, remote fonts, network URLs, and executable hooks are not part of the
format. Artwork is a relative, checksummed file with its own license.

## Motion boundary

Motion packs use named UI slots and bounded numeric keyframes. They cannot add
scripts or selectors. Every pack declares a reduced-motion behavior, and the app
may disable any motion that obscures status, harms accessibility, or exceeds its
resource limits.

## Creator and publishing access

The schemas and boilerplates remain public so packages can be independently
inspected and validated. The public website can preview the formats without an
account. Productized draft import/export, the full Creator Studio, submission,
analytics, and marketplace publishing require an authenticated Pro creator.
Installing an approved free marketplace package does not require Pro.

The private marketplace service handles identity, entitlement, review,
versioning, payment, support, moderation, signatures, and download grants. None
of that is required for local inference or ordinary local profiles.

## Canonical schema parity

This repository is the public schema authority. `contracts/schema-checksums.v1.json`
pins the exact bytes consumed by the app, website, and private marketplace. Every
downstream repository must fail CI when its copy differs. In particular,
`marketplace-listing.v1.schema.json` must be reconciled before any submission or
commerce endpoint is enabled; similar filenames are not proof of compatibility.
