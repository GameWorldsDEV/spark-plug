# Marketplace signing-key trust contract

Spark Plug pins exactly one marketplace issuer and key endpoint:

- issuer: `https://marketplace.sparkplug.gameworlds.ai`
- endpoint: `https://marketplace.sparkplug.gameworlds.ai/.well-known/sparkplug-marketplace-keys`
- schema: `schemas/marketplace-key-set.v1.schema.json`

The document contains only Ed25519 public JWK values. A `d` parameter or any
unknown field is invalid. The endpoint must use HTTPS, follow no redirect, return
the expected content type, and remain below 32 KiB.

## Validity and caching

- A key-set document is valid for at most 35 days.
- An online client caches it for at most one hour or until `expiresAt`, whichever
  comes first, and uses conditional revalidation when supported.
- A failed refresh may use the last accepted document only until its `expiresAt`.
- Clients persist the greatest accepted `generatedAt` for this issuer and reject
  an older document to prevent rollback.
- A document generated more than five minutes in the future is rejected.
- Expiry or validation failure blocks new marketplace imports; it never affects
  local inference or already imported local profiles.

## Rotation and revocation

`active` keys may sign and verify packages during their key validity interval.
For ordinary rotation, publish the next active key before using it, mark the old
key `retiring`, and keep it until every supported package has aged out.

A `retiring` key verifies only packages whose `signedAt` is no later than the key
set's `generatedAt`; it cannot authorize newly signed packages. A `revoked` key
never verifies, including historical packages. Emergency revocation publishes a
newer key set immediately and invalidates affected cached packages at the next
bounded refresh. Clients must not fetch an unknown key by a URL supplied inside
a package.

Key-set validity, key validity, package schema/digest, `kid`, and the Ed25519
signature must all pass independently. No private key, signing seed, service
credential, or recovery material belongs in this repository or response.
