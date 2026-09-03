# Profile package v1 integration

`schemas/profile-package.v1.schema.json` is the public canonical marketplace
envelope. `setup-profile.v1` remains the unsigned, editable profile payload.
Private services and Spark Plug clients must consume the public schema by exact
version and verify its SHA-256 using `contracts/schema-checksums.v1.json`.

## Canonicalization and signature

`sparkplug-json-v1` uses the same canonical JSON function as the public setup
profile validator: JSON scalars use their JSON representation, array order is
preserved, object keys are sorted ascending, and insignificant whitespace is
removed.

The Ed25519 signing message is the UTF-8 canonical JSON of the complete package
with only `signature.value` omitted. The remaining signature metadata
(`algorithm`, `keyId`, and `signedAt`) stays in the message. A verifier must:

1. enforce the package schema and the stricter semantic validator;
2. recalculate `integrity.profileSha256` from the canonical `profile` value;
3. resolve `signature.keyId` from the pinned/revocable marketplace trust store;
4. verify `signature.value` over the signing message;
5. reject an unknown/revoked key, bad signature, stale or future-invalid package,
   origin mismatch, dependency/evidence mismatch, or unsupported schema version.

The trust store format, endpoint, caching, rotation, and revocation rules are in
`docs/MARKETPLACE-KEY-TRUST.md`.

The example signature is structurally valid test data, not a trusted signature.

## App mapping

| App concept | Public canonical field |
| --- | --- |
| envelope type | `kind = sparkplug.profile-package` |
| stable package identity | `packageId` + semantic `version` |
| original creator | `creator` |
| marketplace source | `origin` |
| editable settings | `profile` (`setup-profile.v1`) |
| engine-scoped model dependency | `profile.models[].runtime.engine` |
| MLX/Ollama closed tuning | `profile.models[].runtime.settings` |
| exact Hugging Face source | `profile.models[].repoId` + `revision` + `files[]` |
| license/gating decision | matching `licenseEvidence[]` by `modelAlias` |
| payload digest | `integrity.profileSha256` |
| publisher authenticity | `signature` |

The app must map each existing private envelope into these fields and delete the
private competing envelope after migration. It must preserve the signed source
unchanged, create local edits as a separate draft/fork, and never extend this
package with credentials, paths, commands, environment variables, prompts,
model weights, or runtime authority. New requirements require a deliberate
public schema version rather than private optional fields.
