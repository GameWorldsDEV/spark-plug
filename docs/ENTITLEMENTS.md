# Community, Pro, and creator trust contract

Subscription state and creator trust are independent. A plan controls optional
paid capabilities; a creator class communicates reviewed identity/provenance.
Neither a UI flag nor a client-supplied plan/class authorizes anything.

| Capability | Community | Pro |
| --- | :---: | :---: |
| Download and run the core program | Yes | Yes |
| Local model/tool routing and output handoff | Yes | Yes |
| Browse public setup profiles | Yes | Yes |
| Local authentication/entitlement heartbeat | **None** | Stale/on-demand refresh only |
| Local profile limit | Unlimited | Unlimited |
| Hosted marketplace publishing | — | 10 published free-profile slots |
| Premium visual themes and motion | — | Yes |
| Private profile sync | — | Yes |
| Creator download analytics | — | Yes |
| Early-release and beta channel | Public betas | Opt-in early channel |

## Trust classes

- **Community**: unverified identity; profiles show an unverified publisher
  warning even when the account has Pro.
- **Verified creator**: reviewed individual creator.
- **Verified business**: reviewed business identity.
- **GameWorlds Official**: service-managed first-party provenance. It is never
  inferred from a name, email domain, subscription, or browser claim.

Verification does not unlock premium assets, raise the 10-profile Pro limit, or
bypass manifest validation/moderation. A badge is evidence of a review process,
not an endorsement of every profile. Creator/business verification carries a
review timestamp and expiry and downgrades to the Community trust label until a
manual reviewer revalidates it. GameWorlds Official is service-managed and has
no user-controlled expiry or upgrade path.

## Local verification and refresh

1. With no token, the client immediately selects Community; it makes no auth or
   entitlement call.
2. With a token, the client verifies `alg=EdDSA`, the known key ID, issuer,
   audience, exact claim allowlist, signature, issued time, expiry, and maximum
   seven-day lifetime locally.
3. A valid non-stale snapshot enables its Pro capabilities without a network
   request.
4. The client refreshes only on explicit user request or inside the 12-hour
   stale window. An offline client falls back after expiry; core access remains.
5. Signing keys are published as a cacheable JWK set. Rotation retains the old
   public key for at least the maximum token lifetime plus clock skew.

The hosted refresh route authenticates once, reads only the caller's server-owned
subscription/trust projection, and returns either a signed Pro token or a null
Community result. Tokens contain no email, payment, customer, or local machine
data.

Community Leader is a separately reviewed, expiring recognition. It may grant
complimentary Pro while active, but payment never grants the badge and the role
never bypasses validation or moderation.

## Price and cancellation rules

The launch UI currently proposes Community at $0 and Pro at $5/month or $48/year.
Those are not active charges in Preview. Price IDs live in a server-only allowlist
and remain inactive until Commercial promotion. Cancellation, grace periods,
refunds, disputes, and taxes require published terms before payment routes open.
The first marketplace is free-only; paid listings and payout tooling are excluded.
