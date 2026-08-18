# Free, Pro, and Pro+ entitlement contract

The server owns entitlements. UI flags, local storage, profile claims, and
client-supplied plan names never authorize downloads, paid listings, or payouts.

| Capability | Community | Pro | Pro+ verified creator |
| --- | :---: | :---: | :---: |
| Download and run the core program | Yes | Yes | Yes |
| Local model/tool routing | Yes | Yes | Yes |
| Queue and durable output handoff | Yes | Yes | Yes |
| Browse public setup profiles | Yes | Yes | Yes |
| Publish free setup manifests | Yes | Yes | Yes |
| Premium visual themes | — | Yes | Yes |
| Premium motion packs | — | Yes | Yes |
| Private setup sync | — | Yes | Yes |
| Early visual releases | — | Yes | Yes |
| Verified creator badge | — | — | Yes |
| Free or paid setup listings | Free only | Free only | Yes |
| Creator analytics and payouts | — | — | Yes |

## Price model

- Community: **$0**.
- Pro: **$5/month** or **$48/year** in the launch UI.
- Pro+: application/verification required. Marketplace fees, payout timing,
  refunds, taxes, and any additional charge must be published and owner-approved
  before paid listings open. No placeholder fee may be charged.

## Source of truth

1. Stripe is authoritative for payment state once it is integrated.
2. A verified, idempotently processed webhook updates the server-owned
   `subscriptions` row.
3. The server resolves effective entitlements from subscription status and the
   service-managed creator verification flag.
4. Protected downloads and creator mutations re-check those entitlements on
   every request.
5. Cancellation leaves access active only through the provider-confirmed period
   end. Refunds and disputes follow the final published terms.

## Non-goals

Premium access never removes core routing, output handoff, or public community
setups from the free tier. The public repository describes entitlement wiring;
it does not contain private premium themes, animation packages, or their source.
